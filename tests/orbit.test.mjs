import test from 'node:test';
import assert from 'node:assert/strict';
import {createOrbitGesture, orbitFromDrag, INITIAL_TILT, MIN_TILT, MAX_TILT} from '../assets/demo/orbit.js';
const event = (x, y, extra = {}) => ({pointerId:1,button:0,isPrimary:true,clientX:x,clientY:y,...extra});

test('a click and small hand tremor still visit a house', () => {
  let clicks=0,rotations=0;
  const gesture=createOrbitGesture({onClick:()=>clicks++,onOrbit:()=>rotations++});
  gesture.begin(event(50,50));gesture.update(event(52,53));gesture.end(event(52,53));
  assert.equal(clicks,1);assert.equal(rotations,0);
});
test('dragging rotates without triggering a visit, including a return to the starting point', () => {
  let clicks=0,rotations=0,dragging=false;
  const gesture=createOrbitGesture({onClick:()=>clicks++,onOrbit:()=>rotations++,onDragging:value=>dragging=value});
  gesture.begin(event(50,50));gesture.update(event(90,80));assert.equal(dragging,true);
  gesture.update(event(50,50));gesture.end(event(50,50));
  assert.equal(clicks,0);assert.equal(rotations,2);assert.equal(dragging,false);
});
test('cancelled gestures, secondary pointers and right clicks cannot trigger navigation', () => {
  let clicks=0;
  const gesture=createOrbitGesture({onClick:()=>clicks++,onOrbit:()=>{}});
  assert.equal(gesture.begin(event(0,0,{button:2})),false);
  assert.equal(gesture.begin(event(0,0,{isPrimary:false})),false);
  gesture.begin(event(0,0));gesture.end(event(0,0,{pointerId:2}));gesture.cancel();gesture.end(event(0,0));
  assert.equal(clicks,0);
});
test('camera tilt stays above the ground and yaw can rotate a full circle', () => {
  assert.equal(orbitFromDrag(0,INITIAL_TILT,0,-10000).tilt,MIN_TILT);
  assert.equal(orbitFromDrag(0,INITIAL_TILT,0,10000).tilt,MAX_TILT);
  assert.ok(orbitFromDrag(0,INITIAL_TILT,2000,0).yaw < -Math.PI*2);
});
