import React from 'react';
import { useExampleHelperStore } from './store';
import Footer from './components/Footer';

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore(state => state.redGPUContext);

    return (
        <>
            <div style={panelStyle}>
                <div style={headerStyle}>
                    <div style={titleLabelStyle}>RedGPU Example Helper</div>
                </div>
                <div style={contentStyle}>
                    {redGPUContext ? (
                        <div>
                            <div style={{color: '#fdb48d', fontWeight: 'bold'}}>Context Status</div>
                            <div style={{marginTop: '8px', color: '#ccc', fontSize: '11px'}}>
                                <div>Canvas: {redGPUContext.width} x {redGPUContext.height}</div>
                                <div>DPR: {window.devicePixelRatio}</div>
                                <div>GPU: {redGPUContext.gpuDevice.label || 'WebGPU Device'}</div>
                            </div>
                        </div>
                    ) : (
                        <div>Waiting for Context...</div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: '52px',
    width: '300px',
    bottom: '50px', // Footer height
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(17, 17, 18, 0.9)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10001,
    boxShadow: '-5px 0 15px rgba(0,0,0,0.3)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden',
    transition: 'right 0.3s ease'
};

const headerStyle: React.CSSProperties = {
    padding: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#fdb48d',
    letterSpacing: '0.05em'
};

const contentStyle: React.CSSProperties = {
    padding: '16px',
    fontSize: '12px',
    flex: 1,
    overflowY: 'auto'
};

export default App;
