import jsPDF from 'jspdf';

const DPI = 96;
const inchToPx = inch => inch * DPI;

export function drawLayout(canvas, paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8, paperSettings = {}) {
  const widthInch = paper.orientation === 'portrait' ? 8.27 : 11.69;
  const heightInch = paper.orientation === 'portrait' ? 11.69 : 8.27;
  const canvasWidth = inchToPx(widthInch);
  const canvasHeight = inchToPx(heightInch);

  const ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Apply page margins/padding from PaperSettings
  const padding = paperSettings.padding || { top: 0, bottom: 0, left: 0, right: 0 };
  const availableWidth = canvasWidth - inchToPx(padding.left + padding.right);
  const availableHeight = canvasHeight - inchToPx(padding.top + padding.bottom);
  const offsetX = inchToPx(padding.left);
  const offsetY = inchToPx(padding.top);

  // Image spacing between images (not margins from edges)
  const imageSpacing = inchToPx(paperSettings.imageSpacing || 0);

  let imgW, imgH, cols, rows, totalImages;

  if (layoutMode === 'auto') {
    // AUTO MODE: Create perfect grid based on imagesPerPage count
    cols = Math.ceil(Math.sqrt(imagesPerPage));
    rows = Math.ceil(imagesPerPage / cols);
    
    totalImages = Math.min(images.length, imagesPerPage);
    
    // Calculate image size accounting for spacing between images
    imgW = (availableWidth - (cols - 1) * imageSpacing) / cols;
    imgH = (availableHeight - (rows - 1) * imageSpacing) / rows;
    
    // Make images square in auto mode
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else if (layoutMode === 'grid') {
    // GRID MODE: Use user-specified rows and columns
    cols = paperSettings.columns || 4;
    rows = paperSettings.rows || 2;
    
    totalImages = Math.min(images.length, rows * cols);
    
    // Calculate image size accounting for spacing between images
    imgW = (availableWidth - (cols - 1) * imageSpacing) / cols;
    imgH = (availableHeight - (rows - 1) * imageSpacing) / rows;
    
    // Keep images square in grid mode for consistency
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else {
    // MANUAL MODE: Use user's specified image size
    imgW = inchToPx(imageSize.width);
    imgH = inchToPx(imageSize.height);
    
    const maxCols = Math.floor((availableWidth + imageSpacing) / (imgW + imageSpacing));
    const maxRows = Math.floor((availableHeight + imageSpacing) / (imgH + imageSpacing));
    totalImages = Math.min(images.length, maxCols * maxRows);
    
    cols = maxCols;
    rows = Math.ceil(totalImages / cols);
  }

  images.slice(0, totalImages).forEach((src, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = offsetX + col * (imgW + imageSpacing);
    const y = offsetY + row * (imgH + imageSpacing);

    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, x, y, imgW, imgH);
    };
  });
}

export function drawLayoutToPDF(paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8, paperSettings = {}) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Apply page margins/padding from PaperSettings
  const padding = paperSettings.padding || { top: 0, bottom: 0, left: 0, right: 0 };
  const availableWidth = pageWidth - (padding.left + padding.right);
  const availableHeight = pageHeight - (padding.top + padding.bottom);
  const offsetX = padding.left;
  const offsetY = padding.top;

  // Image spacing between images (not margins from edges)
  const imageSpacing = paperSettings.imageSpacing || 0;

  let imgW, imgH, cols, rows, perPage;

  if (layoutMode === 'auto') {
    // AUTO MODE: Create perfect grid based on imagesPerPage count
    cols = Math.ceil(Math.sqrt(imagesPerPage));
    rows = Math.ceil(imagesPerPage / cols);
    
    perPage = imagesPerPage;
    
    // Calculate image size accounting for spacing between images
    imgW = (availableWidth - (cols - 1) * imageSpacing) / cols;
    imgH = (availableHeight - (rows - 1) * imageSpacing) / rows;
    
    // Make images square in auto mode
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else if (layoutMode === 'grid') {
    // GRID MODE: Use user-specified rows and columns
    cols = paperSettings.columns || 4;
    rows = paperSettings.rows || 2;
    
    perPage = rows * cols;
    
    // Calculate image size accounting for spacing between images
    imgW = (availableWidth - (cols - 1) * imageSpacing) / cols;
    imgH = (availableHeight - (rows - 1) * imageSpacing) / rows;
    
    // Keep images square in grid mode for consistency
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else {
    // MANUAL MODE: Use user's specified image size
    imgW = imageSize.width;
    imgH = imageSize.height;
    
    const maxCols = Math.floor((availableWidth + imageSpacing) / (imgW + imageSpacing));
    const maxRows = Math.floor((availableHeight + imageSpacing) / (imgH + imageSpacing));
    perPage = maxCols * maxRows;
    
    cols = maxCols;
    rows = maxRows;
  }

  images.forEach((src, index) => {
    const pageIndex = Math.floor(index / perPage);
    const indexInPage = index % perPage;

    const row = Math.floor(indexInPage / cols);
    const col = indexInPage % cols;

    const x = offsetX + col * (imgW + imageSpacing);
    const y = offsetY + row * (imgH + imageSpacing);

    // Add new page if needed (but not for the first image)
    if (indexInPage === 0 && index !== 0) {
      pdf.addPage();
    }

    pdf.addImage(src, 'JPEG', x, y, imgW, imgH);
  });

  pdf.save('photos.pdf');
}