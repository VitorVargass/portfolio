import * as T from 'three';

// Each destination has its own silhouette; the footprint is also used by navigation.
export function buildHouse(parent,house,kit){
  const {box,ball,cylinder,torus,mesh,emblem,planter,palette:p}=kit;
  const g=new T.Group(),{width:w,depth:d,height}=house.building,c=house.color;
  g.position.set(house.x,0,house.z);g.rotation.y=Math.atan2(-house.x,-house.z);parent.add(g);
  const front=d/2;
  box(g,w+1,.35,d+1,p.cream,0,.22,0,.25);
  function windowAt(x,y,z,ww=1.2,hh=1.5,rotation=0){
    const frame=new T.Group();frame.position.set(x,y,z);frame.rotation.y=rotation;g.add(frame);
    box(frame,ww+.25,hh+.25,.16,p.cream);box(frame,ww,hh,.12,c,0,0,.12);
    box(frame,.07,hh,.07,p.cream,0,0,.21,.02);box(frame,ww,.07,.07,p.cream,0,0,.21,.02);
  }
  function door(x=0,y=1.9,ww=1.7,hh=2.7){
    box(g,ww+.38,hh+.3,.22,p.cream,x,y,front+.13,.28);
    box(g,ww,hh,.18,p.dark,x,y,front+.28,.24);ball(g,.08,p.gold,x+ww*.3,y-.2,front+.4);
    box(g,ww+1,.2,1.2,p.cream,x,.34,front+.6);box(g,ww+1.7,.16,1.3,p.stone,x,.15,front+1.1);
  }
  function pitchedRoof(width,depth,base,rise,color=c){
    const shape=new T.Shape();shape.moveTo(-width/2,0);shape.lineTo(0,rise);shape.lineTo(width/2,0);shape.closePath();
    mesh(g,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.1,bevelSize:.1,bevelSegments:1,steps:1}),color,0,base,-depth/2);
    box(g,.16,.16,depth+.25,p.cream,0,base+rise+.1,0,.04);
  }
  function sideWindows(y=2.8){
    for(const side of [-1,1])for(const z of [-d*.25,d*.15])windowAt(side*(w/2+.06),y,z,1.2,1.5,side*Math.PI/2);
    for(const x of [-w*.27,w*.27])windowAt(x,y,-d/2-.06,1.3,1.6,Math.PI);
  }
  function sign(text,y,width=4,z=front+.22){emblem(g,text,c,width,.75,0,y,z);}
  if(house.id==='projects'){
    // Broad workshop: brickwork, a roller garage and a raised roof light.
    box(g,w,4.7,d,'#e2c2ad',0,2.7,0,.18);
    box(g,w+.6,.35,d+.6,c,0,5.12,0,.12);
    for(let row=0;row<6;row++)for(let i=0;i<8;i++)box(g,.95,.035,.035,p.cream,-w/2+.6+i*1.3+(row%2)*.3,.9+row*.58,front+.02,.005);
    box(g,4.5,3.2,.18,p.cream,-1.1,2.1,front+.12,.12);box(g,4.1,2.95,.12,c,-1.1,2.1,front+.26,.1);
    for(let i=0;i<9;i++)box(g,3.9,.055,.05,p.cream,-1.1,.8+i*.31,front+.34,.01);
    door(3.25,1.85,1.25,2.65);
    const hood=box(g,w+.4,.22,1.35,p.gold,0,4.38,front+.56,.06);hood.rotation.x=.12;
    for(const x of [-4.7,4.7])box(g,.12,3.8,.12,p.wood,x,2.1,front+.95,.03);
    box(g,5.2,.6,2.5,p.cream,-.6,5.55,-.4,.15);box(g,4.8,.1,2.2,c,-.6,5.92,-.4,.05);
    for(let i=0;i<4;i++)box(g,.09,.12,2.2,p.cream,-2.3+i*1.1,6,-.4,.02);
    box(g,1.15,1.7,1.15,p.wood,3.3,5.7,-2,.06);box(g,1.4,.25,1.4,p.dark,3.3,6.6,-2,.05);
    sign('OFICINA',4.82,3.3,front+.4);sideWindows(2.7);
    const car=new T.Group();car.position.set(-3.6,.42,front+1.25);car.rotation.y=-.17;g.add(car);
    box(car,2.1,.5,.95,c,0,.5,0,.18);box(car,1,.4,.85,p.cream,0,.91,0,.14);
    for(const x of [-.75,.75])for(const z of [-.5,.5]){const wheel=cylinder(car,.25,.25,.15,p.dark,x,.3,z,12);wheel.rotation.x=Math.PI/2;}
    for(const x of [-4.6,-3.5])box(g,.7,.75,.7,p.wood,x,.6,-d/2-1,.06);
  }else if(house.id==='experience'){
    // A taller two-storey town house, with balcony and clock tower.
    box(g,w,7.5,d,'#ead7d6',0,4.15,0,.25);box(g,w+.3,.32,d+.3,p.cream,0,4.4,0,.06);
    box(g,w+.35,.3,d+.35,p.cream,0,7.9,0,.06);pitchedRoof(w+.8,d+.6,8,1.5);
    door();
    for(const x of [-2.45,2.45]){windowAt(x,2.65,front+.06,1.25,1.7);windowAt(x,6.1,front+.06,1.25,1.9);}
    windowAt(0,6.2,front+.06,1.4,2);
    box(g,3.1,.2,1.05,p.cream,0,4.7,front+.65);
    for(let i=0;i<7;i++)box(g,.08,.9,.08,c,-1.4+i*.46,5.22,front+1.12,.02);
    box(g,3,.1,.12,c,0,5.7,front+1.12,.03);
    box(g,2.2,2.1,2.1,p.cream,0,9.45,.6,.18);pitchedRoof(2.55,2.5,10.45,.9);
    const clock=cylinder(g,.68,.68,.15,p.white,0,9.55,1.76,32);clock.rotation.x=Math.PI/2;
    torus(g,.67,.065,c,0,9.55,1.88);box(g,.07,.44,.05,p.dark,0,9.71,1.96,.01);box(g,.38,.07,.05,p.dark,.14,9.55,1.96,.01);
    sideWindows(2.7);sideWindows(6.2);
    for(const x of [-3.5,3.5])planter(g,x,front+1,.7);
    sign('TRAJETÓRIA',4,2.8);
  }else if(house.id==='about'){
    // A circular personal observatory, with copper dome and telescope.
    cylinder(g,4,4,5.1,'#d8ded1',0,2.85,0,32);cylinder(g,4.22,4.22,.28,p.cream,0,5.4,0,40);
    const dome=mesh(g,new T.SphereGeometry(4.08,32,16,0,Math.PI*2,0,Math.PI/2),c,0,5.5,0);dome.scale.y=.72;
    for(const a of [-.72,.72]){
      const seam=mesh(g,new T.TorusGeometry(4.1,.055,5,32,Math.PI),p.cream,0,5.51,0);seam.rotation.y=a;seam.scale.y=.72;
    }
    box(g,.55,3.5,1.1,p.cream,0,6.7,2.1,.15);box(g,.32,3.3,1.2,p.dark,0,6.75,2.2,.06);
    const scope=new T.Group();scope.position.set(.4,7.1,1.3);scope.rotation.x=.6;g.add(scope);
    cylinder(scope,.26,.36,2.8,p.gold,0,.7,0,16);cylinder(scope,.38,.38,.18,p.dark,0,2.1,0,20);
    door();for(const x of [-2.4,2.4])windowAt(x,2.8,3.22,1,1.6,x>0?.52:-.52);
    for(const a of [Math.PI/2,Math.PI,Math.PI*1.5])windowAt(Math.sin(a)*4.03,2.8,Math.cos(a)*4.03,1.3,1.65,a);
    cylinder(g,1,1.2,.4,p.stone,5,.2,1);
    const plane=new T.Group();plane.position.set(5,1.4,1);plane.rotation.z=.2;g.add(plane);
    const body=ball(plane,.25,p.cream,0,0,0);body.scale.set(.7,.7,4.3);
    box(plane,2.2,.08,.45,c,0,0,.1,.05);box(plane,.8,.06,.3,c,0,.15,.8,.04);box(plane,.08,.55,.3,c,0,.23,.75,.04);
    sign('VITOR',4.7,2.1,3.92);planter(g,-3.8,3.6,.8);
  }else if(house.id==='tech'){
    // Asymmetric modern lab with glazing, a roof garden and server units.
    box(g,w,4.8,d,p.white,0,2.75,0,.22);box(g,w+.6,.35,d+.6,c,0,5.3,0,.1);
    box(g,4.1,2.25,4.6,c,-1.9,6.35,-.8,.17);box(g,4.6,.25,5.1,p.cream,-1.9,7.6,-.8,.09);
    for(const side of [-1,1])box(g,.14,2.3,4,p.cream,-1.9+side*1.7,6.4,-.45,.03);
    windowAt(-1.9,6.4,1.55,3.25,1.5);
    for(const x of [-3.2,3.2])windowAt(x,2.8,front+.06,1.65,2.3);
    door();sideWindows(2.9);sign('LAB',4.65,2);
    for(let i=0;i<3;i++){
      box(g,1.2,1.7,1.4,p.dark,2.6,6.25,-2.2+i*1.6,.12);
      for(let j=0;j<4;j++)box(g,.8,.07,.05,p.leafLight,2.6,5.75+j*.3,-1.47+i*1.6,.01);
    }
    for(let i=0;i<4;i++)ball(g,.45,p.leaf,-3.2+i*.85,7.95,-1.8,.5);
    box(g,1.1,1.1,1.1,p.gold,-4.8,.8,front+.6,.09);box(g,.8,.8,.8,c,4.7,.65,front+.3,.09);
    for(let i=0;i<4;i++)box(g,w+.25,.045,.05,c,0,1+i*.55,-front-.03,.01);
  }else if(house.id==='education'){
    // A generous library with classical columns, a pediment and roof book.
    box(g,w,5.4,d,'#e8d4ac',0,3.1,0,.2);pitchedRoof(w+1,d+.9,5.95,2.1);
    box(g,w+.45,.3,d+.45,p.cream,0,5.8,0,.06);
    for(const x of [-3.9,-1.7,1.7,3.9]){
      cylinder(g,.19,.24,3.9,p.cream,x,2.7,front+.9,12);box(g,.55,.2,.55,p.white,x,.73,front+.9,.05);box(g,.6,.18,.6,p.white,x,4.7,front+.9,.05);
    }
    box(g,w+.2,.3,1.6,p.cream,0,4.96,front+.85,.08);
    door(0,2,1.8,3);for(const x of [-3.1,3.1])windowAt(x,3,front+.06,1.4,2.25);
    sideWindows(2.8);sign('BIBLIOTECA',5.43,4.4,front+.34);
    for(let i=0;i<3;i++)box(g,w+.4+i*.45,.16,1.3,p.stone,0,.4-i*.13,front+1.3+i*.38,.06);
    const book=new T.Group();book.position.set(0,8.45,0);g.add(book);
    for(const side of [-1,1]){
      const page=box(book,1.8,.3,2.1,p.cream,side*.85,.05,0,.06);page.rotation.z=side*.2;
      const cover=box(book,1.9,.13,2.2,c,side*.86,-.14,0,.04);cover.rotation.z=side*.2;
    }
    for(const x of [-5.3,5.3])planter(g,x,front+.6,.7);
  }else{
    // A rose post house: hipped roof, striped canopy, post box and signal mast.
    box(g,w,4.6,d,'#ebc7bd',0,2.7,0,.3);
    const roof=mesh(g,new T.ConeGeometry(6,2.2,4),c,0,6.2,0);roof.rotation.y=Math.PI/4;roof.scale.z=.9;
    box(g,w+.6,.3,d+.7,p.cream,0,5.2,0,.08);
    door();for(const x of [-2.5,2.5])windowAt(x,2.7,front+.06,1.15,1.7);
    for(let i=0;i<8;i++)box(g,.65,.2,1.6,i%2?p.cream:c,-2.3+i*.65,3.92,front+.6,.06);
    sideWindows(2.6);sign('OLÁ!',4.65,2.1,front+.4);
    cylinder(g,.075,.075,2.6,p.wood,1.7,6.7,-1.3,8);
    const dish=mesh(g,new T.SphereGeometry(.8,16,8,0,Math.PI*2,0,Math.PI/2),p.cream,1.7,7.6,-1.3);dish.rotation.z=-.65;
    ball(g,.1,c,2.2,8.2,-1.3);
    box(g,.25,1.5,.25,p.wood,4.8,.9,2,.04);box(g,1.2,.85,.8,c,4.8,1.8,2,.2);
    box(g,.7,.07,.06,p.dark,4.8,1.9,2.43,.01);box(g,.1,.45,.5,p.gold,5.45,2,2,.03);
    for(const x of [-3.3,3.3])planter(g,x,front+1,.75);
  }
  const forward=new T.Vector3(0,0,1).applyAxisAngle(new T.Vector3(0,1,0),g.rotation.y);
  house.door=new T.Vector3(house.x,0,house.z).addScaledVector(forward,front+2.8);
  house.center=new T.Vector3(house.x,0,house.z);house.rotation=g.rotation.y;
  house.labelAnchor=new T.Vector3(house.x,height+1.6,house.z);
  return g;
}
