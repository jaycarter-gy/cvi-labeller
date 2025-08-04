"use client";
import React from 'react';

const RadioGroup = ({ title, fieldName, options, value, onChange }) => (
    <div>
        <h5 className="text-sm font-bold text-gray-700 mb-2">{title}</h5>
        <div className="space-y-2">
            {options.map(option => (
                <label key={option.value} className="flex items-center p-2 rounded border border-gray-200 hover:bg-white cursor-pointer">
                    <input
                        type="radio"
                        name={fieldName}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(fieldName, e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    </div>
);


const ColorationSelector = ({
    values,
    onChange,
    className = ""
}) => {
    const patientSkinColorOptions = [
        { value: 'light', label: 'Light' },
        { value: 'brown', label: 'Brown' },
        { value: 'dark', label: 'Dark' },
    ];

    const pigmentationColorOptions = [
        { value: 'pink', label: 'Pink' },
        { value: 'red', label: 'Red' },
        { value: 'brown', label: 'Brown' },
        { value: 'black', label: 'Black' },
    ];

    return (
        <div className={`${className} space-y-4`}>
            <RadioGroup
                title="Patient Skin Color"
                fieldName="patient_skin_color"
                options={patientSkinColorOptions}
                value={values?.patient_skin_color}
                onChange={onChange}
            />
            <RadioGroup
                title="Pigmentation Color"
                fieldName="pigmentation_color"
                options={pigmentationColorOptions}
                value={values?.pigmentation_color}
                onChange={onChange}
            />
        </div>
    );
};

export default ColorationSelector;
