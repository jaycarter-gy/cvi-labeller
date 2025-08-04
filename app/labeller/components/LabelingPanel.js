"use client";
import React from 'react';
import PositionSelector from './PositionSelector';
import LocationSelector from './LocationSelector';
import ColorationSelector from './ColorationSelector';

// Import the reusable components

const NestedDetailsContainer = ({ 
    title = "Details", 
    children, 
    className = "",
    borderColor = "border-emerald-200",
    bgColor = "bg-emerald-50",
    textColor = "text-emerald-700"
}) => {
    return (
        <div className={`ml-6 pl-4 border-l-2 ${borderColor} ${bgColor} rounded-r-lg p-4 space-y-4 ${className}`}>
            <div className={`text-sm ${textColor} font-medium mb-3`}>
                ↳ {title}
            </div>
            {children}
        </div>
    );
};

const LabelingPanel = ({
    medicalQuestions,
    ulcerClassifications,
    nonCviUlcerTypes,
    patientHistoryOptions,
    currentLabels,
    updateLabel,
    labels,
    setLabels,
    images,
    currentImageIndex,
    clearAllLabels
}) => {
    const detailsMap = {
        'active_ulcer': {
            title: "Ulcer Details",
            fields: ['ulcer_position', 'ulcer_location'],
            component: (
                <>
                    <PositionSelector
                        value={currentLabels['ulcer_position']}
                        onChange={updateLabel}
                        fieldName="ulcer_position"
                        label="Position:"
                    />
                    <LocationSelector
                        value={currentLabels['ulcer_location']}
                        onChange={updateLabel}
                        fieldName="ulcer_location"
                    
                    />
                </>
            )
        },
        'pigmentation': {
            title: "Pigmentation Details",
            fields: ['patient_skin_color', 'pigmentation_color', 'pigmentation_location', 'pigmentation_position'],
            component: (
                <>
                    <ColorationSelector
                        values={currentLabels}
                        onChange={updateLabel}
                    />
                    <LocationSelector
                        value={currentLabels['pigmentation_location']}
                        onChange={updateLabel}
                        fieldName="pigmentation_location"
                    />
                    <PositionSelector
                        value={currentLabels['pigmentation_position']}
                        onChange={updateLabel}
                        fieldName="pigmentation_position"
                    />
                </>
            )
        },
        'eczema': {
            title: "Eczema Details",
            fields: ['eczema_location'],
            component: (
                <>
                    <LocationSelector
                        value={currentLabels['eczema_location']}
                        onChange={updateLabel}
                        fieldName="eczema_location"
                    
                    />
                </>
            )
        },
        'edema': {
            title: "Edema Details",
            fields: ['edema_location'],
            component: (
                <>
                    <LocationSelector
                        value={currentLabels['edema_location']}
                        onChange={updateLabel}
                        fieldName="edema_location"
                        label="Location:"
                    />
                </>
            )
        },
        'superficial_veins': {
            title: "Superficial Veins Details",
            fields: ['superficial_veins_location'],
            component: (
                <>
                    <LocationSelector
                        value={currentLabels['superficial_veins_location']}
                        onChange={updateLabel}
                        fieldName="superficial_veins_location"
                    />
                </>
            )
        }
    };

    return (
        <div className="w-1/3 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">Medical Assessment</h3>
                    <button
                        onClick={clearAllLabels}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                     Reset
                    </button>
                </div>
                <p className="text-base text-gray-600 mb-8 pt-1">
                    Press the number/letter key to toggle answers for each condition:
                </p>
                {/* Medical Conditions */}
                <div className="space-y-8">
                    {medicalQuestions.map((question, index) => (
                        <React.Fragment key={question.id}>
                            
                            <div className={`space-y-4 ${index < medicalQuestions.length - 1 ? 'border-b border-gray-200 pb-6' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <label className="text-base font-medium text-gray-700 flex items-center">
                                        {question.label}
                                        <span className="ml-3 text-base bg-gray-100 text-gray-600 px-3 py-1 rounded font-mono">
                                            {question.shortcut}
                                        </span>
                                    </label>
                                </div>
                                {(() => {
                                    if (question.id === 'cvi_classification') {
                                        return (
                                            <div className="grid grid-cols-2 gap-4">
                                                {ulcerClassifications.map((classification) => (
                                                    <label key={classification.value} className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="cvi_classification"
                                                            value={classification.value}
                                                            checked={currentLabels['cvi_classification']?.includes(classification.value) || false}
                                                            onChange={(e) => {
                                                                const currentSelection = currentLabels['cvi_classification'] || [];
                                                                const newSelection = e.target.checked
                                                                    ? [...currentSelection, classification.value]
                                                                    : currentSelection.filter(id => id !== classification.value);
                                                                updateLabel('cvi_classification', newSelection);
                                                            }}
                                                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-3 text-base text-gray-700">{classification.label}</span>
                                                        <span className="ml-auto text-base bg-gray-100 text-gray-600 px-3 py-1 rounded font-mono">
                                                            {classification.shortcut}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        );
                                    } else if (detailsMap[question.id]) {
                                        const details = detailsMap[question.id];
                                        return (
                                            <div className="space-y-4">
                                                <div className="flex space-x-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={question.id}
                                                            value="yes"
                                                            checked={currentLabels[question.id] === 'yes'}
                                                            onChange={(e) => updateLabel(question.id, e.target.value)}
                                                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-3 text-base text-gray-700">Yes</span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={question.id}
                                                            value="no"
                                                            checked={currentLabels[question.id] === 'no'}
                                                            onChange={(e) => updateLabel(question.id, e.target.value)}
                                                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-3 text-base text-gray-700">No</span>
                                                    </label>
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={question.id}
                                                            value="unclear"
                                                            checked={currentLabels[question.id] === 'unclear'}
                                                            onChange={(e) => updateLabel(question.id, e.target.value)}
                                                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-3 text-base text-gray-700">Unclear/Can't Tell</span>
                                                    </label>
                                                    <button
                                                        onClick={() => {
                                                            const newLabels = { ...labels };
                                                            const imageSrc = images[currentImageIndex]?.src;
                                                            if (imageSrc && newLabels[imageSrc]) {
                                                                delete newLabels[imageSrc][question.id];
                                                                details.fields.forEach(field => {
                                                                    delete newLabels[imageSrc][field];
                                                                });
                                                                if (Object.keys(newLabels[imageSrc]).length === 0) {
                                                                    delete newLabels[imageSrc];
                                                                }
                                                            }
                                                            setLabels(newLabels);
                                                        }}
                                                        className="text-base text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                                {currentLabels[question.id] === 'yes' && (
                                                    <NestedDetailsContainer title={details.title}>
                                                        {details.component}
                                                    </NestedDetailsContainer>
                                                )}
                                            </div>
                                        );
                                    } else if (question.id === 'patient_history') {
                                        return (
                                            <div className="grid grid-cols-1 gap-3">
                                                {patientHistoryOptions.map((option) => (
                                                    <label key={option.id} className="flex items-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="patient_history"
                                                            value={option.id}
                                                            checked={currentLabels['patient_history']?.includes(option.id) || false}
                                                            onChange={(e) => {
                                                                const currentSelection = currentLabels['patient_history'] || [];
                                                                const newSelection = e.target.checked
                                                                    ? [...currentSelection, option.id]
                                                                    : currentSelection.filter(id => id !== option.id);
                                                                updateLabel('patient_history', newSelection);
                                                            }}
                                                            className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        />
                                                        <span className="ml-3 text-base text-gray-700">{option.label}</span>
                                                        <span className="ml-auto text-base bg-gray-100 text-gray-600 px-3 py-1 rounded font-mono">
                                                            {option.shortcut}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="flex space-x-4">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value="yes"
                                                        checked={currentLabels[question.id] === 'yes'}
                                                        onChange={(e) => updateLabel(question.id, e.target.value)}
                                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                    />
                                                    <span className="ml-3 text-base text-gray-700">Yes</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value="no"
                                                        checked={currentLabels[question.id] === 'no'}
                                                        onChange={(e) => updateLabel(question.id, e.target.value)}
                                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                    />
                                                    <span className="ml-3 text-base text-gray-700">No</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value="unclear"
                                                        checked={currentLabels[question.id] === 'unclear'}
                                                        onChange={(e) => updateLabel(question.id, e.target.value)}
                                                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                    />
                                                    <span className="ml-3 text-base text-gray-700">Unclear/Can't Tell</span>
                                                </label>
                                                <button
                                                    onClick={() => {
                                                        const newLabels = { ...labels };
                                                        const imageSrc = images[currentImageIndex]?.src;
                                                        if (imageSrc && newLabels[imageSrc]) {
                                                            delete newLabels[imageSrc][question.id];
                                                            if (Object.keys(newLabels[imageSrc]).length === 0) {
                                                                delete newLabels[imageSrc];
                                                            }
                                                        }
                                                        setLabels(newLabels);
                                                    }}
                                                    className="text-base text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Assessment Summary</h4>
                    <div className="text-sm text-gray-600">
                        {Object.keys(currentLabels).length === 0 ? (
                            <p>No conditions assessed yet</p>
                        ) : (
                            <div className="space-y-1">
                                {medicalQuestions
                                    .filter(q => currentLabels[q.id])
                                    .map(q => (
                                        <div key={q.id} className="flex justify-between">
                                            <span>{q.label}:</span>
                                            <span className={`font-medium ${currentLabels[q.id] === 'yes' ? 'text-red-600' : 'text-green-600'}`}>
                                                {currentLabels[q.id] === 'yes' ? 'Present' : 'Absent'}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabelingPanel;
export { NestedDetailsContainer };