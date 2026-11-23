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

const saveButton = document.querySelector('#save-png');
const saveStatus = document.querySelector('#save-status');
saveButton.addEventListener('click', async () => {
  saveButton.disabled = true;
  saveStatus.textContent = 'Creating your PNG…';
  let url;
  try {
    await document.fonts.ready;
    const width = document.documentElement.clientWidth;
    const height = Math.max(document.body.scrollHeight, document.documentElement.clientHeight);
    const canvas = await html2canvas(document.body, {
      backgroundColor: '#171a2a',
      scale: Math.min(2, Math.sqrt(12000000 / (width * height))),
      width, height, windowWidth: width, scrollX: 0, scrollY: 0,
      logging: false,
      onclone: clonedDocument => { clonedDocument.querySelectorAll('dialog').forEach(item => item.remove()); }
    });
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('PNG could not be created.')), 'image/png'));
    url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Giullia-birthday-book.png';
    document.body.append(link);
    link.click();
    link.remove();
    saveStatus.textContent = 'Your PNG is ready. Check your downloads.';
  } catch (error) {
    saveStatus.textContent = 'The PNG could not be saved. Please try again.';
    console.error('PNG export failed:', error);
  } finally {
    if (url) setTimeout(() => URL.revokeObjectURL(url), 60000);
    saveButton.disabled = false;
  }
});
