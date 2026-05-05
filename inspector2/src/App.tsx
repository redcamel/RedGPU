import React from 'react';
import {useInspectorStore} from './store';

const App = () => {
    const {useDebugPanel, setUseDebugPanel} = useInspectorStore();

    if (!useDebugPanel) return null;

    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                <div style={{fontSize: '14px', fontWeight: 'bold', color: '#fdb48d'}}>RedGPU Inspector 2.0</div>
                <button onClick={() => setUseDebugPanel(false)} style={closeBtnStyle}>CLOSE</button>
            </div>
            <div style={{padding: '10px', fontSize: '12px'}}>
                인스펙터가 정상적으로 로드되었습니다.
            </div>
        </div>
    );
};

const panelStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '300px',
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
