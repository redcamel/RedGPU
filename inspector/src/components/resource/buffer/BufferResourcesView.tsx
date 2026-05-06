import React, {useState} from 'react';
import {useInspectorStore} from '../../../store';
import Section from '../../common/Section';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber, formatBufferUsage} from '../../../utils/format';
import RedGPUContext from '@redgpu/src/context/RedGPUContext';
import {ResourceSummary} from '../common/ResourceSummary';

/**
 * [KO] 버퍼 리소스 목록을 표시하는 컴포넌트입니다.
 */
const BufferResourcesView = ({onPreview}: { onPreview: (item: any, type: string) => void }) => {
    const {resourceStats, redGPUContext} = useInspectorStore();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    if (!redGPUContext) return null;

    const renderBufferSection = (type: string, label: string, stats: any) => (
        <React.Fragment key={type}>
            <ResourceSummary
                label={label}
                stats={stats}
                isExpanded={!!expanded[type]}
                onToggle={() => toggleExpanded(type)}
            />
            {expanded[type] && (
                <BufferDetailList type={type} redGPUContext={redGPUContext} onPreview={onPreview} />
            )}
        </React.Fragment>
    );

    return (
        <Section title="Buffer Resources">
            {renderBufferSection('uniformBuffer', 'Uniform Buffers', resourceStats.uniformBuffer)}
            {renderBufferSection('vertexBuffer', 'Vertex Buffers', resourceStats.vertexBuffer)}
            {renderBufferSection('indexBuffer', 'Index Buffers', resourceStats.indexBuffer)}
            {renderBufferSection('storageBuffer', 'Storage Buffers', resourceStats.storageBuffer)}
            {renderBufferSection('gpuBuffer', 'Raw GPU Buffers', resourceStats.gpuBuffer)}
        </Section>
    );
};

const BufferDetailList = ({type, redGPUContext, onPreview}: { type: string, redGPUContext: RedGPUContext, onPreview: (item: any, type: string) => void }) => {
    const rm = redGPUContext.resourceManager;
    let items: any[] = [];

    switch (type) {
        case 'uniformBuffer': items = Array.from(rm.managedUniformBufferState.table.values()); break;
        case 'vertexBuffer': items = Array.from(rm.managedVertexBufferState.table.values()); break;
        case 'indexBuffer': items = Array.from(rm.managedIndexBufferState.table.values()); break;
        case 'storageBuffer': items = Array.from(rm.managedStorageBufferState.table.values()); break;
        case 'gpuBuffer': {
            const gpuBufferMap = rm.resources.get('GPUBuffer') as Map<string, GPUBuffer>;
            items = Array.from(gpuBufferMap.entries()).map(([key, buffer]) => ({
                uuid: key,
                label: buffer.label || key,
                size: buffer.size,
                usage: (buffer as any).usage,
                isRaw: true,
                gpuBuffer: buffer // Pass the instance for readback
            }));
            break;
        }
    }

    if (items.length === 0) return <div style={noItemStyle}>No buffers found.</div>;

    return (
        <div style={detailListStyle}>
            {items.map((item, idx) => {
                if (item.isRaw) {
                    return (
                        <div 
                            key={item.uuid || idx} 
                            style={{...detailItemStyle, cursor: 'pointer'}}
                            onClick={() => onPreview(item, type)}
                        >
                            <div style={detailHeaderStyle}>
                                <div style={detailLeftContainerStyle}>
                                    <span style={detailNameStyle}>{item.label}</span>
                                    <div style={detailInfoStyle}>
                                        <span>UUID: {item.uuid}</span>
                                    </div>
                                    {item.usage !== undefined && (
                                        <div style={{...detailInfoStyle, marginTop: '2px', opacity: 0.7}}>
                                            <span>Usage: <b style={{color: '#eee'}}>{formatBufferUsage(item.usage)}</b></span>
                                        </div>
                                    )}
                                </div>
                                <div style={detailRightContainerStyle}>
                                    <span style={detailMemoryStyle}>{formatBytes(item.size)}</span>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    const buf = item.buffer;
                    return (
                        <div 
                            key={item.uuid || idx} 
                            style={{
                                ...detailItemStyle,
                                borderLeft: type === 'uniformBuffer' ? '2px solid #a0aec0' : 'none',
                                background: type === 'uniformBuffer' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.02)',
                                marginBottom: type === 'uniformBuffer' ? '4px' : '2px',
                                cursor: 'pointer'
                            }}
                            onClick={() => onPreview(item, type)}
                        >
                            <div style={detailHeaderStyle}>
                                <div style={detailLeftContainerStyle}>
                                    <span style={detailNameStyle}>{item.label || buf?.label || buf?.name || 'Unnamed'}</span>
                                    <div style={detailInfoStyle}>
                                        <span>UUID: {item.uuid}</span>
                                    </div>
                                    {buf?.usage !== undefined && (
                                        <div style={{...detailInfoStyle, marginTop: '2px', opacity: 0.7}}>
                                            <span>Usage: <b style={{color: '#eee'}}>{formatBufferUsage(buf.usage)}</b></span>
                                        </div>
                                    )}
                                </div>
                                <div style={detailRightContainerStyle}>
                                    <span style={useNumStyle}>Use: {formatNumber(item.useNum, 0)}</span>
                                    <span style={detailMemoryStyle}>{formatBytes(buf?.size || 0)}</span>
                                </div>
                            </div>
                        </div>
                    );
                }
            })}
        </div>
    );
};

// Styles
const detailListStyle: React.CSSProperties = {
    padding: '4px 0 4px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    margin: '0 0 8px 8px'
};

const detailItemStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#888',
    background: 'rgba(255,255,255,0.02)',
    padding: '6px 8px',
    borderRadius: '2px',
    lineHeight: '1.4',
};

const detailHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px'
};

const detailLeftContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
    minWidth: 0
};

const detailNameStyle: React.CSSProperties = {
    color: '#ddd',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '600',
    fontSize: '12px',
    marginBottom: '2px'
};

const detailInfoStyle: React.CSSProperties = {
    display: 'flex', gap: '12px', opacity: 0.6, fontSize: '9px'
};

const detailRightContainerStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', minWidth: '90px', flexShrink: 0
};

const detailMemoryStyle: React.CSSProperties = {
    color: '#fdb48d', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '12px'
};

const useNumStyle: React.CSSProperties = {
    fontSize: '10px', opacity: 0.8, color: '#fdb48d', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', whiteSpace: 'nowrap', fontWeight: 'bold'
};

const noItemStyle: React.CSSProperties = {
    padding: '8px 16px', fontSize: '10px', color: '#666', fontStyle: 'italic'
};

export default BufferResourcesView;
