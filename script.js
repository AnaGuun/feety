const dialog = document.querySelector('#book-dialog');
document.querySelector('#open-book').addEventListener('click', () => dialog.showModal());
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
const sound = document.querySelector('.sound');
const musicPanel = document.querySelector('#music-panel');
const audio = document.querySelector('#birthday-audio');
const musicStatus = document.querySelector('#music-status');
audio.volume = 0.45;
function syncMusicButton() {
  const playing = !audio.paused;
  sound.setAttribute('aria-pressed', String(playing));
  sound.setAttribute('aria-label', playing ? 'Pause Lambada' : 'Play Lambada');
}
audio.addEventListener('play', syncMusicButton);
audio.addEventListener('pause', syncMusicButton);
audio.addEventListener('error', () => { musicStatus.textContent = 'The song could not load. Please refresh and try again.'; });
sound.addEventListener('click', async () => {
  musicPanel.hidden = false;
  sound.setAttribute('aria-expanded', 'true');
  if (!audio.paused) { audio.pause(); return; }
  try {
    await audio.play();
    musicStatus.textContent = 'Play, pause, or adjust the volume here.';
  } catch (error) {
    musicStatus.textContent = 'Press play in the audio player to start Lambada.';
    syncMusicButton();
  }
});
function closeMusic() {
  audio.pause();
  musicPanel.hidden = true;
  sound.setAttribute('aria-expanded', 'false');
  sound.focus();
}
document.querySelector('#close-music').addEventListener('click', closeMusic);
musicPanel.addEventListener('keydown', event => { if (event.key === 'Escape') closeMusic(); });

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

