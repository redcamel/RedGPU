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
                        <div key={key} style={{marginLeft: depth > 0 ? 10 : 0}}>
                            <div style={{
                                ...groupTitleStyle,
                                marginTop: (depth === 0 && idx === 0) ? 0 : '16px',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                {item.name}
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
                            marginLeft: 4,
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
    fontSize: '14px',
    color: '#fdb48d',
    fontWeight: 700,
    marginTop: '16px',
    marginBottom: '6px',
    letterSpacing: '0.03em',
    textShadow: '0 1px 4px rgba(0, 0, 0, 0.75)',
};

const itemStyle: React.CSSProperties = {
    fontSize: '12.5px',
    color: '#d8dae0',
    padding: '5px 6px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'color 0.15s, background-color 0.15s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
};

export default SidebarTree;
