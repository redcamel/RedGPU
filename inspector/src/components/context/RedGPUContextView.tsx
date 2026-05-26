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
                <StatItem label="devicePixelRatio" value={formatNumber(devicePixelRatio)}/>
                <StatBoolItem label="Mobile" value={detector.isMobile} trueLabel="Yes" falseLabel="No"/>
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
            <Section title="GPU Limits">
                {(() => {
                    const limits = detector.limits;
                    if (!limits) return <div style={labelStyle}>Limits not available</div>;
                    
                    const keys: string[] = [];
                    // [KO] GPUSupportedLimits의 속성들은 보통 enumerable하지 않으므로 프로토타입에서 가져옵니다.
                    // [EN] Since properties of GPUSupportedLimits are usually non-enumerable, get them from the prototype.
                    const proto = Object.getPrototypeOf(limits);
                    const allKeys = Object.getOwnPropertyNames(proto);
                    
                    return allKeys
                        .filter(key => typeof (limits as any)[key] === 'number')
                        .sort()
                        .map(key => {
                            const value = (limits as any)[key];
                            const formattedValue = formatNumber(value, 0);
                            const displayValue = key.toLowerCase().endsWith('size') 
                                ? `${formattedValue} (${formatBytes(value)})` 
                                : formattedValue;
                            return (
                                <StatItem key={key} label={key} value={displayValue} />
                            );
                        });
                })()}
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

const placeholderStyle: React.CSSProperties = {
    padding: '20px',
    textAlign: 'center',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic'
};

export default RedGPUContextView;
