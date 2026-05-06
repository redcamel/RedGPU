import {create} from 'zustand';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {CommandBatchStats} from "@redgpu/src/renderer/commandEncoder/CommandEncoderManager";

export interface ResourceStatusSummary {
    count: number;
    videoMemory: number;
}

export interface InspectorState {
    useDebugPanel: boolean;
    redGPUContext: RedGPUContext | null;
    // 엔진 타임스탬프
    lastUpdateTime: number;
    // FPS 통계
    fps: number;
    avgFps: number;
    low1Fps: number;
    low01Fps: number;
    frameTime: string;
    // 엔진 통계
    totalNum3DGroups: number;
    totalNum3DObjects: number;
    totalNumInstances: number;
    totalNumDrawCalls: number;
    totalNumTriangles: number;
    totalNumPoints: number;
    totalUsedVideoMemory: number;
    pixelRectArray: [number, number, number, number];
    commandBatchStats: CommandBatchStats | null;
    // 리소스 통계
    resourceStats: {
        bitmapTexture: ResourceStatusSummary;
        cubeTexture: ResourceStatusSummary;
        hdrTexture: ResourceStatusSummary;
        uniformBuffer: ResourceStatusSummary;
        vertexBuffer: ResourceStatusSummary;
        indexBuffer: ResourceStatusSummary;
        storageBuffer: ResourceStatusSummary;
        gpuBuffer: ResourceStatusSummary;
    };
    currentTab: string;
    // 히스토리 데이터 (최근 100개 데이터 포인트)
    fpsHistory: number[];
    memoryHistory: number[];
    drawCallHistory: number[];
    setStats: (stats: Partial<InspectorState>) => void;
    setUseDebugPanel: (value: boolean) => void;
    setRedGPUContext: (value: RedGPUContext) => void;
    setCurrentTab: (tab: string) => void;
}

export const useInspectorStore = create<InspectorState>((set) => ({
    useDebugPanel: false,
    redGPUContext: null,
    lastUpdateTime: 0,
    fps: 0,
    avgFps: 0,
    low1Fps: 0,
    low01Fps: 0,
    frameTime: '0ms',
    totalNum3DGroups: 0,
    totalNum3DObjects: 0,
    totalNumInstances: 0,
    totalNumDrawCalls: 0,
    totalNumTriangles: 0,
    totalNumPoints: 0,
    totalUsedVideoMemory: 0,
    pixelRectArray: [0, 0, 0, 0],
    commandBatchStats: null,
    resourceStats: {
        bitmapTexture: {count: 0, videoMemory: 0},
        cubeTexture: {count: 0, videoMemory: 0},
        hdrTexture: {count: 0, videoMemory: 0},
        uniformBuffer: {count: 0, videoMemory: 0},
        vertexBuffer: {count: 0, videoMemory: 0},
        indexBuffer: {count: 0, videoMemory: 0},
        storageBuffer: {count: 0, videoMemory: 0},
        gpuBuffer: {count: 0, videoMemory: 0}
    },
    currentTab: 'STATE',
    fpsHistory: [],
    memoryHistory: [],
    drawCallHistory: [],
    setStats: (stats) => set((state) => {
        const nextState = {...state, ...stats};

        // [KO] 히스토리 업데이트 최적화: 매 프레임 배열을 생성하는 대신, 데이터가 변경되었을 때만 업데이트하거나
        // 렌더링 부하를 줄이기 위해 전략적으로 처리합니다.
        if (stats.fps !== undefined) {
            state.fpsHistory.push(stats.fps);
            if (state.fpsHistory.length > 100) state.fpsHistory.shift();
            nextState.fpsHistory = [...state.fpsHistory];
        }

        if (stats.totalUsedVideoMemory !== undefined) {
            state.memoryHistory.push(stats.totalUsedVideoMemory);
            if (state.memoryHistory.length > 100) state.memoryHistory.shift();
            nextState.memoryHistory = [...state.memoryHistory];
        }

        if (stats.totalNumDrawCalls !== undefined) {
            state.drawCallHistory.push(stats.totalNumDrawCalls);
            if (state.drawCallHistory.length > 100) state.drawCallHistory.shift();
            nextState.drawCallHistory = [...state.drawCallHistory];
        }

        return nextState;
    }),
    setUseDebugPanel: (value) => set({useDebugPanel: value}),
    setRedGPUContext: (value) => set({redGPUContext: value}),
    setCurrentTab: (tab) => set({currentTab: tab}),
}));
