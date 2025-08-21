import React, { useState } from 'react';
import { X, Upload, Trash2, Move, Eye, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageUploader({images, setImages}) {

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [viewModal, setViewModal] = useState({ isOpen: false, currentIndex: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleUpload = e => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...urls]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Adjust indices for remaining images
      const adjustedSet = new Set();
      newSet.forEach(i => {
        if (i > index) adjustedSet.add(i - 1);
        else if (i < index) adjustedSet.add(i);
      });
      return adjustedSet;
    });
  };

  const clearAllImages = () => {
    setImages([]);
    setSelectedImages(new Set());
  };

  const openViewModal = (index) => {
    setViewModal({ isOpen: true, currentIndex: index });
    setZoomLevel(1);
  };

  const closeViewModal = () => {
    setViewModal({ isOpen: false, currentIndex: 0 });
    setZoomLevel(1);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (viewModal.currentIndex + 1) % images.length
      : (viewModal.currentIndex - 1 + images.length) % images.length;
    setViewModal(prev => ({ ...prev, currentIndex: newIndex }));
    setZoomLevel(1);
  };

  const handleZoom = (type) => {
    if (type === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else if (type === 'out' && zoomLevel > 0.5) {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    } else if (type === 'reset') {
      setZoomLevel(1);
    }
  };

  const toggleSelectImage = (index) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const removeSelectedImages = () => {
    setImages(prev => prev.filter((_, i) => !selectedImages.has(i)));
    setSelectedImages(new Set());
  };

  const selectAllImages = () => {
    setSelectedImages(new Set(images.map((_, i) => i)));
  };

  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  // Drag and Drop functionality
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Keyboard navigation for modal
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (!viewModal.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          closeViewModal();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case '+':
        case '=':
          handleZoom('in');
          break;
        case '-':
          handleZoom('out');
          break;
        case '0':
          handleZoom('reset');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewModal.isOpen, viewModal.currentIndex, zoomLevel]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upload Images</h2>
            <div className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''} uploaded
            </div>
          </div>

          {/* Upload Area */}
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </div>
              <input 
                type="file" 
                multiple 
                onChange={handleUpload} 
                accept="image/*" 
                className="hidden"
              />
            </label>
          </div>

          {/* Bulk Actions */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded">
              <button
                onClick={selectAllImages}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={deselectAllImages}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Deselect All
              </button>
              {selectedImages.size > 0 && (
                <button
                  onClick={removeSelectedImages}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove Selected ({selectedImages.size})
                </button>
              )}
              <button
                onClick={clearAllImages}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.map((img, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  className={`relative group border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-move
                    ${selectedImages.has(i) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${dragOverIndex === i ? 'border-green-500 bg-green-50' : ''}
                    ${draggedIndex === i ? 'opacity-50' : ''}
                    hover:border-gray-400 hover:shadow-md
                  `}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-1 left-1 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.has(i)}
                      onChange={() => toggleSelectImage(i)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  {/* Image Number */}
                  <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    {i + 1}
                  </div>

                  {/* Image */}
                  <img 
                    src={img} 
                    alt={`preview ${i + 1}`} 
                    className="w-full h-24 object-cover"
                  />

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openViewModal(i)}
                        className="p-1 bg-blue-500 bg-opacity-80 rounded hover:bg-opacity-100 transition-colors"
                        title="View Full Size"
                      >
                        <Eye className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => removeImage(i)}
                        className="p-1 bg-red-500 bg-opacity-80 rounded hover:bg-opacity-100 transition-colors"
                        title="Remove"
                      >
                      <X className="w-3 h-3 text-black" />
                      </button>
                    </div>
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="w-3 h-3 text-white drop-shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload some images to get started</p>
            </div>
          )}

          {/* Tips */} 
          {images.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tips:</strong> 
                • Drag images to reorder them 
                • Use checkboxes for bulk selection 
                • Click the eye icon to view full size
                • Use arrow keys to navigate in view mode
                • Images will appear in the layout in this order
              </p>
            </div>
          )}
        </div>

        {/* Image View Modal */}
        {viewModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeViewModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <X className="w-6 h-6 text-black" />
              </button>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-black" />
                  </button>
                </>
              )}

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <button
                  onClick={() => handleZoom('out')}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors disabled:opacity-50"
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={() => handleZoom('reset')}
                  className="px-3 py-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors text-black text-sm font-medium"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  onClick={() => handleZoom('in')}
                  className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors disabled:opacity-50"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-sm">
                {viewModal.currentIndex + 1} of {images.length}
              </div>

              {/* Main Image */}
              <div className="max-w-full max-h-full overflow-auto">
                <img
                  src={images[viewModal.currentIndex]}
                  alt={`Full size preview ${viewModal.currentIndex + 1}`}
                  className="max-w-none transition-transform duration-200"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    cursor: zoomLevel > 1 ? 'grab' : 'default'
                  }}
                  draggable={false}
                />
              </div>

              {/* Keyboard Shortcuts Info */}
              <div className="absolute bottom-4 right-4 z-10 text-white text-xs bg-black bg-opacity-20 rounded p-2 ">
                <div>ESC: Close</div>
                <div>←/→: Navigate</div>
                <div>+/-: Zoom</div>
                <div>0: Reset zoom</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}