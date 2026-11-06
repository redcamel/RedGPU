import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useExampleHelperStore} from '../../store';
import '../styles/loading.css';

/**
 * [KO] 바이트 단위를 읽기 좋은 형식으로 변환합니다.
 */
const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * [KO] 리소스 로딩 진행 상태를 표시하는 컴포넌트입니다.
 * [EN] Component that displays resource loading progress.
 */
const LoadingUI: React.FC = () => {
    const loadingStates = useExampleHelperStore((state) => state.loadingStates);
    const clearLoadingStates = useExampleHelperStore((state) => state.clearLoadingStates);
    const [visible, setVisible] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const maxRatiosRef = useRef({model: 0, buffers: 0, textures: 0, total: 0});

    // 데이터 집계 (Aggregation)
    const totals = useMemo(() => {
        const t = {
            model: {loaded: 0, total: 0, hasActivity: false, allDone: true},
            buffers: {loaded: 0, total: 0, hasActivity: false, allDone: true},
            textures: {loaded: 0, total: 0, hasActivity: false, allDone: true}
        };

        const states = Object.values(loadingStates);
        if (states.length === 0) {
            t.model.allDone = false;
            t.buffers.allDone = false;
            t.textures.allDone = false;
            return t;
        }

        states.forEach((state) => {
            if (state.model) {
                t.model.hasActivity = true;
                const loaded = state.model.loaded || 0;
                const total = state.model.total || (state.model.percent === 100 ? loaded : 0);
                t.model.loaded += loaded;
                t.model.total += total;
                const isModelDone = state.model.percent === 100 || (total > 0 && loaded >= total);
                if (!isModelDone) t.model.allDone = false;
            } else {
                t.model.allDone = false;
            }

            if (state.buffers) {
                t.buffers.hasActivity = true;
                const loaded = state.buffers.loaded || 0;
                const total = state.buffers.total || 0;
                t.buffers.loaded += loaded;
                t.buffers.total += total;
                if (total > 0 && loaded < total) t.buffers.allDone = false;
            } else {
                // GLTF/GLB는 항상 getGLTFBuffersResources 단계를 거치므로 buffers가 아직 없으면 파싱 진행 중
                t.buffers.allDone = false;
            }

            if (state.textures) {
                t.textures.hasActivity = true;
                const loaded = state.textures.loaded || 0;
                const total = state.textures.total || 0;
                t.textures.loaded += loaded;
                t.textures.total += total;
                if (total > 0 && loaded < total) t.textures.allDone = false;
            }
        });
        return t;
    }, [loadingStates]);

    const rawMRatio = totals.model.total > 0
        ? Math.min(1, totals.model.loaded / totals.model.total)
        : (totals.model.allDone ? 1 : 0);
    const rawBRatio = totals.buffers.total > 0
        ? Math.min(1, totals.buffers.loaded / totals.buffers.total)
        : (totals.buffers.allDone ? 1 : 0);
    const rawTRatio = totals.textures.total > 0
        ? Math.min(1, totals.textures.loaded / totals.textures.total)
        : (totals.textures.hasActivity && totals.textures.allDone ? 1 : 0);

    const isAllFinished = useMemo(() => {
        const states = Object.values(loadingStates);
        if (states.length === 0) return false;
        return totals.model.allDone && totals.buffers.allDone && totals.textures.allDone;
    }, [loadingStates, totals]);

    if (Object.keys(loadingStates).length === 0) {
        maxRatiosRef.current.model = 0;
        maxRatiosRef.current.buffers = 0;
        maxRatiosRef.current.textures = 0;
        maxRatiosRef.current.total = 0;
    } else {
        maxRatiosRef.current.model = Math.max(maxRatiosRef.current.model, rawMRatio);
        maxRatiosRef.current.buffers = Math.max(maxRatiosRef.current.buffers, rawBRatio);
        maxRatiosRef.current.textures = Math.max(maxRatiosRef.current.textures, rawTRatio);
    }

    const mRatio = maxRatiosRef.current.model;
    const bRatio = maxRatiosRef.current.buffers;
    const tRatio = maxRatiosRef.current.textures;

    const rawTotalRatio = isAllFinished
        ? 1
        : (mRatio * 0.5 + bRatio * 0.15 + (totals.textures.hasActivity ? tRatio * 0.35 : 0));
    if (Object.keys(loadingStates).length > 0) {
        maxRatiosRef.current.total = Math.max(maxRatiosRef.current.total, rawTotalRatio);
    }

    // UI 노출 여부 결정
    useEffect(() => {
        if (Object.keys(loadingStates).length > 0) {
            setVisible(true);
            if (!isAllFinished) {
                setOpacity(1);
            }
        }
    }, [loadingStates, isAllFinished]);

    // 완료 시 페이드 아웃 처리
    useEffect(() => {
        if (isAllFinished) {
            const timer = setTimeout(() => {
                setOpacity(0);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setOpacity(1);
        }
    }, [isAllFinished]);

    // 트랜지션 종료 후 상태 초기화 (자식 요소 트랜지션 버블링 무시)
    const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return;
        if (opacity === 0 && isAllFinished) {
            maxRatiosRef.current = {model: 0, buffers: 0, textures: 0, total: 0};
            setVisible(false);
            clearLoadingStates();
        }
    };

    if (!visible) return null;

    const avgTotal = maxRatiosRef.current.total * 100;

    return (
        <div 
            className="loading-ui" 
            style={{ opacity, transition: 'opacity 0.5s ease' }}
            onTransitionEnd={handleTransitionEnd}
        >
            <div className="loading-ui-title">📦 Loading Resources...</div>

            {([
                {
                    key: 'model',
                    ratio: mRatio,
                    loaded: formatBytes(totals.model.loaded),
                    total: totals.model.total > 0 ? formatBytes(totals.model.total) : formatBytes(totals.model.loaded),
                    unitClass: 'size',
                    showFiles: true
                },
                {
                    key: 'buffers',
                    ratio: bRatio,
                    loaded: totals.buffers.loaded,
                    total: totals.buffers.total,
                    unitClass: 'count',
                    showFiles: false
                },
                {
                    key: 'textures',
                    ratio: tRatio,
                    loaded: totals.textures.loaded,
                    total: totals.textures.total,
                    unitClass: 'count',
                    showFiles: false
                },
            ] as const).map(({key, ratio, loaded, total, unitClass, showFiles}) => (
                (totals[key].total > 0 || (key === 'model' && totals.model.hasActivity)) && (
                    <div key={key} className={`info-container-${key} loading-ui-info active`}>
                        <div className="loading-ui-info-wrapper">
                            <div className="loading-ui-info-title">{key}</div>
                            <div className="loading-ui-info-detail">
                                <span className="percent">{Math.floor(ratio * 100)}%</span>
                                <span className={unitClass} style={{marginLeft: '10px', opacity: 0.7}}>
                                    {loaded} / {total}
                                </span>
                            </div>
                            <div className="loading-ui-progress">
                                <div className="bar" style={{width: `${ratio * 100}%`}}></div>
                            </div>
                            {showFiles && (
                                <div className="loading-ui-info-file">
                                    {Object.entries(loadingStates).map(([url, state]) => (
                                        state.model && (state.model.total > 0 || state.model.loaded > 0 || state.model.percent === 100) ? (
                                            <div key={url} className="file">
                                                <span>{url}</span>
                                                <span>{formatBytes(state.model.total || state.model.loaded || 0)}</span>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            ))}

            {/* Total Progress Section */}
            {Object.keys(loadingStates).length >= 2 && (
                <div className="total-progress-section" style={{ display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                        <span>TOTAL PROGRESS</span>
                        <span className="total-percent-text">{Math.floor(avgTotal)}%</span>
                    </div>
                    <div className="loading-ui-progress" style={{ height: '8px', background: '#111' }}>
                        <div 
                            className="total-progress-bar" 
                            style={{ width: `${avgTotal}%`, background: '#4caf50', height: '100%', transition: 'width 0.2s' }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingUI;
