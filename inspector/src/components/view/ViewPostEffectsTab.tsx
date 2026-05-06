import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatBoolItem from "../common/StatBoolItem";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";
import PropertyInspector from "../common/PropertyInspector";
import {COMMON_STYLES} from "../common/Theme";

/**
 * [KO] 뷰의 후처리 효과 설정을 표시하는 탭 컴포넌트입니다.
 * [EN] Tab component that displays the post-processing effect settings of a view.
 */
const ViewPostEffectsTab = ({view}: { view: View3D }) => {
    const {redGPUContext} = useInspectorStore();
    const {postEffectManager, rawCamera} = view;

    if (!postEffectManager) {
        return <div style={placeholderStyle}>PostEffectManager not available</div>;
    }

    const {antialiasingManager} = redGPUContext;

    return (
        <>
            <Section title="General">
                <StatItem label="videoMemorySize" value={formatBytes(postEffectManager.videoMemorySize)}/>
            </Section>

            <Section title="Built-in Effects">
                <StatBoolItem label="useFXAA" value={antialiasingManager.useFXAA}/>
                <StatBoolItem label="useTAA" value={antialiasingManager.useTAA}/>
                <StatBoolItem label="useSSAO" value={postEffectManager.useSSAO}/>
                <StatBoolItem label="useSSR" value={postEffectManager.useSSR}/>
                <StatBoolItem label="Auto Exposure" value={rawCamera.useAutoExposure}/>
                <StatBoolItem label="Sky Atmosphere" value={!!view.skyAtmosphere}/>
            </Section>

            <Section title={`Custom Effects (${postEffectManager.effectList.length})`}>
                {postEffectManager.effectList.map((effect: any, i: number) => (
                    <CollapsibleEffect key={i} effect={effect}/>
                ))}
                {postEffectManager.effectList.length === 0 && (
                    <div style={placeholderStyle}>No custom effects added.</div>
                )}
            </Section>
        </>
    );
};

/**
 * [KO] 개별 효과를 접고 펼칠 수 있는 컴포넌트입니다.
 * [EN] Component that can expand and collapse individual effects.
 */
const CollapsibleEffect = ({effect}: { effect: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={effectContainerStyle}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={effectHeaderStyle}
            >
                <span style={COMMON_STYLES.toggleButton}>{isExpanded ? '-' : '+'}</span>
                <span style={effectNameStyle}>{effect.constructor.name || 'Unknown Effect'}</span>
            </div>
            {isExpanded && (
                <div style={effectContentStyle}>
                    <PropertyInspector target={effect}/>
                </div>
            )}
        </div>
    );
};

// Styles
const placeholderStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#666',
    fontStyle: 'italic'
};

const effectContainerStyle: React.CSSProperties = {
    marginBottom: '8px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '4px'
};

const effectHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: '12px'
};

const effectNameStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#ddd'
};

const effectContentStyle: React.CSSProperties = {
    padding: '8px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
};

export default ViewPostEffectsTab;
