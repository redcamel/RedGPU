import React, {useEffect, useMemo, useState} from 'react';
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

    // 데이터 집계 (Aggregation)
    const totals = useMemo(() => {
        const t = {
            model: { loaded: 0, total: 0 },
            buffers: { loaded: 0, total: 0 },
            textures: { loaded: 0, total: 0 }
        };

        Object.values(loadingStates).forEach((state) => {
            (['model', 'buffers', 'textures'] as const).forEach((key) => {
                if (state[key]) {
                    t[key].loaded += state[key]?.loaded || 0;
                    t[key].total += state[key]?.total || 0;
                }
            });
        });
        return t;
    }, [loadingStates]);

    const mRatio = totals.model.total > 0 ? totals.model.loaded / totals.model.total : 1;
    const bRatio = totals.buffers.total > 0 ? totals.buffers.loaded / totals.buffers.total : 1;
    const tRatio = totals.textures.total > 0 ? totals.textures.loaded / totals.textures.total : 1;

    const isAllFinished = useMemo(() => {
        const states = Object.values(loadingStates);
        if (states.length === 0) return false;
        return mRatio >= 1 && bRatio >= 1 && tRatio >= 1;
    }, [loadingStates, mRatio, bRatio, tRatio]);

    // UI 노출 여부 결정
    useEffect(() => {
        if (Object.keys(loadingStates).length > 0) {
            setVisible(true);
            setOpacity(1);
        }
    }, [loadingStates]);

    // 완료 시 페이드 아웃 처리
    useEffect(() => {
        if (isAllFinished) {
            const timer = setTimeout(() => {
                setOpacity(0);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isAllFinished]);

    // 트랜지션 종료 후 상태 초기화
    const handleTransitionEnd = () => {
        if (opacity === 0) {
            setVisible(false);
            clearLoadingStates();
        }
    };

    if (!visible) return null;

    const activeSections = [totals.model.total, totals.buffers.total, totals.textures.total].filter(t => t > 0).length;
    const avgTotal = activeSections > 0
        ? (((totals.model.total > 0 ? mRatio : 0) + (totals.buffers.total > 0 ? bRatio : 0) + (totals.textures.total > 0 ? tRatio : 0)) / activeSections) * 100
        : 100;

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
                    total: formatBytes(totals.model.total),
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
                totals[key].total > 0 && (
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
                                        state.model && state.model.total > 0 ? (
                                            <div key={url} className="file">
                                                <span>{url}</span>
                                                <span>{formatBytes(state.model.total)}</span>
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
