import RedGPUContext from "../../../context/RedGPUContext.js";
import Ground from "../../../primitive/Ground.js";
import {LandscapeLODManager} from "./LandscapeLODManager.js";

/**
 * [KO] LandscapeChunkRenderer
 * [EN] LandscapeChunkRenderer
 *
 * WebGPU Instancing을 활용하여 LandscapeLODManager의 청크 데이터를 단일 드로우콜로 와이어프레임/솔리드 렌더링합니다.
 */
export class LandscapeChunkRenderer {
    readonly #redGPUContext: RedGPUContext;
    readonly #lodManager: LandscapeLODManager;
    #unitGround: Ground;

    // GPU Instance Buffer (Stride = 4 floats: x, z, scale, lodLevel)
    #instanceGPUBuffer: GPUBuffer | null = null;
    #instanceCapacity: number = 0;

    constructor(redGPUContext: RedGPUContext, lodManager: LandscapeLODManager) {
        this.#redGPUContext = redGPUContext;
        this.#lodManager = lodManager;

        // 1. 단일 Unit Plane (1x1 크기, 32x32 세분화)
        this.#unitGround = new Ground(redGPUContext, 1, 1, 32, 32);

        // 2. GPU Instance Buffer 초기 생성
        this.#createOrResizeInstanceBuffer(lodManager.maxChunks);
    }

    get instanceGPUBuffer(): GPUBuffer | null {
        return this.#instanceGPUBuffer;
    }

    get unitGround(): Ground {
        return this.#unitGround;
    }

    /**
     * [KO] 매 프레임 LOD Manager의 인스턴스 버퍼를 GPU로 빠르게 업로드합니다 (GC-Free).
     * [EN] Rapidly uploads LOD Manager's instance buffer to GPU every frame (GC-Free).
     */
    updateGPUBuffer(): void {
        const device = this.#redGPUContext.gpuDevice;
        if (!device || !this.#instanceGPUBuffer) return;

        const activeCount = this.#lodManager.activeChunkCount;
        if (activeCount <= 0) return;

        // 용량 초과 시 재할당
        if (activeCount > this.#instanceCapacity) {
            this.#createOrResizeInstanceBuffer(Math.max(activeCount, this.#instanceCapacity * 2));
        }

        // Active Chunks 범위만큼만 GPU Buffer로 writeBuffer (GC 발생 0%)
        const activeBytes = activeCount * 4 * Float32Array.BYTES_PER_ELEMENT;
        device.queue.writeBuffer(
            this.#instanceGPUBuffer,
            0,
            this.#lodManager.instanceBuffer.buffer,
            0,
            activeBytes
        );
    }

    #createOrResizeInstanceBuffer(capacity: number): void {
        const device = this.#redGPUContext.gpuDevice;
        if (!device) return;

        const byteLength = capacity * 4 * Float32Array.BYTES_PER_ELEMENT;

        if (this.#instanceGPUBuffer) {
            this.#instanceGPUBuffer.destroy();
        }

        this.#instanceGPUBuffer = device.createBuffer({
            label: "LandscapeInstanceBuffer",
            size: byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
        this.#instanceCapacity = capacity;
    }
}
