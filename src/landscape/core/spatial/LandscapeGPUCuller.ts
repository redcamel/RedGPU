import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeCullComputeSource from "../shader/landscapeCullCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

export class LandscapeGPUCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformByteLength: number = 0;
    #uniformData: Float32Array;
    #uniformUintData: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#initGPUResources();
    }

    updateBindGroup(
        allInputTilesBuffer: GPUBuffer,
        visibleTileIndicesBuffer: GPUBuffer,
        indirectDrawBuffer: GPUBuffer,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#bindGroupLayout || !this.#uniformBuffer) return;

        const targetHZBView = hzbTextureView || this.resourceManager.emptyBitmapTextureView;
        const targetHZBSampler = hzbSampler || this.resourceManager.basicSampler.gpuSampler;

        this.#bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_Cull_BindGroup_${this.instanceId}`,
            layout: this.#bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: {buffer: allInputTilesBuffer}},
                {binding: 2, resource: {buffer: visibleTileIndicesBuffer}},
                {binding: 3, resource: {buffer: indirectDrawBuffer}},
                {binding: 4, resource: targetHZBView},
                {binding: 5, resource: targetHZBSampler}
            ]
        });
    }

    updateUniforms(
        camX: number,
        camY: number,
        camZ: number,
        lodMaxLevel: number,
        worldSizeX: number,
        worldSizeZ: number,
        tileSizeX: number,
        tileSizeZ: number,
        heightScale: number,
        tileCount: number,
        frustumPlanes: number[][] | Float32Array[] | null,
        lodDistancesSq: Float32Array,
        tanHalfFOV: number = 1.0,
        lodMetric: number = 0.0,
        useHZB: boolean = false,
        viewProjectionMatrix: Float32Array | null = null
    ): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#uniformBuffer) return;

        const data = this.#uniformData;
        const uintData = this.#uniformUintData;

        data[0] = camX;
        data[1] = camY;
        data[2] = camZ;
        uintData[3] = lodMaxLevel;

        data[4] = worldSizeX;
        data[5] = worldSizeZ;
        data[6] = tileSizeX;
        data[7] = tileSizeZ;

        data[8] = heightScale;
        uintData[9] = tileCount;
        data[10] = tanHalfFOV;
        data[11] = lodMetric;

        uintData[12] = useHZB ? 1 : 0;
        data[13] = 0.0;
        data[14] = 0.0;
        data[15] = 0.0;

        if (viewProjectionMatrix && viewProjectionMatrix.length >= 16) {
            for (let i = 0; i < 16; i++) {
                data[16 + i] = viewProjectionMatrix[i];
            }
        } else {
            for (let i = 0; i < 16; i++) {
                data[16 + i] = 0.0;
            }
        }

        if (frustumPlanes && frustumPlanes.length >= 6) {
            for (let i = 0; i < 6; i++) {
                const plane = frustumPlanes[i];
                const offset = 32 + i * 4;
                data[offset] = plane[0];
                data[offset + 1] = plane[1];
                data[offset + 2] = plane[2];
                data[offset + 3] = plane[3];
            }
        } else {
            for (let i = 0; i < 6; i++) {
                const offset = 32 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

        const distCount = lodDistancesSq.length;
        for (let i = 0; i < 8; i++) {
            const val = i < distCount ? lodDistancesSq[i] : 0;
            data[56 + i] = (val && val > 0) ? val : 1e15;
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

    #initGPUResources(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_Cull_ShaderModule', landscapeCullComputeSource);

        let shaderModule = resourceManager.getGPUShaderModule('Landscape_Cull_ShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('Landscape_Cull_ShaderModule', {
                code: landscapeCullComputeSource
            });
        }

        this.#uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 256;
        this.#uniformData = new Float32Array(this.#uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintData = new Uint32Array(this.#uniformData.buffer);

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: `Landscape_Cull_UniformBuffer_${this.instanceId}`,
            size: this.#uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout('Landscape_Cull_BindGroupLayout', {
            label: 'Landscape_Cull_BindGroupLayout',
            ...descriptor
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Landscape_Cull_PipelineLayout', {
            bindGroupLayouts: [this.#bindGroupLayout]
        });
        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `Landscape_Cull_ComputePipeline_${this.instanceId}`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    destroy(): void {
        if (this.#uniformBuffer) {
            try {
                this.#uniformBuffer.destroy();
            } catch (e) {
            }
            this.#uniformBuffer = null;
        }
        this.#computePipeline = null;
        this.#bindGroup = null;
        this.#bindGroupLayout = null;
    }
}

Object.freeze(LandscapeGPUCuller);
export default LandscapeGPUCuller;
