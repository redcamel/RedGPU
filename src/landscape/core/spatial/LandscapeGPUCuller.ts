import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import landscapeCullSource from "../shader/landscapeCull.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

class LandscapeGPUCuller extends RedGPUObject {
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
        allTilesBuffer: GPUBuffer,
        visibleTilesBuffer: GPUBuffer,
        indirectDrawBuffer: GPUBuffer,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice || !this.#bindGroupLayout || !this.#uniformBuffer) return;

        const {emptyR32FloatTextureView, basicSampler} = resourceManager;
        const targetHZBView = hzbTextureView || emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler || basicSampler.gpuSampler;

        this.#bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_Cull_BindGroup_${this.instanceId}`,
            layout: this.#bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer}},
                {binding: 1, resource: {buffer: allTilesBuffer}},
                {binding: 2, resource: {buffer: visibleTilesBuffer}},
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
        tileSizeX: number,
        tileSizeZ: number,
        heightScale: number,
        tileCount: number,
        frustumPlanes: Float32Array | null,
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

        if (viewProjectionMatrix && viewProjectionMatrix.length >= 16) {
            for (let i = 0; i < 16; i++) {
                data[i] = viewProjectionMatrix[i];
            }
        } else {
            for (let i = 0; i < 16; i++) {
                data[i] = 0.0;
            }
        }

        if (frustumPlanes && frustumPlanes.length >= 24) {
            data.set(frustumPlanes.length === 24 ? frustumPlanes : frustumPlanes.subarray(0, 24), 16);
        } else {
            for (let i = 0; i < 6; i++) {
                const offset = 16 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

        const distCount = lodDistancesSq.length;
        for (let i = 0; i < 8; i++) {
            const val = i < distCount ? lodDistancesSq[i] : 0;
            data[40 + i] = (val && val > 0) ? val : 1e15;
        }

        data[48] = camX;
        data[49] = camY;
        data[50] = camZ;
        uintData[51] = lodMaxLevel;

        data[52] = tileSizeX;
        data[53] = tileSizeZ;
        data[54] = heightScale;
        uintData[55] = tileCount;

        data[56] = tanHalfFOV;
        data[57] = lodMetric;
        uintData[58] = useHZB ? 1 : 0;

        data[59] = 0.0;
        data[60] = 0.0;
        data[61] = 0.0;
        data[62] = 0.0;
        data[63] = 0.0;

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
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_Cull_ShaderModule', landscapeCullSource);

        let shaderModule = resourceManager.getGPUShaderModule('Landscape_Cull_ShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('Landscape_Cull_ShaderModule', {
                code: landscapeCullSource
            });
        }

        this.#uniformByteLength = shaderInfo.uniforms?.uniforms?.arrayBufferByteLength || 256;
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

