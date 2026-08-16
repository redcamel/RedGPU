import RedGPUContext from "../../../context/RedGPUContext";
import landscapeCullComputeSource from "../shader/landscapeCullCompute.wgsl";

/**
 * [KO] Landscape Multi-LOD GPU Compute Shader Culling 파이프라인 관리 클래스입니다 (GPU-Driven Index Redirection).
 * [EN] Landscape Multi-LOD GPU Compute Shader Culling pipeline manager class (GPU-Driven Index Redirection).
 */
export class LandscapeGPUCuller {
    #redGPUContext: RedGPUContext;

    #computePipeline: GPUComputePipeline | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    // Zero-GC 16-byte alignment uniform float buffer (cameraPos 3f, maxLOD 1u, worldSize 2f, tileSize 2f, heightScale 1f, tileCount 1f, pad 2f, frustumPlanes 24f, lodDistances 8f = 44 floats = 176 bytes)
    #uniformData: Float32Array = new Float32Array(44);
    #uniformUintData: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#uniformUintData = new Uint32Array(this.#uniformData.buffer);

        this.#initGPUResources();
    }

    updateBindGroup(
        allInputTilesBuffer: GPUBuffer,
        visibleTileIndicesBuffer: GPUBuffer,
        indirectDrawBuffer: GPUBuffer
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#bindGroupLayout || !this.#uniformBuffer) return;

        this.#bindGroup = gpuDevice.createBindGroup({
            label: 'LandscapeCullBindGroup',
            layout: this.#bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: {buffer: allInputTilesBuffer}},
                {binding: 2, resource: {buffer: visibleTileIndicesBuffer}},
                {binding: 3, resource: {buffer: indirectDrawBuffer}}
            ]
        });
    }

    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        maxLODLevel: number,
        worldSizeX: number,
        worldSizeZ: number,
        tileSizeX: number,
        tileSizeZ: number,
        heightScale: number,
        tileCount: number,
        frustumPlanes: number[][] | Float32Array[] | null,
        lodDistancesSq: Float32Array
    ): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#uniformBuffer) return;

        const data = this.#uniformData;
        const uintData = this.#uniformUintData;

        data[0] = camX;
        data[1] = camY;
        data[2] = camZ;
        uintData[3] = maxLODLevel;

        data[4] = worldSizeX;
        data[5] = worldSizeZ;
        data[6] = tileSizeX;
        data[7] = tileSizeZ;

        data[8] = heightScale;
        uintData[9] = tileCount;
        data[10] = 0;
        data[11] = 0;

        // Frustum Planes (6 * 4 = 24 floats)
        if (frustumPlanes && frustumPlanes.length >= 6) {
            for (let i = 0; i < 6; i++) {
                const plane = frustumPlanes[i];
                const offset = 12 + i * 4;
                data[offset] = plane[0];
                data[offset + 1] = plane[1];
                data[offset + 2] = plane[2];
                data[offset + 3] = plane[3];
            }
        } else {
            // Disable culling if frustum planes are missing (all planes 0 0 0 1e10)
            for (let i = 0; i < 6; i++) {
                const offset = 12 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

        // LOD Distances (8 floats, default to 1e15 if unused)
        const distCount = lodDistancesSq.length;
        for (let i = 0; i < 8; i++) {
            const val = i < distCount ? lodDistancesSq[i] : 0;
            data[36 + i] = (val && val > 0) ? val : 1e15;
        }

        gpuDevice.queue.writeBuffer(this.#uniformBuffer, 0, data.buffer, 0, data.byteLength);
    }

    dispatchPass(computePass: GPUComputePassEncoder, tileCount: number): void {
        if (!this.#computePipeline || !this.#bindGroup) return;

        computePass.setPipeline(this.#computePipeline);
        computePass.setBindGroup(0, this.#bindGroup);

        const workgroupCount = Math.ceil(tileCount / 64);
        computePass.dispatchWorkgroups(workgroupCount);
    }

    dispatch(commandEncoder: GPUCommandEncoder, tileCount: number): void {
        if (!this.#computePipeline || !this.#bindGroup) return;

        const computePass = commandEncoder.beginComputePass({
            label: 'LandscapeGPUCullingComputePass'
        });
        this.dispatchPass(computePass, tileCount);
        computePass.end();
    }

    #initGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const shaderModule = gpuDevice.createShaderModule({
            label: 'LandscapeCullComputeShaderModule',
            code: landscapeCullComputeSource
        });

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: 'LandscapeCullUniformBuffer',
            size: this.#uniformData.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.#bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeCullBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}}
            ]
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'LandscapeCullPipelineLayout',
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: 'LandscapeCullComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

export default LandscapeGPUCuller;
