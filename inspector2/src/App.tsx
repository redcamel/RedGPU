import React from 'react';
import { useInspectorStore } from './store';
import FPS from './components/FPS';
import TotalState from './components/TotalState';

const App = () => {
    const useDebugPanel = useInspectorStore(state => state.useDebugPanel);
    const setUseDebugPanel = useInspectorStore(state => state.setUseDebugPanel);

    if (!useDebugPanel) return null;

    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                <div style={titleLabelStyle}>Performance Monitor</div>
                <button onClick={() => setUseDebugPanel(false)} style={closeBtnStyle}>CLOSE</button>
            </div>
            <FPS />
            <TotalState />
        </div>
    );
};

const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: '320px',
    top: 0,
    width: '330px',
    maxHeight: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10000,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    borderTopRightRadius: '8px',
    overflowY: 'auto',
    overflowX: 'hidden'
};

const headerStyle: React.CSSProperties = {
    padding: '10px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fdb48d'
};

const closeBtnStyle: React.CSSProperties = {
    backgroundColor: '#c00',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '4px'
};

export default App;
