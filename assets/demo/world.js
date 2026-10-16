import * as T from 'three';
import { RoundedBoxGeometry } from '../vendor/RoundedBoxGeometry.js';
import { mergeGeometries } from '../vendor/BufferGeometryUtils.js';
import { landmarks, gardenObstacles } from './layout.js';
import { buildHouse } from './buildings.js';

const palette = {cream:'#f6f0df',white:'#faf8ef',stone:'#d8d6dc',dark:'#39415c',grass:'#b4c6b2',leaf:'#8cae9d',leafLight:'#c2d4b6',wood:'#b2988f',blue:'#7b8bc9',lilac:'#aba0cd',pink:'#dcb6ce',gold:'#dbc79d'};
const materials = new Map();
export function createSky(scene){
  const canvas=document.createElement('canvas');canvas.width=Math.round(768*innerWidth/innerHeight);canvas.height=768;
  const width=canvas.width;
  const context=canvas.getContext('2d'),sky=context.createLinearGradient(0,0,0,768);
  sky.addColorStop(0,'#ddcbd6');sky.addColorStop(.42,'#f5dfc9');sky.addColorStop(.73,'#f7e9d5');sky.addColorStop(1,'#cbded7');
  context.fillStyle=sky;context.fillRect(0,0,width,768);
  const sunX=width*.81,glow=context.createRadialGradient(sunX,165,25,sunX,165,250);glow.addColorStop(0,'#fff5d9dd');glow.addColorStop(1,'#fff5d900');
  context.fillStyle=glow;context.fillRect(0,0,width,768);
  context.fillStyle='#fff4db';context.beginPath();context.arc(sunX,165,44,0,Math.PI*2);context.fill();
  for(const [x,y,w,h] of [[width*.18,180,width*.18,19],[width*.8,300,width*.22,17],[width*.12,540,width*.21,24],[width*.87,630,width*.2,21]]){
    context.fillStyle='#fff9ed55';context.beginPath();context.ellipse(x,y,w,h,-.04,0,Math.PI*2);context.fill();
  }
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  if(scene.background?.isTexture)scene.background.dispose();scene.background=texture;
}
export function material(color, roughness=.75){
  const key=color+roughness;
  if(!materials.has(key)) materials.set(key,new T.MeshStandardMaterial({color,roughness}));
  return materials.get(key);
}
export function mesh(parent,geometry,color,x=0,y=0,z=0){const m=new T.Mesh(geometry,typeof color==='string'?material(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function box(parent,w,h,d,color,x=0,y=0,z=0,r=.12){return mesh(parent,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),color,x,y,z);}
function ball(parent,r,color,x,y,z,sy=1){const b=mesh(parent,new T.SphereGeometry(r,12,8),color,x,y,z);b.scale.y=sy;return b;}
function cylinder(parent,rt,rb,h,color,x,y,z,segments=24){return mesh(parent,new T.CylinderGeometry(rt,rb,h,segments),color,x,y,z);}
function torus(parent,r,t,color,x,y,z){return mesh(parent,new T.TorusGeometry(r,t,6,40),color,x,y,z);}
function plant(parent,x,z,scale=1){
  cylinder(parent,.16,.23,1.8*scale,palette.wood,x,.9*scale,z,7);
  ball(parent,1.1*scale,palette.leaf,x,2.2*scale,z,1.13);
  ball(parent,.8*scale,palette.leafLight,x-.45*scale,2.75*scale,z+.2*scale);
  ball(parent,.7*scale,palette.leaf,x+.6*scale,2.55*scale,z-.1*scale);
}
function flower(parent,x,z,color=palette.lilac){cylinder(parent,.035,.035,.35,palette.leaf,x,.2,z,5);ball(parent,.16,color,x,.42,z,.6);ball(parent,.065,palette.cream,x,.48,z);}
function flowerBed(parent,x,z,radius=2){
  cylinder(parent,radius+.2,radius+.3,.3,palette.cream,x,.18,z,24);
  cylinder(parent,radius,radius,.08,palette.wood,x,.35,z,24);
  for(let i=0;i<18;i++){
    const a=i*2.39996,r=Math.sqrt((i+.5)/18)*(radius-.2),px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;
    ball(parent,.26,palette.leaf,px,.48,pz,.55);
    const stem=new T.Group();stem.position.set(px,.38,pz);parent.add(stem);
    flower(stem,0,0,[palette.pink,palette.lilac,palette.gold][i%3]);
    for(let j=0;j<3;j++){const petal=ball(stem,.13,[palette.pink,palette.lilac,palette.gold][i%3],Math.sin(j*2.1)*.17,.41,Math.cos(j*2.1)*.17,.6);}
  }
}
function planter(parent,x,z,scale=1){
  cylinder(parent,.8*scale,.6*scale,.6*scale,palette.cream,x,.3*scale,z);
  ball(parent,.75*scale,palette.leaf,x,.7*scale,z,.65);
  flower(parent,x-.2*scale,z+.2*scale,palette.pink);flower(parent,x+.2*scale,z,palette.lilac);
}
function lamp(parent,x,z){
  cylinder(parent,.12,.23,.26,palette.stone,x,.13,z,8);cylinder(parent,.055,.055,1.7,palette.wood,x,1,z,8);
  box(parent,.42,.55,.42,palette.cream,x,2,z,.1);box(parent,.54,.15,.54,palette.blue,x,2.31,z,.08);
}
function bench(parent,x,z,rotation){
  const g=new T.Group();g.position.set(x,0,z);g.rotation.y=rotation;parent.add(g);
  for(let i=-1;i<=1;i++)box(g,2.7,.12,.23,palette.wood,0,.66,i*.28);
  box(g,2.7,.6,.13,palette.wood,0,1.15,-.43);box(g,.13,.7,.8,palette.cream,-1,.3,0);box(g,.13,.7,.8,palette.cream,1,.3,0);
}
function pond(parent){
  const {x,z}=landmarks.pond,g=new T.Group();g.position.set(x,0,z);parent.add(g);
  cylinder(g,3.2,3.35,.38,palette.cream,0,.2,0,48);
  cylinder(g,2.94,2.94,.1,material('#80b6c4',.3),0,.42,0,48);
  const rim=torus(g,3.05,.13,palette.stone,0,.5,0);rim.rotation.x=-Math.PI/2;
  cylinder(g,.46,.65,.8,palette.cream,0,.8,0);
  cylinder(g,1.2,.4,.3,palette.cream,0,1.33,0);
  cylinder(g,1.02,1.02,.05,'#80b6c4',0,1.5,0);
  cylinder(g,.1,.15,.8,'#b8dfdf',0,1.9,0,12);ball(g,.18,'#b8dfdf',0,2.32,0);
  for(let i=0;i<3;i++){const ring=torus(g,.5+i*.64,.025,'#b8dfdf',0,.49,0);ring.rotation.x=-Math.PI/2;}
  for(const [lx,lz] of [[1.5,1],[-1.8,.5],[.8,-1.7]]){
    const lily=cylinder(g,.38,.38,.03,palette.leaf,lx,.51,lz,12);lily.scale.z=.8;
    ball(g,.16,palette.pink,lx+.1,.61,lz,.65);
  }
  for(let i=0;i<7;i++){const a=i*.83;ball(g,.34,palette.leaf,Math.cos(a)*3.35,.3,Math.sin(a)*3.35,.6);}
}
function pergola(parent){
  const {x,z}=landmarks.pergola,g=new T.Group();g.position.set(x,0,z);g.rotation.y=-.3;parent.add(g);
  box(g,6,.2,5.6,palette.cream,0,.16,0,.2);
  for(const px of [-2.5,2.5])for(const pz of [-2,2]){
    box(g,.22,3.6,.22,palette.wood,px,1.95,pz,.05);
    box(g,.5,.2,.5,palette.cream,px,.4,pz,.06);
  }
  for(const px of [-2.5,2.5])box(g,.3,.3,5.7,palette.wood,px,3.75,0,.04);
  for(let i=0;i<9;i++)box(g,6,.18,.19,palette.cream,0,3.98,-2.4+i*.6,.04);
  bench(g,0,-1.3,0);
  for(const px of [-2.8,2.8])planter(g,px,2,.85);
  for(let i=0;i<14;i++){
    const a=i*.85,px=Math.cos(a)*2.5,pz=Math.sin(a)*2;
    ball(g,.43,palette.leaf,px,4.12,pz,.35);
    if(i%2===0)ball(g,.18,palette.lilac,px,4.28,pz,.5);
  }
  const cable=new T.CatmullRomCurve3([new T.Vector3(-2.5,3.5,2.1),new T.Vector3(0,2.95,2.1),new T.Vector3(2.5,3.5,2.1)]);
  mesh(g,new T.TubeGeometry(cable,20,.025,5,false),palette.wood);
  for(let i=1;i<8;i++){const p=cable.getPoint(i/8);ball(g,.09,palette.gold,p.x,p.y-.12,p.z);}
  box(g,1.3,.1,.7,palette.blue,.2,.92,-1.15,.04);box(g,1.15,.03,.65,palette.cream,.2,.99,-1.15,.02);
}
function emblem(parent,text,color,w=2.4,h=1.2,x=0,y=0,z=0){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle=color;c.fillRect(0,0,512,256);c.fillStyle='#fffaf3';c.textAlign='center';c.textBaseline='middle';c.font='bold 120px Segoe UI, sans-serif';const size=Math.min(120,120*460/c.measureText(text).width);c.font=`bold ${size}px Segoe UI, sans-serif`;c.fillText(text,256,132);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const sign=mesh(parent,new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture}),x,y,z);return sign;
}
// Consolidate decorative geometry into a few material batches for mobile GPUs.
function batchStatic(group){
  group.updateMatrixWorld(true);const buckets=new Map();const originals=[];
  group.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(o.matrixWorld);for(const key of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(key))geo.deleteAttribute(key);const key=o.material.uuid;if(!buckets.has(key))buckets.set(key,{material:o.material,geometries:[]});buckets.get(key).geometries.push(geo);originals.push(o);});
  for(const o of originals){o.removeFromParent();o.geometry.dispose();}
  group.clear();group.position.set(0,0,0);group.rotation.set(0,0,0);
  for(const b of buckets.values()){const merged=mergeGeometries(b.geometries);for(const geo of b.geometries)geo.dispose();if(merged)mesh(group,merged,b.material);}
}
export function createWorld(scene,houses){
  const world=new T.Group();scene.add(world);
  cylinder(world,34,32,1.3,palette.cream,0,-.65,0,96);
  cylinder(world,33,31,5,'#a9a4bd',0,-3.3,0,25);
  cylinder(world,31,23,5.5,'#9296b2',0,-8.5,0,17);
  cylinder(world,23,13,3.5,'#858eaa',0,-12.8,0,14);
  cylinder(world,33.5,33.5,.12,'#b9cbb2',0,.02,0,96);
  cylinder(world,11.5,11.5,.16,palette.stone,0,.16,0,72);
  cylinder(world,10.8,10.8,.17,palette.cream,0,.22,0,72);
  const ring=torus(world,8.9,.09,'#b8b7d6',0,.32,0);ring.rotation.x=-Math.PI/2;
  const ring2=torus(world,4.1,.08,'#b8b7d6',0,.33,0);ring2.rotation.x=-Math.PI/2;
  // Six radial walks and stepping stones between the plaza and the front doors.
  houses.forEach((h,i)=>{
    buildHouse(world,h,{box,ball,cylinder,torus,mesh,emblem,planter,palette});
    const a=Math.atan2(h.door.x,h.door.z),distance=h.door.length();
    const path=box(world,3.7,.13,distance-5,palette.cream,Math.sin(a)*(distance+5)/2,.15,Math.cos(a)*(distance+5)/2,.2);path.rotation.y=a;
    for(let j=8;j<distance;j+=1.4){const tile=box(world,3.45,.03,.06,'#d7d6d8',Math.sin(a)*j,.24,Math.cos(a)*j,.01);tile.rotation.y=a;}
    const tangent=new T.Vector3(Math.cos(a),0,-Math.sin(a));
    for(const side of [-1,1]){
      const at=h.door.clone().multiplyScalar(.8).addScaledVector(tangent,side*3.3);lamp(world,at.x,at.z);
      const p=new T.Vector3(h.x,0,h.z).addScaledVector(tangent,side*6.1);plant(world,p.x,p.z,.95+i%2*.15);
    }
  });
  // A restrained inlaid VV in the central roundel.
  cylinder(world,3.25,3.25,.06,'#e0deee',0,.33,0,60);
  const medallion=emblem(world,'VV','#aaa9ce',4.5,2.25,0,.38,0);medallion.rotation.x=-Math.PI/2;
  pond(world);pergola(world);
  for(const a of [-2.67,-1.61,-.55,.55,1.61,2.67]){
    const x=Math.sin(a)*27,z=Math.cos(a)*27;
    flowerBed(world,x,z,1.7);
    const fence=new T.Group();fence.position.set(x,0,z);fence.rotation.y=a;world.add(fence);
    for(let i=0;i<5;i++){
      box(fence,.13,1.1,.13,palette.cream,-1.5+i*.75,.58,2.25,.045);
      ball(fence,.12,palette.gold,-1.5+i*.75,1.17,2.25);
    }
    for(const y of [.45,.85])box(fence,3.3,.1,.1,palette.cream,0,y,2.25,.03);
  }
  for(let i=0;i<24;i++){
    const a=i/24*Math.PI*2;const x=Math.sin(a)*32,z=Math.cos(a)*32;
    if(i%3===0)plant(world,x,z,.7+(i%4)*.11);
    else{ball(world,1.3,palette.leaf,x,.6,z,.5);for(let j=0;j<4;j++)flower(world,x+(j-1.5)*.4,z+.5,j%2?palette.pink:palette.lilac);}
    const rock=mesh(world,new T.DodecahedronGeometry(1.4,0),'#c7c5d4',x,-.6,z);rock.scale.set(1.5,.6,1);
    // Ivy and small exposed rocks give the island detail from every angle.
    if(i%3===1)for(let j=0;j<6;j++){
      const r=33-j*.22;ball(world,.5-j*.045,palette.leaf,Math.sin(a+j*.012)*r,-.5-j*.43,Math.cos(a+j*.012)*r,.75);
    }
    if(i%2===0){const cliff=mesh(world,new T.DodecahedronGeometry(1.7,0),'#a9a4bd',x*.98,-2.5,z*.98);cliff.scale.set(.8,1.6,.8);}
  }
  for(let i=0;i<70;i++){
    const a=i*2.39996,r=29.8+(i%3)*.65,x=Math.sin(a)*r,z=Math.cos(a)*r;
    for(let j=0;j<3;j++){const blade=mesh(world,new T.ConeGeometry(.09,.55,3),palette.leaf,x+j*.12,.28,z);blade.rotation.z=(j-1)*.3;}
  }
  for(const a of [.6,2.5,3.7,5.6]){const x=Math.sin(a)*11.6,z=Math.cos(a)*11.6;bench(world,x,z,a+Math.PI);planter(world,x+2.1,z+1,.7);}
  // Small clouds below the island make the cliff silhouette easier to read.
  for(let i=0;i<8;i++){const a=i*.8;const x=Math.sin(a)*(42+i%2*9),z=Math.cos(a)*43;for(let j=0;j<3;j++)ball(world,3+j%2,'#f2f3fc',x+j*2.7,-13+i%3,z,.36);}
  batchStatic(world);
  return gardenObstacles;
}
export function createAvatar(scene){
  const root=new T.Group();scene.add(root);const body=new T.Group();root.add(body);
  box(body,1.1,1.05,.7,palette.cream,0,1.35,0,.28);
  box(body,.65,.5,.17,palette.blue,0,1.38,.39,.12);
  ball(body,.1,palette.pink,0,1.38,.51,.5);
  const helmet=ball(body,.82,palette.cream,0,2.48,0,.85);
  box(body,1.25,.63,.4,material('#47547e',.25),0,2.45,.62,.28);
  for(const x of [-.29,.29])box(body,.1,.2,.04,'#aee9eb',x,2.46,.837,.04);
  for(const x of [-.9,.9]){cylinder(body,.22,.22,.16,palette.blue,x,2.47,0,16).rotation.z=Math.PI/2;}
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const leg=new T.Group();leg.position.set(side*.34,.9,0);body.add(leg);box(leg,.36,.65,.4,palette.blue,0,-.25,0,.12);box(leg,.43,.27,.63,palette.cream,0,-.55,.1,.12);legs.push(leg);
    const arm=new T.Group();arm.position.set(side*.72,1.72,0);body.add(arm);box(arm,.32,.62,.36,palette.blue,0,-.26,0,.12);ball(arm,.21,palette.cream,0,-.62,0);arms.push(arm);
  }
  box(body,.7,.8,.4,palette.blue,0,1.4,-.5,.15);
  const shadow=new T.Mesh(new T.CircleGeometry(1.1,28),new T.MeshBasicMaterial({color:'#687491',transparent:true,opacity:.13,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.35;root.add(shadow);
  root.position.set(0,.3,5.8);root.rotation.y=.3;root.scale.setScalar(1.2);
  return {root,body,legs,arms};
}
export function createRoom(scene,house){
  const room=new T.Group();scene.add(room);const offset=160;
  box(room,22,.6,17,'#d9d4dc',offset,-.5,0,.6);
  box(room,21,.15,16,palette.cream,offset,-.1,0,.1);
  box(room,22,10,.4,'#f5f2eb',offset,4.7,-8,.3);box(room,.4,10,16,'#ece8ef',offset-11,4.7,0,.3);
  box(room,22,.5,.6,house.color,offset,9.6,-7.8,.1);box(room,.6,.5,16,house.color,offset-10.8,9.6,0,.1);
  for(let i=0;i<10;i++)box(room,.035,.02,15,'#d3cdd6',offset-9+i*2,.02,0,.01);
  const rug=box(room,12,.06,8,house.color,offset,.04,1,.4);
  box(room,10,.06,6.5,'#d3d1e7',offset,.08,1,.3);
  // Workshop display on the back wall, with a tangible desk and illuminated screen.
  box(room,10,5,.3,house.color,offset-1,5.5,-7.5,.4);box(room,9.1,4.1,.2,palette.dark,offset-1,5.5,-7.25,.3);
  emblem(room,house.id==='projects'?'ICONE ACADEMY':house.name.toUpperCase(),house.color,7.8,2.7,offset-1,5.55,-7.1);
  box(room,10,.5,2.5,palette.wood,offset-1,2.3,-4.8,.15);
  for(const x of [offset-5,offset+3])box(room,.25,2.3,2.2,palette.cream,x,1.1,-4.8,.05);
  // Small working objects give the interior a lived-in scale.
  cylinder(room,.22,.18,.4,palette.cream,offset+2.6,2.75,-4.3,16);
  const handle=torus(room,.13,.04,palette.cream,offset+2.87,2.76,-4.3);handle.rotation.y=Math.PI/2;
  cylinder(room,.16,.16,.015,palette.wood,offset+2.6,2.96,-4.3,16);
  box(room,1.2,.08,.8,house.color,offset-4.6,2.62,-4.7,.04);box(room,1.05,.025,.7,palette.cream,offset-4.6,2.68,-4.7,.02);
  box(room,1.6,1.4,.12,palette.wood,offset+6.9,5.1,-7.6,.08);box(room,1.35,1.15,.1,palette.cream,offset+6.9,5.1,-7.49,.04);
  for(let i=0;i<3;i++){const pin=box(room,.42,.5,.035,i%2?house.color:palette.gold,offset+6.5+i*.4,5.2-i%2*.24,-7.42,.025);pin.rotation.z=(i-1)*.15;}
  if(house.id==='projects'){
    box(room,3.4,2.4,.32,palette.dark,offset-3,3.9,-4.8,.2);emblem(room,'ERP SaaS',house.color,3,1.9,offset-3,3.9,-4.59);
    box(room,.18,1,.2,palette.cream,offset-3,2.8,-4.8,.03);box(room,2.1,.12,1.1,palette.cream,offset-3,2.62,-4.8,.08);
    box(room,2.3,.5,1.1,palette.blue,offset+1.5,2.95,-4.6,.2);box(room,1.1,.45,.95,palette.cream,offset+1.5,3.35,-4.6,.15);
    for(const x of [.65,2.35])for(const z of [-5.15,-4.05]){const wheel=cylinder(room,.28,.28,.15,palette.dark,offset+x,2.8,z,16);wheel.rotation.x=Math.PI/2;}
  }else if(house.id==='experience'){
    for(const [i,name] of ['ICone','BNE'].entries()){
      const x=offset-3.2+i*4.4;box(room,3.5,2.3,.35,palette.cream,x,3.7,-4.8,.2);
      emblem(room,name,house.color,3,1.5,x,3.8,-4.56);
      box(room,3.7,.18,1.1,house.color,x,2.65,-4.8,.08);
    }
  }else if(house.id==='about'){
    const plane=new T.Group();plane.position.set(offset-1,4,-4.4);plane.rotation.y=-.4;room.add(plane);
    const fuselage=ball(plane,.5,palette.cream,0,0,0);fuselage.scale.set(.8,.8,4);
    box(plane,5,.15,.9,house.color,0,0,0,.1);box(plane,1.7,.13,.65,house.color,0,.3,1.7,.08);box(plane,.12,1.2,.7,house.color,0,.5,1.6,.08);
    for(const x of [-1.4,1.4])cylinder(plane,.3,.3,1,palette.cream,x,-.3,0,16).rotation.x=Math.PI/2;
    box(room,.25,1.2,.25,palette.wood,offset-1,3,-4.4,.03);
  }else if(house.id==='tech'){
    for(let i=0;i<3;i++){
      const x=offset-4+i*2.7,color=['#8063b3','#4698a4','#bc8f53'][i];box(room,2.1,4,1.5,palette.dark,x,4.6,-4.8,.15);
      emblem(room,['.NET','React','Go'][i],color,1.8,.85,x,5.87,-3.98);
      for(let j=0;j<6;j++){
        box(room,1.75,.25,.1,color,x,3.1+j*.37,-3.98,.04);
        ball(room,.07,palette.leafLight,x+.6,3.1+j*.37,-3.89);
      }
    }
  }else if(house.id==='education'){
    for(const side of [-1,1]){
      const page=box(room,2.5,.35,2,palette.cream,offset-1+side*1.22,3.05,-4.8,.08);page.rotation.z=side*.2;
      const cover=box(room,2.6,.15,2.2,house.color,offset-1+side*1.23,2.8,-4.8,.05);cover.rotation.z=side*.2;
      for(let j=0;j<3;j++){const line=box(room,1.7,.03,.035,palette.wood,offset-1+side*1.3,3.25,-5.35+j*.5,.01);line.rotation.z=side*.2;}
    }
  }else{
    box(room,5,3.1,.3,palette.cream,offset-1,4.25,-4.8,.2);
    for(const side of [-1,1]){
      const flap=box(room,2.9,.09,.08,house.color,offset-1+side*1.05,4.6,-4.57,.02);flap.rotation.z=side*.47;
    }
    emblem(room,'@',house.color,1.2,.8,offset-1,3.65,-4.55);
    for(const [i,label] of ['WA','in','GH'].entries()){
      const color=['#44895b','#397fb3','#51485f'][i];box(room,1.6,.9,1.2,color,offset-4+i*2.1,1.2,5,.14);
      emblem(room,label,color,1.3,.7,offset-4+i*2.1,1.3,5.63);
    }
  }
  for(let i=0;i<3;i++){
    box(room,2.4,.2,1.6,palette.wood,offset-9,1.3+i*1.7,-4.7,.08);
    for(let j=0;j<4;j++){const book=box(room,.3,.85,.8,j%2?house.color:palette.gold,offset-9.7+j*.43,1.85+i*1.7,-4.7,.03);book.rotation.z=j===0?.15:0;}
  }
  plant(room,offset-8,4,.9);planter(room,offset+8,-5,1.5);
  box(room,3.6,1.1,1.9,house.color,offset+5,.6,3,.3);box(room,3.6,1.5,.4,house.color,offset+5,1.3,2.2,.2);
  for(const x of [offset+3.6,offset+6.4])box(room,.45,1,2,house.color,x,1.1,3,.15);
  box(room,2,.2,1.4,palette.cream,offset+5,.8,5.3,.2);cylinder(room,.15,.25,.7,palette.wood,offset+5,.4,5.3);
  lamp(room,offset-8,-6.5);lamp(room,offset+8,-6.5);
  batchStatic(room);return room;
}
