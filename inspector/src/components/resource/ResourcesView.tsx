import React, {useState} from 'react';
import {ResourceStatusSummary, useInspectorStore} from '../../store';
import Section from '../common/Section';
import StatItem from '../common/StatItem';
import formatBytes from '@redgpu/src/utils/formatBytes';
import RedGPUContext from '@redgpu/src/context/RedGPUContext';

/**
 * [KO] 리소스 유형별 요약 정보를 표시하는 컴포넌트입니다.
 */
const ResourceSummary = ({
                             label,
                             stats,
                             isExpanded,
                             onToggle
                         }: {
    label: string,
    stats: ResourceStatusSummary,
    isExpanded: boolean,
    onToggle: () => void
}) => (
    <div
        style={{
            ...summaryContainerStyle,
            cursor: 'pointer',
            borderLeft: isExpanded ? '2px solid #fdb48d' : '2px solid transparent',
            background: isExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)',
        }}
        onClick={onToggle}
    >
        <div style={summaryLabelStyle}>
            {label}
            <span style={{float: 'right', opacity: 0.5, fontSize: '10px'}}>
                {isExpanded ? '▲' : '▼'}
            </span>
        </div>
        <div style={summaryValuesStyle}>
            <StatItem label="Count" value={stats.count}/>
            <StatItem label="Memory" value={formatBytes(stats.videoMemory)} color="#fdb48d" isBold/>
        </div>
    </div>
);

/**
 * [KO] 리소스 상세 목록을 표시하는 컴포넌트입니다.
 */
const ResourceDetailList = ({type, redGPUContext}: { type: string, redGPUContext: RedGPUContext }) => {
    const rm = redGPUContext.resourceManager;
    let items: any[] = [];
    let isTexture = false;

    switch (type) {
        case 'bitmapTexture':
            items = Array.from(rm.managedBitmapTextureState.table.values());
            isTexture = true;
            break;
        case 'cubeTexture':
            items = Array.from(rm.managedCubeTextureState.table.values());
            isTexture = true;
            break;
        case 'hdrTexture':
            items = Array.from(rm.managedHDRTextureState.table.values());
            isTexture = true;
            break;
        case 'uniformBuffer':
            items = Array.from(rm.managedUniformBufferState.table.values());
            break;
        case 'vertexBuffer':
            items = Array.from(rm.managedVertexBufferState.table.values());
            break;
        case 'indexBuffer':
            items = Array.from(rm.managedIndexBufferState.table.values());
            break;
        case 'storageBuffer':
            items = Array.from(rm.managedStorageBufferState.table.values());
            break;
        case 'gpuBuffer': {
            const gpuBufferMap = rm.resources.get('GPUBuffer') as Map<string, GPUBuffer>;
            items = Array.from(gpuBufferMap.entries()).map(([key, buffer]) => ({
                uuid: key,
                label: buffer.label || key,
                size: buffer.size,
                isRaw: true
            }));
            break;
        }
    }

    if (items.length === 0) {
        return <div style={noItemStyle}>No resources found.</div>;
    }

    return (
        <div style={detailListStyle}>
            {items.map((item, idx) => {
                if (isTexture) {
                    const tex = item.texture;
                    const gpuTex = tex?.gpuTexture;
                    const isBlob = (item.src && item.src.startsWith('blob:')) || (item.srcList && item.srcList[0]?.startsWith('blob:'));
                    const fileName = isBlob ? 'BLOB' : (item.src ? item.src.split('/').pop() : (item.srcList ? item.srcList[0].split('/').pop() : null));
                    const originalPath = item.src || (item.srcList ? item.srcList[0] + '...' : item.cacheKey);

                    return (
                        <div key={item.uuid || idx} style={{
                            ...detailItemStyle,
                            borderLeft: '2px solid #fdb48d',
                            background: 'rgba(255,255,255,0.04)',
                            marginBottom: '6px',
                            padding: '10px'
                        }}>
                            <div style={detailHeaderStyle}>
                                <div style={detailLeftContainerStyle}>
                                    {fileName && <span style={detailNameStyle}>{fileName}</span>}
                                    <span style={{
                                        ...detailInfoStyle,
                                        fontSize: fileName ? '9px' : '10px',
                                        color: fileName ? '#888' : '#ddd',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        marginBottom: '4px'
                                    }} title={originalPath}>{originalPath}</span>
                                    <div style={detailInfoStyle}>
                                        <span>UUID: {item.uuid}</span>
                                    </div>
                                    {gpuTex && (
                                        <div style={{...detailInfoStyle, gap: '8px', marginTop: '2px', opacity: 0.9}}>
                                            <span>Dim: <b style={{color: '#eee'}}>{gpuTex.dimension}</b></span>
                                            <span>Layers: <b style={{color: '#eee'}}>{gpuTex.depthOrArrayLayers}</b></span>
                                            <span>Samples: <b style={{color: '#eee'}}>{gpuTex.sampleCount}</b></span>
                                        </div>
                                    )}
                                </div>
                                <div style={detailRightContainerStyle}>
                                    <div style={{display:'flex', gap:'4px', alignItems:'center', marginBottom: '2px'}}>
                                        <span style={{...useNumStyle, fontWeight: 'bold'}}>Use: {item.useNum}</span>
                                        <span style={detailMemoryStyle}>{formatBytes(tex?.videoMemorySize || 0)}</span>
                                    </div>
                                    {gpuTex && (
                                        <div style={{...detailInfoStyle, flexDirection: 'column', alignItems: 'flex-end', gap: '0', opacity: 0.9}}>
                                            <b style={{color: '#fdb48d'}}>{gpuTex.format}</b>
                                            <span style={{color: '#eee', fontWeight: 'bold'}}>{gpuTex.width}x{gpuTex.height}</span>
                                            <span style={{fontWeight: 'bold'}}>Mip: {gpuTex.mipLevelCount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                } else if (item.isRaw) {
                    return (
                        <div key={item.uuid || idx} style={detailItemStyle}>
                            <div style={detailHeaderStyle}>
                                <div style={detailLeftContainerStyle}>
                                    <span style={detailNameStyle}>{item.label}</span>
                                    <div style={detailInfoStyle}>
                                        <span>UUID: {item.uuid}</span>
                                    </div>
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
                        <div key={item.uuid || idx} style={detailItemStyle}>
                            <div style={detailHeaderStyle}>
                                <div style={detailLeftContainerStyle}>
                                    <span style={detailNameStyle}>{item.label || buf?.name || 'Unnamed'}</span>
                                    <div style={detailInfoStyle}>
                                        <span>UUID: {item.uuid}</span>
                                    </div>
                                </div>
                                <div style={detailRightContainerStyle}>
                                    <span style={useNumStyle}>Use: {item.useNum}</span>
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

/**
 * [KO] 엔진에서 관리하는 리소스 현황을 표시하는 컴포넌트입니다.
 * [EN] Component that displays the status of resources managed by the engine.
 */
const ResourcesView = () => {
    const {resourceStats, redGPUContext} = useInspectorStore();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    const renderResource = (key: string, label: string, stats: ResourceStatusSummary) => (
        <React.Fragment key={key}>
            <ResourceSummary
                label={label}
                stats={stats}
                isExpanded={!!expanded[key]}
                onToggle={() => toggleExpanded(key)}
            />
            {expanded[key] && redGPUContext && (
                <ResourceDetailList type={key} redGPUContext={redGPUContext}/>
            )}
        </React.Fragment>
    );

    return (
        <div style={{paddingBottom: '20px'}}>
            <Section title="Texture Resources">
                {renderResource('bitmapTexture', 'Bitmap Textures', resourceStats.bitmapTexture)}
                {renderResource('cubeTexture', 'Cube Textures', resourceStats.cubeTexture)}
                {renderResource('hdrTexture', 'HDR Textures', resourceStats.hdrTexture)}
            </Section>

            <Section title="Buffer Resources">
                {renderResource('uniformBuffer', 'Uniform Buffers', resourceStats.uniformBuffer)}
                {renderResource('vertexBuffer', 'Vertex Buffers', resourceStats.vertexBuffer)}
                {renderResource('indexBuffer', 'Index Buffers', resourceStats.indexBuffer)}
                {renderResource('storageBuffer', 'Storage Buffers', resourceStats.storageBuffer)}
                {renderResource('gpuBuffer', 'Raw GPU Buffers', resourceStats.gpuBuffer)}
            </Section>
        </div>
    );
};

const summaryContainerStyle: React.CSSProperties = {
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '4px',
    marginBottom: '2px',
    transition: 'all 0.1s'
};

const summaryLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const summaryValuesStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
};

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
    minWidth: 0 // ellipsis 작동을 위함
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

const detailRightContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    minWidth: '90px',
    flexShrink: 0
};

const detailMemoryStyle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    fontSize: '12px'
};

const useNumStyle: React.CSSProperties = {
    fontSize: '10px',
    opacity: 0.8,
    color: '#fdb48d',
    background: 'rgba(255,255,255,0.1)',
    padding: '2px 6px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
};

const detailInfoStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    opacity: 0.6,
    fontSize: '9px'
};

const noItemStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic'
};

export default ResourcesView;
