import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatBoolItem from "../common/StatBoolItem";
import Divider from "../common/Divider";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";
import PropertyInspector from "../common/PropertyInspector";


/**
 * [KO] 뷰의 후처리 효과 설정을 표시하는 탭 컴포넌트입니다.
 */
const ViewPostEffectsTab = ({view}: { view: View3D }) => {
    const {redGPUContext} = useInspectorStore();
    const {postEffectManager, rawCamera} = view;

    if (!postEffectManager) {
        return <div style={{fontSize: '11px', color: '#666', fontStyle: 'italic'}}>PostEffectManager not available</div>;
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
                    <div style={{fontSize: '11px', color: '#666', fontStyle: 'italic'}}>No custom effects added.</div>
                )}
            </Section>
        </>
    );
};

const CollapsibleEffect = ({effect}: { effect: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{marginBottom: '8px', background: 'rgba(255,255,255,0.02)', borderRadius: '4px'}}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={effectHeaderStyle}
            >
                <span style={toggleButtonStyle}>{isExpanded ? '-' : '+'}</span>
                <span style={{fontWeight: 'bold', color: '#ddd'}}>{effect.constructor.name || 'Unknown Effect'}</span>
            </div>
            {isExpanded && (
                <div style={{padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                    <PropertyInspector target={effect}/>
                </div>
            )}
        </div>
    );
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

const toggleButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '14px',
    height: '14px',
    border: '1px solid #fdb48d',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fdb48d',
    lineHeight: '14px',
    background: 'rgba(0,0,0,0.3)',
    flexShrink: 0
};

export default ViewPostEffectsTab;
