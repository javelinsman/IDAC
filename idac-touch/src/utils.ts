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
  const p = document.getElementById('log');
  p.innerHTML = msg + '\n' + p.innerHTML;
}
