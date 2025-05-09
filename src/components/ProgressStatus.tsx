import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

interface ProgressStatusProps {
  currentStep: number;
}

export const ProgressStatus: React.FC<ProgressStatusProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Validating repositories' },
    { id: 2, name: 'Setting up Frappe bench' },
    { id: 3, name: 'Creating site' },
    { id: 4, name: 'Installing ERPNext' },
    { id: 5, name: 'Installing custom app' }
  ];

  return (
    <div className="mb-6">
      <div className="space-y-4">
        {steps.map((step) => {
          let status: 'upcoming' | 'current' | 'completed' | 'error' = 'upcoming';
          
          if (step.id < currentStep) {
            status = 'completed';
          } else if (step.id === currentStep) {
            status = 'current';
          }
          
          // Skip the custom app step if we reach the final step without it
          if (step.id === 5 && currentStep > 5) {
            status = 'completed';
          }
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex-shrink-0">
                {status === 'completed' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {status === 'current' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                  </div>
                )}
                {status === 'error' && (
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                )}
                {status === 'upcoming' && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{step.id}</span>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className={`text-sm font-medium ${
                  status === 'completed' ? 'text-green-600 dark:text-green-400' :
                  status === 'current' ? 'text-blue-600 dark:text-blue-400' :
                  status === 'error' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.name}
                </p>
                {status === 'current' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    In progress...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};