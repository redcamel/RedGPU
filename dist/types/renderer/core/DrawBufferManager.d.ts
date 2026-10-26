import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] Indirect 드로우 커맨드를 GPU 버퍼 풀에 할당하고 업로드하는 매니저 클래스입니다.
 * [EN] Manager class that allocates indirect draw commands in a GPU buffer pool and uploads them.
 *
 * [KO] 슬롯당 5개의 `u32`(drawIndexedIndirect 규격)를 사용하며, 현재 버퍼가 가득 차면 새 버퍼를 자동으로 추가합니다.
 * [EN] Each slot uses 5 `u32` values (drawIndexedIndirect layout), and a new buffer is added automatically when the current one is full.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const drawBufferManager = redGPUContext.drawBufferManager;
 * ```
 *
 * @category Renderer
 */
declare class DrawBufferManager extends RedGPUObject {
    #private;
    /**
     * [KO] DrawBufferManager 인스턴스를 생성하고 초기 드로우 버퍼를 할당합니다.
     * [EN] Creates a DrawBufferManager instance and allocates the initial draw buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 새 드로우 커맨드 슬롯을 할당합니다. 현재 버퍼 용량이 부족하면 새 버퍼를 생성합니다.
     * [EN] Allocates a new draw command slot. Creates a new buffer if the current buffer is full.
     *
     * @param name -
     * [KO] 슬롯 식별용 이름 (디버깅 용도)
     * [EN] Name for identifying the slot (for debugging)
     * @returns
     * [KO] 할당된 드로우 커맨드 슬롯
     * [EN] Allocated draw command slot
     */
    allocateDrawCommand(name: string): DrawCommandSlot;
    /**
     * [KO] 슬롯에 drawIndexedIndirect 커맨드 값을 기록합니다. GPU 업로드는 `flushAllCommands` 또는 `updateSingleCommand` 호출 시 수행됩니다.
     * [EN] Writes drawIndexedIndirect command values into the slot. GPU upload occurs on `flushAllCommands` or `updateSingleCommand`.
     *
     * @param slot -
     * [KO] 대상 드로우 커맨드 슬롯
     * [EN] Target draw command slot
     * @param indexCount -
     * [KO] 인덱스 개수
     * [EN] Index count
     * @param instanceCount -
     * [KO] 인스턴스 개수 (기본값: 1)
     * [EN] Instance count (default: 1)
     * @param firstIndex -
     * [KO] 시작 인덱스 (기본값: 0)
     * [EN] First index (default: 0)
     * @param baseVertex -
     * [KO] 기준 정점 오프셋 (기본값: 0)
     * [EN] Base vertex offset (default: 0)
     * @param firstInstance -
     * [KO] 시작 인스턴스 (기본값: 0)
     * [EN] First instance (default: 0)
     */
    setIndexedIndirectCommand(slot: DrawCommandSlot, indexCount: number, instanceCount?: number, firstIndex?: number, baseVertex?: number, firstInstance?: number): void;
    /**
     * [KO] 슬롯의 인스턴스 개수만 갱신합니다.
     * [EN] Updates only the instance count of the slot.
     *
     * @param slot -
     * [KO] 대상 드로우 커맨드 슬롯
     * [EN] Target draw command slot
     * @param instanceCount -
     * [KO] 인스턴스 개수 (기본값: 0)
     * [EN] Instance count (default: 0)
     */
    setInstanceNum(slot: DrawCommandSlot, instanceCount?: number): void;
    /**
     * [KO] 슬롯에 drawIndirect 커맨드 값을 기록합니다. 슬롯의 5개 값 중 앞 4개만 사용합니다.
     * [EN] Writes drawIndirect command values into the slot. Only the first 4 of the slot's 5 values are used.
     *
     * @param slot -
     * [KO] 대상 드로우 커맨드 슬롯
     * [EN] Target draw command slot
     * @param vertexCount -
     * [KO] 정점 개수
     * [EN] Vertex count
     * @param instanceCount -
     * [KO] 인스턴스 개수 (기본값: 1)
     * [EN] Instance count (default: 1)
     * @param firstVertex -
     * [KO] 시작 정점 (기본값: 0)
     * [EN] First vertex (default: 0)
     * @param firstInstance -
     * [KO] 시작 인스턴스 (기본값: 0)
     * [EN] First instance (default: 0)
     */
    setIndirectCommand(slot: DrawCommandSlot, vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
    /**
     * [KO] 단일 슬롯의 커맨드 데이터를 즉시 GPU 버퍼에 기록합니다.
     * [EN] Immediately writes a single slot's command data to the GPU buffer.
     *
     * @param slot -
     * [KO] 업로드할 드로우 커맨드 슬롯
     * [EN] Draw command slot to upload
     */
    updateSingleCommand(slot: DrawCommandSlot): void;
    /**
     * [KO] 현재 할당된 전체 드로우 커맨드 개수를 반환합니다.
     * [EN] Returns the total number of currently allocated draw commands.
     *
     * @returns
     * [KO] 할당된 커맨드 개수
     * [EN] Number of allocated commands
     */
    getTotalCommandCount(): number;
    /**
     * [KO] 버퍼 풀의 메모리 사용량 정보를 반환합니다.
     * [EN] Returns memory usage information of the buffer pool.
     *
     * @returns
     * [KO] 메모리 사용량 정보
     * [EN] Memory usage information
     */
    getMemoryUsage(): DrawBufferMemoryInfo;
    /**
     * [KO] 사용 중인 모든 버퍼의 커맨드 데이터를 실제 사용 범위만큼 GPU에 업로드합니다.
     * [EN] Uploads the command data of all used buffers to the GPU, limited to the actually used range.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더 상태 데이터
     * [EN] Render state data of the current view
     */
    flushAllCommands(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 모든 GPU 버퍼를 해제하고 내부 풀을 초기화합니다.
     * [EN] Destroys all GPU buffers and resets the internal pools.
     */
    destroy(): void;
}
/**
 * [KO] 할당된 드로우 커맨드 슬롯 정보입니다.
 * [EN] Information about an allocated draw command slot.
 *
 * @category Renderer
 */
interface DrawCommandSlot {
    /**
     * [KO] 버퍼 풀 내 버퍼 인덱스
     * [EN] Buffer index within the buffer pool
     */
    bufferIndex: number;
    /**
     * [KO] 데이터 배열 내 커맨드 시작 오프셋 (`u32` 단위)
     * [EN] Command start offset within the data array (in `u32` units)
     */
    commandOffset: number;
    /**
     * [KO] 커맨드가 저장된 GPU 버퍼
     * [EN] GPU buffer storing the command
     */
    buffer: GPUBuffer;
    /**
     * [KO] 커맨드 값이 기록되는 CPU 측 데이터 배열
     * [EN] CPU-side data array where command values are written
     */
    dataArray: Uint32Array;
}
/**
 * [KO] 드로우 버퍼 풀의 메모리 사용량 정보입니다.
 * [EN] Memory usage information of the draw buffer pool.
 *
 * @category Renderer
 */
interface DrawBufferMemoryInfo {
    /**
     * [KO] 생성된 전체 버퍼 개수
     * [EN] Total number of created buffers
     */
    totalBuffers: number;
    /**
     * [KO] 사용 중인 버퍼 개수
     * [EN] Number of buffers in use
     */
    usedBuffers: number;
    /**
     * [KO] 버퍼당 최대 커맨드 개수
     * [EN] Maximum number of commands per buffer
     */
    maxCommandsPerBuffer: number;
    /**
     * [KO] 전체 메모리 크기 (포맷된 문자열)
     * [EN] Total memory size (formatted string)
     */
    totalMemory: string;
    /**
     * [KO] 사용 중인 메모리 크기 (포맷된 문자열)
     * [EN] Used memory size (formatted string)
     */
    usedMemory: string;
    /**
     * [KO] 할당된 전체 커맨드 개수
     * [EN] Total number of allocated commands
     */
    totalCommands: number;
}
export default DrawBufferManager;
export type { DrawCommandSlot, DrawBufferMemoryInfo };
