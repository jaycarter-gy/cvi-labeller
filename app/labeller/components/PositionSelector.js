"use client";
import React from 'react';

const PositionSelector = ({ 
    value = [], 
    onChange, 
    fieldName = "position",
    label = "Position:",
    options = ['medial', 'lateral', 'posterior', 'anterior'],
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
            <div className="grid grid-cols-2 gap-2">
                {options.map(position => (
                    <label key={position} className="flex items-center p-2 rounded border border-gray-200 hover:bg-white cursor-pointer">
                        <input
                            type="checkbox"
                            name={fieldName}
                            value={position}
                            checked={Array.isArray(value) && value.includes(position)}
                            onChange={handleOnChange}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{position}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
 
export default PositionSelector;