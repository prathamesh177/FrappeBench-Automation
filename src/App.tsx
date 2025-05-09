import React from 'react';
import { Layout } from './components/Layout';
import { SetupForm } from './components/SetupForm';
import { InstallationProvider } from './context/InstallationContext';

function App() {
  return (
    <InstallationProvider>
      <Layout>
        <SetupForm />
      </Layout>
    </InstallationProvider>
  );
}

export default App;