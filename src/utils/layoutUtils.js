import jsPDF from 'jspdf';

const DPI = 96;
const inchToPx = inch => inch * DPI;
export function drawLayout(canvas, paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8) {
  const widthInch = paper.orientation === 'portrait' ? 8.27 : 11.69;
  const heightInch = paper.orientation === 'portrait' ? 11.69 : 8.27;
  const canvasWidth = inchToPx(widthInch);
  const canvasHeight = inchToPx(heightInch);

  const ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let imgW, imgH;
  if (layoutMode === 'auto') {
    const totalArea = widthInch * heightInch;
    const estimatedSize = Math.sqrt(totalArea / imagesPerPage);
    imgW = inchToPx(estimatedSize);
    imgH = inchToPx(estimatedSize);
  } else {
    imgW = inchToPx(imageSize.width);
    imgH = inchToPx(imageSize.height);
  }

  const hSpacing = inchToPx(paper.hSpacing || 0.1);
  const vSpacing = inchToPx(paper.vSpacing || 0.1);

  const imagesPerRow = Math.floor((canvasWidth + hSpacing) / (imgW + hSpacing));
  const numRows = Math.ceil(images.length / imagesPerRow);

  const totalContentWidth = imagesPerRow * imgW + (imagesPerRow - 1) * hSpacing;
  const totalContentHeight = numRows * imgH + (numRows - 1) * vSpacing;

  const offsetX = (canvasWidth - totalContentWidth) / 2;
  const offsetY = (canvasHeight - totalContentHeight) / 2;

  images.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const row = Math.floor(index / imagesPerRow);
      const col = index % imagesPerRow;
      const x = offsetX + col * (imgW + hSpacing);
      const y = offsetY + row * (imgH + vSpacing);
      if (x + imgW <= canvasWidth && y + imgH <= canvasHeight) {
        ctx.drawImage(img, x, y, imgW, imgH);
      }
    };
  });
}




export function drawLayoutToPDF(paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  let imgW, imgH;
  if (layoutMode === 'auto') {
    const totalArea = width * height;
    const estimatedSize = Math.sqrt(totalArea / imagesPerPage);
    imgW = estimatedSize;
    imgH = estimatedSize;
  } else {
    imgW = imageSize.width;
    imgH = imageSize.height;
  }

  const hSpacing = paper.hSpacing || 0.1;
  const vSpacing = paper.vSpacing || 0.1;

  const imagesPerRow = Math.floor((width + hSpacing) / (imgW + hSpacing));
  const imagesPerCol = Math.floor((height + vSpacing) / (imgH + vSpacing));
  const imagesPerPageCalc = imagesPerRow * imagesPerCol;

  const totalContentWidth = imagesPerRow * imgW + (imagesPerRow - 1) * hSpacing;
  const totalContentHeight = imagesPerCol * imgH + (imagesPerCol - 1) * vSpacing;

  const offsetX = (width - totalContentWidth) / 2;
  const offsetY = (height - totalContentHeight) / 2;

  images.forEach((src, index) => {
    const pageIndex = Math.floor(index / imagesPerPageCalc);
    const positionInPage = index % imagesPerPageCalc;
    const row = Math.floor(positionInPage / imagesPerRow);
    const col = positionInPage % imagesPerRow;

    const x = offsetX + col * (imgW + hSpacing);
    const y = offsetY + row * (imgH + vSpacing);

    if (positionInPage === 0 && index !== 0) pdf.addPage();
    pdf.addImage(src, 'JPEG', x, y, imgW, imgH);
  });

  pdf.save('photos.pdf');
}
