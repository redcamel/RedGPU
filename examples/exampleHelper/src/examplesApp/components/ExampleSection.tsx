import React from 'react';
import {ExampleItem} from '../../types/example';
import ExampleCard from './ExampleCard';
import {useExamplesStore} from '../store/useExamplesStore';
import {splitSectionItems} from '../utils/sectionHelpers';

interface ExampleSectionProps {
    item: ExampleItem;
    depth?: number;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({item, depth = 0}) => {
    const viewMode = useExamplesStore(state => state.viewMode);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    if (item.list) {
        const {leafItems, groupItems} = splitSectionItems(item.list);
        
        const responsiveSectionStyle: React.CSSProperties = {
            marginBottom: depth === 0 ? (isNarrow ? '60px' : '80px') : '40px',
            marginLeft: depth > 0 ? (isNarrow ? (depth === 1 ? '12px' : '8px') : (depth === 1 ? '24px' : '16px')) : '0',
            borderLeft: depth > 0 ? '1px solid #222' : 'none',
            paddingLeft: depth > 0 ? (isNarrow ? '16px' : '24px') : '0',
        };

        return (
            <section style={responsiveSectionStyle} className="fade-in">
                {depth === 0 ? (
                    <h2 style={{...sectionTitleStyle, fontSize: isNarrow ? '22px' : '28px'}}>{item.name}</h2>
                ) : depth === 1 ? (
                    <h3 style={{...subSectionTitleStyle, fontSize: isNarrow ? '16px' : '18px'}}>{item.name}</h3>
                ) : (
                    <h4 style={{...subSubSectionTitleStyle, fontSize: isNarrow ? '11px' : '13px'}}>{item.name}</h4>
                )}
                
                {leafItems.length > 0 && (
                    <div style={gridStyle(viewMode, isNarrow)}>
                        {leafItems.map((subItem, idx) => (
                            <ExampleSection key={subItem.name + idx} item={subItem} depth={depth + 1} />
                        ))}
                    </div>
                )}

                {groupItems.length > 0 && (
                    <div style={stackStyle}>
                        {groupItems.map((subItem, idx) => (
                            <ExampleSection key={subItem.name + idx} item={subItem} depth={depth + 1} />
                        ))}
                    </div>
                )}
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
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
};

const subSubSectionTitleStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
};

const stackStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    marginBottom: '20px',
};

const gridStyle = (mode: string, isNarrow: boolean): React.CSSProperties => {
    const isGrid = mode === 'grid';
    return {
        display: 'grid',
        gridTemplateColumns: isGrid 
            ? `repeat(auto-fill, minmax(${isNarrow ? '240px' : '280px'}, 1fr))` 
            : '1fr',
        gap: isNarrow ? '16px' : '24px',
        marginBottom: '20px',
    };
};

export default ExampleSection;
