import React from 'react';
import { useInspectorStore, ResourceStatusSummary } from '../store';
import Section from './commonUI/Section';
import StatItem from './commonUI/StatItem';
import formatBytes from '@redgpu/src/utils/formatBytes';

/**
 * [KO] 리소스 유형별 요약 정보를 표시하는 컴포넌트입니다.
 */
const ResourceSummary = ({ label, stats }: { label: string, stats: ResourceStatusSummary }) => (
    <div style={summaryContainerStyle}>
        <div style={summaryLabelStyle}>{label}</div>
        <div style={summaryValuesStyle}>
            <StatItem label="Count" value={stats.count} />
            <StatItem label="Memory" value={formatBytes(stats.videoMemory)} color="#fdb48d" isBold />
        </div>
    </div>
);

/**
 * [KO] 엔진에서 관리하는 리소스 현황을 표시하는 컴포넌트입니다.
 * [EN] Component that displays the status of resources managed by the engine.
 */
const ResourcesView = () => {
    const { resourceStats } = useInspectorStore();

    return (
        <>
            <Section title="Texture Resources">
                <ResourceSummary label="Bitmap Textures" stats={resourceStats.bitmapTexture} />
                <ResourceSummary label="Cube Textures" stats={resourceStats.cubeTexture} />
                <ResourceSummary label="HDR Textures" stats={resourceStats.hdrTexture} />
            </Section>

            <Section title="Buffer Resources">
                <ResourceSummary label="Uniform Buffers" stats={resourceStats.uniformBuffer} />
                <ResourceSummary label="Vertex Buffers" stats={resourceStats.vertexBuffer} />
                <ResourceSummary label="Index Buffers" stats={resourceStats.indexBuffer} />
                <ResourceSummary label="Storage Buffers" stats={resourceStats.storageBuffer} />
                <ResourceSummary label="Raw GPU Buffers" stats={resourceStats.gpuBuffer} />
            </Section>
        </>
    );
};

const summaryContainerStyle: React.CSSProperties = {
    padding: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '4px'
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

export default ResourcesView;
