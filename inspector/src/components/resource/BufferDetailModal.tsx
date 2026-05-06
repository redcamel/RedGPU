import React, {useState} from 'react';
import formatBytes from '@redgpu/src/utils/formatBytes';

/**
 * [KO] 버퍼 사용처 플래그를 읽기 쉬운 문자열로 변환합니다.
 */
const formatBufferUsage = (usage: number): string => {
    const labels: string[] = [];
    if (usage & 0x01) labels.push('MAP_READ');
    if (usage & 0x02) labels.push('MAP_WRITE');
    if (usage & 0x04) labels.push('COPY_SRC');
    if (usage & 0x08) labels.push('COPY_DST');
    if (usage & 0x10) labels.push('INDEX');
    if (usage & 0x20) labels.push('VERTEX');
    if (usage & 0x40) labels.push('UNIFORM');
    if (usage & 0x80) labels.push('STORAGE');
    if (usage & 0x100) labels.push('INDIRECT');
    if (usage & 0x200) labels.push('QUERY_RESOLVE');
    return labels.join(', ');
};

type DataTab = 'dataViewF32' | 'dataViewU32';

/**
 * [KO] 버퍼 리소스의 상세 정보를 표시하는 모달 컴포넌트입니다.
 */
const BufferDetailModal = ({item, type, onClose}: { item: any, type: string, onClose: () => void }) => {
    const buf = item.buffer || item;
    const isRaw = item.isRaw;

    // Determine available tabs based on type
    const availableTabs: DataTab[] = [];
    if (type === 'indexBuffer') {
        availableTabs.push('dataViewU32');
    } else if (type === 'vertexBuffer') {
        availableTabs.push('dataViewF32');
    } else {
        availableTabs.push('dataViewF32', 'dataViewU32');
    }

    const [activeTab, setActiveTab] = useState<DataTab>(availableTabs[0]);
    
    const label = isRaw ? item.label : (item.label || buf?.name || 'Unnamed Buffer');
    const uuid = item.uuid;
    const size = isRaw ? item.size : (buf?.size || 0);
    const usage = isRaw ? item.usage : buf?.usage;

    const vertexCount = buf?.vertexCount;
    const stride = buf?.stride;
    const triangleCount = buf?.triangleCount;

    // AUniformBaseBuffer getters or fallbacks
    const dataViewF32 = buf?.dataViewF32 || (buf?.data instanceof Float32Array ? buf.data : (buf?.data instanceof ArrayBuffer ? new Float32Array(buf.data) : null));
    const dataViewU32 = buf?.dataViewU32 || (buf?.data instanceof Uint32Array ? buf.data : (buf?.data instanceof ArrayBuffer ? new Uint32Array(buf.data) : null));

    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleUp { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                * { box-sizing: border-box; }
            `}</style>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div style={{display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1}}>
                        <span style={titleStyle}>{label}</span>
                        <span style={typeStyle}>{type.toUpperCase()}</span>
                    </div>
                    <button style={closeButtonStyle} onClick={onClose}>×</button>
                </div>
                
                <div style={contentStyle}>
                    <div style={sectionStyle}>
                        <div style={sectionTitleStyle}>Properties</div>
                        <div style={propertyGridStyle}>
                            <PropertyItem label="UUID" value={uuid} />
                            <PropertyItem label="Size" value={formatBytes(size)} highlight />
                            <PropertyItem label="Usage" value={formatBufferUsage(usage)} />
                            {vertexCount !== undefined && <PropertyItem label="Vertex Count" value={vertexCount} />}
                            {stride !== undefined && <PropertyItem label="Stride" value={`${stride} bytes`} />}
                            {triangleCount !== undefined && <PropertyItem label="Triangle Count" value={triangleCount} />}
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <div style={{...sectionTitleStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>Buffer Data View</span>
                            {availableTabs.length > 1 && (
                                <div style={tabContainerStyle}>
                                    {availableTabs.map(tab => (
                                        <TabButton 
                                            key={tab}
                                            label={tab} 
                                            active={activeTab === tab} 
                                            onClick={() => setActiveTab(tab)} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={dataViewerStyle}>
                            <DataContent type={type} tab={activeTab} f32={dataViewF32} u32={dataViewU32} />
                        </div>
                    </div>
                </div>

                <div style={footerStyle}>
                    <div style={infoRowStyle}>
                        <span>Video Memory: <b style={{color: '#fdb48d'}}>{formatBytes(size)}</b></span>
                        <span style={{opacity: 0.5}}>Top 210 elements shown</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TabButton = ({label, active, onClick}: {label: string, active: boolean, onClick: () => void}) => (
    <button 
        style={{
            ...tabButtonStyle,
            background: active ? '#fdb48d' : 'transparent',
            color: active ? '#000' : '#888',
            fontSize: '9px'
        }}
        onClick={onClick}
    >
        {label}
    </button>
);

const DataContent = ({type, tab, f32, u32}: {type: string, tab: DataTab, f32: any, u32: any}) => {
    const limit = 210; // Multiple of 3
    
    if (tab === 'dataViewF32') {
        if (!f32) return <div style={noDataStyle}>dataViewF32 not available</div>;
        const items = Array.from(f32.subarray(0, limit)) as number[];
        return (
            <div style={dataGridStyle}>
                {items.map((v, i) => (
                    <div key={i} style={dataItemStyle}>
                        <span style={indexLabelStyle}>{i}</span>
                        <span style={valueLabelStyle}>{v.toFixed(4)}</span>
                    </div>
                ))}
                {f32.length > limit && <div style={moreStyle}>... and {f32.length - limit} more</div>}
            </div>
        );
    }

    if (tab === 'dataViewU32') {
        if (!u32) return <div style={noDataStyle}>dataViewU32 not available</div>;
        const items = Array.from(u32.subarray(0, limit)) as number[];

        // Specialized view for IndexBuffer: Group by 3 (Triangles)
        if (type === 'indexBuffer') {
            const groups = [];
            for (let i = 0; i < items.length; i += 3) {
                groups.push(items.slice(i, i + 3));
            }

            return (
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', overflowX: 'hidden'}}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                        gap: '4px',
                        width: '100%'
                    }}>
                        {groups.map((group, groupIdx) => (
                            <div key={groupIdx} style={{...triangleGroupStyle, marginBottom: 0}}>
                                <div style={triangleLabelStyle}>T{groupIdx}</div>
                                <div style={{display: 'flex', gap: '4px', flex: 1, justifyContent: 'space-around'}}>
                                    {group.map((v, i) => (
                                        <div key={i} style={triangleItemStyle}>
                                            <span style={valueLabelStyle}>{v}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {u32.length > limit && <div style={moreStyle}>... and {u32.length - limit} more</div>}
                </div>
            );
        }

        return (
            <div style={dataGridStyle}>
                {items.map((v, i) => (
                    <div key={i} style={dataItemStyle}>
                        <span style={indexLabelStyle}>{i}</span>
                        <span style={valueLabelStyle}>{v}</span>
                    </div>
                ))}
                {u32.length > limit && <div style={moreStyle}>... and {u32.length - limit} more</div>}
            </div>
        );
    }

    return null;
};

const PropertyItem = ({label, value, highlight}: {label: string, value: any, highlight?: boolean}) => (
    <div style={propertyItemStyle}>
        <span style={propertyLabelStyle}>{label}</span>
        <span style={{...propertyValueStyle, color: highlight ? '#fdb48d' : '#eee'}}>{value}</span>
    </div>
);

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
    alignItems: 'flex-start',
    gap: '12px'
};

const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block'
};

const typeStyle: React.CSSProperties = {
    fontSize: '10px',
    color: '#777',
    fontWeight: 'bold',
    letterSpacing: '0.1em'
};

const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '28px',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: '1',
    marginTop: '-4px',
    flexShrink: 0
};

const contentStyle: React.CSSProperties = {
    padding: '20px',
    overflowY: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
};

const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#fdb48d',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(253, 180, 141, 0.2)',
    paddingBottom: '4px'
};

const propertyGridStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
};

const propertyItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    gap: '20px'
};

const propertyLabelStyle: React.CSSProperties = {
    color: '#888',
    flexShrink: 0
};

const propertyValueStyle: React.CSSProperties = {
    color: '#eee',
    textAlign: 'right',
    wordBreak: 'break-all'
};

const dataViewerStyle: React.CSSProperties = {
    background: '#000',
    borderRadius: '4px',
    padding: '12px',
    minHeight: '200px',
    maxHeight: '400px',
    overflowY: 'auto',
    overflowX: 'hidden',
    border: '1px solid rgba(255,255,255,0.05)',
    width: '100%'
};

const tabContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255,255,255,0.05)',
    padding: '2px',
    borderRadius: '4px'
};

const tabButtonStyle: React.CSSProperties = {
    border: 'none',
    padding: '2px 8px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const dataGridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px 8px',
    fontFamily: 'monospace',
    width: '100%'
};

const dataItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '70px',
    background: 'rgba(255,255,255,0.02)',
    padding: '4px',
    borderRadius: '2px',
    border: '1px solid rgba(255,255,255,0.05)'
};

const indexLabelStyle: React.CSSProperties = {
    fontSize: '8px',
    color: '#555',
    marginBottom: '2px'
};

const valueLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#10b981'
};

const noDataStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
    color: '#444',
    fontSize: '12px'
};

const moreStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center',
    padding: '10px',
    color: '#444',
    fontSize: '10px',
    fontStyle: 'italic'
};

const footerStyle: React.CSSProperties = {
    padding: '16px',
    background: 'rgba(255,255,255,0.03)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '11px',
    color: '#666'
};

const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const triangleGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.03)',
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.05)',
    marginBottom: '2px'
};

const triangleLabelStyle: React.CSSProperties = {
    fontSize: '9px',
    color: '#fdb48d',
    fontWeight: 'bold',
    minWidth: '24px',
    opacity: 0.7
};

const triangleItemStyle: React.CSSProperties = {
    minWidth: '30px',
    textAlign: 'center'
};

export default BufferDetailModal;
