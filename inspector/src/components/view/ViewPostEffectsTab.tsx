import React, {useState} from 'react';
import {useInspectorStore} from '../../store';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import StatBoolItem from "../common/StatBoolItem";
import formatBytes from "@redgpu/src/utils/formatBytes";
import View3D from "@redgpu/src/display/view/View3D";
import PropertyInspector from "../common/PropertyInspector";
import ToggleButton from "../common/ToggleButton";
import Divider from "../common/Divider";
import ToneMappingView from "./ToneMappingView";

/**
 * [KO] 뷰의 후처리 효과 설정을 표시하는 탭 컴포넌트입니다.
 * [EN] Tab component that displays the post-processing effect settings of a view.
 */
const ViewPostEffectsTab = ({view, lastUpdateTime}: { view: View3D, lastUpdateTime: number }) => {
    const {redGPUContext} = useInspectorStore();
    const {postEffectManager, rawCamera} = view;

    if (!postEffectManager) {
        return <div style={placeholderStyle}>PostEffectManager not available</div>;
    }

    const {antialiasingManager} = redGPUContext;
    const {texturePool} = postEffectManager;

    return (
        <>
            <Section title="General">
                <StatItem label="Video Memory Size" value={formatBytes(postEffectManager.videoMemorySize)}/>
                <StatItem label="Texture Pool (Total)" value={texturePool.totalCount}/>
                <StatItem label="Peak Concurrent" value={texturePool.peakActiveCount}/>
                <Divider/>
                <StatItem label="Pool Hit Rate" value={`${(texturePool.hitRate * 100).toFixed(1)}%`}/>
                <StatItem label="Total Allocations" value={texturePool.allocationCount}/>
                <Divider/>
                <div style={{fontSize: '11px', color: '#888', marginBottom: '4px', paddingLeft: '4px'}}>Pool Breakdown</div>
                {texturePool.getDetails().map((detail, index) => (
                    <div key={index} style={{
                        padding: '4px 8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '11px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{color: '#ddd', fontWeight: 'bold'}}>{detail.key}</div>
                        <div style={{color: '#aaa'}}>
                            <span>Total: {detail.total}</span>
                        </div>
                    </div>
                ))}
            </Section>

            <Section title="Built-in Effects">
                <StatBoolItem label="useFXAA" value={antialiasingManager.useFXAA}/>
                <StatBoolItem label="useTAA" value={antialiasingManager.useTAA}/>
                <StatBoolItem label="useSSAO" value={postEffectManager.useSSAO}/>
                <StatBoolItem label="useSSR" value={postEffectManager.useSSR}/>
                <StatBoolItem label="Auto Exposure" value={rawCamera.useAutoExposure}/>
                <StatBoolItem label="Sky Atmosphere" value={!!view.skyAtmosphere}/>
                <Divider/>
                <ToneMappingView view={view}/>
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
                <ToggleButton isExpanded={isExpanded} style={{marginRight: '8px'}}/>
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
