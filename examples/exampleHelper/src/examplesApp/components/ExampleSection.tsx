import React from 'react';
import {ExampleItem} from '../../types/example';
import ExampleCard from './ExampleCard';
import {useExamplesStore} from '../store/useExamplesStore';

interface ExampleSectionProps {
    item: ExampleItem;
    depth?: number;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({item, depth = 0}) => {
    const viewMode = useExamplesStore(state => state.viewMode);

    if (item.list) {
        return (
            <section style={{marginBottom: depth === 0 ? '80px' : '40px'}} className="fade-in">
                {depth === 0 ? (
                    <h2 style={sectionTitleStyle}>{item.name}</h2>
                ) : (
                    <h3 style={subSectionTitleStyle}>{item.name}</h3>
                )}
                
                <div style={item.list[0].list ? {} : gridStyle(viewMode, depth)}>
                    {item.list.map((subItem, idx) => (
                        <ExampleSection key={subItem.name + idx} item={subItem} depth={depth + 1} />
                    ))}
                </div>
            </section>
        );
    }

    return <ExampleCard item={item} />;
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#fff',
    borderLeft: '4px solid #fdb48d',
    paddingLeft: '20px',
    letterSpacing: '-0.02em',
};

const subSectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#fdb48d',
    opacity: 0.8,
};

const gridStyle = (mode: string, depth: number): React.CSSProperties => {
    const isGrid = mode === 'grid';
    return {
        display: 'grid',
        gridTemplateColumns: isGrid 
            ? 'repeat(auto-fill, minmax(320px, 1fr))' 
            : '1fr',
        gap: '24px',
        marginBottom: '20px',
    };
};

export default ExampleSection;
