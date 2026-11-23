# A book for Giullia

A responsive birthday book cover for Giullia, from Enguun and Tianyu. Built with HTML, CSS, and JavaScript, with an original inline SVG illustration celebrating China, Mongolia, and Brazil.

## Run

From this directory:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open the site on port 3000. No dependency installation or build is required. The book button opens an introductory page; the music button plays an optional synthesized birthday melody. Add future chapters to `index.html`. Google Fonts are optional; local serif and sans-serif fallbacks are provided.

The birthday book opens Enguun’s letter and Tianyu’s illustrated present. Enguun’s letter includes a PDF download containing the cover, book overview, letter, present, and the original uploaded artwork on five separate pages. A persistent download link remains available if the browser blocks the automatic download. On iPhone, use Share → Save to Files if the PDF opens in the browser. Export uses locally vendored html2canvas 1.4.1 and jsPDF 3.0.4; licenses are included in `vendor/`.
