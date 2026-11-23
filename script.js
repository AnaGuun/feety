const dialog = document.querySelector('#book-dialog');
document.querySelector('#open-book').addEventListener('click', () => dialog.showModal());
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
const sound = document.querySelector('.sound');
const musicPanel = document.querySelector('#music-panel');
const musicEmbed = document.querySelector('#music-embed');
function closeMusic() {
  musicPanel.hidden = true;
  musicEmbed.replaceChildren(); // Removing the player stops playback.
  sound.setAttribute('aria-expanded', 'false');
  sound.setAttribute('aria-label', 'Listen to Mas Que Nada');
}
sound.addEventListener('click', () => {
  if (!musicPanel.hidden) { closeMusic(); return; }
  const player = document.createElement('iframe');
  player.src = 'https://www.youtube-nocookie.com/embed/Tfa6fRjPlUE?autoplay=1&playsinline=1&rel=0';
  player.title = 'Mas Que Nada — Sérgio Mendes feat. The Black Eyed Peas';
  player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.allowFullscreen = true;
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  musicEmbed.replaceChildren(player);
  musicPanel.hidden = false;
  sound.setAttribute('aria-expanded', 'true');
  sound.setAttribute('aria-label', 'Close Mas Que Nada player');
});
document.querySelector('#close-music').addEventListener('click', () => { closeMusic(); sound.focus(); });
musicPanel.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMusic(); sound.focus(); }
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

