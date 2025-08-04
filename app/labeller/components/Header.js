"use client";
import React from 'react';
import { Undo2, Redo2, Keyboard } from 'lucide-react';

const Header = ({
    undo,
    redo,
    historyIndex,
    history,
    currentImageIndex,
    images,
    jumpToImage,
    setJumpToImage,
    handleJumpToImage,
    setShowKeyboardHelp,
    progress
}) => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-900">Medical Image Assessment</h1>
                
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Image {currentImageIndex + 1} of {images.length}
                    </div>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="jump-input" className="text-sm text-gray-600">Go to:</label>
                        <input
                            id="jump-input"
                            type="number"
                            min="1"
                            max={images.length}
                            value={jumpToImage}
                            onChange={(e) => setJumpToImage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleJumpToImage(e);
                                }
                            }}
                            className="w-16 text-black px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder={`1-${images.length}`}
                        />
                    </div>
                    <button
                        onClick={() => setShowKeyboardHelp(true)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                        title="Keyboard shortcuts (?)"
                    >
                        <Keyboard className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
