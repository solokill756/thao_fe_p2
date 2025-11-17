'use client';

import React from 'react';

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}
export default function RenderAuthInput({
  id,
  name,
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}: AuthInputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {React.cloneElement(
            icon as React.ReactElement<React.ComponentProps<'svg'>>,
            {
              className: 'w-5 h-5 text-gray-400',
            }
          )}
        </div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
