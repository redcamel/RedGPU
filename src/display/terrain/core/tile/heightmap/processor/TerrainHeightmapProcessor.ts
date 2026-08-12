import RedGPUContext from "../../../../../../context/RedGPUContext";
import wgslCode from "./terrainHeightmapProcessor.wgsl";
import {COMMAND_ENCODER_TYPE} from "../../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] Terrain 높이맵 타일 데이터의 Compute Shader 기반 변환 및 패킹을 전담하는 프로세서 유틸리티입니다.
 * [EN] Processor utility dedicated to Compute Shader-based conversion and packing of Terrain heightmap tile data.
 */
export class TerrainHeightmapProcessor {
    #redGPUContext: RedGPUContext;
    #computePipeline: GPUComputePipeline | null = null;
    #computeBindGroupLayout: GPUBindGroupLayout | null = null;

    #inputBufferPool: GPUBuffer[] = [];
    #outputBufferPool: GPUBuffer[] = [];
    #uniformBufferPool: GPUBuffer[] = [];
    #staticPaddingBuffer: Uint8Array | null = null;
    #bindGroupCache: Map<number, GPUBindGroup> = new Map();

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#initComputePipeline();
    }

    /**
     * [KO] 16비트/Float32 타일 데이터를 Compute Shader로 변환하여 destination GPUTexture에 업로드합니다.
     * [EN] Converts 16-bit/Float32 tile data via Compute Shader and uploads to destination GPUTexture.
     */
    processAndUploadTile(
        destX: number,
        destZ: number,
        data: ArrayBuffer | ArrayBufferView,
        width: number,
        height: number,
        targetGPUTexture: GPUTexture,
        atlasTileSize: number
    ) {
        if (!this.#computePipeline || !this.#computeBindGroupLayout) return;

        const device = this.#redGPUContext.gpuDevice;
        const targetTileSize = atlasTileSize;

        let srcByteArray: Uint8Array;
        let dataType = 0; // 0 = Uint16, 1 = Float32

        if (data instanceof Float32Array) {
            srcByteArray = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            dataType = 1;
        } else if (ArrayBuffer.isView(data)) {
            srcByteArray = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            dataType = 0;
        } else {
            srcByteArray = new Uint8Array(data);
            dataType = 0;
        }

        const reqInputSize = Math.max(16, Math.ceil(srcByteArray.byteLength / 4) * 4);
        const inputBuffer = this.#acquireBuffer(
            this.#inputBufferPool,
            reqInputSize,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            'TerrainTile_PooledInputBuffer'
        );

        let uploadData: BufferSource = srcByteArray as BufferSource;
        if (srcByteArray.byteLength % 4 !== 0) {
            if (!this.#staticPaddingBuffer || this.#staticPaddingBuffer.byteLength < reqInputSize) {
                this.#staticPaddingBuffer = new Uint8Array(Math.max(reqInputSize, 1024 * 1024));
            }
            this.#staticPaddingBuffer.set(srcByteArray);
            uploadData = new Uint8Array(this.#staticPaddingBuffer.buffer as ArrayBuffer, 0, reqInputSize);
        }

        device.queue.writeBuffer(inputBuffer, 0, uploadData);

        const outputPixelCount = targetTileSize * targetTileSize;
        const outputByteSize = Math.max(16, outputPixelCount * 8); // rgba16float = 8 bytes per pixel
        const outputBuffer = this.#acquireBuffer(
            this.#outputBufferPool,
            outputByteSize,
            GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
            'TerrainTile_PooledOutputBuffer'
        );

        const uniformBuffer = this.#acquireBuffer(
            this.#uniformBufferPool,
            16,
            GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            'TerrainTile_PooledUniformBuffer'
        );
        const u32Array = new Uint32Array([targetTileSize, width, height, dataType]);
        device.queue.writeBuffer(uniformBuffer, 0, u32Array);

        const bindGroup = this.#getOrCreateBindGroup(inputBuffer, outputBuffer, uniformBuffer);
        if (!bindGroup) return;

        // CommandEncoderManager를 통해 연산 버퍼들이 순차 인코딩된 후 안전한 시점에 큐 제출되도록 조율
        const commandEncoderManager = this.#redGPUContext.commandEncoderManager;

        commandEncoderManager.addResourceComputePass('TerrainTile_ComputePass', (passEncoder) => {
            passEncoder.setPipeline(this.#computePipeline!);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(targetTileSize / 16), Math.ceil(targetTileSize / 16));
        });

        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (encoder) => {
            encoder.copyBufferToTexture(
                {buffer: outputBuffer, bytesPerRow: targetTileSize * 8, rowsPerImage: targetTileSize},
                {
                    texture: targetGPUTexture,
                    origin: [destX, destZ, 0]
                },
                [targetTileSize, targetTileSize, 1]
            );
        });

        // 큐 제출이 완료된 뒤 안전한 시점에 임시 버퍼들을 파괴하는 대신 풀로 반납하도록 리사이클러 지연 등록
        commandEncoderManager.addDeferredDestroy({
            destroy: () => {
                this.#recycleBuffer(this.#inputBufferPool, inputBuffer);
                this.#recycleBuffer(this.#outputBufferPool, outputBuffer);
                this.#recycleBuffer(this.#uniformBufferPool, uniformBuffer);
            }
        });
    }

    destroy(): void {
        this.#computePipeline = null;
        this.#computeBindGroupLayout = null;
        this.#inputBufferPool.forEach(b => b.destroy());
        this.#outputBufferPool.forEach(b => b.destroy());
        this.#uniformBufferPool.forEach(b => b.destroy());
        this.#inputBufferPool = [];
        this.#outputBufferPool = [];
        this.#uniformBufferPool = [];
        this.#staticPaddingBuffer = null;
        this.#bindGroupCache.clear();
    }

    #getOrCreateBindGroup(
        inputBuffer: GPUBuffer,
        outputBuffer: GPUBuffer,
        uniformBuffer: GPUBuffer
    ): GPUBindGroup | null {
        const layout = this.#computeBindGroupLayout;
        if (!layout) return null;

        const key = (getBindId(inputBuffer) * 1000000) + (getBindId(outputBuffer) * 1000) + getBindId(uniformBuffer);
        let bindGroup = this.#bindGroupCache.get(key);
        if (!bindGroup) {
            bindGroup = this.#redGPUContext.gpuDevice.createBindGroup({
                label: 'TerrainTile_ComputeBindGroup_Cached',
                layout,
                entries: [
                    {binding: 0, resource: {buffer: inputBuffer}},
                    {binding: 1, resource: {buffer: outputBuffer}},
                    {binding: 2, resource: {buffer: uniformBuffer}}
                ]
            });
            this.#bindGroupCache.set(key, bindGroup);
        }
        return bindGroup;
    }

    #acquireBuffer(
        pool: GPUBuffer[],
        minSize: number,
        usage: GPUBufferUsageFlags,
        label: string
    ): GPUBuffer {
        const device = this.#redGPUContext.gpuDevice;
        for (let i = 0; i < pool.length; i++) {
            if (pool[i].size >= minSize) {
                return pool.splice(i, 1)[0];
            }
        }
        return device.createBuffer({
            label,
            size: minSize,
            usage
        });
    }

    #initComputePipeline() {
        if (this.#computePipeline) return;
        const device = this.#redGPUContext.gpuDevice;

        const shaderModule = device.createShaderModule({
            label: 'TerrainTile_16bitComputeShader',
            code: wgslCode
        });

        this.#computeBindGroupLayout = device.createBindGroupLayout({
            label: 'TerrainTile_ComputeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#computePipeline = device.createComputePipeline({
            label: 'TerrainTile_16bitComputePipeline',
            layout: device.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout]}),
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }

    #recycleBuffer(pool: GPUBuffer[], buffer: GPUBuffer, maxSize: number = 8 * 1024 * 1024) {
        if (!buffer) return;
        if (buffer.size > maxSize || pool.length >= 32) {
            buffer.destroy();
        } else {
            pool.push(buffer);
        }
    }
}

let bindGroupIdSeed = 0;
const getBindId = (obj: any): number => {
    if (!obj) return 0;
    if (!obj.__bindId) {
        obj.__bindId = ++bindGroupIdSeed;
    }
    return obj.__bindId;
};

export default TerrainHeightmapProcessor;
