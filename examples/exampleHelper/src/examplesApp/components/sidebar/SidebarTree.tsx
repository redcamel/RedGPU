import React from 'react';
import {ExampleItem} from '../../../types/example';

interface SidebarTreeProps {
    items: ExampleItem[];
    depth?: number;
}

const SidebarTree: React.FC<SidebarTreeProps> = ({items, depth = 0}) => {
    return (
        <>
            {depth === 0 && (
                <style>
                    {`
                    .sidebar-item:hover {
                        color: #fdb48d !important;
                        background-color: rgba(255, 255, 255, 0.04);
                    }
                    `}
                </style>
            )}
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
                        className="sidebar-item"
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
    fontSize: '10.5px',
    color: '#8e8e93',
    fontWeight: 700,
    textTransform: 'uppercase',
    marginTop: '16px',
    marginBottom: '6px',
    letterSpacing: '0.06em',
};

const itemStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: '#d8dae0',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'color 0.15s, background-color 0.15s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '8.5px',
    backgroundColor: 'rgba(255, 90, 95, 0.16)',
    color: '#ff7b80',
    border: '1px solid rgba(255, 90, 95, 0.35)',
    padding: '2px 6px',
    borderRadius: '9999px',
    fontWeight: 700,
    lineHeight: '1',
    display: 'inline-block',
    marginLeft: '6px',
    flexShrink: 0
};

export default SidebarTree;
