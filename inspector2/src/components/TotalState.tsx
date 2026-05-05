import React from 'react';
import { useInspectorStore } from '../store';
import formatBytes from '@redgpu/src/utils/formatBytes';

const TotalState = () => {
    const {
        totalNum3DGroups,
        totalNum3DObjects,
        totalNumInstances,
        totalNumDrawCalls,
        totalNumTriangles,
        totalNumPoints,
        totalUsedVideoMemory
    } = useInspectorStore();

    return (
        <div style={containerStyle}>
            <div style={titleStyle}>Total State</div>
            <div style={gridStyle}>
                <StatItem label="Groups" value={totalNum3DGroups} />
                <StatItem label="Objects" value={totalNum3DObjects} />
                <StatItem label="Instances" value={totalNumInstances} />
                <StatItem label="Draw Calls" value={totalNumDrawCalls} color="#fdb48d" />
                <StatItem label="Triangles" value={totalNumTriangles.toLocaleString()} />
                <StatItem label="Points" value={totalNumPoints.toLocaleString()} />
                <StatItem label="Video Memory" value={formatBytes(totalUsedVideoMemory)} color="#fdb48d" isBold />
            </div>
        </div>
    );
};

const StatItem = ({ label, value, color = '#ccc', isBold = false }: { label: string, value: any, color?: string, isBold?: boolean }) => {
    const itemStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px'
    };

    const labelStyle: React.CSSProperties = {
        color: '#888'
    };

    const valueStyle: React.CSSProperties = {
        color,
        fontWeight: isBold ? 'bold' : 'normal'
    };

    return (
        <div style={itemStyle}>
            <span style={labelStyle}>{label}</span>
            <span style={valueStyle}>{value}</span>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const titleStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#fdb48d',
    marginBottom: '10px',
    fontWeight: 'bold'
};

const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
};

export default TotalState;
