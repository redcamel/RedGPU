import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
/**
 * WebGPU 드로우 커맨드를 효율적으로 관리하는 매니저 클래스
 * 동적 확장 가능한 버퍼 풀을 통해 무제한 드로우 커맨드를 지원합니다.
 */
declare class DrawBufferManager {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /**
     * DrawBufferManager 싱글톤 인스턴스를 가져옵니다.
     */
    static getInstance(redGPUContext: RedGPUContext): DrawBufferManager;
    /**
     * 새로운 드로우 커맨드 슬롯을 할당합니다.
     */
    allocateDrawCommand(name: string): DrawCommandSlot;
    /**
     * drawIndexedIndirect 커맨드를 설정합니다.
     */
    setIndexedIndirectCommand(slot: DrawCommandSlot, indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number, isStatic?: boolean): void;
    setInstanceNum(slot: DrawCommandSlot, instanceCount?: number): void;
    /**
     * drawIndirect 커맨드를 설정합니다.
     */
    setIndirectCommand(slot: DrawCommandSlot, vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number, isStatic?: boolean): void;
    /**
     * 슬롯의 드로우 커맨드를 즉시 GPU로 업데이트합니다.
     */
    updateSingleCommand(slot: DrawCommandSlot): void;
    /**
     * 현재 할당된 총 커맨드 개수를 반환합니다.
     */
    getTotalCommandCount(): number;
    /**
     * 메모리 사용량 정보를 반환합니다.
     */
    getMemoryUsage(): DrawBufferMemoryInfo;
    flushAllCommands(renderViewStateData: RenderViewStateData): void;
}
/**
 * 드로우 커맨드 슬롯 정보
 */
interface DrawCommandSlot {
    bufferIndex: number;
    commandOffset: number;
    buffer: GPUBuffer;
    dataArray: Uint32Array;
}
/**
 * 드로우 버퍼 메모리 사용량 정보
 */
interface DrawBufferMemoryInfo {
    totalBuffers: number;
    usedBuffers: number;
    maxCommandsPerBuffer: number;
    totalMemory: string;
    usedMemory: string;
    totalCommands: number;
}
export default DrawBufferManager;
export type { DrawCommandSlot, DrawBufferMemoryInfo };
