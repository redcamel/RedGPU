import React from 'react';
import Section from "../common/Section";
import StatItem from "../common/StatItem";
import View3D from "@redgpu/src/display/view/View3D";

/**
 * [KO] 특정 뷰의 톤 매핑 설정을 표시하는 컴포넌트입니다.
 * [EN] Component that displays tone mapping settings for a specific view.
 */
const ToneMappingView = ({view}: { view: View3D }) => {
    const {toneMappingManager} = view;
    if (!toneMappingManager) return null;

    return (
        <>
            <div style={{fontSize: '10px', color: '#666', fontWeight: 'bold', marginBottom: '4px', marginTop: '4px'}}>TONE MAPPING</div>
            <StatItem label="Mode" value={toneMappingManager.mode}/>
            <StatItem label="Contrast" value={toneMappingManager.contrast.toFixed(2)}/>
            <StatItem label="Brightness" value={toneMappingManager.brightness.toFixed(2)}/>
        </>
    );
};

export default ToneMappingView;
