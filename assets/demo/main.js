import * as T from 'three';
import { houses } from './content.js';
import { createWorld, createAvatar, createRoom, createSky } from './world.js';
import { move, findRoute } from './movement.js';
import { createOrbitGesture, orbitFromDrag, INITIAL_TILT } from './orbit.js';
import {icon} from './icons.js';

const $=id=>document.getElementById(id);
const stage=$('world'),keys=new Set(),visited=new Set();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{
  renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'default'});
}catch(error){
  $('loading').hidden=true;$('fallback').hidden=false;
  console.info('A prévia 3D está indisponível.',error);
}
if(renderer)start();

function start(){
  stage.appendChild(renderer.domElement);
  renderer.setClearColor('#f2dfcc');renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
  const scene=new T.Scene();scene.fog=new T.Fog('#eeddd1',190,360);
  const camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.5,500);
  scene.add(new T.HemisphereLight('#f7f5ff','#8b94ba',1.75));
  const sun=new T.DirectionalLight('#fff1d7',2.7);sun.position.set(-34,60,35);sun.castShadow=true;
  sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-53,right:53,top:53,bottom:-53,near:1,far:140});
  sun.shadow.bias=-.0003;sun.shadow.normalBias=.045;sun.shadow.blurSamples=5;scene.add(sun);
  const fill=new T.DirectionalLight('#b5bfff',.85);fill.position.set(35,20,-35);scene.add(fill);
  const obstacles=createWorld(scene,houses);
  const avatar=createAvatar(scene);
  let room=null,activeHouse=null,nearest=null,route=[],angle=Math.PI+.3,targetAngle=Math.PI+.3,walkPhase=0,roomExpanded=false,cameraMode='character';
  let tilt=.42,targetTilt=.42;
  let suspended=false,transitioning=false,quality=false,joystick={x:0,y:0};
  let roomReturnFocus=null,lastTime=0,accumulator=0;
  const look=new T.Vector3(),cameraPosition=new T.Vector3(),projected=new T.Vector3(),cameraDirection=new T.Vector3(),cameraRay=new T.Raycaster();
  const dialog=$('destinations');
  let orbitGesture;
  const release=()=>{keys.clear();joystick.x=0;joystick.y=0;$('joystick-knob').style.transform='';orbitGesture?.cancel();};
  const announce=(text)=>{$('action-hint').textContent=text;};
  const labelElements=houses.map(h=>{
    const button=document.createElement('button');button.className='house-label';button.style.setProperty('--house-color',h.color);button.setAttribute('aria-label','Visitar casa: '+h.name);
    button.innerHTML=`<span>${h.number}</span>${h.name}<b>↗</b>`;button.addEventListener('click',()=>travel(h));$('labels').appendChild(button);
    const menu=document.createElement('button');menu.style.setProperty('--house-color',h.color);menu.innerHTML=`<span>${h.number}</span><div><strong>${h.name}</strong><small>${h.description}</small></div>`;menu.addEventListener('click',()=>{dialog.close();travel(h);});$('destination-list').appendChild(menu);return button;
  });
  function travel(h){
    if(transitioning)return;
    suspended=document.hidden;lastTime=0;
    if(activeHouse)exitRoom(false);
    release();$('welcome').classList.add('is-exploring');
    route=findRoute(avatar.root.position,h.door,houses,obstacles).map(p=>new T.Vector3(p.x,.3,p.z));
    if(!route.length){announce('Aproxime-se da porta para entrar.');return;}
    route.house=h;document.body.classList.add('is-navigating');
    labelElements.forEach((el,i)=>el.classList.toggle('is-target',houses[i]===h));
    announce('Em direção à casa: '+h.name);stage.focus({preventScroll:true});
  }
  function cancelRoute(){route=[];document.body.classList.remove('is-navigating');labelElements.forEach(el=>el.classList.remove('is-target'));}
  function setRoomExpanded(value){
    roomExpanded=value;document.body.classList.toggle('is-room-expanded',value);
    $('room-copy').hidden=value;$('expand-room').setAttribute('aria-pressed',String(value));
    $('expand-room').innerHTML=`${icon(value?'book':'expand')}<span>${value?'Mostrar conteúdo':'Ampliar ambiente'}</span>`;
  }
  $('expand-room').addEventListener('click',()=>{if(activeHouse)setRoomExpanded(!roomExpanded);});
  $('room-copy').addEventListener('click',e=>{
    const filter=e.target.closest('[data-tech-filter]');
    if(filter){
      const selected=filter.dataset.techFilter;
      $('room-copy').querySelectorAll('[data-tech-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button===filter)));
      const groups=[...$('room-copy').querySelectorAll('[data-tech-group]')];
      groups.forEach(group=>group.hidden=selected!=='all'&&group.dataset.techGroup!==selected);
      const count=groups.filter(group=>!group.hidden).reduce((total,group)=>total+group.querySelectorAll('.tech-tile').length,0);
      $('tech-filter-status').textContent=`${count} tecnologias e ferramentas exibidas.`;
    }
    const destination=e.target.closest('[data-room-destination]');
    if(destination){const target=houses.find(h=>h.id===destination.dataset.roomDestination);if(target)travel(target);}
  });
  async function transition(callback){
    if(transitioning)return;transitioning=true;release();cancelRoute();$('transition').classList.add('active');
    if(!reducedMotion)await new Promise(resolve=>setTimeout(resolve,260));
    callback();updateCamera(1,true);renderer.render(scene,camera);
    $('transition').classList.remove('active');transitioning=false;
  }
  function enterRoom(h){
    if(!h||transitioning)return;
    roomReturnFocus=document.activeElement;
    transition(()=>{
      activeHouse=h;room=createRoom(scene,h);avatar.root.position.set(156,.25,3);avatar.root.rotation.y=.3;
      document.body.classList.add('in-room');document.body.dataset.room=h.id;document.body.style.setProperty('--room-accent',h.color);setRoomExpanded(false);
      $('room-copy').innerHTML=`<span class="eyebrow">${h.eyebrow}</span><h2 id="room-title">${h.title}</h2>${h.html}`;
      $('room-name').textContent=h.name;
      $('room-content').hidden=false;$('location').textContent=h.name;
      visited.add(h.id);$('visited').textContent=`${visited.size} / 6 casas visitadas`;
      labelElements[houses.indexOf(h)].classList.add('is-visited');$('leave-room').focus({preventScroll:true});
      $('room-copy').scrollTo({top:0,left:0,behavior:'instant'});
    });
  }
  function exitRoom(animate=true){
    if(!activeHouse)return;
    const exit=()=>{
      const previous=activeHouse;
      avatar.root.position.copy(previous.door).setY(.3);avatar.root.rotation.y=previous.rotation;
      room.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(o.material.map){o.material.map.dispose();o.material.dispose();}}});room.removeFromParent();room=null;activeHouse=null;
      setRoomExpanded(false);$('room-content').hidden=true;document.body.classList.remove('in-room');delete document.body.dataset.room;$('location').textContent='Praça central';
      $('welcome').classList.add('is-exploring');nearest=previous;
      if(roomReturnFocus?.isConnected)roomReturnFocus.focus({preventScroll:true});else stage.focus({preventScroll:true});
    };
    if(animate)transition(exit);else exit();
  }
  $('leave-room').addEventListener('click',()=>exitRoom());
  $('interact').addEventListener('click',()=>enterRoom(nearest));
  $('destinations-button').addEventListener('click',()=>{release();cancelRoute();dialog.showModal();});
  $('close-destinations').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  $('rotate-left').addEventListener('click',()=>targetAngle-=Math.PI/4);
  $('rotate-right').addEventListener('click',()=>targetAngle+=Math.PI/4);
  function setCameraMode(mode){
    cameraMode=mode;targetAngle=mode==='character'?avatar.root.rotation.y+Math.PI:0;targetTilt=mode==='character'?.42:INITIAL_TILT;
    $('camera-mode').setAttribute('aria-pressed',String(mode==='character'));
    $('camera-mode').setAttribute('aria-label',mode==='character'?'Alternar para visão da praça':'Alternar para visão do personagem');
    $('camera-mode').title=mode==='character'?'Ver a praça de cima':'Acompanhar o personagem';
    $('camera-mode').innerHTML=`${icon(mode==='character'?'person':'map')}<span>${mode==='character'?'Personagem':'Praça'}</span>`;
    stage.focus({preventScroll:true});
  }
  $('camera-mode').addEventListener('click',()=>setCameraMode(cameraMode==='character'?'plaza':'character'));
  $('home').addEventListener('click',()=>{
    if(transitioning)return;cancelRoute();release();avatar.root.position.set(0,.3,5.8);avatar.root.rotation.y=.3;setCameraMode(cameraMode);
  });
  $('quality').addEventListener('click',()=>{
    quality=!quality;renderer.setPixelRatio(quality?1:Math.min(devicePixelRatio,1.65));renderer.shadowMap.enabled=!quality;
    $('quality').setAttribute('aria-pressed',String(quality));$('quality').setAttribute('aria-label',quality?'Ativar qualidade normal':'Ativar qualidade leve');
    resize();
  });
  const movementKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
  window.addEventListener('keydown',e=>{
    if(dialog.open)return;
    if(e.code==='Escape'){release();cancelRoute();if(activeHouse)exitRoom();return;}
    if(transitioning)return;
    if(activeHouse)return;
    if(e.code==='KeyE'){e.preventDefault();if(!e.repeat)enterRoom(nearest);return;}
    if(movementKeys.includes(e.code)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
      // Buttons retain their normal Tab and Enter behavior.
      e.preventDefault();keys.add(e.code);cancelRoute();$('welcome').classList.add('is-exploring');
    }
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>{release();suspended=true;lastTime=0;});
  window.addEventListener('focus',()=>{suspended=false;lastTime=0;});
  document.addEventListener('pointerdown',()=>{if(!document.hidden&&suspended){suspended=false;lastTime=0;}},{capture:true});
  document.addEventListener('visibilitychange',()=>{release();suspended=document.hidden;lastTime=0;});
  const stick=$('joystick');let stickPointer=null;
  function updateStick(e){const r=stick.getBoundingClientRect(),radius=r.width*.35;let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;const length=Math.hypot(x,y);if(length>1){x/=length;y/=length;}joystick={x,y};$('joystick-knob').style.transform=`translate(${x*radius}px,${y*radius}px)`;}
  stick.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);cancelRoute();$('welcome').classList.add('is-exploring');updateStick(e);});
  stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e);});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,()=>{stickPointer=null;release();});
  // Capture the pointer so orbiting remains continuous across floating labels.
  const raycaster=new T.Raycaster(),mouse=new T.Vector2();
  // Separate hit volumes keep roof clicks reliable after the scenery is batched.
  const houseHitMaterial=new T.MeshBasicMaterial({side:T.DoubleSide});
  const houseHits=houses.map(h=>{
    const {width,depth,height}=h.building;
    const hit=new T.Mesh(new T.BoxGeometry(width+.6,height,depth+.6),houseHitMaterial);hit.position.set(h.x,height/2,h.z);hit.rotation.y=h.rotation;hit.userData.house=h;hit.updateMatrixWorld();return hit;
  });
  orbitGesture=createOrbitGesture({
    onOrbit(dx,dy){
      const next=orbitFromDrag(targetAngle,targetTilt,dx,dy);targetAngle=next.yaw;targetTilt=next.tilt;
      $('welcome').classList.add('is-exploring');
    },
    onDragging(value){stage.classList.toggle('is-orbiting',value);},
    onClick(e){
      if(activeHouse||transitioning)return;
      mouse.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(mouse,camera);
      const hit=raycaster.intersectObjects(houseHits,false)[0];if(hit)travel(hit.object.userData.house);
    }
  });
  renderer.domElement.addEventListener('pointerdown',e=>{
    if(activeHouse||transitioning||dialog.open)return;
    if(orbitGesture.begin(e)){stage.focus({preventScroll:true});renderer.domElement.setPointerCapture(e.pointerId);}
  });
  renderer.domElement.addEventListener('pointermove',e=>orbitGesture.update(e));
  renderer.domElement.addEventListener('pointerup',e=>{
    orbitGesture.update(e);orbitGesture.end(e);
    if(renderer.domElement.hasPointerCapture(e.pointerId))renderer.domElement.releasePointerCapture(e.pointerId);
  });
  for(const event of ['pointercancel','lostpointercapture'])renderer.domElement.addEventListener(event,()=>orbitGesture.cancel());
  function resize(){createSky(scene);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);updateCamera(1,true);}
  window.addEventListener('resize',resize);
  function updateCamera(dt,instant=false){
    const easing=instant||reducedMotion?1:1-Math.exp(-dt*(cameraMode==='character'&&!activeHouse?8:5));
    camera.fov=!activeHouse&&cameraMode==='character'?60:38;
    angle=T.MathUtils.lerp(angle,targetAngle,easing);
    tilt=T.MathUtils.lerp(tilt,targetTilt,easing);
    if(activeHouse){
      const mobile=innerWidth<600;
      const mobileFit=Math.max(1,390/innerWidth);
      if(roomExpanded){cameraPosition.set(mobile?160+25*mobileFit:181,mobile?2+27*mobileFit:21,mobile?60*mobileFit:41);}
      else{cameraPosition.set(mobile?160+27*mobileFit:186,mobile?2+27*mobileFit:25,mobile?61*mobileFit:50);}
      look.set(160,2,0);
      // Keep the full miniature beside the reading panel, or above it on a phone.
      const panelWidth=Math.min(680,innerWidth*(innerWidth<900?.51:.49));
      camera.setViewOffset(innerWidth,innerHeight,roomExpanded||mobile?0:(panelWidth+24)/2,!roomExpanded&&mobile?innerHeight*.22:0,innerWidth,innerHeight);
      sun.position.set(126,60,35);sun.target.position.set(160,0,0);
    }else{
      camera.clearViewOffset();
      if(cameraMode==='character'){
        const radius=Math.cos(tilt)*16;
        cameraPosition.set(avatar.root.position.x+Math.sin(angle)*radius,avatar.root.position.y+Math.sin(tilt)*16+1,avatar.root.position.z+Math.cos(angle)*radius);
        look.set(avatar.root.position.x-Math.sin(angle)*2,avatar.root.position.y+2.4,avatar.root.position.z-Math.cos(angle)*2);
        cameraDirection.subVectors(cameraPosition,look);const distance=cameraDirection.length();cameraDirection.normalize();cameraRay.set(look,cameraDirection);
        const obstruction=cameraRay.intersectObjects(houseHits,false)[0];
        if(obstruction&&obstruction.distance<distance)cameraPosition.copy(look).addScaledVector(cameraDirection,Math.max(.6,obstruction.distance-.6));
      }else{
        const fit=Math.max(1,.94/camera.aspect);
        const distance=Math.hypot(82,65)*fit,radius=Math.cos(tilt)*distance;
        cameraPosition.set(Math.sin(angle)*radius,Math.sin(tilt)*distance,Math.cos(angle)*radius);
        look.set(avatar.root.position.x*.07,-3,avatar.root.position.z*.07-1);
      }
      sun.position.set(-34,60,35);sun.target.position.set(0,0,0);
    }
    camera.position.lerp(cameraPosition,easing);camera.lookAt(look);sun.target.updateMatrixWorld();
  }
  function tick(dt){
    if(suspended||dialog.open||transitioning||activeHouse)return;
    let dx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+joystick.x;
    let dz=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+joystick.y;
    if(route.length){
      const next=route[0],dist=Math.hypot(next.x-avatar.root.position.x,next.z-avatar.root.position.z);
      if(dist<.34){const destination=route.house;route.shift();if(!route.length){enterRoom(destination);return;}}
      else{dx=(next.x-avatar.root.position.x)/dist;dz=(next.z-avatar.root.position.z)/dist;}
    }else{
      const x=dx*Math.cos(angle)+dz*Math.sin(angle),z=-dx*Math.sin(angle)+dz*Math.cos(angle);dx=x;dz=z;
    }
    const walked=move(avatar.root.position,dx,dz,dt,houses,obstacles),moving=Math.hypot(walked.dx,walked.dz)>.001;
    if(moving){const desired=Math.atan2(walked.dx,walked.dz);avatar.root.rotation.y+=Math.atan2(Math.sin(desired-avatar.root.rotation.y),Math.cos(desired-avatar.root.rotation.y))*.3;walkPhase+=dt*19;}
    const stride=moving&&!reducedMotion?Math.sin(walkPhase)*.55:0;
    avatar.legs.forEach((limb,i)=>limb.rotation.x=stride*(i?1:-1));avatar.arms.forEach((limb,i)=>limb.rotation.x=stride*(i?-1:1));avatar.body.position.y=moving&&!reducedMotion?Math.abs(Math.sin(walkPhase))*.09:0;
  }
  function updateHUD(){
    if(activeHouse)return;
    let closest=null,distance=Infinity;
    houses.forEach((h,i)=>{
      projected.copy(h.labelAnchor);if(cameraMode==='character')projected.y=5.8;projected.project(camera);
      const el=labelElements[i],half=el.offsetWidth/2+8;el.style.left=`${T.MathUtils.clamp((projected.x*.5+.5)*innerWidth,half,innerWidth-half)}px`;el.style.top=`${(-projected.y*.5+.5)*innerHeight}px`;
      el.hidden=projected.z>1||projected.z< -1||(cameraMode==='character'&&(Math.abs(projected.x)>1.08||projected.y>.75||projected.y<-.75));
      if(cameraMode==='character'&&innerWidth>600&&!$('welcome').classList.contains('is-exploring')&&projected.x<-.3&&projected.y>.25)el.hidden=true;
      const d=avatar.root.position.distanceTo(h.door);if(d<distance){distance=d;closest=h;}
    });
    nearest=distance<3.6?closest:null;
    const action=$('interact');action.disabled=!nearest||transitioning;action.querySelector('span').textContent=nearest?'Entrar em '+nearest.name:'Explorar';
    if(!route.length)announce(nearest?'Você chegou. A porta está aberta.':'Escolha uma casinha para começar');
    $('location').textContent=route.length?'Explorando a praça':nearest?'Casa: '+nearest.name:'Praça central';
  }
  function frame(time){
    requestAnimationFrame(frame);
    const dt=lastTime?Math.min((time-lastTime)/1000,.1):0;lastTime=time;
    accumulator+=dt;while(accumulator>=1/60){tick(1/60);accumulator-=1/60;}
    updateCamera(dt);updateHUD();renderer.render(scene,camera);
    // Compact diagnostics for inspecting the actual prototype during local QA.
    stage.dataset.position=`${avatar.root.position.x.toFixed(2)},${avatar.root.position.z.toFixed(2)}`;
    stage.dataset.room=activeHouse?.id||'plaza';stage.dataset.drawCalls=renderer.info.render.calls;
    stage.dataset.camera=`${angle.toFixed(3)},${tilt.toFixed(3)}`;stage.dataset.cameraMode=cameraMode;
  }
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();release();suspended=true;$('fallback').hidden=false;});
  setCameraMode('character');resize();renderer.render(scene,camera);$('loading').hidden=true;requestAnimationFrame(frame);
}
