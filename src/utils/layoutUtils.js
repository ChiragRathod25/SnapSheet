import jsPDF from 'jspdf';

const DPI = 96;
const inchToPx = inch => inch * DPI;

export function drawLayout(canvas, paper, images, imageSize) {
  const widthInch = paper.orientation === 'portrait' ? 8.27 : 11.69;
  const heightInch = paper.orientation === 'portrait' ? 11.69 : 8.27;

  const canvasWidth = inchToPx(widthInch);
  const canvasHeight = inchToPx(heightInch);

  const ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imgW = inchToPx(imageSize.width);
  const imgH = inchToPx(imageSize.height);
  const padding = inchToPx(0.1);

  let x = padding;
  let y = padding;

  for (let i = 0; i < images.length; i++) {
    const img = new Image();
    img.src = images[i];
    img.onload = () => {
      if (x + imgW > canvasWidth) {
        x = padding;
        y += imgH + padding;
      }
      if (y + imgH > canvasHeight) return;
      ctx.drawImage(img, x, y, imgW, imgH);
      x += imgW + padding;
    };
  }
}

export function drawLayoutToPDF(paper, images, imageSize) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const padding = 0.1;
  const imgW = imageSize.width;
  const imgH = imageSize.height;
  let x = padding;
  let y = padding;

  for (let i = 0; i < images.length; i++) {
    pdf.addImage(images[i], 'JPEG', x, y, imgW, imgH);
    x += imgW + padding;
    if (x + imgW > pdf.internal.pageSize.getWidth()) {
      x = padding;
      y += imgH + padding;
    }
    if (y + imgH > pdf.internal.pageSize.getHeight()) {
      pdf.addPage();
      x = padding;
      y = padding;
    }
  }
  pdf.save('photos.pdf');
}