"use client";
import React from 'react';

const UlcerDurationSelector = ({ 
    value, 
    onChange, 
    fieldName = "ulcer_duration",
    label = "Ulcer Duration:",
    options = [
        { value: 'more_than_a_year', label: 'More than a year' },
        { value: 'less_than_a_year', label: 'Less than a year' }
    ],
    className = ""
}) => {
    return (
        <div className={className}>
            <h5 className="text-sm font-bold text-gray-700 mb-2">{label}</h5>
            <div className="flex space-x-3">
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
};

export default UlcerDurationSelector;
