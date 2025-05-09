import React, { forwardRef } from 'react';
import { Github } from 'lucide-react';

interface RepoInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const RepoInput = forwardRef<HTMLInputElement, RepoInputProps>(
  ({ label, value, onChange, error, placeholder, disabled }, ref) => {
    return (
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Github size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-10 p-2 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
            disabled={disabled}
            ref={ref}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

RepoInput.displayName = 'RepoInput';