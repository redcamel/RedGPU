import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import ExampleGrid from './ExampleGrid';
import ViewControls from './ViewControls';

const MainContent: React.FC = () => {
    const activeTab = useExamplesStore(state => state.activeTab);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <main style={mainStyle}>
            <div style={{...topBar, padding: isNarrow ? '0 10px' : '0 20px'}}>
                {!isNarrow && (
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        style={toggleSidebarButton}
                        title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                )}
                <div style={{...pathStyle, fontSize: isNarrow ? '12px' : '13px'}}>
                    <span style={{opacity: 0.5}}>Examples /</span> {activeTab}
                </div>
                <ViewControls />
            </div>
            
            <div style={{
                ...scrollArea, 
                padding: isNarrow ? '20px 15px 100px 15px' : '40px 40px 100px 40px'
            }}>
                <ExampleGrid />
            </div>
        </main>
    );
};

const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#000',
};

const topBar: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    padding: '0 20px',
    borderBottom: '1px solid #222',
    backgroundColor: '#0a0a0b',
};

const toggleSidebarButton: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fdb48d',
    cursor: 'pointer',
    padding: '5px 10px',
    marginRight: '10px',
    fontSize: '12px',
};

const pathStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#eee',
    flex: 1,
};

const scrollArea: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '40px 40px 100px 40px',
};

export default MainContent;
