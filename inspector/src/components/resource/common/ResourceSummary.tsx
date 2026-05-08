import React from 'react';
import {ResourceStatusSummary} from '../../../store';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber} from '../../../utils/format';
import {THEME} from "../../common/Theme";
import ToggleButton from "../../common/ToggleButton";

/**
 * [KO] 리소스 유형별 요약 정보를 표시하는 컴포넌트입니다.
 */
export const ResourceSummary = ({
                                    label,
                                    stats,
                                    isExpanded,
                                    onToggle
                                }: {
    label: string,
    stats: ResourceStatusSummary,
    isExpanded: boolean,
    onToggle: () => void
}) => (
    <div style={{marginBottom: '4px'}}>
        <div
            style={headerStyle}
            onClick={onToggle}
        >
            <ToggleButton
                isExpanded={isExpanded}
                style={{paddingRight: '8px'}}
            />
            <div style={labelWrapperStyle}>
                <span style={labelStyle}>{label} <small
                    style={countStyle}>({formatNumber(stats.count, 0)})</small></span>
                <span style={memoryStyle}>{formatBytes(stats.videoMemory)}</span>
            </div>
        </div>
    </div>
);

const headerStyle: React.CSSProperties = {
    padding: '8px 12px',
    background: '#222',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    borderLeft: `2px solid ${THEME.colors.primary}`,
    transition: 'background 0.2s',
};

const toggleWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '8px'
};

const labelWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center'
};

const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: '#eee'
};

const countStyle: React.CSSProperties = {
    color: '#888',
    fontWeight: 'normal',
    marginLeft: '4px'
};

const memoryStyle: React.CSSProperties = {
    fontSize: '11px',
    color: THEME.colors.primary,
    fontWeight: 'bold'
};
