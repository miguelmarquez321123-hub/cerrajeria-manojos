function buildScene(){objects=[];
  // ground / city shell
  add('box',[0,-1.42,0],[5.7,.08,4.7],[.055,.07,.12],0,'world');
  // Tiffin campus silhouettes
  add('box',[-2.7,-.68,-1.25],[1.18,.7,.8],[.24,.12,.34],0,'tiffin');add('box',[-2.7,.17,-1.25],[.18,.22,.18],[.32,.18,.46],0,'tiffin');
  add('box',[-1.25,-.85,-1.8],[.72,.52,.52],[.20,.10,.31],0,'tiffin');
  // Sandusky waterfront / lighthouse
  add('box',[-2.4,-1.25,-.3],[2.7,.05,2.6],[.05,.22,.35],0,'sandusky',.86,.05);add('cyl',[-2.35,-.52,-1.45],[.23,.83,.23],[.86,.86,.88],0,'sandusky');add('cone',[-2.35,.38,-1.45],[.34,.22,.34],[.55,.10,.16],0,'sandusky');
  // trees
  for(let k=0;k<8;k++){let x=-3.8+k*1.05,z=-2.2+(k%2)*.45;add('cyl',[x,-.91,z],[.09,.5,.09],[.26,.14,.08],0,'world');add('cone',[x,-.25,z],[.42,.75,.42],[.08,.28,.18],0,'world')}
  // siren tower
  add('cyl',[0.15,-.1,-1.55],[.08,1.25,.08],[.37,.41,.49],0,'world');add('box',[.15,1.08,-1.55],[.52,.10,.18],[.24,.27,.34],0,'world');
  add('cone',[-.16,1.08,-1.55],[.24,.20,.24],[.55,.58,.63],[0,0,1.57],'world');add('cone',[.46,1.08,-1.55],[.24,.20,.24],[.55,.58,.63],[0,0,-1.57],'world');add('sphere',[.15,1.35,-1.55],[.12,.09,.12],[1,.10,.18],0,'beacon',1,.7);
  // avatar torso
  const skin=[.63,.39,.27],dark=[.018,.02,.027],hair=[.018,.014,.018],gold=[.95,.69,.18];
  add('box',[1.92,-.68,.55],[.76,.83,.42],[.025,.03,.04],[0,-.14,0],'avatar');add('box',[1.92,-.57,.78],[.42,.63,.08],[.02,.02,.025],[0,-.14,0],'avatar');
  add('cyl',[1.28,-.52,.55],[.18,.7,.18],[.028,.033,.045],[0,0,.18],'avatar');add('cyl',[2.56,-.52,.55],[.18,.7,.18],[.028,.033,.045],[0,0,-.18],'avatar');
  add('cyl',[1.92,.08,.54],[.18,.26,.18],skin,0,'avatar');add('sphere',[1.92,.78,.54],[.62,.73,.58],skin,[0,-.10,0],'avatar');
  add('sphere',[1.32,.78,.54],[.12,.22,.10],skin,0,'avatar');add('sphere',[2.52,.78,.54],[.12,.22,.10],skin,0,'avatar');
  // eyes
  add('sphere',[1.68,.88,1.05],[.12,.075,.055],[.96,.96,.92],0,'avatar');add('sphere',[2.16,.88,1.05],[.12,.075,.055],[.96,.96,.92],0,'avatar');
  add('sphere',[1.68,.88,1.105],[.043,.05,.025],[.045,.06,.055],0,'avatar');add('sphere',[2.16,.88,1.105],[.043,.05,.025],[.045,.06,.055],0,'avatar');
  // glasses
  add('torus',[1.67,.89,1.105],[.24,.24,.09],[.12,.12,.13],[1.57,0,0],'avatar');add('torus',[2.17,.89,1.105],[.24,.24,.09],[.12,.12,.13],[1.57,0,0],'avatar');add('box',[1.92,.89,1.105],[.16,.018,.018],[.12,.12,.13],0,'avatar');
  // nose, lips, moustache, goatee
  add('sphere',[1.92,.66,1.09],[.105,.16,.08],skin,0,'avatar');add('sphere',[1.92,.43,1.08],[.18,.045,.045],[.30,.12,.11],0,'avatar');
  add('sphere',[1.76,.52,1.105],[.18,.035,.035],hair,[0,0,.13],'avatar');add('sphere',[2.08,.52,1.105],[.18,.035,.035],hair,[0,0,-.13],'avatar');add('cone',[1.92,.28,1.05],[.13,.24,.08],hair,[0,0,0],'avatar');
  // eyebrows
  add('box',[1.68,1.08,1.08],[.19,.025,.035],hair,[0,0,.08],'avatar');add('box',[2.16,1.08,1.08],[.19,.025,.035],hair,[0,0,-.08],'avatar');
  // curls
  const curls=[[-.45,.44,.02],[-.25,.56,.05],[0,.62,.03],[.25,.56,.04],[.47,.42,.01],[-.53,.2,.0],[-.35,.30,.16],[-.12,.35,.17],[.13,.36,.16],[.36,.30,.14],[.54,.18,0],[-.40,.05,.18],[-.18,.12,.24],[.06,.13,.24],[.29,.10,.21],[.44,.02,.14]];
  curls.forEach((q,i)=>add('sphere',[1.92+q[0],1.33+q[1],.53+q[2]],[.22+.03*(i%3),.19+.02*(i%2),.21],hair,[0,0,0],'avatar'));
  // collar + gold chain beads
  add('box',[1.55,-.05,.92],[.24,.36,.06],[.035,.04,.05],[0,0,-.38],'avatar');add('box',[2.29,-.05,.92],[.24,.36,.06],[.035,.04,.05],[0,0,.38],'avatar');
  for(let i=0;i<12;i++){let a=Math.PI*(.12+.76*i/11),x=1.92+.36*Math.cos(a),y=.05-.29*Math.sin(a);add('sphere',[x,y,.99],[.032,.032,.032],gold,0,'avatar',1,.18)}
  // small city lights
  for(let i=0;i<13;i++)add('sphere',[-3.8+i*.55,-.45,-2.7+(i%3)*.08],[.035,.035,.035],[.9,.65,.25],0,'world',1,.8);
}
function drawObj(o,root,t){let group=o.group;if(group==='tiffin'&&state.city!=='tiffin')return;if(group==='sandusky'&&state.city!=='sandusky')return;let r=[...o.r],p=[...o.p],s=[...o.s],glow=o.glow;
  if(group==='avatar'){let bob=Math.sin(t*1.5+o.phase)*.008;p[1]+=bob;}
  if(group==='beacon'){glow=state.siren||state.stormLab?(1.3+Math.sin(t*12)*.8):.25;s=[s[0]*(1+(state.siren?Math.sin(t*9)*.12:0)),s[1],s[2]]}
  let m=compose(p,r,s,root);let mm=meshes[o.type];gl.bindBuffer(gl.ARRAY_BUFFER,mm.v);gl.vertexAttribPointer(loc.aP,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.aP);gl.bindBuffer(gl.ARRAY_BUFFER,mm.n);gl.vertexAttribPointer(loc.aN,3,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(loc.aN);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mm.i);gl.uniformMatrix4fv(loc.uM,false,m);gl.uniform4f(loc.uC,o.col[0],o.col[1],o.col[2],o.alpha);gl.uniform1f(loc.uGlow,glow);gl.drawElements(gl.TRIANGLES,mm.count,gl.UNSIGNED_SHORT,0)}
function drawStorm(root,t){if(!(state.stormLab||state.weather==='storm'))return;for(let i=0;i<16;i++){let y=-1.15+i*.14,rad=.75*(1-i/19)+.09,x=-1.0+Math.sin(t*2+i*.6)*.08,z=.45+Math.cos(t*1.7+i*.4)*.05;let o={type:'torus',p:[x,y,z],s:[rad,.15,rad],r:[1.57,t*1.3+i*.32,0],col:[.52,.55,.61],alpha:.20,glow:0};drawObj(o,root,t)}}
function resize(){let d=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==w*d||canvas.height!==h*d){canvas.width=w*d;canvas.height=h*d;$('#fx').width=w*d;$('#fx').height=h*d;gl.viewport(0,0,canvas.width,canvas.height)}}
function updateSky(){const h=$('#hero');let w=state.stormLab?'storm':state.weather;const g={clear:'linear-gradient(160deg,#372062,#174d78 58%,#f0a45d)',cloud:'linear-gradient(160deg,#283146,#586274 55%,#b8a3a8)',rain:'linear-gradient(160deg,#101827,#263a55 56%,#526b7a)',snow:'linear-gradient(160deg,#1d2840,#607188 55%,#bbc9d9)',storm:'linear-gradient(160deg,#080b15,#1a2238 55%,#3e4961)',fog:'linear-gradient(160deg,#37404b,#687581 55%,#a6adb4)'};h.style.background=g[w]||g.cloud}
function loop(ms){if(!gl)return;resize();let t=ms/1000;state.yaw+=(state.targetYaw-state.yaw)*.06;state.pitch+=(state.targetPitch-state.pitch)*.06;if(state.focusAvatar){state.spin+=.013;state.targetYaw=.08+Math.sin(t*.5)*.10}else state.spin*=.95;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);let p=perspective(.72,canvas.width/canvas.height,.1,50),v=lookAt([0,.65,7.4],[0,.25,0],[0,1,0]);gl.uniformMatrix4fv(loc.uP,false,p);gl.uniformMatrix4fv(loc.uV,false,v);gl.uniform3f(loc.uL,-.3,.8,.7);let root=M.mul(M.ry(state.yaw+state.spin),M.rx(state.pitch));objects.forEach(o=>drawObj(o,root,t));drawStorm(root,t);renderFX(t);requestAnimationFrame(loop)}

// particles: rain/snow/cloud sparkle on a 2D overlay
const fxc=$('#fx'),ctx=fxc.getContext('2d');let particles=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),v:.4+Math.random()*.7,s:.4+Math.random()*1.3}));
function renderFX(t){let d=fxc.width/(fxc.clientWidth||1);ctx.clearRect(0,0,fxc.width,fxc.height);ctx.save();ctx.scale(d,d);let w=fxc.clientWidth,h=fxc.clientHeight,mode=state.stormLab?'storm':state.weather;
 if(mode==='rain'||mode==='storm'){ctx.strokeStyle=mode==='storm'?'rgba(190,220,255,.32)':'rgba(155,215,255,.28)';ctx.lineWidth=1.1;particles.forEach(q=>{q.y+=(q.v*(mode==='storm'?1.7:1))/80;q.x+=(mode==='storm'?.002:.0008);if(q.y>1){q.y=-.05;q.x=Math.random()}let x=q.x*w,y=q.y*h;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5*q.s,y+15*q.s);ctx.stroke()});if(mode==='storm'&&Math.random()<.004)$('#flash').classList.remove('go'),void $('#flash').offsetWidth,$('#flash').classList.add('go')}
 else if(mode==='snow'){ctx.fillStyle='rgba(245,250,255,.78)';particles.forEach(q=>{q.y+=q.v/220;q.x+=Math.sin(t+q.y*8)*.0005;if(q.y>1){q.y=-.03;q.x=Math.random()}ctx.beginPath();ctx.arc(q.x*w,q.y*h,1.7*q.s,0,7);ctx.fill()})}
 ctx.restore()}
