"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Save, ArrowLeft, StickyNote } from 'lucide-react';
import Header from './components/Header';
import ThumbnailStrip from './components/ThumbnailStrip';
import ImageViewer from './components/ImageViewer';
import LabelingPanel from './components/LabelingPanel';

const medicalQuestions = [
    { id: 'cvi_classification', label: 'Is CVI', shortcut: '1' },
    // { id: 'patient_history', label: 'Patient History', shortcut: '4' },
    { id: 'active_ulcer', label: 'Active Ulcer', shortcut: '2' },
    { id: 'atrophie_blanche', label: 'Atrophie Blanche', shortcut: '3' },
    { id: 'lipodermatosclerosis', label: 'Lipodermatosclerosis', shortcut: '5' },
    { id: 'pigmentation', label: 'Pigmentation', shortcut: '6' },
    { id: 'eczema', label: 'Eczema', shortcut: '7' },
    { id: 'edema', label: 'Edema', shortcut: '8' },
    { id: 'superficial_veins', label: 'Superficial Veins', shortcut: '9' },
    { id: 'corona_phlebectatica', label: 'Corona Phlebectatica', shortcut: '-' }
];

const ulcerClassifications = [
    { value: 'c1', label: 'C1', shortcut: 'A' },
    { value: 'c2', label: 'C2', shortcut: 'B' },
    { value: 'c3', label: 'C3', shortcut: 'C' },
    { value: 'c4', label: 'C4', shortcut: 'D' },
    { value: 'c5', label: 'C5', shortcut: 'E' },
    { value: 'c6', label: 'C6', shortcut: 'F' },
    { value: 'no', label: 'No', shortcut: 'G' },
    { value: 'yes-unspecified', label: 'Yes - Unspecified', shortcut: 'H' }
];

const nonCviUlcerTypes = [
    { id: 'diabetic', label: 'Diabetic', shortcut: 'I' },
    { id: 'bed_sores', label: 'Bed Sores', shortcut: 'X' },
    { id: 'arterial_ulcer', label: 'Arterial Ulcer', shortcut: 'R' },
    { id: 'unknown', label: 'Unknown', shortcut: 'O' }
];

const patientHistoryOptions = [
    { id: 'diabetic', label: 'Diabetic', shortcut: 'I' },
    { id: 'trauma', label: 'Trauma', shortcut: 'X' },
    { id: 'arterial_ulcer', label: 'Arterial Ulcer', shortcut: 'R' },
    { id: 'auto_immune', label: 'Auto Immune', shortcut: 'S' },

    { id: 'unknown', label: 'Unknown', shortcut: 'O' }
];







const ImageLabelingInterface = () => {
    const [images, setImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [jumpToImage, setJumpToImage] = useState('');
    const [rotation, setRotation] = useState(0);

    const [labels, setLabels] = useState({});
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    const imageRef = useRef(null);
    const notesInputRef = useRef(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoadingImages(true);
                const response = await fetch(`/api/images?dir=${encodeURIComponent("/Users/jaycarter/Documents/Envveno/for-labelling")}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch images.');
                }
                const imageFiles = await response.json();

                if (imageFiles.length === 0) {
                    setLoadError('No images found in the specified directory.');
                } else {
                    setImages(imageFiles);
                    console.log(`Successfully loaded ${imageFiles.length} images`);
                }
            } catch (error) {
                console.error('Error loading images:', error);
                setLoadError('Failed to load images: ' + error.message);
            } finally {
                setLoadingImages(false);
            }
        };

        loadImages();
    }, []);

    const currentLabels = images.length > 0 ? (labels[images[currentImageIndex]?.src] || {}) : {};

    const saveToHistory = useCallback(() => {
        const newState = { ...labels };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [labels, history, historyIndex]);

    const updateLabel = (category, value) => {
        if (images.length === 0) return;
        const imageSrc = images[currentImageIndex].src;
        const newLabelsForImage = {
            ...currentLabels,
            [category]: value
        };

        

        const newLabels = {
            ...labels,
            [imageSrc]: newLabelsForImage
        };
        setLabels(newLabels);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setLabels(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setLabels(history[historyIndex + 1]);
        }
    };

    const clearAllLabels = () => {
        if (images.length === 0) return;
        const imageSrc = images[currentImageIndex].src;
        const newLabels = { ...labels };
        delete newLabels[imageSrc];
        setLabels(newLabels);
    };

    const goToNext = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
            resetImageView();
        }
    };

    const goToPrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
            resetImageView();
        }
    };

    const resetImageView = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const saveAndContinue = () => {
        saveToHistory();
        localStorage.setItem('medicalLabels', JSON.stringify(labels));
        console.log('Saving labels:', labels);

        const dataToSave = {};
        for (const imageSrc in labels) {
            const image = images.find(img => img.src === imageSrc);
            if (image) {
                dataToSave[image.name] = {
                    ...labels[imageSrc],
                    image_path: image.name, // Use relative path
                    timestamp: new Date().toUTCString()
                };
            }
        }

        // Create a blob with the JSON data
        const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });

        // Create a link to download the blob
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'labels.json';

        // Append the link to the body and click it
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);

        if (currentImageIndex < images.length - 1) {
            goToNext();
        }
    };

    useEffect(() => {
        const savedLabels = localStorage.getItem('medicalLabels');
        if (savedLabels) {
            try {
                setLabels(JSON.parse(savedLabels));
            } catch (error) {
                console.error('Failed to load saved labels:', error);
            }
        }
    }, []);

    const zoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
    const zoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
    const resetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setRotation(0);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleJumpToImage = (e) => {
        if (e) e.preventDefault();
        const imageNum = parseInt(jumpToImage);
        if (imageNum >= 1 && imageNum <= images.length) {
            setCurrentImageIndex(imageNum - 1);
            resetImageView();
            setJumpToImage('');
        }
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (images.length === 0) return;
            if (e.target.tagName === 'INPUT' && e.target.id !== 'jump-input') return;
            if (e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    goToNext();
                    break;
                case 'ArrowLeft':
                case 'Backspace':
                    e.preventDefault();
                    goToPrevious();
                    break;
                case 's':
                case 'S':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        saveAndContinue();
                    }
                    break;
                case '+':
                case '=':
                    e.preventDefault();
                    zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    zoomOut();
                    break;
                case '0':
                    e.preventDefault();
                    resetZoom();
                    break;
                case 'z':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        if (e.shiftKey) {
                            redo();
                        } else {
                            undo();
                        }
                    }
                    break;
                case '?':
                    e.preventDefault();
                    setShowKeyboardHelp(!showKeyboardHelp);
                    break;
                case 'm':
                case 'M':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        setShowNotesModal(true);
                    }
                    break;
                case '1':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        const question = medicalQuestions.find(q => q.id === 'cvi_classification');
                        if (question) {
                            const currentValue = currentLabels[question.id];
                            const newValue = currentValue === 'yes' ? 'no' : currentValue === 'no' ? 'unclear' : currentValue === 'unclear' ? undefined : 'yes';
                            if (newValue === undefined) {
                                const newLabels = { ...labels };
                                const imageSrc = images[currentImageIndex]?.src;
                                if (imageSrc && newLabels[imageSrc]) {
                                    delete newLabels[imageSrc][question.id];
                                    if (Object.keys(newLabels[imageSrc]).length === 0) {
                                        delete newLabels[imageSrc];
                                    }
                                }
                                setLabels(newLabels);
                            } else {
                                updateLabel(question.id, newValue);
                            }
                        }
                    }
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        const questionIndex = parseInt(e.key) - 1;
                        if (medicalQuestions[questionIndex]) {
                            const question = medicalQuestions[questionIndex];

                            if (question.id === 'cvi_classification' || question.id === 'patient_history') break;

                            const currentValue = currentLabels[question.id];
                            const newValue = currentValue === 'yes' ? 'no' : currentValue === 'no' ? 'unclear' : currentValue === 'unclear' ? undefined : 'yes';
                            if (newValue === undefined) {
                                const newLabels = { ...labels };
                                const imageSrc = images[currentImageIndex]?.src;
                                if (imageSrc && newLabels[imageSrc]) {
                                    delete newLabels[imageSrc][question.id];
                                    if (Object.keys(newLabels[imageSrc]).length === 0) {
                                        delete newLabels[imageSrc];
                                    }
                                }
                                setLabels(newLabels);
                            } else {
                                updateLabel(question.id, newValue);
                            }
                        }
                    }
                    break;
                case 'a':
                case 'b':
                case 'c':
                case 'd':
                case 'e':
                case 'f':
                case 'g':
                case 'h':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        const key = e.key.toUpperCase();
                        const classification = ulcerClassifications.find(c => c.shortcut === key);
                        if (classification) {
                            const currentSelection = currentLabels['cvi_classification'] || [];
                            const newSelection = currentSelection.includes(classification.value)
                                ? currentSelection.filter(id => id !== classification.value)
                                : [...currentSelection, classification.value];
                            updateLabel('cvi_classification', newSelection);
                        }
                    }
                    break;
                case 'n':
                     if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        updateLabel('ulcer_classification', 'none');
                    }
                    break;
                case 'i':
                case 'x':
                case 'r':
                case 'o':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        const key = e.key.toUpperCase();
                        const ulcer = nonCviUlcerTypes.find(u => u.shortcut === key);
                        if (ulcer) {
                            const currentSelection = currentLabels['non_cvi_ulcer_type'] || [];
                            const newSelection = currentSelection.includes(ulcer.id)
                                ? currentSelection.filter(id => id !== ulcer.id)
                                : [...currentSelection, ulcer.id];
                            updateLabel('non_cvi_ulcer_type', newSelection);
                        }
                    }
                    break;
                // case 'd':
                // case 'b':
                // case 'a':
                // case 'u':
                //     if (!e.ctrlKey && !e.metaKey) {
                //         e.preventDefault();
                //         const key = e.key.toUpperCase();
                //         const historyOption = patientHistoryOptions.find(o => o.shortcut === key);
                //         if (historyOption) {
                //             const currentSelection = currentLabels['patient_history'] || [];
                //             const newSelection = currentSelection.includes(historyOption.id)
                //                 ? currentSelection.filter(id => id !== historyOption.id)
                //                 : [...currentSelection, historyOption.id];
                //             updateLabel('patient_history', newSelection);
                //         }
                //     }
                //     break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [currentImageIndex, isDragging, dragStart, position, showKeyboardHelp, currentLabels, labels, images]);

    useEffect(() => {
        if (showNotesModal && notesInputRef.current) {
            notesInputRef.current.focus();
        }
    }, [showNotesModal]);

    const progress = images.length > 0 ? ((currentImageIndex + 1) / images.length) * 100 : 0;

    if (!hasMounted) {
        return null;
    }

    if (loadingImages) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading images from ./images/ folder...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Cannot Load Images</h2>
                    <p className="text-gray-600 mb-4">{loadError}</p>
                    <p className="text-sm text-gray-500">
                        Make sure you have an "images" folder at the same level as this file with images named image-1.jpg, image-2.jpg, etc.
                    </p>
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Images Found</h2>
                    <p className="text-gray-600">
                        No images found in the ./images/ folder.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <Header
                undo={undo}
                redo={redo}
                historyIndex={historyIndex}
                history={history}
                currentImageIndex={currentImageIndex}
                images={images}
                jumpToImage={jumpToImage}
                setJumpToImage={setJumpToImage}
                handleJumpToImage={handleJumpToImage}
                setShowKeyboardHelp={setShowKeyboardHelp}
                progress={progress}
            />

            <div className="flex flex-1 overflow-hidden">
                <ThumbnailStrip
                    images={images}
                    currentImageIndex={currentImageIndex}
                    setCurrentImageIndex={setCurrentImageIndex}
                    resetImageView={resetImageView}
                    labels={labels}
                />

                <ImageViewer
                    images={images}
                    currentImageIndex={currentImageIndex}
                    zoom={zoom}
                    rotation={rotation}
                    setRotation={setRotation}
                    zoomIn={zoomIn}
                    zoomOut={zoomOut}
                    resetZoom={resetZoom}
                    position={position}
                    imageRef={imageRef}
                    handleMouseDown={handleMouseDown}
                    isDragging={isDragging}
                />

                <LabelingPanel
                    medicalQuestions={medicalQuestions}
                    ulcerClassifications={ulcerClassifications}
                    nonCviUlcerTypes={nonCviUlcerTypes}
                    patientHistoryOptions={patientHistoryOptions}
                    currentLabels={currentLabels}
                    updateLabel={updateLabel}
                    labels={labels}
                    setLabels={setLabels}
                    images={images}
                    currentImageIndex={currentImageIndex}
                    clearAllLabels={clearAllLabels}
                />
            </div>

            {/* Footer Controls */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={goToPrevious}
                        disabled={currentImageIndex === 0}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </button>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setShowNotesModal(true)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <StickyNote className="w-4 h-4 mr-2" />
                            Add Note
                        </button>
                        <button
                            onClick={saveAndContinue}
                            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Assessment & Continue
                        </button>
                    </div>
                </div>
            </div>

            {showNotesModal && (
                <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes for {images[currentImageIndex].name}</h3>
                        <textarea
                            ref={notesInputRef}
                            value={currentLabels.notes || ''}
                            onChange={(e) => updateLabel('notes', e.target.value)}
                            className="w-full h-40 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
                            placeholder="Enter notes here..."
                        />
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowNotesModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    saveToHistory();
                                    setShowNotesModal(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
                            >
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showKeyboardHelp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
                        <div className="space-y-2 text-sm">
                            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 mb-3">
                                <p className="text-emerald-800 text-xs font-medium">Medical Conditions (1-7):</p>
                                <p className="text-emerald-700 text-xs mt-1">Press number once for "Yes", again for "No", third time to clear</p>
                            </div>
                            <div className="bg-sky-50 border border-sky-200 rounded p-3 mb-3">
                                <p className="text-sky-800 text-xs font-medium">CVI Classification (A-F, N):</p>
                                <p className="text-sky-700 text-xs mt-1">Press letter to select classification</p>
                            </div>
                            <div className="bg-fuchsia-50 border border-fuchsia-200 rounded p-3 mb-3">
                                <p className="text-fuchsia-800 text-xs font-medium">Non-CVI Ulcer Type (I, X, R, O):</p>
                                <p className="text-fuchsia-700 text-xs mt-1">Press letter to select non-CVI ulcer type</p>
                            </div>
                            
                            // <div className="bg-indigo-50 border border-indigo-200 rounded p-3 mb-3">
                            //     <p className="text-indigo-800 text-xs font-medium">Patient History (D, B, A, U):</p>
                            //     <p className="text-indigo-700 text-xs mt-1">Press letter to select patient history type</p>
                            // </div>
                            <div className="flex justify-between">
                                <span>Next image:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">→ or Space</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Previous image:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">← or Backspace</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Save & Continue:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+S</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Add Note:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">M</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Zoom in:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">+</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Zoom out:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">-</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Reset zoom:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Undo:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+Z</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Redo:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl+Shift+Z</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Show shortcuts:</span>
                                <span className="font-mono bg-gray-100 px-2 py-1 rounded">?</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowKeyboardHelp(false)}
                            className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageLabelingInterface;
