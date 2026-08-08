import RedGPUContext from "../../../../context/RedGPUContext";
import wgslCode from "./terrainHeightmapProcessor.wgsl";

/**
 * [KO] Terrain 높이맵 타일 데이터의 Compute Shader 기반 변환 및 패킹을 전담하는 프로세서 유틸리티입니다.
 * [EN] Processor utility dedicated to Compute Shader-based conversion and packing of Terrain heightmap tile data.
 */
export class TerrainHeightmapProcessor {
    #redGPUContext: RedGPUContext;
    #computePipeline: GPUComputePipeline | null = null;
    #computeBindGroupLayout: GPUBindGroupLayout | null = null;

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

        const inputBuffer = device.createBuffer({
            size: Math.max(16, Math.ceil(srcByteArray.byteLength / 4) * 4),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        new Uint8Array(inputBuffer.getMappedRange()).set(srcByteArray);
        inputBuffer.unmap();

        const outputPixelCount = targetTileSize * targetTileSize;
        const outputByteSize = Math.max(16, outputPixelCount * 2);
        const outputBuffer = device.createBuffer({
            size: outputByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
        });

        const uniformBuffer = device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        });
        const u32View = new Uint32Array(uniformBuffer.getMappedRange());
        u32View[0] = targetTileSize;
        u32View[1] = width;
        u32View[2] = height;
        u32View[3] = dataType;
        uniformBuffer.unmap();

        const bindGroup = device.createBindGroup({
            layout: this.#computeBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: inputBuffer}},
                {binding: 1, resource: {buffer: outputBuffer}},
                {binding: 2, resource: {buffer: uniformBuffer}}
            ]
        });

        const commandEncoder = device.createCommandEncoder({label: 'TerrainTile_ComputeEncoder'});
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#computePipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(targetTileSize / 16), Math.ceil(targetTileSize / 16));
        passEncoder.end();

        commandEncoder.copyBufferToTexture(
            {buffer: outputBuffer, bytesPerRow: targetTileSize * 2, rowsPerImage: targetTileSize},
            {
                texture: targetGPUTexture,
                origin: [destX, destZ, 0]
            },
            [targetTileSize, targetTileSize, 1]
        );

        device.queue.submit([commandEncoder.finish()]);

        inputBuffer.destroy();
        outputBuffer.destroy();
        uniformBuffer.destroy();
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
}

export default TerrainHeightmapProcessor;
