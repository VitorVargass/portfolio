import test from 'node:test';
import assert from 'node:assert/strict';
import {move,canWalk,findRoute,WALK_SPEED} from '../assets/demo/movement.js';
import {houses as content} from '../assets/demo/content.js';
import {gardenObstacles} from '../assets/demo/layout.js';
const houses=content.map(h=>{const rotation=Math.atan2(-h.x,-h.z),distance=h.building.depth/2+2.8;return {...h,rotation,door:{x:h.x+Math.sin(rotation)*distance,z:h.z+Math.cos(rotation)*distance}};});

test('equal walking distance at 30, 60 and 144 updates per second',()=>{
  for(const fps of [30,60,144]){
    const p={x:0,z:0};for(let i=0;i<fps;i++)move(p,1,0,1/fps,houses);
    assert.ok(Math.abs(p.x-WALK_SPEED)<1e-8);
  }
});
test('diagonal input does not increase speed',()=>{
  const p={x:0,z:0};for(let i=0;i<60;i++)move(p,1,1,1/60,houses);
  assert.ok(Math.abs(Math.hypot(p.x,p.z)-WALK_SPEED)<1e-8);
});
test('walking stops at walls and at the island edge',()=>{
  const p={x:0,z:-16};for(let i=0;i<120;i++)move(p,0,-1,1/60,houses);
  assert.ok(canWalk(p.x,p.z,houses));assert.ok(p.z>=houses[1].z+houses[1].building.depth/2+.7);
  const edge={x:30,z:0};for(let i=0;i<120;i++)move(edge,1,0,1/60,houses);
  assert.ok(Math.hypot(edge.x,edge.z)<=32.2);
});
test('all six houses are reachable without crossing walls or the new gardens',()=>{
  const starts=[{x:0,z:5.8},...houses.map(h=>h.door),{x:26,z:-15}];
  for(const start of starts)for(const destination of houses){
    const route=findRoute(start,destination.door,houses,gardenObstacles);assert.ok(route.length,`route to ${destination.id}`);
    const p={...start};let i=0;
    for(let frame=0;frame<60*25&&i<route.length;frame++){
      const next=route[i],dx=next.x-p.x,dz=next.z-p.z,length=Math.hypot(dx,dz);
      if(length<.34){i++;continue;}
      move(p,dx/length,dz/length,1/60,houses,gardenObstacles);assert.ok(canWalk(p.x,p.z,houses,gardenObstacles));
    }
    assert.equal(i,route.length,`reached ${destination.id} from ${start.x},${start.z}`);
    assert.ok(Math.hypot(p.x-destination.door.x,p.z-destination.door.z)<.4);
  }
});

test('the character and automatic routes go around the pond',()=>{
  const pond=gardenObstacles[0],p={x:pond.x-6,z:pond.z};
  for(let i=0;i<120;i++)move(p,1,0,1/60,houses,gardenObstacles);
  assert.ok(p.x<pond.x-pond.radius+.01);
  const route=findRoute({x:pond.x-6,z:pond.z},{x:pond.x+6,z:pond.z},houses,gardenObstacles);
  assert.ok(route.some(point=>Math.abs(point.z-pond.z)>pond.radius));
});

test('faster movement cannot tunnel through a small obstacle after a long frame',()=>{
  const p={x:0,z:0};move(p,1,0,1,[],[{x:5,z:0,radius:.5}]);
  assert.ok(p.x<=4.5);
});
