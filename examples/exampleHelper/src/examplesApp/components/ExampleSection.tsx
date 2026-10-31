import React from 'react';
import {ExampleItem} from '../../types/example';
import ExampleCard from './ExampleCard';
import {useExamplesStore} from '../store/useExamplesStore';
import {splitSectionItems} from '../utils/sectionHelpers';

interface ExampleSectionProps {
    item: ExampleItem;
    depth?: number;
    lcpCounter?: React.MutableRefObject<number>;
}

const ExampleSection: React.FC<ExampleSectionProps> = ({item, depth = 0, lcpCounter}) => {
    const viewMode = useExamplesStore(state => state.viewMode);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    if (item.list) {
        const {leafItems, groupItems} = splitSectionItems(item.list);

        const responsiveSectionStyle: React.CSSProperties = {
            marginBottom: depth === 0 ? (isNarrow ? '56px' : '72px') : '36px',
            marginLeft: depth > 0 ? (isNarrow ? (depth === 1 ? '12px' : '8px') : (depth === 1 ? '20px' : '14px')) : '0',
            borderLeft: depth > 0 ? '1px solid rgba(255, 255, 255, 0.07)' : 'none',
            paddingLeft: depth > 0 ? (isNarrow ? '14px' : '22px') : '0',
        };

        return (
            <section style={responsiveSectionStyle} className="fade-in">
                {depth === 0 ? (
                    <h2 style={{...sectionTitleStyle, fontSize: isNarrow ? '21px' : '25px'}}>{item.name}</h2>
                ) : depth === 1 ? (
                    <h3 style={{...subSectionTitleStyle, fontSize: isNarrow ? '15px' : '17px'}}>{item.name}</h3>
                ) : (
                    <h4 style={{...subSubSectionTitleStyle, fontSize: isNarrow ? '11px' : '12.5px'}}>{item.name}</h4>
                )}

                {leafItems.length > 0 && (
                    <div style={gridStyle(viewMode, isNarrow)}>
                        {leafItems.map((subItem, idx) => (
                            <ExampleSection key={subItem.name + idx} item={subItem} depth={depth + 1} lcpCounter={lcpCounter} />
                        ))}
                    </div>
                )}

                {groupItems.length > 0 && (
                    <div style={stackStyle}>
                        {groupItems.map((subItem, idx) => (
                            <ExampleSection key={subItem.name + idx} item={subItem} depth={depth + 1} lcpCounter={lcpCounter} />
                        ))}
                    </div>
                )}
            </section>
        );
    }

    return <ExampleCard item={item} lcpCounter={lcpCounter} />;
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '25px',
    fontWeight: 700,
    marginBottom: '26px',
    color: '#f8f9fa',
    borderLeft: '3px solid #fdb48d',
    paddingLeft: '16px',
    letterSpacing: '-0.02em',
};

const subSectionTitleStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 600,
    marginBottom: '18px',
    color: '#fdb48d',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.01em',
};

const subSubSectionTitleStyle: React.CSSProperties = {
    fontSize: '12.5px',
    fontWeight: 700,
    marginBottom: '14px',
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
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
        gap: isNarrow ? '16px' : '22px',
        marginBottom: '20px',
    };
};

export default ExampleSection;
