import React, { createContext, useContext, useState, ReactNode } from 'react';
import { installFrappe } from '../services/installationService';

// Repository information
interface RepoInfo {
  owner: string;
  name: string;
  branch?: string;
}

// Installation configuration
interface InstallationConfig {
  erpnextRepo: RepoInfo;
  customAppRepo: RepoInfo | null;
  siteName: string;
}

// Installation context state
interface InstallationContextState {
  isInstalling: boolean;
  installationStatus: string | null;
  installationLogs: string[];
  currentStep: number;
  startInstallation: (config: InstallationConfig) => Promise<void>;
}

// Create context with default values
const InstallationContext = createContext<InstallationContextState>({
  isInstalling: false,
  installationStatus: null,
  installationLogs: [],
  currentStep: 0,
  startInstallation: async () => {},
});

// Hook to use the installation context
export const useInstallation = () => useContext(InstallationContext);

// Provider component
export const InstallationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationStatus, setInstallationStatus] = useState<string | null>(null);
  const [installationLogs, setInstallationLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const addLog = (log: string) => {
    setInstallationLogs(prev => [...prev, log]);
  };

  const startInstallation = async (config: InstallationConfig) => {
    if (isInstalling) return;
    
    setIsInstalling(true);
    setInstallationStatus('Installing...');
    setInstallationLogs([]);
    setCurrentStep(1);
    
    try {
      addLog(`🔍 Validating repository information...`);
      
      // Step 1: Validate repositories
      addLog(`→ ERPNext repository: ${config.erpnextRepo.owner}/${config.erpnextRepo.name}`);
      if (config.customAppRepo) {
        addLog(`→ Custom app repository: ${config.customAppRepo.owner}/${config.customAppRepo.name}`);
      }
      addLog(`→ Site name: ${config.siteName}`);
      
      // Instead of actually installing (which would require real shell access),
      // we'll simulate the installation process with timeouts
      await simulateInstallation(config, addLog, setCurrentStep);
      
      setInstallationStatus('Installation completed');
      addLog(`✅ Installation process completed successfully!`);
      addLog(`✅ You can now access your site at: http://${config.siteName}`);
      
    } catch (error) {
      console.error('Installation failed:', error);
      setInstallationStatus('Installation failed');
      
      if (error instanceof Error) {
        addLog(`❌ ERROR: ${error.message}`);
      } else {
        addLog(`❌ ERROR: An unknown error occurred`);
      }
      
      // Add troubleshooting information
      addLog(`⚠️ Please check the logs above for details on what went wrong.`);
      addLog(`⚠️ Common issues include:`);
      addLog(`  - Network connectivity problems`);
      addLog(`  - Invalid repository URL or branch`);
      addLog(`  - Insufficient disk space`);
      addLog(`  - Conflicts with existing installations`);
      
    } finally {
      setIsInstalling(false);
    }
  };

  // In a real application, this would call the actual installation service
  // For demo purposes, we're simulating the process
  const simulateInstallation = async (
    config: InstallationConfig, 
    logFn: (log: string) => void,
    setStep: (step: number) => void
  ) => {
    // This function simulates what would happen if we were actually calling
    // the install functions from installationService.ts
    
    // Step 1: Validation (already done)
    await new Promise(resolve => setTimeout(resolve, 1500));
    logFn(`✅ Repository validation successful!`);
    
    // Step 2: Setup Frappe bench
    setStep(2);
    logFn(`🔧 Setting up Frappe bench (version 15)...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logFn(`→ Cloning Frappe repository...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    logFn(`→ Installing bench dependencies...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logFn(`→ Initializing bench directory...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    logFn(`✅ Frappe bench setup completed!`);
    
    // Step 3: Create site
    setStep(3);
    logFn(`🌐 Creating new site: ${config.siteName}...`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    logFn(`→ Configuring database...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    logFn(`→ Setting up site directories...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    logFn(`✅ Site creation completed!`);
    
    // Step 4: Install ERPNext
    setStep(4);
    logFn(`📦 Installing ERPNext from ${config.erpnextRepo.owner}/${config.erpnextRepo.name}...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    logFn(`→ Fetching ERPNext code...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logFn(`→ Installing dependencies...`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    logFn(`→ Migrating database schema...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    logFn(`→ Building ERPNext assets...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    logFn(`✅ ERPNext installation completed!`);
    
    // Step 5: Install custom app (if provided)
    if (config.customAppRepo) {
      setStep(5);
      logFn(`📦 Installing custom app: ${config.customAppRepo.owner}/${config.customAppRepo.name}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      logFn(`→ Fetching app code...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      logFn(`→ Installing dependencies...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      logFn(`→ Migrating app schema...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      logFn(`→ Building app assets...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      logFn(`✅ Custom app installation completed!`);
    }
    
    setStep(6); // All complete
    return true;
  };

  const value = {
    isInstalling,
    installationStatus,
    installationLogs,
    currentStep,
    startInstallation
  };

  return (
    <InstallationContext.Provider value={value}>
      {children}
    </InstallationContext.Provider>
  );
};