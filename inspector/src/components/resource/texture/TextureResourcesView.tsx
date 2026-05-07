import React, {useState} from 'react';
import {useInspectorStore} from '../../../store';
import Section from '../../common/Section';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber, formatTextureUsage} from '../../../utils/format';
import RedGPUContext from '@redgpu/src/context/RedGPUContext';
import {ResourceSummary} from '../common/ResourceSummary';

/**
 * [KO] 텍스처 리소스 목록을 표시하는 컴포넌트입니다.
 */
const TextureResourcesView = ({onPreview}: { onPreview: (item: any, type: string) => void }) => {
    const {resourceStats, redGPUContext} = useInspectorStore();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    if (!redGPUContext) return null;

    const totalMemory = (resourceStats.bitmapTexture?.videoMemory || 0) +
        (resourceStats.cubeTexture?.videoMemory || 0) +
        (resourceStats.hdrTexture?.videoMemory || 0);

    const renderTextureSection = (type: string, label: string, stats: any) => (
        <React.Fragment key={type}>
            <ResourceSummary
                label={label}
                stats={stats}
                isExpanded={!!expanded[type]}
                onToggle={() => toggleExpanded(type)}
            />
            {expanded[type] && (
                <TextureDetailList type={type} redGPUContext={redGPUContext} onPreview={onPreview}/>
            )}
        </React.Fragment>
    );

    return (
        <Section title={
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                <span>Texture Resources</span>
                <span style={{fontSize: '11px', color: '#fdb48d'}}>{formatBytes(totalMemory)}</span>
            </div>
        }>
            {renderTextureSection('bitmapTexture', 'Bitmap Textures', resourceStats.bitmapTexture)}
            {renderTextureSection('cubeTexture', 'Cube Textures', resourceStats.cubeTexture)}
            {renderTextureSection('hdrTexture', 'HDR Textures', resourceStats.hdrTexture)}
        </Section>
    );
};

const TextureDetailList = ({type, redGPUContext, onPreview}: {
    type: string,
    redGPUContext: RedGPUContext,
    onPreview: (item: any, type: string) => void
}) => {
    const rm = redGPUContext.resourceManager;
    let items: any[] = [];

    switch (type) {
        case 'bitmapTexture':
            items = Array.from(rm.managedBitmapTextureState.table.values());
            break;
        case 'cubeTexture':
            items = Array.from(rm.managedCubeTextureState.table.values());
            break;
        case 'hdrTexture':
            items = Array.from(rm.managedHDRTextureState.table.values());
            break;
    }

    if (items.length === 0) return <div style={noItemStyle}>No textures found.</div>;

    return (
        <div style={detailListStyle}>
            {items.map((item, idx) => {
                const tex = item.texture;
                const gpuTex = tex?.gpuTexture;
                const isBlob = (item.src && item.src.startsWith('blob:')) || (item.srcList && item.srcList[0]?.startsWith('blob:'));
                const fileName = isBlob ? 'BLOB' : (item.src ? item.src.split('/').pop() : (item.srcList ? item.srcList[0].split('/').pop() : null));
                const originalPath = item.src || (item.srcList ? item.srcList[0] + '...' : item.cacheKey);

                return (
                    <div
                        key={item.uuid || idx}
                        style={textureItemStyle}
                        onClick={() => onPreview(item, type)}
                    >
                        <div style={detailHeaderStyle}>
                            <div style={detailLeftContainerStyle}>
                                {fileName && <span style={detailNameStyle}>{fileName}</span>}
                                <span style={pathStyle} title={originalPath}>{originalPath}</span>
                                <div style={detailInfoStyle}>
                                    <span>UUID: {item.uuid}</span>
                                </div>
                                {gpuTex && (
                                    <>
                                        <div style={{...detailInfoStyle, gap: '8px', marginTop: '2px', opacity: 0.9}}>
                                            <span>Dim: <b style={{color: '#eee'}}>{gpuTex.dimension}</b></span>
                                            <span>Layers: <b
                                                style={{color: '#eee'}}>{formatNumber(gpuTex.depthOrArrayLayers, 0)}</b></span>
                                            <span>Samples: <b style={{color: '#eee'}}>{gpuTex.sampleCount}</b></span>
                                        </div>
                                        {(gpuTex as any).usage !== undefined && (
                                            <div style={{...detailInfoStyle, marginTop: '2px', opacity: 0.7}}>
                                                <span>Usage: <b
                                                    style={{color: '#eee'}}>{formatTextureUsage((gpuTex as any).usage)}</b></span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div style={detailRightContainerStyle}>
                                <div style={{display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '2px'}}>
                                    <span style={useNumStyle}>Use: {formatNumber(item.useNum, 0)}</span>
                                    <span style={detailMemoryStyle}>{formatBytes(tex?.videoMemorySize || 0)}</span>
                                </div>
                                {gpuTex && (
                                    <div style={{
                                        ...detailInfoStyle,
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '0',
                                        opacity: 0.9
                                    }}>
                                        <b style={{color: '#fdb48d'}}>{gpuTex.format}</b>
                                        <span style={{
                                            color: '#eee',
                                            fontWeight: 'bold'
                                        }}>{formatNumber(gpuTex.width, 0)}x{formatNumber(gpuTex.height, 0)}</span>
                                        <span
                                            style={{fontWeight: 'bold'}}>Mip: {formatNumber(gpuTex.mipLevelCount, 0)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Styles (unified with G-Buffer Resources)
const detailListStyle: React.CSSProperties = {
    padding: '4px 0 4px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '1px solid #333',
    marginLeft: '6px',
    marginBottom: '8px'
};

const textureItemStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#888',
    background: '#1a1a1a',
    padding: '8px 12px',
    borderRadius: '2px',
    lineHeight: '1.4',
    borderBottom: '1px solid #222',
    cursor: 'pointer',
    transition: 'background 0.2s'
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

const pathStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#888',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '4px'
};

const detailInfoStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    opacity: 0.6,
    fontSize: '9px'
};

const detailRightContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    minWidth: '90px',
    flexShrink: 0
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

const detailMemoryStyle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    fontSize: '12px'
};

const noItemStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic'
};

export default TextureResourcesView;
