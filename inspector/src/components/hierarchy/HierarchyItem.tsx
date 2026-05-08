import React, {useState} from 'react';
import {HierarchyNode} from '../../store';
import {COMMON_STYLES, THEME} from '../common/Theme';

/**
 * [KO] 계층 구조의 개별 항목을 렌더링하는 컴포넌트입니다.
 */
const HierarchyItem = ({node, depth = 0}: { node: HierarchyNode, depth?: number }) => {
    const [isExpanded, setIsExpanded] = useState(depth < 2); // 초기에는 상위 레벨만 확장
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div style={{marginLeft: depth > 0 ? '12px' : '0'}}>
            <div style={itemHeaderStyle}>
                <div 
                    onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                    style={{
                        ...toggleWrapperStyle,
                        visibility: hasChildren ? 'visible' : 'hidden'
                    }}
                >
                    <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
                </div>
                <div style={contentStyle}>
                    <span style={nameStyle}>{node.name}</span>
                    <span style={typeStyle}>{node.type}</span>
                </div>
            </div>
            {isExpanded && hasChildren && (
                <div style={childrenContainerStyle}>
                    {node.children.map(child => (
                        <HierarchyItem key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Styles
const itemHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 0',
    cursor: 'default',
    fontSize: '12px',
    fontFamily: THEME.fontFamily
};

const toggleWrapperStyle: React.CSSProperties = {
    cursor: 'pointer',
    marginRight: '6px',
    display: 'flex',
    alignItems: 'center'
};

const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    flex: 1,
    minWidth: 0
};

const nameStyle: React.CSSProperties = {
    color: '#eee',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const typeStyle: React.CSSProperties = {
    color: '#666',
    fontSize: '10px',
    fontStyle: 'italic'
};

const childrenContainerStyle: React.CSSProperties = {
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    marginLeft: '6px'
};

export default HierarchyItem;
