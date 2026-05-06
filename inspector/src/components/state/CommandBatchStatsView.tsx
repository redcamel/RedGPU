import React from 'react';
import {useInspectorStore} from '../../store';
import Section from '../common/Section';
import StatItem from '../common/StatItem';

/**
 * [KO] GPU 커맨드 배치 통계를 표시하는 컴포넌트입니다.
 * [EN] Component that displays GPU command batch statistics.
 */
const CommandBatchStatsView = () => {
    const commandBatchStats = useInspectorStore(state => state.commandBatchStats);

    if (!commandBatchStats || Object.keys(commandBatchStats).length === 0) {
        return null;
    }

    return (
        <>
            {Object.entries(commandBatchStats).map(([phase, stats]) => (
                <Section key={phase} title={`Command Batch: ${phase}`}>
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
            ))}
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

export default CommandBatchStatsView;
