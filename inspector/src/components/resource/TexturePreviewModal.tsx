import React from 'react';
import formatBytes from '@redgpu/src/utils/formatBytes';

/**
 * [KO] 텍스처 리소스의 미리보기를 표시하는 모달 컴포넌트입니다.
 */
const TexturePreviewModal = ({item, onClose}: { item: any, onClose: () => void }) => {
    const isTexture = !!item.texture;
    if (!isTexture) return null;

    const tex = item.texture;
    const gpuTex = tex?.gpuTexture;
    const isBlob = (item.src && item.src.startsWith('blob:')) || (item.srcList && item.srcList[0]?.startsWith('blob:'));
    const fileName = isBlob ? 'BLOB' : (item.src ? item.src.split('/').pop() : (item.srcList ? item.srcList[0].split('/').pop() : null));
    const originalPath = item.src || (item.srcList ? item.srcList[0] + '...' : item.cacheKey);

    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
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
                    {item.src && <img src={item.src} style={previewImageStyle} alt="preview" />}
                    {item.srcList && Array.isArray(item.srcList) && (
                        <div style={cubePreviewGridStyle}>
                            {/* Cube map layout: cross shape or grid */}
                            <div style={{gridColumn: '2', gridRow: '1'}}><img src={item.srcList[2]} style={cubePreviewImageStyle} title="Top" /></div>
                            <div style={{gridColumn: '1', gridRow: '2'}}><img src={item.srcList[1]} style={cubePreviewImageStyle} title="Left" /></div>
                            <div style={{gridColumn: '2', gridRow: '2'}}><img src={item.srcList[4]} style={cubePreviewImageStyle} title="Front" /></div>
                            <div style={{gridColumn: '3', gridRow: '2'}}><img src={item.srcList[0]} style={cubePreviewImageStyle} title="Right" /></div>
                            <div style={{gridColumn: '2', gridRow: '3'}}><img src={item.srcList[3]} style={cubePreviewImageStyle} title="Bottom" /></div>
                            <div style={{gridColumn: '2', gridRow: '4'}}><img src={item.srcList[5]} style={cubePreviewImageStyle} title="Back" /></div>
                        </div>
                    )}
                    {!item.src && !item.srcList && (
                        <div style={noPreviewStyle}>
                             <div style={{textAlign: 'center'}}>
                                 <div style={{fontSize: '40px', marginBottom: '10px'}}>🖼️</div>
                                 No direct image preview available.<br/>
                                 <span style={{opacity: 0.5, fontSize: '10px'}}>(Generated or Direct Texture)</span>
                             </div>
                        </div>
                    )}
                </div>
                <div style={footerStyle}>
                    <div style={infoRowStyle}>
                        <span>Format: <b style={{color: '#fdb48d'}}>{gpuTex?.format}</b></span>
                        <span>Size: <b style={{color: '#eee'}}>{gpuTex?.width}x{gpuTex?.height}</b></span>
                    </div>
                    <div style={infoRowStyle}>
                        <span>Dimension: <b style={{color: '#eee'}}>{gpuTex?.dimension}</b></span>
                        <span>Layers: <b style={{color: '#eee'}}>{gpuTex?.depthOrArrayLayers}</b></span>
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
    maxWidth: '500px',
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
    minHeight: '300px'
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
    gap: '2px',
    width: '300px',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px'
};

const cubePreviewImageStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    display: 'block'
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

export default TexturePreviewModal;
