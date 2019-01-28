import * as d3 from 'd3';

export function eqArray(a: any[], b: any[]) {
    if (a === b) {
      return true;
    } else if (a === null || b === null) {
      return false;
    } else if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
}

export function eqSet(as: Set<any>, bs: Set<any>) {
    if (as.size !== bs.size) {
      return false;
    }
    const eq = [];
    as.forEach(a => eq.push(bs.has(a)));
    return eq.reduce((a, b) => a && b);
}

const audioContext = new AudioContext();
// browsers limit the number of concurrent audio contexts, so you better re-use'em

export function beep(vol, freq, duration) {
  const v = audioContext.createOscillator();
  const u = audioContext.createGain();
  v.connect(u);
  v.frequency.value = freq;
  v.type = 'square';
  u.connect(audioContext.destination);
  u.gain.value = vol * 0.01;
  v.start(audioContext.currentTime);
  v.stop(audioContext.currentTime + duration * 0.001);
}

export function beep_error() {
  beep(5, 700, 150);
}

export function beep_detect() {
  beep(5, 350, 150);
}

let sayTimeout = null;
export function speak(message, korean = false) {
  if (speechSynthesis.speaking) {
    // SpeechSyn is currently speaking, cancel the current utterance(s)
    speechSynthesis.cancel();
    // Make sure we don't create more than one timeout...
    if (sayTimeout !== null) {
        clearTimeout(sayTimeout);
    }
    const _this = this;
    sayTimeout = setTimeout(function () { speak(message); }, 250);
  } else {
    const msg = new SpeechSynthesisUtterance(message);
    if (korean) {
      msg.lang = 'ko-KR';
    } else {
      msg.lang = 'en-US';
    }
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
  }
}

export function isAscendingArray(arr: any[]) {
  for (let i = 1; i < arr.length ; i++) {
    if (arr[i - 1] > arr[i]) {
      return false;
    }
  }
  return true;
}

export function isDescendingArray(arr: any[]) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] < arr[i]) {
      return false;
    }
  }
  return true;
}

export function d3ImmediateChildren(selection: d3.Selection<any, any, any, any>, selector: string) {
  return selection.selectAll(selector).filter(function() {
    return (this as any).parentNode === selection.node();
  });
}

export function d3AsSelectionArray(selection: d3.Selection<any, any, any, any>) {
  return Array.from(selection.nodes()).map(d => d3.select(d));
}
