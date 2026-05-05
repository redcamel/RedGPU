import React from 'react';
import { useInspectorStore } from '../store';

/**
 * [KO] RedGPUContext의 상세 정보를 표시하는 컴포넌트입니다.
 * [EN] Component that displays detailed information about RedGPUContext.
 */
const RedGPUContextView = () => {
    const redGPUContext = useInspectorStore(state => state.redGPUContext);

    if (!redGPUContext) {
        return <div style={placeholderStyle}>RedGPUContext not initialized</div>;
    }

    const detector = redGPUContext.detector;
    const adapterInfo = detector.adapterInfo;
    const canvas = redGPUContext.htmlCanvas;

    return (
        <div style={containerStyle}>
            <Section title="Adapter Info">
                <StatItem label="Vendor" value={adapterInfo.vendor} />
                <StatItem label="Architecture" value={adapterInfo.architecture} />
                <StatItem label="Device" value={adapterInfo.device} />
                <StatItem label="Description" value={adapterInfo.description} />
                <StatItem label="Fallback" value={detector.isFallbackAdapter ? 'Yes' : 'No'} />
            </Section>

            <Section title="Canvas Info">
                <StatItem label="Width" value={canvas.width} />
                <StatItem label="Height" value={canvas.height} />
                <StatItem label="Alpha Mode" value={redGPUContext.alphaMode} />
                <StatItem label="Display" value={`${canvas.clientWidth} x ${canvas.clientHeight}`} />
            </Section>

            <Section title="Environment">
                <StatItem label="Mobile" value={detector.isMobile ? 'Yes' : 'No'} />
                <div style={userAgentStyle}>
                    <div style={labelStyle}>User Agent</div>
                    <div style={userAgentValueStyle}>{detector.userAgent}</div>
                </div>
            </Section>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>{title}</div>
        {children}
    </div>
);

const StatItem = ({ label, value, color = '#ccc' }: { label: string, value: any, color?: string }) => (
    <div style={itemStyle}>
        <span style={labelStyle}>{label}</span>
        <span style={{ ...valueStyle, color }}>{value || 'N/A'}</span>
    </div>
);

// Styles
const containerStyle: React.CSSProperties = {
    padding: '12px'
};

const sectionStyle: React.CSSProperties = {
    marginBottom: '16px'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#fdb48d',
    marginBottom: '8px',
    fontWeight: 'bold',
    borderBottom: '1px solid rgba(253, 180, 141, 0.2)',
    paddingBottom: '4px'
};

const itemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '11px'
};

const labelStyle: React.CSSProperties = {
    color: '#888'
};

const valueStyle: React.CSSProperties = {
    color: '#ccc',
    textAlign: 'right',
    wordBreak: 'break-all',
    marginLeft: '10px'
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
