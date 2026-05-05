import React from 'react';
import { useInspectorStore } from './store';
import FPS from './components/FPS';
import TotalState from './components/TotalState';

const App = () => {
    const useDebugPanel = useInspectorStore(state => state.useDebugPanel);
    const setUseDebugPanel = useInspectorStore(state => state.setUseDebugPanel);
    const currentTab = useInspectorStore(state => state.currentTab);

    if (!useDebugPanel) return null;

    const renderTabContent = () => {
        switch (currentTab) {
            case 'STATE':
                return <TotalState />;
            case 'CONTEXT':
                return <div style={placeholderStyle}>RedGPUContext Inspector (Coming Soon)</div>;
            case 'VIEWS':
                return <div style={placeholderStyle}>ViewList Inspector (Coming Soon)</div>;
            case 'RESOURCES':
                return <div style={placeholderStyle}>Resources Inspector (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                <div style={titleLabelStyle}>Performance Monitor</div>
                <button onClick={() => setUseDebugPanel(false)} style={closeBtnStyle}>CLOSE</button>
            </div>
            <FPS />
            <div style={contentContainerStyle}>
                {renderTabContent()}
            </div>
        </div>
    );
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

const contentContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto'
};

const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: '340px',
    top: 0,
    width: '400px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10000,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    borderTopRightRadius: '8px',
    overflow: 'hidden'
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
