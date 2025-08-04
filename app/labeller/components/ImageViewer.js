"use client";
import React from 'react';
import { ZoomIn, ZoomOut, Home, RotateCw, RotateCcw } from 'lucide-react';

const ImageViewer = ({
    images,
    currentImageIndex,
    zoom,
    rotation,
    setRotation,
    zoomIn,
    zoomOut,
    resetZoom,
    position,
    imageRef,
    handleMouseDown,
    isDragging
}) => {
    const rotateRight = () => setRotation(prev => (prev + 90) % 360);
    const rotateLeft = () => setRotation(prev => (prev - 90 + 360) % 360);

    return (
        <div className="flex-1 flex flex-col bg-gray-100">
            <div className="bg-white border-b border-gray-200 px-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={zoomOut}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Zoom out (-)"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 min-w-16 text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={zoomIn}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Zoom in (+)"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                            onClick={rotateLeft}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Rotate Left"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={rotateRight}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Rotate Right"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={resetZoom}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Reset zoom (0)"
                        >
                            <Home className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-600">
                        {images[currentImageIndex]?.name}
                    </div>
                </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 overflow-hidden relative cursor-move">
                <div
                    ref={imageRef}
                    className="absolute inset-0 flex items-center justify-center"
                    onMouseDown={handleMouseDown}
                >
                    <img
                        src={images[currentImageIndex]?.src}
                        alt={images[currentImageIndex]?.name}
                        className="max-w-none select-none"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                        }}
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;