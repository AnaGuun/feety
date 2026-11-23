# A book for Giullia

A responsive birthday book cover for Giullia, from Enguun and Tianyu. Built with HTML, CSS, and JavaScript, with an original inline SVG illustration celebrating China, Mongolia, and Brazil.

## Run

From this directory:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Open the site on port 3000. No dependency installation or build is required. The book button opens an introductory page; the music button plays an optional synthesized birthday melody. Add future chapters to `index.html`. Google Fonts are optional; local serif and sans-serif fallbacks are provided.

The birthday book opens Enguun’s letter and Tianyu’s illustrated present. The PDF link in Enguun’s letter downloads the prebuilt `media/Giullia-birthday-book.pdf` directly, without browser-side PDF generation. It includes five pages: cover, book overview, Enguun’s letter, Tianyu’s present, and the original artwork. Update this PDF whenever book content changes. If a mobile browser opens the PDF, use Download or Share → Save to Files.
