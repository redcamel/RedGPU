import React from 'react';
import {ExampleHelperState, useExampleHelperStore} from './store';
import Footer from './components/Footer';
import TopBar from './components/TopBar';
import Description from './components/Description';
import SourceModal from './components/SourceModal';

/**
 * [KO] 예제 헬퍼의 메인 애플리케이션 컴포넌트입니다.
 * [EN] Main application component of the example helper.
 */
const App = () => {
    const redGPUContext = useExampleHelperStore((state: ExampleHelperState) => state.redGPUContext);

    return (
        <>
            <TopBar/>
            <Description/>

            <div style={panelStyle}>
                <div style={headerStyle}>
                    <div style={titleLabelStyle}>RedGPU Example Helper</div>
                </div>
                <div style={contentStyle}>
                    {redGPUContext ? (
                        <div style={contextInfoBoxStyle}>
                            <div style={sectionTitleStyle}>Context Status</div>
                            <div style={{color: '#ccc', fontSize: '11px', lineHeight: '1.6'}}>
                                <div>Canvas: <b
                                    style={{color: '#fff'}}>{redGPUContext.width} x {redGPUContext.height}</b></div>
                                <div>DPR: <b style={{color: '#fff'}}>{window.devicePixelRatio}</b></div>
                                <div>GPU: <b
                                    style={{color: '#fff'}}>{redGPUContext.gpuDevice.label || 'WebGPU Device'}</b></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{color: '#666', fontSize: '11px', fontStyle: 'italic'}}>Waiting for Context...</div>
                    )}
                </div>
            </div>

            <Footer/>
            <SourceModal/>
        </>
    );
};

// Styles
const panelStyle: React.CSSProperties = {
    position: 'fixed',
    right: 0,
    top: '352px',
    width: '320px',
    bottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(17, 17, 18, 0.95)',
    color: 'white',
    fontFamily: 'monospace',
    zIndex: 10001,
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden'
};

const headerStyle: React.CSSProperties = {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
};

const titleLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
};

const contentStyle: React.CSSProperties = {
    padding: '20px',
    fontSize: '12px',
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const exampleInfoBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const contextInfoBoxStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#fdb48d',
    fontWeight: 'bold',
    marginBottom: '4px'
};

const descriptionStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: '11px',
    lineHeight: '1.6',
    wordBreak: 'break-all'
};

export default App;
