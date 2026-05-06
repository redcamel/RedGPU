import React from 'react';
import {ResourceStatusSummary} from '../../../store';
import StatItem from '../../common/StatItem';
import formatBytes from '@redgpu/src/utils/formatBytes';
import {formatNumber} from '../../../utils/format';

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
    <div
        style={{
            ...summaryContainerStyle,
            cursor: 'pointer',
            borderLeft: isExpanded ? '2px solid #fdb48d' : '2px solid transparent',
            background: isExpanded ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.03)',
        }}
        onClick={onToggle}
    >
        <div style={summaryLabelStyle}>
            {label}
            <span style={{float: 'right', opacity: 0.5, fontSize: '10px'}}>
                {isExpanded ? '▲' : '▼'}
            </span>
        </div>
        <div style={summaryValuesStyle}>
            <StatItem label="Count" value={formatNumber(stats.count, 0)}/>
            <StatItem label="Memory" value={formatBytes(stats.videoMemory)} color="#fdb48d" isBold/>
        </div>
    </div>
);

const summaryContainerStyle: React.CSSProperties = {
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '4px',
    marginBottom: '2px',
    transition: 'all 0.1s'
};

const summaryLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#aaa',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const summaryValuesStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
};
