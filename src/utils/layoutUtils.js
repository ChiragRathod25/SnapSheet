import jsPDF from 'jspdf';

const DPI = 96;
const inchToPx = inch => inch * DPI;


function calculateGrid({ mode, canvasWidth, canvasHeight, imagesPerPage, imageSize, rows, cols }) {
  let imgW, imgH, hSpacing, vSpacing, maxCols, maxRows;

  if (mode === 'auto') {
    const totalArea = (canvasWidth / DPI) * (canvasHeight / DPI);
    const estimatedSize = Math.sqrt(totalArea / imagesPerPage);
    imgW = inchToPx(estimatedSize);
    imgH = inchToPx(estimatedSize);
    maxCols = Math.floor(canvasWidth / imgW);
    maxRows = Math.floor(canvasHeight / imgH);
  } else if (mode === 'grid') {
    maxCols = cols;
    maxRows = rows;
    imgW = (canvasWidth * 0.9) / cols; // reserve 10% for spacing
    imgH = (canvasHeight * 0.9) / rows;
  } else {
    imgW = inchToPx(imageSize.width);
    imgH = inchToPx(imageSize.height);
    maxCols = Math.floor(canvasWidth / imgW);
    maxRows = Math.floor(canvasHeight / imgH);
  }

  // ✅ Fix: Assign instead of re-declare
  hSpacing = (canvasWidth - maxCols * imgW) / (maxCols + 1);
  vSpacing = (canvasHeight - maxRows * imgH) / (maxRows + 1);

  return { imgW, imgH, hSpacing, vSpacing, maxCols, maxRows };
}



export function drawLayout(canvas, paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8, gridConfig = {}) {
  const widthInch = paper.orientation === 'portrait' ? 8.27 : 11.69;
  const heightInch = paper.orientation === 'portrait' ? 11.69 : 8.27;
  const canvasWidth = inchToPx(widthInch);
  const canvasHeight = inchToPx(heightInch);

  const ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const { imgW, imgH, hSpacing, vSpacing, maxCols, maxRows } = calculateGrid({
    mode: layoutMode,
    canvasWidth,
    canvasHeight,
    imagesPerPage,
    imageSize,
    rows: gridConfig.rows,
    cols: gridConfig.cols,
  });

  const totalImages = Math.min(images.length, maxCols * maxRows);

  images.slice(0, totalImages).forEach((src, index) => {
    const col = index % maxCols;
    const row = Math.floor(index / maxCols);
    const x = hSpacing + col * (imgW + hSpacing);
    const y = vSpacing + row * (imgH + vSpacing);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, x, y, imgW, imgH);
    };
  });
}

export function drawLayoutToPDF(paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8, gridConfig = {}) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = inchToPx(pageWidth);
  const canvasHeight = inchToPx(pageHeight);

  const { imgW, imgH, hSpacing, vSpacing, maxCols, maxRows } = calculateGrid({
    mode: layoutMode,
    canvasWidth,
    canvasHeight,
    imagesPerPage,
    imageSize,
    rows: gridConfig.rows,
    cols: gridConfig.cols,
  });

  const perPage = maxCols * maxRows;

  images.forEach((src, index) => {
    const pageIndex = Math.floor(index / perPage);
    const indexInPage = index % perPage;
    const row = Math.floor(indexInPage / maxCols);
    const col = indexInPage % maxCols;

    const x = hSpacing + col * (imgW + hSpacing) / DPI;
    const y = vSpacing + row * (imgH + vSpacing) / DPI;

    if (indexInPage === 0 && index !== 0) pdf.addPage();
    pdf.addImage(src, 'JPEG', x, y, imgW / DPI, imgH / DPI);
  });

  pdf.save('photos.pdf');
}
