import React, {useState} from 'react';
import {useInspectorStore} from '../../../store';
import Section from '../../common/Section';
import {formatTextureUsage} from '../../../utils/format';
import formatBytes from '@redgpu/src/utils/formatBytes';
import View3D from '@redgpu/src/display/view/View3D';
import {COMMON_STYLES, THEME} from "../../common/Theme";
import calculateTextureByteSize from "@redgpu/src/utils/texture/calculateTextureByteSize";

/**
 * [KO] G-Buffer 리소스 목록을 표시하는 컴포넌트입니다.
 * [EN] Component that displays the list of G-Buffer resources.
 */
const GBufferResourcesView = ({onPreview}: { onPreview: (item: any, type: string) => void }) => {
    const {redGPUContext} = useInspectorStore();
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    if (!redGPUContext) return null;

    const toggleExpanded = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    const views = redGPUContext.viewList as View3D[];
    const totalMemory = views.reduce((acc, view) => acc + (view.viewRenderTextureManager?.videoMemorySize || 0), 0);

    return (
        <Section title={
            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
                <span>G-Buffer Resources</span>
                <span style={{fontSize: '11px', color: THEME.colors.primary}}>{formatBytes(totalMemory)}</span>
            </div>
        }>
            {views.map((view, idx) => (
                <ViewGBufferList
                    key={idx}
                    view={view}
                    isExpanded={!!expanded[idx.toString()]}
                    onToggle={() => toggleExpanded(idx.toString())}
                    onPreview={onPreview}
                />
            ))}
        </Section>
    );
};

const ViewGBufferList = ({view, isExpanded, onToggle, onPreview}: {
    view: View3D,
    isExpanded: boolean,
    onToggle: () => void,
    onPreview: (item: any, type: string) => void
}) => {
    const vrm = view.viewRenderTextureManager;
    const gBuffers = vrm.gBuffers;
    const items = Array.from(gBuffers.entries());
    const viewMemory = vrm.videoMemorySize;

    return (
        <div style={{marginBottom: '12px'}}>
            <div
                style={viewHeaderStyle}
                onClick={onToggle}
            >
                <div style={toggleWrapperStyle}>
                    <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', flex: 1, alignItems: 'center'}}>
                    <span>View: <b>{view.name || 'Unnamed View'}</b> <small
                        style={{color: '#888'}}>({items.length})</small></span>
                    <span style={{
                        fontSize: '11px',
                        opacity: 0.8,
                        color: THEME.colors.primary
                    }}>{formatBytes(viewMemory)}</span>
                </div>
            </div>
            {isExpanded && (
                <div style={detailListStyle}>
                    {items.map(([key, info]) => (
                        <GBufferItem
                            key={key}
                            name={key}
                            info={info}
                            onPreview={onPreview}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const GBufferItem = ({name, info, onPreview}: {
    name: string,
    info: any,
    onPreview: (item: any, type: string) => void
}) => {
    const gpuTex = info.texture;
    if (!gpuTex) return null;

    const isMSAA = gpuTex.sampleCount > 1;
    const previewTex = (isMSAA && info.resolveTexture) ? info.resolveTexture : gpuTex;

    // Calculate memory for item (including resolve target)
    let itemMemory = calculateTextureByteSize(gpuTex);
    if (info.resolveTexture) {
        itemMemory += calculateTextureByteSize(info.resolveTexture);
    }

    return (
        <div
            style={textureItemStyle}
            onClick={() => onPreview({texture: {gpuTexture: previewTex}, label: name}, 'bitmapTexture')}
        >
            <div style={detailHeaderStyle}>
                <div style={detailLeftContainerStyle}>
                    <span style={detailNameStyle}>{name} {isMSAA ?
                        <span style={msaaBadgeStyle}>MSAA</span> : null}</span>
                    <div style={detailInfoStyle}>
                        <span>Format: <b style={{color: '#eee'}}>{gpuTex.format}</b></span>
                    </div>
                    <div style={{...detailInfoStyle, gap: '8px', marginTop: '2px', opacity: 0.9}}>
                        <span>Dim: <b style={{color: '#eee'}}>{gpuTex.width}x{gpuTex.height}</b></span>
                        <span>Samples: <b
                            style={{color: isMSAA ? THEME.colors.primary : '#eee'}}>{gpuTex.sampleCount}</b></span>
                        <span>Mips: <b style={{color: '#eee'}}>{gpuTex.mipLevelCount}</b></span>
                    </div>
                    {gpuTex.usage !== undefined && (
                        <div style={{...detailInfoStyle, marginTop: '2px', opacity: 0.7}}>
                            <span>Usage: <b style={{color: '#eee'}}>{formatTextureUsage(gpuTex.usage)}</b></span>
                        </div>
                    )}
                    {isMSAA && !info.resolveTexture && (
                        <div style={{...detailInfoStyle, marginTop: '4px', color: '#f44336', fontSize: '10px'}}>
                            <span>⚠️ Multisampled texture without resolve target cannot be previewed.</span>
                        </div>
                    )}
                </div>
                <div style={detailRightContainerStyle}>
                    <span style={detailMemoryStyle}>{formatBytes(itemMemory)}</span>
                </div>
            </div>
        </div>
    );
};

const msaaBadgeStyle: React.CSSProperties = {
    background: THEME.colors.primary,
    color: '#000',
    fontSize: '9px',
    padding: '1px 4px',
    borderRadius: '3px',
    marginLeft: '6px',
    verticalAlign: 'middle'
};

const viewHeaderStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: '#222',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    borderLeft: `2px solid ${THEME.colors.primary}`,
};

const toggleWrapperStyle: React.CSSProperties = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    paddingRight: '8px'
};

const detailListStyle: React.CSSProperties = {
    padding: '4px 0 4px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderLeft: '1px solid #333',
    marginLeft: '6px'
};

const textureItemStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: '#1a1a1a',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.2s',
    borderBottom: '1px solid #222',
};

const detailHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
};

const detailLeftContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0
};

const detailNameStyle: React.CSSProperties = {
    color: THEME.colors.primary,
    fontWeight: 'bold',
    marginBottom: '2px',
    fontSize: '13px'
};

const detailInfoStyle: React.CSSProperties = {
    display: 'flex',
    fontSize: '11px',
    color: '#aaa',
    gap: '12px'
};

const detailRightContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingLeft: '12px'
};

const detailMemoryStyle: React.CSSProperties = {
    color: THEME.colors.primary,
    fontWeight: 'bold',
    fontSize: '11px'
};

export default GBufferResourcesView;
