export function colorForTouch(touch) {
  const rr = touch.identifier % 16;
  const gg = Math.floor(touch.identifier / 3) % 16;
  const bb = Math.floor(touch.identifier / 7) % 16;
  const r = rr.toString(16); // make it a hex digit
  const g = gg.toString(16); // make it a hex digit
  const b = bb.toString(16); // make it a hex digit
  const color = '#' + r + g + b;
  console.log('color for touch with identifier ' + touch.identifier + ' = ' + color);
  return color;
}

export function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

export function ongoingTouchIndexById(ongoingTouches, idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

export function log(msg) {
  return;
  const p = document.getElementById('log');
  p.innerHTML = msg + '\n' + p.innerHTML;
}


const audioContext = new AudioContext();

export function beep(volume: number, frequency: number, duration: number) {
  const v = audioContext.createOscillator();
  const u = audioContext.createGain();
  v.connect(u);
  v.frequency.value = frequency;
  v.type = 'square';
  u.connect(audioContext.destination);
  u.gain.value = volume * 0.01;
  v.start(audioContext.currentTime);
  v.stop(audioContext.currentTime + duration * 0.001);
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
export function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
