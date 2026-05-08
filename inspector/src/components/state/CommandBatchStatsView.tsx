import React from 'react';
import {useInspectorStore} from '../../store';
import Section from '../common/Section';
import StatItem from '../common/StatItem';
import {CommandBatchStats} from "@redgpu/src/renderer/commandEncoder/CommandEncoderManager";

/**
 * [KO] GPU 커맨드 배치 통계를 표시하는 컴포넌트입니다.
 * [EN] Component that displays GPU command batch statistics.
 */
const CommandBatchStatsView = ({statsProp}: { statsProp?: CommandBatchStats | null }) => {
    const storeStats = useInspectorStore(state => state.commandBatchStats);
    const commandBatchStats = statsProp !== undefined ? statsProp : storeStats;

    if (!commandBatchStats || Object.keys(commandBatchStats).length === 0) {
        return <div style={noItemStyle}>No command batch stats available.</div>;
    }

    return (
        <>
            {Object.entries(commandBatchStats).map(([phase, stats]) => {
                const totalPasses = stats['Render Passes'].count + stats['Compute Passes'].count;
                return (
                    <Section 
                        key={phase} 
                        title={`Batch: ${phase}`}
                        subTitle={`${stats['Command Buffers']} Buffers, ${totalPasses} Passes`}
                    >
                        <StatItem label="Command Buffers" value={stats['Command Buffers']}/>
                    <StatItem label="Render Passes" value={stats['Render Passes'].count}/>
                    {stats['Render Passes'].list.length > 0 && (
                        <div style={listStyle}>
                            {stats['Render Passes'].list.map((name, i) => (
                                <div key={i} style={listItemStyle}>- {name}</div>
                            ))}
                        </div>
                    )}
                    <StatItem label="Compute Passes" value={stats['Compute Passes'].count}/>
                    {stats['Compute Passes'].list.length > 0 && (
                        <div style={listStyle}>
                            {stats['Compute Passes'].list.map((name, i) => (
                                <div key={i} style={listItemStyle}>- {name}</div>
                            ))}
                        </div>
                    )}
                    <StatItem label="Raw Usages" value={stats['Raw Usages']}/>
                </Section>
            )})}
        </>
    );
};
const listStyle: React.CSSProperties = {
    paddingLeft: '12px',
    marginBottom: '8px',
    fontSize: '11px',
    lineHeight: '1.4',
    color: '#666'
};

const listItemStyle: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
};

const noItemStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: '10px',
    color: '#666',
    fontStyle: 'italic'
};

export default CommandBatchStatsView;
