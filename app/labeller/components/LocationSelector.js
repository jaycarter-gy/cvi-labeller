"use client";
import React from 'react';

const LocationSelector = ({ 
    value = [], 
    onChange, 
    fieldName = "location",
    label = "Location (relative to the malleolus):",
    options = [
        { value: 'above', label: 'Above' },
        { value: 'below', label: 'Below' }
    ],
    className = ""
}) => {
    const handleOnChange = (e) => {
        const { value: selectedValue, checked } = e.target;
        const currentValues = Array.isArray(value) ? value : [];
        let newValues;

        if (checked) {
            newValues = [...currentValues, selectedValue];
        } else {
            newValues = currentValues.filter(v => v !== selectedValue);
        }
        onChange(fieldName, newValues);
    };

    return (
        <div className={className}>
            <h5 className="text-sm font-bold text-gray-700 mb-2">{label}</h5>
            <div className="flex space-x-3">
                {options.map(location => (
                    <label key={location.value} className="flex items-center p-2 rounded border border-gray-200 hover:bg-white cursor-pointer">
                        <input
                            type="checkbox"
                            name={fieldName}
                            value={location.value}
                            checked={Array.isArray(value) && value.includes(location.value)}
                            onChange={handleOnChange}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{location.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default LocationSelector;