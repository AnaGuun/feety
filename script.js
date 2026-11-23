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

const saveButton = document.querySelector('#save-pdf');
const saveStatus = document.querySelector('#save-status');
const downloadLink = document.querySelector('#pdf-download');
let pdfUrl;

async function captureBookPage(id) {
  const target = id ? document.getElementById(id) : document.body;
  return html2canvas(target, {
    backgroundColor: '#171a2a', scale: 1.5,
    windowWidth: 1440, windowHeight: 1000, scrollX: 0, scrollY: 0,
    logging: false,
    onclone: doc => {
      if (!id) {
        doc.querySelectorAll('dialog').forEach(item => item.remove());
      } else {
        const page = doc.getElementById(id);
        doc.querySelectorAll('dialog').forEach(item => { if (item !== page) item.remove(); });
        doc.body.replaceChildren(page);
        page.setAttribute('open', '');
        Object.assign(page.style, {
          position: 'relative', inset: 'auto', margin: '0',
          width: id === 'tianyu-dialog' ? '1000px' : '740px',
          maxWidth: 'none', maxHeight: 'none', height: 'auto',
          overflow: 'visible', boxSizing: 'border-box'
        });
        page.querySelectorAll('.close').forEach(item => item.remove());
        doc.body.style.minHeight = '0';
      }
    }
  });
}

saveButton.addEventListener('click', async () => {
  saveButton.disabled = true;
  downloadLink.hidden = true;
  saveStatus.textContent = 'Preparing all pages…';
  try {
    await document.fonts.ready;
    const image = document.querySelector('.present-art img');
    await image.decode();
    const { jsPDF } = window.jspdf;
    let pdf;
    function addPage(source, width, height) {
      const orientation = width > height ? 'landscape' : 'portrait';
      if (!pdf) pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4', compress: true });
      else pdf.addPage('a4', orientation);
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      pdf.setFillColor(23, 26, 42);
      pdf.rect(0, 0, pw, ph, 'F');
      const ratio = Math.min((pw - 12) / width, (ph - 12) / height);
      pdf.addImage(source, 'JPEG', (pw - width * ratio) / 2, (ph - height * ratio) / 2, width * ratio, height * ratio);
    }
    const pages = [null, 'book-dialog', 'enguun-dialog', 'tianyu-dialog'];
    for (let index = 0; index < pages.length; index++) {
      saveStatus.textContent = `Creating PDF page ${index + 1} of 5…`;
      const canvas = await captureBookPage(pages[index]);
      addPage(canvas.toDataURL('image/jpeg', .95), canvas.width, canvas.height);
      canvas.width = canvas.height = 0;
    }
    // Include the uploaded artwork at its original resolution as a separate page.
    const artwork = document.createElement('canvas');
    artwork.width = image.naturalWidth;
    artwork.height = image.naturalHeight;
    artwork.getContext('2d').drawImage(image, 0, 0);
    addPage(artwork.toDataURL('image/jpeg', .98), artwork.width, artwork.height);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    pdfUrl = URL.createObjectURL(pdf.output('blob'));
    downloadLink.href = pdfUrl;
    downloadLink.hidden = false;
    saveStatus.textContent = 'Your 5-page PDF is ready. If the download does not start, tap the link above. On iPhone, choose Share → Save to Files if it opens in the browser.';
    downloadLink.click();
  } catch (error) {
    saveStatus.textContent = 'The PDF could not be created. Please try again.';
    console.error('PDF export failed:', error);
  } finally {
    saveButton.disabled = false;
  }
});
