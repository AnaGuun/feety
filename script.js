const dialog = document.querySelector('#book-dialog');
document.querySelector('#open-book').addEventListener('click', () => dialog.showModal());
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
let context, melody;
const sound = document.querySelector('.sound');
sound.addEventListener('click', async () => {
  if (melody) { clearInterval(melody); melody = null; await context.suspend(); sound.setAttribute('aria-pressed', 'false'); sound.setAttribute('aria-label', 'Turn on birthday melody'); return; }
  context ||= new (window.AudioContext || window.webkitAudioContext)();
  await context.resume();
  const notes = [261.63,261.63,293.66,261.63,349.23,329.63,261.63,261.63,293.66,261.63,392,349.23,261.63,261.63,523.25,440,349.23,329.63,293.66,466.16,466.16,440,349.23,392,349.23];
  let index = 0;
  const play = () => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = notes[index++ % notes.length]; gain.gain.setValueAtTime(0, context.currentTime); gain.gain.linearRampToValueAtTime(.055, context.currentTime + .03); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .5); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .55); };
  play(); melody = setInterval(play, 550); sound.setAttribute('aria-pressed', 'true'); sound.setAttribute('aria-label', 'Turn off birthday melody');
});
