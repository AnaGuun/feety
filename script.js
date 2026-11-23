const dialog = document.querySelector('#book-dialog');
document.querySelector('#open-book').addEventListener('click', () => dialog.showModal());
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
const sound = document.querySelector('.sound');
const audio = document.querySelector('#birthday-audio');
const musicStatus = document.querySelector('#music-status');
audio.volume = 0.45;
function syncMusicButton() {
  const playing = !audio.paused;
  sound.setAttribute('aria-pressed', String(playing));
  sound.setAttribute('aria-label', playing ? 'Pause Lambada' : 'Play Lambada');
  sound.title = playing ? 'Pause Lambada' : 'Play Lambada';
}
audio.addEventListener('play', syncMusicButton);
audio.addEventListener('pause', syncMusicButton);
audio.addEventListener('error', () => {
  musicStatus.textContent = 'The song could not load. Please refresh and try again.';
  sound.title = 'The song could not load. Click to retry.';
});
sound.addEventListener('click', async () => {
  if (!audio.paused) { audio.pause(); return; }
  try {
    await audio.play();
    musicStatus.textContent = '';
  } catch (error) {
    musicStatus.textContent = 'Music could not start. Please tap the music icon again.';
    syncMusicButton();
  }
});

document.querySelectorAll('[data-letter]').forEach(button => {
  button.addEventListener('click', () => { dialog.close(); document.getElementById(button.dataset.letter).showModal(); });
});
document.querySelectorAll('.letter-dialog').forEach(letter => {
  letter.addEventListener('close', () => { dialog.showModal(); document.querySelector('[data-letter="' + letter.id + '"]').focus(); });
  letter.querySelector('.letter-close').addEventListener('click', () => letter.close());
  letter.addEventListener('click', event => {
    const box = letter.getBoundingClientRect();
    if (event.target === letter && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) letter.close();
  });
});


const envelope = document.querySelector('#open-envelope');
const surprise = document.querySelector('.envelope-surprise');
const envelopePicture = document.querySelector('#envelope-picture');
const envelopeStatus = document.querySelector('#envelope-status');
envelope.addEventListener('click', async () => {
  if (envelope.disabled) return;
  envelope.disabled = true;
  envelopeStatus.textContent = 'Opening your surprise…';
  try {
    await envelopePicture.querySelector('img').decode();
    envelopePicture.hidden = false;
    envelope.setAttribute('aria-expanded', 'true');
    surprise.classList.add('is-open');
    envelopeStatus.textContent = 'Envelope opened. Your assignment meme is ready.';
    envelopePicture.focus({ preventScroll: true });
  } catch (error) {
    envelope.disabled = false;
    envelopeStatus.textContent = 'The picture could not load. Please try opening the envelope again.';
  }
});
document.querySelector('.reseal-envelope').addEventListener('click', () => {
  surprise.classList.remove('is-open');
  envelopePicture.hidden = true;
  envelope.disabled = false;
  envelope.setAttribute('aria-expanded', 'false');
  envelopeStatus.textContent = '';
  envelope.focus({ preventScroll: true });
});
