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
            marginLeft: depth > 0 ? (isNarrow ? '0' : (depth === 1 ? '20px' : '14px')) : '0',
            borderLeft: (depth > 0 && !isNarrow) ? '1px solid rgba(255, 255, 255, 0.07)' : 'none',
            paddingLeft: depth > 0 ? (isNarrow ? '0' : '22px') : '0',
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
    lineHeight: 1.15,
    marginTop: 0,
    marginBottom: '18px',
    color: '#f8f9fa',
    borderLeft: '3px solid #fdb48d',
    paddingLeft: '16px',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.75)',
};

const subSectionTitleStyle: React.CSSProperties = {
    fontSize: '17px',
    fontWeight: 600,
    marginTop: 0,
    marginBottom: '16px',
    color: '#fdb48d',
    opacity: 0.95,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '-0.01em',
    textShadow: '0 2px 6px rgba(0, 0, 0, 0.75)',
};

const subSubSectionTitleStyle: React.CSSProperties = {
    fontSize: '12.5px',
    fontWeight: 700,
    marginTop: 0,
    marginBottom: '12px',
    color: '#8e8e93',
    letterSpacing: '0.04em',
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
            ? `repeat(auto-fill, minmax(${isNarrow ? '230px' : '265px'}, 1fr))`
            : '1fr',
        gap: isGrid ? (isNarrow ? '14px' : '18px') : '8px',
        marginBottom: '20px',
    };
};

export default ExampleSection;
