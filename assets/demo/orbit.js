export const INITIAL_TILT = Math.atan2(65, 82);
export const MIN_TILT = Math.PI * 24 / 180;
export const MAX_TILT = Math.PI * 68 / 180;

// Keep a click distinct from an orbit, even when the pointer returns to its origin.
export function createOrbitGesture({ onOrbit, onClick, onDragging = () => {} }) {
  let pointer = null;
  return {
    begin(event) {
      if (pointer || event.button !== 0 || event.isPrimary === false) return false;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, dragging: false };
      return true;
    },
    update(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      if (!pointer.dragging && Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) >= 6) {
        pointer.dragging = true;
        onDragging(true);
      }
      if (pointer.dragging) onOrbit(dx, dy);
      pointer.x = event.clientX; pointer.y = event.clientY;
    },
    end(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const wasDragging = pointer.dragging;
      pointer = null;
      onDragging(false);
      if (!wasDragging) onClick(event);
    },
    cancel() {
      pointer = null;
      onDragging(false);
    }
  };
}

export function orbitFromDrag(yaw, tilt, dx, dy) {
  return { yaw: yaw - dx * .005, tilt: Math.max(MIN_TILT, Math.min(MAX_TILT, tilt + dy * .004)) };
}
