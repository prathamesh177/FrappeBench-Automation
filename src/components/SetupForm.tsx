import React, { useState, useRef, useEffect } from 'react';
import { useInstallation } from '../context/InstallationContext';
import { RepoInput } from './RepoInput';
import { InstallationLog } from './InstallationLog';
import { ProgressStatus } from './ProgressStatus';
import { RepoHistory } from './RepoHistory';
import { isValidGithubRepo } from '../utils/validation';
import { extractRepoInfo } from '../utils/githubHelper';

export const SetupForm: React.FC = () => {
  const { 
    startInstallation, 
    installationStatus, 
    isInstalling, 
    installationLogs,
    currentStep 
  } = useInstallation();
  
  const [erpnextRepoUrl, setErpnextRepoUrl] = useState('https://github.com/frappe/erpnext');
  const [customAppRepoUrl, setCustomAppRepoUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [repoHistory, setRepoHistory] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState({
    erpnext: '',
    customApp: '',
    siteName: ''
  });

  // Refs for form focus handling
  const customAppInputRef = useRef<HTMLInputElement>(null);
  const siteNameInputRef = useRef<HTMLInputElement>(null);

  // Load saved repo history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('repoHistory');
    if (savedHistory) {
      try {
        setRepoHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse repo history:', error);
        localStorage.removeItem('repoHistory');
      }
    }
  }, []);

  // Save repo history to localStorage
  const saveToHistory = (repoUrl: string) => {
    if (!repoUrl.trim() || repoHistory.includes(repoUrl)) return;
    
    const updatedHistory = [repoUrl, ...repoHistory.slice(0, 9)]; // Keep last 10
    setRepoHistory(updatedHistory);
    localStorage.setItem('repoHistory', JSON.stringify(updatedHistory));
  };

  const handleStartInstallation = () => {
    // Reset validation errors
    setValidationErrors({
      erpnext: '',
      customApp: '',
      siteName: ''
    });

    // Validate inputs
    let hasErrors = false;

    if (!isValidGithubRepo(erpnextRepoUrl)) {
      setValidationErrors(prev => ({ ...prev, erpnext: 'Please enter a valid GitHub repository URL' }));
      hasErrors = true;
    }

    if (customAppRepoUrl && !isValidGithubRepo(customAppRepoUrl)) {
      setValidationErrors(prev => ({ ...prev, customApp: 'Please enter a valid GitHub repository URL' }));
      hasErrors = true;
    }

    if (!siteName.trim()) {
      setValidationErrors(prev => ({ ...prev, siteName: 'Site name is required' }));
      hasErrors = true;
      siteNameInputRef.current?.focus();
    } else if (!/^[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z0-9]+([\-\.][a-z0-9]+)*$/.test(siteName)) {
      setValidationErrors(prev => ({ 
        ...prev, 
        siteName: 'Site name must be a valid domain name (e.g., mysite.localhost)' 
      }));
      hasErrors = true;
      siteNameInputRef.current?.focus();
    }

    if (hasErrors) return;

    // Save valid repos to history
    saveToHistory(erpnextRepoUrl);
    if (customAppRepoUrl) saveToHistory(customAppRepoUrl);

    // Extract repo info
    const erpnextRepo = extractRepoInfo(erpnextRepoUrl);
    const customAppRepo = customAppRepoUrl ? extractRepoInfo(customAppRepoUrl) : null;

    // Start installation
    startInstallation({
      erpnextRepo,
      customAppRepo,
      siteName
    });
  };

  const handleSelectFromHistory = (repoUrl: string) => {
    // If ERPNext field is default, update the custom app field
    if (erpnextRepoUrl === 'https://github.com/frappe/erpnext') {
      setCustomAppRepoUrl(repoUrl);
      customAppInputRef.current?.focus();
    } else {
      // Otherwise, update whichever field is focused or the default one
      if (document.activeElement === customAppInputRef.current) {
        setCustomAppRepoUrl(repoUrl);
      } else {
        setErpnextRepoUrl(repoUrl);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Setup Configuration</h2>
          
          <div className="space-y-4">
            <RepoInput
              label="ERPNext Repository"
              value={erpnextRepoUrl}
              onChange={setErpnextRepoUrl}
              error={validationErrors.erpnext}
              placeholder="https://github.com/frappe/erpnext"
              disabled={isInstalling}
            />

            <RepoInput
              label="Custom App Repository (Optional)"
              value={customAppRepoUrl}
              onChange={setCustomAppRepoUrl}
              error={validationErrors.customApp}
              placeholder="https://github.com/username/app-name"
              disabled={isInstalling}
              ref={customAppInputRef}
            />

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="mysite.localhost"
                className={`w-full p-2 border ${validationErrors.siteName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                disabled={isInstalling}
                ref={siteNameInputRef}
              />
              {validationErrors.siteName && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.siteName}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a domain name for your site (e.g., mysite.localhost)
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={handleStartInstallation}
                disabled={isInstalling}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isInstalling 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isInstalling ? 'Installation in Progress...' : 'Start Installation'}
              </button>
            </div>
          </div>
        </div>

        {repoHistory.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <RepoHistory repositories={repoHistory} onSelect={handleSelectFromHistory} />
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 h-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Installation Progress</h2>
          
          {installationStatus && (
            <ProgressStatus currentStep={currentStep} />
          )}

          <InstallationLog logs={installationLogs} />
        </div>
      </div>
    </div>
  );
};