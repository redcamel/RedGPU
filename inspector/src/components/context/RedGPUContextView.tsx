import React from 'react';
import {useInspectorStore} from '../../store';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatRGBAItem from "../common/StatRGBAItem";
import StatBoolItem from "../common/StatBoolItem";
import {formatNumber} from "../../utils/format";
import formatBytes from "@redgpu/src/utils/formatBytes";


/**
 * [KO] RedGPUContext의 상세 정보를 표시하는 컴포넌트입니다.
 * [EN] Component that displays detailed information about RedGPUContext.
 */
const RedGPUContextView = () => {
    const redGPUContext = useInspectorStore(state => state.redGPUContext);
    const pixelRectArray = useInspectorStore(state => state.pixelRectArray);

    if (!redGPUContext) {
        return <div style={placeholderStyle}>RedGPUContext not initialized</div>;
    }

    const {detector, htmlCanvas, width, height, backgroundColor, antialiasingManager} = redGPUContext;
    const adapterInfo = detector.adapterInfo;

    return (
        <div style={containerStyle}>

            <Section title="RedGPUContext Info">
                <StatItem label="Width" value={formatNumber(width)}/>
                <StatItem label="Height" value={formatNumber(height)}/>
                <StatItem label="pixelRectArray" value={`[${pixelRectArray.map(v => formatNumber(v, 0)).join(', ')}]`} color="#fdb48d"/>
                <StatItem label="Canvas size" value={`${formatNumber(htmlCanvas.clientWidth, 0)} x ${formatNumber(htmlCanvas.clientHeight, 0)}`}/>
                <StatItem label="Device Pixel Ratio" value={formatNumber(window.devicePixelRatio)}/>
                <StatItem label="renderScale" value={formatNumber(redGPUContext.renderScale)}/>
                <StatItem label="Alpha Mode" value={redGPUContext.alphaMode}/>
                <StatRGBAItem label="backgroundColor" value={backgroundColor.rgba}/>
            </Section>

            <Section title="Antialiasing">
                <StatBoolItem label="useMSAA" value={antialiasingManager.useMSAA}/>
                <StatBoolItem label="useFXAA" value={antialiasingManager.useFXAA}/>
                <StatBoolItem label="useTAA" value={antialiasingManager.useTAA}/>
            </Section>

            <Section title="Environment">
                <StatItem label="Platform" value={detector.isIOS ? 'iOS' : detector.isAndroid ? 'Android' : detector.isMobile ? 'Mobile' : 'Desktop'}/>
                <StatItem label="Browser" value={detector.isChromium ? 'Chromium' : detector.isSafari ? 'Safari' : detector.isFirefox ? 'Firefox' : 'Unknown'}/>
                <StatItem label="CPU Cores" value={detector.hardwareConcurrency}/>
                <StatItem label="Device Memory" value={`~${detector.deviceMemory}GB`}/>
                <div style={userAgentStyle}>
                    <div style={labelStyle}>User Agent</div>
                    <div style={userAgentValueStyle}>{detector.userAgent}</div>
                </div>
            </Section>

            <Section title="Adapter Info">
                <StatItem label="Vendor" value={adapterInfo.vendor}/>
                <StatItem label="Architecture" value={adapterInfo.architecture}/>
                <StatItem label="Device" value={adapterInfo.device}/>
                <StatItem label="Description" value={adapterInfo.description}/>
                <StatBoolItem label="Fallback" value={detector.isFallbackAdapter} trueLabel="Yes" falseLabel="No"/>
            </Section>

            <Section title="GPU Features">
                <table style={tableStyle}>
                    <thead>
                    <tr>
                        <th style={{...thStyle, width: '34%'}}>Feature Name</th>
                        <th style={{...thStyle, textAlign: 'right', width: '33%'}}>Supported</th>
                        <th style={{...thStyle, textAlign: 'right', width: '33%'}}>Active</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(() => {
                        const allKnownFeatures = [
                            "core-features-and-limits", "depth-clip-control", "depth32float-stencil8",
                            "texture-compression-bc", "texture-compression-bc-sliced-3d", "texture-compression-etc2",
                            "texture-compression-astc", "texture-compression-astc-sliced-3d", "timestamp-query",
                            "indirect-first-instance", "shader-f16", "rg11b10ufloat-renderable",
                            "bgra8unorm-storage", "float32-filterable", "float32-blendable", "clip-distances",
                            "dual-source-blending", "subgroups", "texture-formats-tier1", "texture-formats-tier2",
                            "primitive-index", "texture-component-swizzle"
                        ];

                        const allSupportedKeys = Object.keys(detector.supportedFeatures);
                        const extraFeatures = allSupportedKeys.filter(f => !allKnownFeatures.includes(f));
                        const finalFeatureList = [...allKnownFeatures, ...extraFeatures.sort()];

                        return finalFeatureList.map(feature => {
                            const supported = !!detector.supportedFeatures[feature];
                            const active = !!detector.activeFeatures[feature];

                            return (
                                <tr key={feature}>
                                    <td style={{...tdStyle, color: supported ? '#aaa' : '#555', whiteSpace: 'nowrap'}}>{feature}</td>
                                    <td style={{...tdStyle, textAlign: 'right'}}>
                                        <span style={{
                                            ...badgeBaseStyle,
                                            backgroundColor: supported ? '#008000' : '#cc0000',
                                            opacity: supported ? 1 : 0.5
                                        }}>
                                            {supported ? 'YES' : 'NO'}
                                        </span>
                                    </td>
                                    <td style={{...tdStyle, textAlign: 'right'}}>
                                        {supported ? (
                                            <span style={{
                                                ...badgeBaseStyle,
                                                backgroundColor: active ? '#75e24a' : '#444',
                                                color: active ? '#000' : '#888'
                                            }}>
                                                {active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        ) : <span style={{color: '#444', fontSize: '9px'}}>-</span>}
                                    </td>
                                </tr>
                            );
                        });
                    })()}
                    </tbody>
                </table>
            </Section>

            <Section title="GPU Limits">
                <table style={tableStyle}>
                    <thead>
                    <tr>
                        <th style={{...thStyle, width: '34%'}}>Name</th>
                        <th style={{...thStyle, textAlign: 'right', width: '33%'}}>Max</th>
                        <th style={{...thStyle, textAlign: 'right', width: '33%'}}>Active</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(() => {
                        const sLimits = detector.supportedLimits;
                        const aLimits = detector.activeLimits;
                        if (!sLimits) return <tr><td colSpan={3} style={tdStyle}>Limits not available</td></tr>;

                        const proto = Object.getPrototypeOf(sLimits);
                        const allKeys = Object.getOwnPropertyNames(proto);

                        return allKeys
                            .filter(key => typeof (sLimits as any)[key] === 'number')
                            .sort()
                            .map(key => {
                                const sVal = (sLimits as any)[key];
                                const aVal = aLimits ? (aLimits as any)[key] : null;
                                const isSize = key.toLowerCase().endsWith('size');

                                const format = (val: number | null) => {
                                    if (val === null) return 'N/A';
                                    const formatted = formatNumber(val, 0);
                                    return isSize ? (
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end',lineHeight:1.2}}>
                                            <span style={{opacity:0.8}}>{formatted}</span>
                                            <span style={{fontSize: '12px'}}>{formatBytes(val)}</span>
                                        </div>
                                    ) : <span>{formatted}</span>;
                                };

                                const isRestricted = aVal !== null && aVal < sVal;

                                return (
                                    <tr key={key}>
                                        <td style={{
                                            ...tdStyle,
                                            color: '#aaa',
                                            whiteSpace: 'nowrap',
                                        }} title={key}>{key}</td>
                                        <td style={{
                                            ...tdStyle, 
                                            textAlign: 'right', 
                                            color: isRestricted ? '#fdb48d' : '#eee', 
                                            fontStyle: 'italic',
                                            fontWeight: isRestricted ? 'bold' : 'normal'
                                        }}>
                                            {format(sVal)}
                                        </td>
                                        <td style={{
                                            ...tdStyle, 
                                            textAlign: 'right',
                                            color: isRestricted ? '#75e24a' : '#eee', 
                                            fontWeight: isRestricted ? 'bold' : 'normal'
                                        }}>
                                            {format(aVal)}
                                        </td>
                                    </tr>
                                );
                            });
                    })()}
                    </tbody>
                </table>
            </Section>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {};

const labelStyle: React.CSSProperties = {
    color: '#888'
};

const userAgentStyle: React.CSSProperties = {
    marginTop: '8px',
    fontSize: '11px'
};

const userAgentValueStyle: React.CSSProperties = {
    color: '#666',
    marginTop: '4px',
    lineHeight: '1.4',
    wordBreak: 'break-all'
};

const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '11px',
    marginTop: '4px',
};

const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '4px 2px',
    color: '#888',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '10px'
};

const tdStyle: React.CSSProperties = {
    padding: '6px 2px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    verticalAlign: 'top',
    lineHeight: '1.2',
    fontSize: '11px'
};

const badgeBaseStyle: React.CSSProperties = {
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 'bold',
    lineHeight: 1,
    textTransform: 'uppercase'
};

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default RedGPUContextView;
