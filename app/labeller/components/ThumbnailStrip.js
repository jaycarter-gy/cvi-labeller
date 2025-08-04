"use client";
import React from 'react';
import { StickyNote } from 'lucide-react';

const ThumbnailStrip = ({ images, currentImageIndex, setCurrentImageIndex, resetImageView, labels }) => {
    return (
        <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Images</h3>
                <div className="space-y-2">
                    {images.map((image, index) => (
                        <div
                            key={image.src}
                            onClick={() => {
                                setCurrentImageIndex(index);
                                resetImageView();
                            }}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <img
                                src={image.src}
                                alt={image.name}
                                className="w-full h-24 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <div className="text-xs text-white font-medium truncate">
                                    {index + 1}. {image.name.split('/').pop()}
                                </div>
                            </div>
                            {labels[image.src] && (
                                <div className="absolute top-1 right-1">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full border border-white" />
                                </div>
                            )}
                            {labels[image.src]?.notes && (
                                <div className="absolute top-1 left-1">
                                    <StickyNote className="w-4 h-4 text-yellow-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailStrip;
