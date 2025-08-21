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

  // Draw background
  if (paperSettings.backgroundColor) {
    ctx.fillStyle = paperSettings.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  let imgW, imgH, cols, rows, totalImages;

  if (layoutMode === 'auto') {
    // AUTO MODE: Create perfect grid based on imagesPerPage count
    // Calculate optimal grid dimensions
    cols = Math.ceil(Math.sqrt(imagesPerPage));
    rows = Math.ceil(imagesPerPage / cols);
    
    // Show only the specified number of images (or available images if less)
    totalImages = Math.min(images.length, imagesPerPage);
    
    // Calculate image size to perfectly fill the grid
    // Divide canvas into equal grid cells with small margins
    imgW = (canvasWidth / cols) * 0.9; // 90% of cell width for margins
    imgH = (canvasHeight / rows) * 0.9; // 90% of cell height for margins
    
    // Make images square in auto mode
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else if (layoutMode === 'grid') {
    // GRID MODE: Use user-specified rows and columns
    cols = paperSettings.columns || 4;
    rows = paperSettings.rows || 2;
    
    // Total images that can fit in this grid
    const gridCapacity = rows * cols;
    totalImages = Math.min(images.length, gridCapacity);
    
    // Calculate image size to perfectly fill the specified grid
    // Use margin setting if provided
    const marginFactor = paperSettings.margin ? (1 - paperSettings.margin / 2) : 0.9;
    imgW = (canvasWidth / cols) * marginFactor;
    imgH = (canvasHeight / rows) * marginFactor;
    
    // Keep images square in grid mode for consistency
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else {
    // MANUAL MODE: Use user's specified image size
    imgW = inchToPx(imageSize.width);
    imgH = inchToPx(imageSize.height);
    
    const maxCols = Math.floor(canvasWidth / imgW);
    const maxRows = Math.floor(canvasHeight / imgH);
    totalImages = Math.min(images.length, maxCols * maxRows);
    
    cols = maxCols;
    rows = Math.ceil(totalImages / cols);
  }

  // Calculate spacing to center the grid
  const hSpacing = (canvasWidth - cols * imgW) / (cols + 1);
  const vSpacing = (canvasHeight - rows * imgH) / (rows + 1);

  // Draw grid lines if enabled
  if (paperSettings.showGridLines) {
    ctx.strokeStyle = paperSettings.gridLineColor || '#cccccc';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = hSpacing / 2 + i * (imgW + hSpacing);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = vSpacing / 2 + i * (imgH + vSpacing);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }

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

export function drawLayoutToPDF(paper, images, imageSize, layoutMode = 'manual', imagesPerPage = 8, paperSettings = {}) {
  const pdf = new jsPDF({
    orientation: paper.orientation,
    unit: 'in',
    format: paper.size,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  let imgW, imgH, cols, rows, perPage;

  if (layoutMode === 'auto') {
    // AUTO MODE: Create perfect grid based on imagesPerPage count
    // Calculate optimal grid dimensions
    cols = Math.ceil(Math.sqrt(imagesPerPage));
    rows = Math.ceil(imagesPerPage / cols);
    
    // Each page will have exactly imagesPerPage slots
    perPage = imagesPerPage;
    
    // Calculate image size to perfectly fill the grid
    // Divide page into equal grid cells with small margins
    imgW = (pageWidth / cols) * 0.9; // 90% of cell width for margins
    imgH = (pageHeight / rows) * 0.9; // 90% of cell height for margins
    
    // Make images square in auto mode
    const minDimension = Math.min(imgW, imgH);
    imgW = imgH = minDimension;
  } else {
    // MANUAL MODE: Use user's specified image size
    imgW = imageSize.width;
    imgH = imageSize.height;
    
    const maxCols = Math.floor(pageWidth / imgW);
    const maxRows = Math.floor(pageHeight / imgH);
    perPage = maxCols * maxRows;
    
    cols = maxCols;
    rows = maxRows;
  }

  // Calculate spacing to center the grid
  const hSpacing = (pageWidth - cols * imgW) / (cols + 1);
  const vSpacing = (pageHeight - rows * imgH) / (rows + 1);

  // Draw grid lines on each page if enabled
  const drawGridLines = () => {
    if (paperSettings.showGridLines) {
      pdf.setDrawColor(paperSettings.gridLineColor || '#cccccc');
      pdf.setLineWidth(0.01);
      
      // Draw vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = hSpacing / 2 + i * (imgW + hSpacing);
        pdf.line(x, 0, x, pageHeight);
      }
      
      // Draw horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = vSpacing / 2 + i * (imgH + vSpacing);
        pdf.line(0, y, pageWidth, y);
      }
    }
  };

  // Draw grid lines on first page
  drawGridLines();

  images.forEach((src, index) => {
    const pageIndex = Math.floor(index / perPage);
    const indexInPage = index % perPage;

    const row = Math.floor(indexInPage / cols);
    const col = indexInPage % cols;

    const x = hSpacing + col * (imgW + hSpacing);
    const y = vSpacing + row * (imgH + vSpacing);

    // Add new page if needed (but not for the first image)
    if (indexInPage === 0 && index !== 0) {
      pdf.addPage();
      
      // Add background color to new page if specified
      if (paperSettings.backgroundColor && paperSettings.backgroundColor !== '#ffffff') {
        pdf.setFillColor(paperSettings.backgroundColor);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      }
      
      // Draw grid lines on new page
      drawGridLines();
    }

    pdf.addImage(src, 'JPEG', x, y, imgW, imgH);
  });

  pdf.save('photos.pdf');
}