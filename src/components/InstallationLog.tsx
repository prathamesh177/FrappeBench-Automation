import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface InstallationLogProps {
  logs: string[];
}

export const InstallationLog: React.FC<InstallationLogProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center h-64">
        <Terminal size={24} className="text-gray-400 mb-2" />
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
          Installation logs will appear here once you start the process.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 h-64 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm">
      <div className="p-4 space-y-1">
        {logs.map((log, index) => {
          // Colorize success, error, and info messages
          let className = "text-gray-800 dark:text-gray-300";
          
          if (log.includes("SUCCESS") || log.includes("success") || log.includes("✅")) {
            className = "text-green-600 dark:text-green-400";
          } else if (log.includes("ERROR") || log.includes("error") || log.includes("failed") || log.includes("❌")) {
            className = "text-red-600 dark:text-red-400";
          } else if (log.includes("INFO") || log.includes("info") || log.includes("→")) {
            className = "text-blue-600 dark:text-blue-400";
          }
          
          return (
            <div key={index} className={className}>
              {log}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};