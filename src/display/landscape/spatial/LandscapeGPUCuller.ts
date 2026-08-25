import RedGPUContext from "../../../context/RedGPUContext";
import landscapeCullComputeSource from "../shader/landscapeCullCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

export class LandscapeGPUCuller {
    #redGPUContext: RedGPUContext;

    #computePipeline: GPUComputePipeline | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformByteLength: number = 0;
    #uniformData: Float32Array;
    #uniformUintData: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
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
        lodDistancesSq: Float32Array,
        tanHalfFOV: number = 1.0,
        lodMetric: number = 0.0
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
        data[10] = tanHalfFOV;
        data[11] = lodMetric;

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

            for (let i = 0; i < 6; i++) {
                const offset = 12 + i * 4;
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 1000000000.0;
            }
        }

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

    #initGPUResources(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.#redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('LandscapeCullComputeShaderModule', landscapeCullComputeSource);

        let shaderModule = resourceManager.getGPUShaderModule('LandscapeCullComputeShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('LandscapeCullComputeShaderModule', {
                code: landscapeCullComputeSource
            });
        }

        // WGSLParser 리플렉션으로부터 CameraFrustumUniforms 구조체 크기 동적 추출
        this.#uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 176;
        this.#uniformData = new Float32Array(this.#uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintData = new Uint32Array(this.#uniformData.buffer);

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: 'LandscapeCullUniformBuffer',
            size: this.#uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeCullBindGroupLayout',
            ...descriptor
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

export default LandscapeGPUCuller;
