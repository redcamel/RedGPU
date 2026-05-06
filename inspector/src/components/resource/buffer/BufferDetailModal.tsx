import React, {useEffect, useState} from 'react';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber, formatBufferUsage} from '../../../utils/format';
import {useInspectorStore} from '../../../store';
import {readGPUBufferToCPU} from '../../../utils/bufferReadback';

type DataTab = 'dataViewF32' | 'dataViewU32' | 'data';

/**
 * [KO] 버퍼 리소스의 상세 정보를 표시하는 모달 컴포넌트입니다.
 */
const BufferDetailModal = ({item, type, onClose}: { item: any, type: string, onClose: () => void }) => {
    const {redGPUContext} = useInspectorStore();
    const [liveData, setLiveData] = useState<ArrayBuffer | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const buf = item.buffer || item;
    const isRaw = item.isRaw;
    const gpuBuffer = buf?.gpuBuffer as GPUBuffer;

    // Determine available tabs based on type
    const availableTabs: DataTab[] = [];
    if (type === 'indexBuffer') {
        availableTabs.push('dataViewU32');
    } else if (type === 'vertexBuffer') {
        availableTabs.push('dataViewF32');
    } else if (type === 'uniformBuffer' || type === 'storageBuffer' || type === 'gpuBuffer') {
        // For General-purpose buffers, 'data' is the primary combined view
        availableTabs.push('data');
    } else {
        availableTabs.push('data', 'dataViewF32', 'dataViewU32');
    }

    const [activeTab, setActiveTab] = useState<DataTab>(availableTabs[0]);

    useEffect(() => {
        const fetchBufferData = async () => {
            if (redGPUContext && gpuBuffer) {
                const canRead = !!(gpuBuffer.usage & GPUBufferUsage.COPY_SRC);
                if (canRead) {
                    const data = await readGPUBufferToCPU(redGPUContext.gpuDevice, gpuBuffer);
                    if (data) {
                        setLiveData(data);
                        setIsLive(true);
                        setIsLoading(false);
                        return;
                    }
                }
            }

            const localData = buf?.data instanceof ArrayBuffer ? buf.data : (buf?.data?.buffer instanceof ArrayBuffer ? buf.data.buffer : null);
            if (localData) {
                setLiveData(localData.slice(0));
            }
            setIsLive(false);
            setIsLoading(false);
        };

        fetchBufferData();
    }, [redGPUContext, gpuBuffer, buf?.data]);

    const label = isRaw ? item.label : (item.label || 'Unnamed Buffer');
    const uuid = item.uuid;
    const size = isRaw ? item.size : (buf?.size || 0);
    const usage = isRaw ? item.usage : buf?.usage;

    const vertexCount = buf?.vertexCount;
    const stride = buf?.stride;
    const triangleCount = buf?.triangleCount;
    const interleavedStruct = buf?.interleavedStruct;
    const dataObjectType = isRaw ? 'GPUBuffer' : (buf?.data?.constructor.name || 'Unknown');

    const dataViewF32 = liveData ? new Float32Array(liveData) : null;
    const dataViewU32 = liveData ? new Uint32Array(liveData) : null;

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
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span style={titleStyle}>{label}</span>
                            <div style={{
                                ...statusBadgeStyle,
                                background: isLive ? '#10b981' : '#666'
                            }}>
                                {isLive ? 'LIVE GPU' : 'LOCAL CACHE'}
                            </div>
                        </div>
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
                            <PropertyItem label="Data Object" value={dataObjectType} />
                            <PropertyItem label="Usage" value={formatBufferUsage(usage)} />
                            {vertexCount !== undefined && <PropertyItem label="Vertex Count" value={formatNumber(vertexCount, 0)} />}
                            {stride !== undefined && <PropertyItem label="Stride" value={`${formatNumber(stride, 0)} elements`} />}
                            {triangleCount !== undefined && <PropertyItem label="Triangle Count" value={formatNumber(triangleCount, 0)} />}
                        </div>
                    </div>

                    {type === 'vertexBuffer' && interleavedStruct && (
                        <div style={sectionStyle}>
                            <div style={sectionTitleStyle}>Interleaved Structure</div>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                {interleavedStruct.attributes.map((attr: any, i: number) => (
                                    <div key={i} style={structRowStyle}>
                                        <span style={structNameStyle}>{attr.attributeName}</span>
                                        <div style={{display: 'flex', gap: '10px', fontSize: '9px', color: '#888'}}>
                                            <span>Loc: <b style={{color: '#eee'}}>{formatNumber(attr.shaderLocation, 0)}</b></span>
                                            <span>Offset: <b style={{color: '#eee'}}>{formatNumber(attr.offset, 0)}</b></span>
                                            <span>Format: <b style={{color: '#fdb48d'}}>{attr.format}</b></span>
                                        </div>
                                    </div>
                                ))}
                                <div style={{marginTop: '4px', fontSize: '9px', color: '#666', textAlign: 'right'}}>
                                    Total Array Stride: <b>{formatNumber(interleavedStruct.arrayStride, 0)} bytes</b>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={sectionStyle}>
                        <div style={{...sectionTitleStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>Buffer Data View</span>
                            {availableTabs.length > 1 && (
                                <div style={tabContainerStyle}>
                                    {availableTabs.map(tab => (
                                        <TabButton 
                                            key={tab}
                                            label={tab === 'data' ? 'data (Raw)' : tab} 
                                            active={activeTab === tab} 
                                            onClick={() => setActiveTab(tab)} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div style={dataViewerStyle}>
                            {isLoading ? (
                                <div style={noDataStyle}>Loading data from GPU...</div>
                            ) : (
                                <DataContent 
                                    type={type} 
                                    tab={activeTab} 
                                    f32={dataViewF32} 
                                    u32={dataViewU32} 
                                    raw={liveData}
                                    stride={stride} 
                                    interleavedStruct={interleavedStruct}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div style={footerStyle}>
                    <div style={infoRowStyle}>
                        <span>Video Memory: <b style={{color: '#fdb48d'}}>{formatBytes(size)}</b></span>
                        <span style={{opacity: 0.5}}>Top {formatNumber(210, 0)} elements shown</span>
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

const DataContent = ({type, tab, f32, u32, raw, stride, interleavedStruct}: {type: string, tab: DataTab, f32: any, u32: any, raw: any, stride?: number, interleavedStruct?: any}) => {
    const limit = 300; 
    
    if (tab === 'dataViewF32') {
        if (!f32) return <div style={noDataStyle}>dataViewF32 not available</div>;
        const items = Array.from(f32.subarray(0, limit)) as number[];

        if (type === 'vertexBuffer' && stride) {
            const attrInfo = interleavedStruct ? interleavedStruct.attributes.map((attr: any, idx: number, arr: any[]) => {
                const nextOffset = arr[idx + 1] ? arr[idx + 1].offset : interleavedStruct.arrayStride;
                return {
                    name: attr.attributeName.replace('vertex', ''),
                    count: (nextOffset - attr.offset) / 4,
                    offset: attr.offset / 4
                };
            }) : null;

            const groups = [];
            for (let i = 0; i < items.length; i += stride) {
                groups.push(items.slice(i, i + stride));
            }

            return (
                <div style={{display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', overflowX: 'hidden'}}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2px', width: '100%' }}>
                        {groups.map((group, groupIdx) => (
                            <div key={groupIdx} style={{
                                ...triangleGroupStyle, 
                                background: groupIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.07)',
                                marginBottom: 0, 
                                padding: '6px 8px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{...triangleLabelStyle, color: '#10b981', minWidth: '35px', marginTop: '14px'}}>V{formatNumber(groupIdx, 0)}</div>
                                <div style={{display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap'}}>
                                    {attrInfo ? attrInfo.map((info: any) => (
                                        <div key={info.name} style={attrBlockStyle}>
                                            <div style={attrBlockLabelStyle}>{info.name}</div>
                                            <div style={{display: 'flex', gap: '6px'}}>
                                                {group.slice(info.offset, info.offset + info.count).map((v: number, i: number) => (
                                                    <div key={i} style={{minWidth: '55px', textAlign: 'right'}}>
                                                        <span style={{...valueLabelStyle, fontSize: '10px'}}>{formatNumber(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                            {group.map((v, i) => (
                                                <div key={i} style={{minWidth: '60px', textAlign: 'right'}}>
                                                    <span style={{...valueLabelStyle, fontSize: '10px'}}>{formatNumber(v)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {f32.length > limit && <div style={moreStyle}>... and {formatNumber(f32.length - limit, 0)} more</div>}
                </div>
            );
        }

        return (
            <div style={dataGridStyle}>
                {items.map((v, i) => (
                    <div key={i} style={dataItemStyle}>
                        <span style={indexLabelStyle}>{formatNumber(i, 0)}</span>
                        <span style={valueLabelStyle}>{formatNumber(v)}</span>
                    </div>
                ))}
                {f32.length > limit && <div style={moreStyle}>... and {formatNumber(f32.length - limit, 0)} more</div>}
            </div>
        );
    }

    if (tab === 'dataViewU32') {
        if (!u32) return <div style={noDataStyle}>dataViewU32 not available</div>;
        const items = Array.from(u32.subarray(0, limit)) as number[];

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
                            <div key={groupIdx} style={{
                                ...triangleGroupStyle, 
                                background: groupIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.07)',
                                marginBottom: 0
                            }}>
                                <div style={triangleLabelStyle}>T{formatNumber(groupIdx, 0)}</div>
                                <div style={{display: 'flex', gap: '4px', flex: 1, justifyContent: 'space-around'}}>
                                    {group.map((v, i) => (
                                        <div key={i} style={triangleItemStyle}>
                                            <span style={valueLabelStyle}>{formatNumber(v, 0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    {u32.length > limit && <div style={moreStyle}>... and {formatNumber(u32.length - limit, 0)} more</div>}
                </div>
            );
        }

        return (
            <div style={dataGridStyle}>
                {items.map((v, i) => (
                    <div key={i} style={dataItemStyle}>
                        <span style={indexLabelStyle}>{formatNumber(i, 0)}</span>
                        <span style={valueLabelStyle}>{formatNumber(v, 0)}</span>
                    </div>
                ))}
                {u32.length > limit && <div style={moreStyle}>... and {formatNumber(u32.length - limit, 0)} more</div>}
            </div>
        );
    }

    if (tab === 'data') {
        if (!raw) return <div style={noDataStyle}>ArrayBuffer not available</div>;
        const f32View = new Float32Array(raw);
        const u32View = new Uint32Array(raw);
        const wordLimit = 100; 
        const count = Math.min(f32View.length, wordLimit);
        
        return (
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px', width: '100%'}}>
                <div style={wordHeaderStyle}>
                    <span style={{width: '50px'}}>Offset</span>
                    <span style={{flex: 1}}>Float32</span>
                    <span style={{flex: 1}}>Uint32</span>
                </div>
                {Array.from({length: count}).map((_, i) => (
                    <div key={i} style={{
                        ...wordRowStyle,
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)'
                    }}>
                        <span style={wordOffsetStyle}>+{formatNumber(i * 4, 0)}</span>
                        <span style={wordValueStyle}>{formatNumber(f32View[i])}</span>
                        <span style={{...wordValueStyle, color: '#aaa'}}>{formatNumber(u32View[i], 0)}</span>
                    </div>
                ))}
                {f32View.length > wordLimit && <div style={moreStyle}>... and {formatNumber(f32View.length - wordLimit, 0)} words more</div>}
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

const statusBadgeStyle: React.CSSProperties = {
    fontSize: '8px',
    color: '#000',
    padding: '2px 6px',
    borderRadius: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
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
    fontSize: '11px', gap: '20px'
};

const propertyLabelStyle: React.CSSProperties = {
    color: '#888', flexShrink: 0
};

const propertyValueStyle: React.CSSProperties = {
    color: '#eee', textAlign: 'right', wordBreak: 'break-all'
};

const dataViewerStyle: React.CSSProperties = {
    background: '#000', borderRadius: '4px', padding: '12px', minHeight: '200px', maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', border: '1px solid rgba(255,255,255,0.05)', width: '100%'
};

const tabContainerStyle: React.CSSProperties = {
    display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px', borderRadius: '4px'
};

const tabButtonStyle: React.CSSProperties = {
    border: 'none', padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s'
};

const dataGridStyle: React.CSSProperties = {
    display: 'flex', flexWrap: 'wrap', gap: '4px 8px', fontFamily: 'monospace', width: '100%'
};

const dataItemStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', minWidth: '70px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.05)'
};

const indexLabelStyle: React.CSSProperties = {
    fontSize: '8px', color: '#555', marginBottom: '2px'
};

const valueLabelStyle: React.CSSProperties = {
    fontSize: '11px', color: '#10b981'
};

const noDataStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', color: '#444', fontSize: '12px'
};

const moreStyle: React.CSSProperties = {
    width: '100%', textAlign: 'center', padding: '10px', color: '#444', fontSize: '10px', fontStyle: 'italic'
};

const footerStyle: React.CSSProperties = {
    padding: '16px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#666'
};

const infoRowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

const triangleGroupStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2px'
};

const triangleLabelStyle: React.CSSProperties = {
    fontSize: '9px', color: '#fdb48d', fontWeight: 'bold', minWidth: '24px', opacity: 0.7
};

const triangleItemStyle: React.CSSProperties = {
    minWidth: '30px', textAlign: 'center'
};

const structRowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)'
};

const structNameStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 'bold', color: '#ddd'
};

const attrBlockStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(255,255,255,0.03)', padding: '4px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)'
};

const attrBlockLabelStyle: React.CSSProperties = {
    fontSize: '8px', color: '#888', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2px', marginBottom: '2px'
};

const wordHeaderStyle: React.CSSProperties = {
    display: 'flex', padding: '4px 10px', fontSize: '9px', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '4px'
};

const wordRowStyle: React.CSSProperties = {
    display: 'flex', padding: '4px 10px', borderRadius: '2px', gap: '10px', fontFamily: 'monospace', alignItems: 'center'
};

const wordOffsetStyle: React.CSSProperties = {
    width: '50px', fontSize: '9px', color: '#666'
};

const wordValueStyle: React.CSSProperties = {
    flex: 1, fontSize: '11px', color: '#10b981'
};

export default BufferDetailModal;
