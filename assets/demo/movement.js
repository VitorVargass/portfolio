// Horizontal movement uses seconds, independent of the render frame rate.
export const WALK_SPEED = 19;
export function canWalk(x,z,houses,obstacles=[],clearance=0){
  if(Math.hypot(x,z)>32.2-clearance)return false;
  if(obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.radius+clearance))return false;
  return !houses.some(h=>{
    const dx=x-h.x,dz=z-h.z,c=Math.cos(h.rotation),s=Math.sin(h.rotation);
    const localX=dx*c-dz*s,localZ=dx*s+dz*c;
    const halfWidth=h.building?h.building.width/2+.65:4.4,halfDepth=h.building?h.building.depth/2+.7:4.5;
    return Math.abs(localX)<halfWidth+clearance&&Math.abs(localZ)<halfDepth+clearance;
  });
}
export function move(position,dx,dz,dt,houses,obstacles=[]){
  const length=Math.hypot(dx,dz);
  if(length<.001)return {dx:0,dz:0};
  const amount=Math.min(length,1)*WALK_SPEED*dt;dx=dx/length*amount;dz=dz/length*amount;
  const oldX=position.x,oldZ=position.z;
  // Small collision steps keep the faster character from skipping thin obstacles.
  const steps=Math.max(1,Math.ceil(amount/.25));
  for(let i=0;i<steps;i++){
    if(canWalk(position.x+dx/steps,position.z,houses,obstacles))position.x+=dx/steps;
    if(canWalk(position.x,position.z+dz/steps,houses,obstacles))position.z+=dz/steps;
  }
  return {dx:position.x-oldX,dz:position.z-oldZ};
}

// A small navigation grid keeps click-to-walk routes clear of building walls.
export function findRoute(start,end,houses,obstacles=[]){
  const step=1.4,key=(x,z)=>`${x},${z}`,sx=Math.round(start.x/step),sz=Math.round(start.z/step),ex=Math.round(end.x/step),ez=Math.round(end.z/step);
  const clear=(ax,az,bx,bz)=>{
    const samples=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)/.25));
    for(let i=1;i<=samples;i++)if(!canWalk(ax+(bx-ax)*i/samples,az+(bz-az)*i/samples,houses,obstacles,.4))return false;
    return true;
  };
  const first={x:sx,z:sz,g:0,f:Math.hypot(ex-sx,ez-sz),previous:null};
  const open=[first],seen=new Map([[key(sx,sz),first]]),closed=new Set();let found=null;
  while(open.length){
    open.sort((a,b)=>a.f-b.f);const current=open.shift(),id=key(current.x,current.z);
    if(closed.has(id))continue;closed.add(id);
    if(current.x===ex&&current.z===ez){found=current;break;}
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
      const x=current.x+dx,z=current.z+dz,k=key(x,z);
      if(closed.has(k)||!clear(current.x*step,current.z*step,x*step,z*step))continue;
      const g=current.g+Math.hypot(dx,dz),previous=seen.get(k);
      if(previous&&previous.g<=g)continue;
      const node={x,z,g,f:g+Math.hypot(ex-x,ez-z),previous:current};seen.set(k,node);open.push(node);
    }
  }
  if(!found)return [];
  const points=[];for(let n=found;n.previous;n=n.previous)points.unshift({x:n.x*step,z:n.z*step});
  points.push({x:end.x,z:end.z});return points;
}
