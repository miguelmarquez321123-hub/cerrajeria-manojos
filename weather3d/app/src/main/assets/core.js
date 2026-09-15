'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const cities={
  tiffin:{name:'Tiffin, Ohio',lat:41.1145,lon:-83.17797,kind:'campus'},
  sandusky:{name:'Sandusky, Ohio',lat:41.4489,lon:-82.70796,kind:'lake'}
};
const WMO={0:['Clear sky','☀️','clear'],1:['Mostly clear','🌤️','clear'],2:['Partly cloudy','⛅','cloud'],3:['Overcast','☁️','cloud'],45:['Fog','🌫️','fog'],48:['Rime fog','🌫️','fog'],51:['Light drizzle','🌦️','rain'],53:['Drizzle','🌦️','rain'],55:['Heavy drizzle','🌧️','rain'],56:['Freezing drizzle','🌧️','rain'],57:['Freezing drizzle','🌧️','rain'],61:['Light rain','🌦️','rain'],63:['Rain','🌧️','rain'],65:['Heavy rain','🌧️','rain'],66:['Freezing rain','🌧️','rain'],67:['Freezing rain','🌧️','rain'],71:['Light snow','🌨️','snow'],73:['Snow','❄️','snow'],75:['Heavy snow','❄️','snow'],77:['Snow grains','❄️','snow'],80:['Rain showers','🌦️','rain'],81:['Showers','🌧️','rain'],82:['Heavy showers','⛈️','storm'],85:['Snow showers','🌨️','snow'],86:['Heavy snow showers','❄️','snow'],95:['Thunderstorm','⛈️','storm'],96:['Storm with hail','⛈️','storm'],99:['Severe hail storm','⛈️','storm']};
const state={city:'tiffin',weather:'clear',stormLab:false,focusAvatar:false,yaw:-.25,pitch:.02,targetYaw:-.25,targetPitch:.02,spin:0,siren:false,data:null};

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
function compass(deg){return ['N','NE','E','SE','S','SW','W','NW'][Math.round((deg||0)/45)%8]}
function dayName(s,i){if(i===0)return'Today';return new Date(s+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'})}
function hourLabel(s,i){if(i===0)return'Now';return new Date(s).toLocaleTimeString([],{hour:'numeric'})}
function weatherMeta(c){return WMO[c]||['Weather','🌤️','cloud']}

async function loadWeather(){
  const c=cities[state.city], btn=$('#refreshBtn');btn.textContent='↻ Loading…';
  const u=`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=7`;
  try{
    const r=await fetch(u,{cache:'no-store'}); if(!r.ok)throw new Error('weather');
    const d=await r.json(); state.data=d; renderWeather(d); loadAlerts();
  }catch(e){
    state.data=null; renderFallback(); $('#alertTitle').textContent='Weather connection unavailable'; $('#alertText').textContent='The 3D world still works offline. Try Refresh when connected.';
  }
  btn.textContent='↻ Refresh'; setTimeout(()=>$('#loading').classList.add('hide'),450);
}
function renderWeather(d){
  const c=cities[state.city], cur=d.current, meta=weatherMeta(cur.weather_code); state.weather=meta[2];
  $('#place').textContent=c.name; $('#temp').textContent=Math.round(cur.temperature_2m)+'°'; $('#cond').textContent=meta[0];
  $('#feels').textContent=Math.round(cur.apparent_temperature)+'°'; $('#wind').textContent=Math.round(cur.wind_speed_10m); $('#windDir').textContent=`mph · ${compass(cur.wind_direction_10m)}`;
  $('#humid').textContent=Math.round(cur.relative_humidity_2m)+'%'; $('#precip').textContent=`precip ${Number(cur.precipitation||0).toFixed(2)} in`;
  $('#updated').textContent=`Live · updated ${new Date(cur.time).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}`;
  document.body.dataset.weather=state.weather; updateSky();
  let start=Math.max(0,d.hourly.time.findIndex(x=>x>=cur.time)); if(start<0)start=0;
  $('#hours').innerHTML=d.hourly.time.slice(start,start+10).map((t,j)=>{const i=start+j,m=weatherMeta(d.hourly.weather_code[i]);return `<div class="hour ${j===0?'now':''}"><small>${hourLabel(t,j)}</small><i>${m[1]}</i><strong>${Math.round(d.hourly.temperature_2m[i])}°</strong><em>${d.hourly.precipitation_probability[i]??0}%</em></div>`}).join('');
  $('#forecast').innerHTML=d.daily.time.map((t,i)=>{const m=weatherMeta(d.daily.weather_code[i]);return `<div class="day"><b>${dayName(t,i)}</b><span class="ico">${m[1]}</span><span class="rain">💧 ${d.daily.precipitation_probability_max[i]??0}%</span><span class="temps"><b>${Math.round(d.daily.temperature_2m_max[i])}°</b> <span>${Math.round(d.daily.temperature_2m_min[i])}°</span></span></div>`}).join('');
}
function renderFallback(){
  const c=cities[state.city]; $('#place').textContent=c.name; $('#temp').textContent='--°';$('#cond').textContent='Offline 3D weather mode';$('#updated').textContent='Tap Refresh for live data';$('#feels').textContent='--°';$('#wind').textContent='--';$('#windDir').textContent='mph';$('#humid').textContent='--%';$('#precip').textContent='precip --';
  $('#hours').innerHTML=Array.from({length:8},(_,i)=>`<div class="hour ${i===0?'now':''}"><small>${i?'+'+i+'h':'Now'}</small><i>🌤️</i><strong>--°</strong><em>--%</em></div>`).join('');
  $('#forecast').innerHTML=Array.from({length:7},(_,i)=>`<div class="day"><b>${i?'Day '+(i+1):'Today'}</b><span class="ico">🌤️</span><span class="rain">💧 --%</span><span class="temps"><b>--°</b> <span>--°</span></span></div>`).join('');
}
async function loadAlerts(){
  const c=cities[state.city]; $('#alertTitle').textContent='Checking official alerts…';
  try{const r=await fetch(`https://api.weather.gov/alerts/active?point=${c.lat},${c.lon}`,{headers:{Accept:'application/geo+json'}}); if(!r.ok)throw 0; const d=await r.json();
    if(d.features&&d.features.length){const a=d.features[0].properties;$('#alertTitle').textContent=a.event||'Weather alert';$('#alertText').textContent=(a.headline||a.description||'Official NWS alert').slice(0,190);}
    else{$('#alertTitle').textContent='No active NWS alerts';$('#alertText').textContent='No severe weather alert is active for this city right now.';}
  }catch(e){$('#alertTitle').textContent='Official alert status unavailable';$('#alertText').textContent='Live weather is still available through Open-Meteo.';}
}
