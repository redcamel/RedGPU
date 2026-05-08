import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import Section from '../common/Section';
import {TabBar, TabItem} from '../common/Tabs';
import HierarchyItem from './HierarchyItem';

/**
 * [KO] 씬의 계층 구조를 트리 형태로 표시하는 컴포넌트입니다.
 */
const HierarchyView = () => {
    const hierarchy = useInspectorStore(state => state.hierarchy);
    const viewNames = Object.keys(hierarchy);
    const [activeView, setActiveView] = useState(viewNames[0] || '');

    if (viewNames.length === 0) {
        return <div style={placeholderStyle}>No scene hierarchy available.</div>;
    }

    const tabs: TabItem[] = viewNames.map(name => ({id: name, label: name}));

    return (
        <div style={containerStyle}>
            {viewNames.length > 1 && (
                <div style={tabWrapperStyle}>
                    <TabBar 
                        tabs={tabs} 
                        activeTab={activeView || viewNames[0]} 
                        onTabChange={setActiveView} 
                        isSticky={false}
                    />
                </div>
            )}
            <div style={contentStyle}>
                <Section title="Scene Tree">
                    <HierarchyItem node={hierarchy[activeView || viewNames[0]]} />
                </Section>
            </div>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

const tabWrapperStyle: React.CSSProperties = {
    marginBottom: '12px',
    background: 'rgba(255,255,255,0.03)'
};

const contentStyle: React.CSSProperties = {
    padding: '0'
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default HierarchyView;
