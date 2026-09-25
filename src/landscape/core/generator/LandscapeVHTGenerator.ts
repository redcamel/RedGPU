import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vhtShaderCode from "../shader/landscapeVHTBake.wgsl";
import vhtGlobalBakeShaderCode from "../shader/landscapeVHTGlobalBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export class LandscapeVHTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Uint32Array;
    #uniformByteLength: number = 16;

    #globalComputePipeline: GPUComputePipeline | null = null;
    #globalBindGroupLayout: GPUBindGroupLayout | null = null;
    #globalSampler: GPUSampler | null = null;
    #globalUniformBuffer: ArrayBuffer;
    #globalUniformU32: Uint32Array;
    #globalUniformF32: Float32Array;
    #globalUniformByteLength: number = 32;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VHT');
        this.#uniformArray = new Uint32Array(4);

        this.#globalUniformBuffer = new ArrayBuffer(32);
        this.#globalUniformU32 = new Uint32Array(this.#globalUniformBuffer);
        this.#globalUniformF32 = new Float32Array(this.#globalUniformBuffer);

        this.#globalSampler = redGPUContext.gpuDevice.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            label: 'Landscape_VHT_Global_Sampler'
        });

        this.#initComputeResources();
        this.#initGlobalComputeResources();
    }

    bakeTileRegion(
        srcTileTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;
        if (pixelX >= atlasW || pixelZ >= atlasH || pixelW <= 0 || pixelH <= 0) return;

        const device = this.redGPUContext.gpuDevice;

        const arr = this.#uniformArray;
        arr[0] = pixelX;
        arr[1] = pixelZ;
        arr[2] = pixelW;
        arr[3] = pixelH;

        const uniformBuffer = this.acquireUniformBuffer(this.#uniformByteLength);
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, this.#uniformByteLength);

        const srcView = srcTileTexture.createView();
        const bindGroup = device.createBindGroup({
            label: `Landscape_VHT_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: srcView
                },
                {
                    binding: 1,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 2,
                    resource: {buffer: uniformBuffer}
                }
            ]
        });

        this.dispatchBakePass(bindGroup, pixelW, pixelH, pixelX, pixelZ);
    }

    bakeGlobalBase(
        globalTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        compCountX: number,
        compCountZ: number
    ): void {
        const atlasW = compCountX * 512;
        const atlasH = compCountZ * 512;
        this.bakeGlobalRegion(
            globalTexture,
            vhtAtlas,
            0, 0,
            atlasW, atlasH,
            0.0, 0.0, 1.0, 1.0
        );
    }

    bakeGlobalRegion(
        globalTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number,
        uMin: number,
        vMin: number,
        uMax: number,
        vMax: number
    ): void {
        if (!this.#globalComputePipeline || !this.#globalBindGroupLayout) return;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;
        if (pixelX >= atlasW || pixelZ >= atlasH || pixelW <= 0 || pixelH <= 0) return;

        const device = this.redGPUContext.gpuDevice;

        this.#globalUniformU32[0] = pixelX;
        this.#globalUniformU32[1] = pixelZ;

        this.#globalUniformU32[2] = pixelW;
        this.#globalUniformU32[3] = pixelH;

        this.#globalUniformF32[4] = uMin;
        this.#globalUniformF32[5] = vMin;
        this.#globalUniformF32[6] = uMax;
        this.#globalUniformF32[7] = vMax;

        const uniformBuffer = this.acquireUniformBuffer(this.#globalUniformByteLength);
        device.queue.writeBuffer(uniformBuffer, 0, this.#globalUniformBuffer, 0, this.#globalUniformByteLength);

        const srcView = globalTexture.createView();

        const bindGroup = device.createBindGroup({
            label: `Landscape_VHT_Global_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.#globalBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: srcView
                },
                {
                    binding: 1,
                    resource: this.#globalSampler!
                },
                {
                    binding: 2,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 3,
                    resource: {buffer: uniformBuffer}
                }
            ]
        });

        const workgroupCountX = Math.max(1, Math.ceil(pixelW / 16));
        const workgroupCountY = Math.max(1, Math.ceil(pixelH / 16));

        this.redGPUContext.commandEncoderManager.useEncoder(
            COMMAND_ENCODER_TYPE.RESOURCE,
            (commandEncoder) => {
                const pass = commandEncoder.beginComputePass({
                    label: `Landscape_VHT_Global_BakePass_[${pixelX},${pixelZ}]`
                });
                pass.setPipeline(this.#globalComputePipeline!);
                pass.setBindGroup(0, bindGroup);
                pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
                pass.end();
            }
        );
    }

    #initComputeResources(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('LandscapeVHTBakeComputeShaderModule', vhtShaderCode);
        const uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 16;
        this.#uniformByteLength = uniformByteLength;
        this.#uniformArray = new Uint32Array(uniformByteLength / Uint32Array.BYTES_PER_ELEMENT);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0, {
            0: {
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d'
                }
            }
        });

        this.initBaseComputePipeline(
            'LandscapeVHTBakeComputeShaderModule',
            vhtShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            uniformByteLength
        );
    }

    #initGlobalComputeResources(): void {
        const device = this.redGPUContext.gpuDevice;
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('LandscapeVHTGlobalBakeComputeShaderModule', vhtGlobalBakeShaderCode);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);

        this.#globalBindGroupLayout = device.createBindGroupLayout(descriptor);

        const shaderModule = resourceManager.createGPUShaderModule(
            'LandscapeVHTGlobalBakeComputeShaderModule',
            {code: vhtGlobalBakeShaderCode}
        );

        const pipelineLayout = device.createPipelineLayout({
            label: 'LandscapeVHTGlobalBake_PipelineLayout',
            bindGroupLayouts: [this.#globalBindGroupLayout]
        });

        this.#globalComputePipeline = device.createComputePipeline({
            label: 'LandscapeVHTGlobalBake_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

export default LandscapeVHTGenerator;
