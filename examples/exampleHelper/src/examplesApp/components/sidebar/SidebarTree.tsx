import React from 'react';
import {ExampleItem} from '../../../types/example';

interface SidebarTreeProps {
    items: ExampleItem[];
    depth?: number;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({items, depth = 0}) => {
    return (
        <>
            {items.map((item, idx) => {
                const key = `${item.name}-${idx}`;
                if (item.list) {
                    return (
                        <div key={key} style={{marginLeft: depth * 12}}>
                            <div style={{...groupTitleStyle, display: 'flex', alignItems: 'center'}}>
                                {item.name}
                                {item.experimental && depth === 0 && (
                                    <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>
                                )}
                            </div>
                            <SidebarTree items={item.list} depth={depth + 1} />
                        </div>
                    );
                }
                const href = item.path ? `/RedGPU/examples/${item.path}/index.html` : '#';
                return (
                    <a
                        key={key}
                        href={href}
                        style={{
                            ...itemStyle,
                            marginLeft: depth * 12,
                            textDecoration: 'none',
                        }}
                    >
                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                             {item.name}
                        </span>
                    </a>
                );
            })}
        </>
    );
};

const groupTitleStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#8a8a8a',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '15px',
    marginBottom: '8px',
    letterSpacing: '0.05em',
};

const itemStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#e0e0e0',
    padding: '6px 0',
    cursor: 'pointer',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '8px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '3px 4px',
    borderRadius: '4px',
    fontWeight: 'bold',
    lineHeight: '1',
    display: 'inline-block',
    marginLeft: '6px',
    flexShrink: 0
};

export default SidebarTree;