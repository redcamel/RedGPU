import RedGPUContext from "../../context/RedGPUContext";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import formatBytes from "../../utils/math/formatBytes";

/**
 * WebGPU 드로우 커맨드를 효율적으로 관리하는 매니저 클래스
 * 동적 확장 가능한 버퍼 풀을 통해 무제한 드로우 커맨드를 지원합니다.
 */
class DrawBufferManager {
    static #instance: DrawBufferManager
    // 드로우 커맨드 타입별 크기
    static readonly #INDEXED_COMMAND_SIZE = 5  // drawIndexedIndirect
    #redGPUContext: RedGPUContext
    #bufferPool: GPUBuffer[] = []
    #dataPool: Uint32Array[] = []
    #maxCommandsPerBuffer: number
    #currentBufferIndex: number = 0
    #currentCommandIndex: number = 0
    #deviceMaxBufferSize: number
    #usedBufferIndices: Set<number> = new Set()

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#initializeSystem()
    }

    /**
     * DrawBufferManager 싱글톤 인스턴스를 가져옵니다.
     */
    static getInstance(redGPUContext: RedGPUContext): DrawBufferManager {
        if (!DrawBufferManager.#instance) {
            DrawBufferManager.#instance = new DrawBufferManager(redGPUContext)
        }
        return DrawBufferManager.#instance
    }

    /**
     * 새로운 드로우 커맨드 슬롯을 할당합니다.
     */
    allocateDrawCommand(name: string): DrawCommandSlot {
        // 현재 버퍼에 공간이 부족하면 새 버퍼 생성
        if (this.#currentCommandIndex >= this.#maxCommandsPerBuffer) {
            this.#currentBufferIndex = this.#createNewBuffer()
            this.#currentCommandIndex = 0
        }
        // 사용된 버퍼 추적
        this.#usedBufferIndices.add(this.#currentBufferIndex)
        const slot: DrawCommandSlot = {
            bufferIndex: this.#currentBufferIndex,
            commandOffset: this.#currentCommandIndex * DrawBufferManager.#INDEXED_COMMAND_SIZE,
            buffer: this.#bufferPool[this.#currentBufferIndex],
            dataArray: this.#dataPool[this.#currentBufferIndex]
        }
        // keepLog(`🎯 드로우 슬롯 할당:`, {
        // 	bufferIndex: slot.bufferIndex,
        // 	commandOffset: slot.commandOffset,
        // 	currentCommandIndex: this.#currentCommandIndex,
        // 	meshInfo: name || 'unknown' // 나중에 메시 이름 추가 가능
        // })
        this.#currentCommandIndex++
        return slot
    }

    /**
     * drawIndexedIndirect 커맨드를 설정합니다.
     */
    setIndexedIndirectCommand(
        slot: DrawCommandSlot,
        indexCount: number,
        instanceCount: number = 1,
        firstIndex: number = 0,
        baseVertex: number = 0,
        firstInstance: number = 0,
    ): void {
        const offset = slot.commandOffset
        const data = slot.dataArray
        data[offset] = indexCount
        data[offset + 1] = instanceCount
        data[offset + 2] = firstIndex
        data[offset + 3] = baseVertex
        data[offset + 4] = firstInstance
    }

    setInstanceNum(slot: DrawCommandSlot, instanceCount: number = 0) {
        const offset = slot.commandOffset
        const data = slot.dataArray
        data[offset + 1] = instanceCount
    }

    /**
     * drawIndirect 커맨드를 설정합니다.
     */
    setIndirectCommand(
        slot: DrawCommandSlot,
        vertexCount: number,
        instanceCount: number = 1,
        firstVertex: number = 0,
        firstInstance: number = 0,
    ): void {
        const offset = slot.commandOffset
        const data = slot.dataArray
        data[offset] = vertexCount
        data[offset + 1] = instanceCount
        data[offset + 2] = firstVertex
        data[offset + 3] = firstInstance
        // data[offset + 4] = 미사용 (direct draw는 4개 값만 사용)
    }

    /**
     * 슬롯의 드로우 커맨드를 즉시 GPU로 업데이트합니다.
     */
    updateSingleCommand(slot: DrawCommandSlot): void {
        const buffer = this.#bufferPool[slot.bufferIndex]
        const data = this.#dataPool[slot.bufferIndex]
        // 해당 커맨드 부분만 즉시 업데이트
        const commandSize = DrawBufferManager.#INDEXED_COMMAND_SIZE
        const byteOffset = slot.commandOffset * 4
        const elementCount = commandSize
        this.#redGPUContext.gpuDevice.queue.writeBuffer(
            buffer,
            byteOffset,
            data,
            slot.commandOffset,
            elementCount
        )
    }

    /**
     * 현재 할당된 총 커맨드 개수를 반환합니다.
     */
    getTotalCommandCount(): number {
        let total = 0
        for (const bufferIndex of this.#usedBufferIndices) {
            if (bufferIndex === this.#currentBufferIndex) {
                total += this.#currentCommandIndex
            } else {
                total += this.#maxCommandsPerBuffer
            }
        }
        return total
    }

    /**
     * 메모리 사용량 정보를 반환합니다.
     */
    getMemoryUsage(): DrawBufferMemoryInfo {
        const totalBuffers = this.#bufferPool.length
        const usedBuffers = this.#usedBufferIndices.size
        const totalMemory = totalBuffers * this.#deviceMaxBufferSize
        const usedMemory = usedBuffers * this.#deviceMaxBufferSize
        return {
            totalBuffers,
            usedBuffers,
            maxCommandsPerBuffer: this.#maxCommandsPerBuffer,
            totalMemory: formatBytes(totalMemory),
            usedMemory: formatBytes(usedMemory),
            totalCommands: this.getTotalCommandCount()
        }
    }

    //  */
    flushAllCommands(renderViewStateData: RenderViewStateData): void {
        // if(!renderViewStateData.rebuildRenderBundleNum){
        // 	// keepLog('⚡ 드로우 커맨드 변경사항없음')
        // 	return
        // }
        const startTime = performance.now()
        let totalUploaded = 0
        for (const bufferIndex of this.#usedBufferIndices) {
            const buffer = this.#bufferPool[bufferIndex]
            const data = this.#dataPool[bufferIndex]
            // 실제 사용된 부분만 업로드
            const usedCommands = bufferIndex === this.#currentBufferIndex ?
                this.#currentCommandIndex :
                this.#maxCommandsPerBuffer
            const uploadSize = usedCommands * DrawBufferManager.#INDEXED_COMMAND_SIZE * 4
            this.#redGPUContext.gpuDevice.queue.writeBuffer(
                buffer,
                0,
                data,
                0,
                uploadSize / 4
            )
            totalUploaded += uploadSize
        }
        const endTime = performance.now()
        // keepLog(`⚡ 드로우 커맨드 업로드 완료:`, {
        // 	changedRenderBundleNum: renderViewStateData.rebuildRenderBundleNum,
        // 	buffersUpdated: this.#usedBufferIndices.size,
        // 	totalCommands: this.getTotalCommandCount(),
        // 	uploadedSize: formatBytes(totalUploaded),
        // 	uploadTime: `${(endTime - startTime).toFixed(2)}ms`
        // })
    }

    /**
     * 드로우 버퍼 시스템을 초기화합니다.
     */
    #initializeSystem(): void {
        this.#calculateDeviceLimits()
        this.#createInitialBuffer()
        // keepLog(`🚀 DrawBufferManager 초기화 완료:`, {
        // 	maxBufferSize: `${formatBytes(this.#deviceMaxBufferSize)}`,
        // 	maxCommandsPerBuffer: this.#maxCommandsPerBuffer.toLocaleString(),
        // 	estimatedCapacity: '무제한 (동적 확장)'
        // })
    }

    // /**
    //  * 모든 사용된 버퍼의 데이터를 GPU로 업로드합니다.
    /**
     * 디바이스의 실제 버퍼 크기 제한을 계산합니다.
     */
    #calculateDeviceLimits(): void {
        const limits = this.#redGPUContext.gpuDevice.limits
        // 안전한 최대 크기 계산 (실제 제한의 90% 사용)
        this.#deviceMaxBufferSize = Math.floor(
            Math.min(
                // limits.maxBufferSize || 268435456,           // 256MB
                // limits.maxStorageBufferBindingSize || 134217728  // 128MB
                268435456,           // 256MB
                134217728  // 128MB
            ) * 0.9
        )
        // 버퍼당 최대 커맨드 수 (가장 큰 커맨드 크기 기준)
        this.#maxCommandsPerBuffer = Math.floor(
            this.#deviceMaxBufferSize / (DrawBufferManager.#INDEXED_COMMAND_SIZE * 4)
        )
    }

    // /**
    //  * 다음 프레임을 위해 상태를 리셋합니다.
    //  */
    // resetForNextFrame(): void {
    // 	this.#usedBufferIndices.clear()
    // 	this.#currentBufferIndex = 0
    // 	this.#currentCommandIndex = 0
    // }
    /**
     * 첫 번째 드로우 버퍼를 생성합니다.
     */
    #createInitialBuffer(): void {
        this.#createNewBuffer()
    }

    /**
     * 새로운 드로우 버퍼를 생성하고 풀에 추가합니다.
     */
    #createNewBuffer(): number {
        const bufferSize = this.#maxCommandsPerBuffer * DrawBufferManager.#INDEXED_COMMAND_SIZE * 4
        const buffer = this.#redGPUContext.gpuDevice.createBuffer({
            size: bufferSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
            label: `DrawBuffer_${this.#bufferPool.length}`
        })
        const data = new Uint32Array(this.#maxCommandsPerBuffer * DrawBufferManager.#INDEXED_COMMAND_SIZE)
        this.#bufferPool.push(buffer)
        this.#dataPool.push(data)
        console.log(`📦 새 드로우 버퍼 생성: #${this.#bufferPool.length - 1} (총 ${this.#bufferPool.length}개)`)
        return this.#bufferPool.length - 1
    }

    //
    // /**
    //  * 사용하지 않는 버퍼들을 정리합니다.
    //  * (메모리 절약이 필요한 경우 호출)
    //  */
    // cleanup(): void {
    // 	// 현재 프레임에서 사용되지 않은 버퍼들을 찾아서 제거
    // 	//TODO 드로우 버퍼 정리 (구현 예정)
    // }
    //
    // /**
    //  * 매니저를 완전히 해제합니다.
    //  */
    // dispose(): void {
    // 	this.#bufferPool.forEach(buffer => buffer.destroy())
    // 	this.#bufferPool = []
    // 	this.#dataPool = []
    // 	this.#usedBufferIndices.clear()
    // 	DrawBufferManager.#instance = null
    // 	keepLog('🗑️ DrawBufferManager 해제됨')
    // }
}

/**
 * 드로우 커맨드 슬롯 정보
 */
interface DrawCommandSlot {
    bufferIndex: number
    commandOffset: number
    buffer: GPUBuffer
    dataArray: Uint32Array
}

/**
 * 드로우 버퍼 메모리 사용량 정보
 */
interface DrawBufferMemoryInfo {
    totalBuffers: number
    usedBuffers: number
    maxCommandsPerBuffer: number
    totalMemory: string
    usedMemory: string
    totalCommands: number
}

export default DrawBufferManager
export type {DrawCommandSlot, DrawBufferMemoryInfo}
