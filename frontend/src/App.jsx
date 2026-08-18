import React from 'react';
import { SandboxProvider, useSandboxContext } from './context/SandboxContext';
import { LandingView } from './views/LandingView';
import { WorkspaceView } from './views/WorkspaceView';

function MainAppContent() {
  const { activeView } = useSandboxContext();

  return activeView === 'workspace' ? <WorkspaceView /> : <LandingView />;
}

export default function App() {
  return (
    <SandboxProvider>
      <MainAppContent />
    </SandboxProvider>
  );
}
