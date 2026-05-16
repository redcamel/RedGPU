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
                            <div style={groupTitleStyle}>{item.name}</div>
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
                            display: 'block'
                        }}
                    >
                        {item.name}
                    </a>
                );
            })}
        </>
    );
};

const groupTitleStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#555',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: '15px',
    marginBottom: '8px',
    letterSpacing: '0.05em',
};

const itemStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#ccc',
    padding: '6px 0',
    cursor: 'pointer',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export default SidebarTree;