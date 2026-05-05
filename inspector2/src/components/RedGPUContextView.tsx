import React from 'react';
import { useInspectorStore } from '../store';
import Section from "./commonUI/Section";
import StatItem from "./commonUI/StatItem";
import StatRGBAItem from "./commonUI/StatRGBAItem";
import StatBoolItem from "./commonUI/StatBoolItem";


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
            <Section title="Adapter Info">
                <StatItem label="Vendor" value={adapterInfo.vendor} />
                <StatItem label="Architecture" value={adapterInfo.architecture} />
                <StatItem label="Device" value={adapterInfo.device} />
                <StatItem label="Description" value={adapterInfo.description} />
                <StatBoolItem label="Fallback" value={detector.isFallbackAdapter} trueLabel="Yes" falseLabel="No" />
            </Section>

            <Section title="RedGPUContext Info">
                <StatItem label="Width" value={width} />
                <StatItem label="Height" value={height} />
                <StatItem label="pixelRectArray" value={`[${pixelRectArray.join(', ')}]`} color="#fdb48d" />
                <StatItem label="Canvas size" value={`${htmlCanvas.clientWidth} x ${htmlCanvas.clientHeight}`} />
                <StatItem label="Device Pixel Ratio" value={window.devicePixelRatio} />
                <StatItem label="renderScale" value={redGPUContext.renderScale} />
                <StatItem label="Alpha Mode" value={redGPUContext.alphaMode} />
                <StatRGBAItem label="backgroundColor" value={backgroundColor.rgba} />
            </Section>

            <Section title="Antialiasing">
                <StatBoolItem label="useMSAA" value={antialiasingManager.useMSAA} />
                <StatBoolItem label="useFXAA" value={antialiasingManager.useFXAA} />
                <StatBoolItem label="useTAA" value={antialiasingManager.useTAA} />
            </Section>

            <Section title="Environment">
                <StatItem label="devicePixelRatio" value={devicePixelRatio} />
                <StatBoolItem label="Mobile" value={detector.isMobile} trueLabel="Yes" falseLabel="No" />
                <div style={userAgentStyle}>
                    <div style={labelStyle}>User Agent</div>
                    <div style={userAgentValueStyle}>{detector.userAgent}</div>
                </div>
            </Section>
        </div>
    );
};

// Styles
const containerStyle: React.CSSProperties = {
    padding: '12px'
};

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
