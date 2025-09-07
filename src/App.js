import React from 'react';
import ExclusivesViewer from './ExclusivesViewer';

function App() {
  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Game Exclusives Dashboard</h1>
      <ExclusivesViewer />
    </div>
  );
}

export default App;