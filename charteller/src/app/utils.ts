export function eqArray(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
}

export function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    let eq = [];
    as.forEach(a => eq.push(bs.has(a)));
    return eq.reduce((a,b) => a&&b);
}

let a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

export function beep(vol, freq, duration){
  let v=a.createOscillator()
  let u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

export function beep_error(){
  beep(5, 700, 150)
}

export function beep_detect(){
  beep(5, 350, 150)
}

let sayTimeout = null;
export function speak(message) {
  if (speechSynthesis.speaking) {
    // SpeechSyn is currently speaking, cancel the current utterance(s)
    speechSynthesis.cancel();
    // Make sure we don't create more than one timeout...
    if (sayTimeout !== null)
        clearTimeout(sayTimeout);
    let _this = this;
    sayTimeout = setTimeout(function () { speak(message); }, 150);
  }
  else {
    var msg = new SpeechSynthesisUtterance(message)
    msg.lang = 'ko-KR';
    msg.rate = 3;
    window.speechSynthesis.speak(msg)
  }
}
