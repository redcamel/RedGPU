import React, {useEffect, useRef, useState} from 'react';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber} from '../../../utils/format';
import {useInspectorStore} from '../../../store';
import {readGPUTextureToCanvas} from '../../../utils/textureReadback';

/**
 * [KO] 텍스처 리소스의 미리보기를 표시하는 모달 컴포넌트입니다.
 */
const TexturePreviewModal = ({item, onClose}: { item: any, onClose: () => void }) => {
    const {redGPUContext} = useInspectorStore();
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    const isTexture = !!item.texture;
    if (!isTexture) return null;

    const tex = item.texture;
    const gpuTex = tex?.gpuTexture;
    const isBlob = (item.src && item.src.startsWith('blob:')) || (item.srcList && item.srcList[0]?.startsWith('blob:'));
    const fileName = isBlob ? 'BLOB' : (item.src ? item.src.split('/').pop() : (item.srcList ? item.srcList[0].split('/').pop() : null));
    const originalPath = item.src || (item.srcList ? item.srcList[0] + '...' : item.cacheKey);

    const isCube = gpuTex?.dimension === '2d' && gpuTex?.depthOrArrayLayers === 6;
    const isHDR = item.src?.toLowerCase().endsWith('.hdr') || gpuTex?.format === 'rgba16float';
    const hasSrcList = item.srcList && Array.isArray(item.srcList);

    useEffect(() => {
        if (!redGPUContext || !gpuTex) return;
        let isMounted = true;

        const updatePreviews = async () => {
            try {
                if (isCube && !hasSrcList) {
                    for (let i = 0; i < 6; i++) {
                        if (!isMounted) return;
                        const canvas = canvasRefs.current[i];
                        if (canvas) {
                            await readGPUTextureToCanvas(redGPUContext.gpuDevice, gpuTex, canvas, i);
                        }
                    }
                } else if ((!item.src || isHDR) && !hasSrcList) {
                    if (!isMounted) return;
                    const canvas = canvasRefs.current[0];
                    if (canvas) {
                        await readGPUTextureToCanvas(redGPUContext.gpuDevice, gpuTex, canvas, 0);
                    }
                }
            } catch (e) {
                if (isMounted) console.error('Failed to read GPU texture:', e);
            }
        };

        updatePreviews();
        return () => { isMounted = false; };
    }, [gpuTex, redGPUContext, item.src, hasSrcList, isCube, isHDR]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopyFeedback(`Copied ${label} path!`);
        setTimeout(() => setCopyFeedback(null), 2000);
    };

    const cubeFaceLabels = ['Right (+X)', 'Left (-X)', 'Top (+Y)', 'Bottom (-Y)', 'Front (+Z)', 'Back (-Z)'];
    const cubeFaceIndices = [2, 1, 4, 0, 3, 5]; // Top, Left, Front, Right, Bottom, Back order for cross layout
    const gridPositions = [
        {col: 2, row: 1}, // Top (idx 2)
        {col: 1, row: 2}, // Left (idx 1)
        {col: 2, row: 2}, // Front (idx 4)
        {col: 3, row: 2}, // Right (idx 0)
        {col: 2, row: 3}, // Bottom (idx 3)
        {col: 2, row: 4}, // Back (idx 5)
    ];

    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <span style={titleStyle}>{fileName || 'Texture Preview'}</span>
                        <span style={pathStyle}>{originalPath}</span>
                    </div>
                    <button style={closeButtonStyle} onClick={onClose}>×</button>
                </div>
                <div style={contentStyle}>
                    {item.src && !isHDR && <img src={item.src} style={previewImageStyle} alt="preview" />}

                    {isCube && (
                        <div style={cubePreviewGridStyle}>
                            {gridPositions.map((pos, i) => {
                                const faceIdx = cubeFaceIndices[i];
                                return (
                                    <div key={i} style={{
                                        gridColumn: pos.col, 
                                        gridRow: pos.row, 
                                        position: 'relative',
                                        overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={faceLabelStyle}>{cubeFaceLabels[faceIdx]}</div>
                                        {hasSrcList ? (
                                            <img src={item.srcList[faceIdx]} style={cubePreviewImageStyle} title={cubeFaceLabels[faceIdx]} />
                                        ) : (
                                            <canvas 
                                                ref={el => canvasRefs.current[faceIdx] = el} 
                                                style={cubePreviewImageStyle} 
                                            />
                                        )}
                                        {hasSrcList && (
                                            <button 
                                                style={faceCopyButtonStyle} 
                                                onClick={() => handleCopy(item.srcList[faceIdx], cubeFaceLabels[faceIdx])}
                                                title="Copy path"
                                            >
                                                📋
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {((!item.src && !isCube) || isHDR) && (
                        <div style={{...previewImageStyle, position: 'relative'} as any}>
                            {isHDR && (
                                <div style={hdrBadgeStyle}>
                                    HDR DATA VIEW (Reference only)
                                </div>
                            )}
                            <canvas 
                                ref={el => canvasRefs.current[0] = el} 
                                style={{maxWidth: '100%', maxHeight: '500px', display: 'block'}} 
                            />
                            {!redGPUContext && (
                                <div style={noPreviewStyle}>
                                     <div style={{textAlign: 'center'}}>
                                         <div style={{fontSize: '40px', marginBottom: '10px'}}>🖼️</div>
                                         No direct image preview available.<br/>
                                         <span style={{opacity: 0.5, fontSize: '10px'}}>(Generated or Direct Texture)</span>
                                     </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {copyFeedback && (
                    <div style={toastStyle}>{copyFeedback}</div>
                )}

                <div style={footerStyle}>
                    <div style={infoRowStyle}>
                        <span>Format: <b style={{color: '#fdb48d'}}>{gpuTex?.format}</b></span>
                        <span>Size: <b style={{color: '#eee'}}>{formatNumber(gpuTex?.width, 0)}x{formatNumber(gpuTex?.height, 0)}</b></span>
                    </div>
                    <div style={infoRowStyle}>
                        <span>Dimension: <b style={{color: '#eee'}}>{gpuTex?.dimension}</b></span>
                        <span>Layers: <b style={{color: '#eee'}}>{formatNumber(gpuTex?.depthOrArrayLayers, 0)}</b></span>
                    </div>
                    <div style={infoRowStyle}>
                        <span>Memory: <b style={{color: '#fdb48d'}}>{formatBytes(tex?.videoMemorySize || 0)}</b></span>
                        <span>UUID: <small style={{opacity: 0.5}}>{item.uuid}</small></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    backdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.2s ease-out'
};

const modalStyle: React.CSSProperties = {
    background: 'rgba(26, 26, 26, 0.95)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
    overflow: 'hidden',
    animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
};

const headerStyle: React.CSSProperties = {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
};

const titleStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: '4px'
};

const pathStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#777',
    wordBreak: 'break-all',
    maxWidth: '400px'
};

const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: '1',
    marginTop: '-4px'
};

const contentStyle: React.CSSProperties = {
    padding: '20px',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0a0a0a',
    minHeight: '350px'
};

const previewImageStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '500px',
    objectFit: 'contain',
    boxShadow: '0 0 30px rgba(0,0,0,0.8)',
    border: '1px solid rgba(255,255,255,0.1)'
};

const cubePreviewGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(4, 1fr)',
    gap: '4px',
    width: '400px',
    background: 'rgba(255,255,255,0.02)',
    padding: '4px',
    borderRadius: '4px'
};

const cubePreviewImageStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block'
};

const faceLabelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: '8px',
    padding: '2px 4px',
    zIndex: 1,
    pointerEvents: 'none',
    textTransform: 'uppercase'
};

const faceCopyButtonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    color: '#fff',
    fontSize: '10px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
    // We'll use a CSS rule for hover on parent
};

const footerStyle: React.CSSProperties = {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '12px',
    color: '#999',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const noPreviewStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#555',
    fontSize: '13px',
    height: '100%'
};

const hdrBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#fdb48d',
    color: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
};

const toastStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#fdb48d',
    color: '#000',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 100,
    animation: 'slideUp 0.3s ease-out'
};

// Add hover effect for copy button via global style
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        div[style*="position: relative"]:hover button[title="Copy path"] {
            opacity: 1 !important;
        }
        button[title="Copy path"]:hover {
            background: #fdb48d !important;
            color: #000 !important;
        }
    `;
    document.head.appendChild(style);
}

export default TexturePreviewModal;
