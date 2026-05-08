import React from 'react';

const App = () => {
    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                <div style={titleLabelStyle}>RedGPU Example Helper</div>
            </div>
            <div style={contentStyle}>
                Example Helper Content goes here.
            </div>
        </div>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: 0,
    width: '300px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10001,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
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

const contentStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '12px'
};

export default App;
