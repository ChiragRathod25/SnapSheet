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

  const maxCols = Math.floor(canvasWidth / imgW);
  const maxRows = Math.floor(canvasHeight / imgH);
  const totalImages = Math.min(images.length, maxCols * maxRows);

  const cols = maxCols;
  const rows = Math.ceil(totalImages / cols);

  const hSpacing = (canvasWidth - cols * imgW) / (cols + 1);
  const vSpacing = (canvasHeight - rows * imgH) / (rows + 1);

  images.slice(0, totalImages).forEach((src, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = hSpacing + col * (imgW + hSpacing);
    const y = vSpacing + row * (imgH + vSpacing);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, x, y, imgW, imgH);
    };
  });
}

export function drawLayoutToPDF(paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let imgW, imgH;
  if (layoutMode === 'auto') {
    const totalArea = pageWidth * pageHeight;
    const estimatedSize = Math.sqrt(totalArea / imagesPerPage);
    imgW = estimatedSize;
    imgH = estimatedSize;
  } else {
    imgW = imageSize.width;
    imgH = imageSize.height;
  }

  const maxCols = Math.floor(pageWidth / imgW);
  const maxRows = Math.floor(pageHeight / imgH);
  const perPage = maxCols * maxRows;

  const hSpacing = (pageWidth - maxCols * imgW) / (maxCols + 1);
  const vSpacing = (pageHeight - maxRows * imgH) / (maxRows + 1);

  images.forEach((src, index) => {
    const pageIndex = Math.floor(index / perPage);
    const indexInPage = index % perPage;

    const row = Math.floor(indexInPage / maxCols);
    const col = indexInPage % maxCols;

    const x = hSpacing + col * (imgW + hSpacing);
    const y = vSpacing + row * (imgH + vSpacing);

    if (indexInPage === 0 && index !== 0) pdf.addPage();

    pdf.addImage(src, 'JPEG', x, y, imgW, imgH);
  });

  pdf.save('photos.pdf');
}
