/**
 * [KO] 지형 가상 높이 텍스처(VHT) 아틀라스 베이킹 제너레이터 모듈입니다.
 * [EN] Terrain virtual height texture (VHT) atlas baking generator module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vhtShaderCode from "../shader/landscapeVHTBake.wgsl";
import vhtGlobalBakeShaderCode from "../shader/landscapeVHTGlobalBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 타일 단위 높이맵 또는 전역 지형 높이맵 텍스처를 VHT 아틀라스 텍스처로 베이킹하는 제너레이터 클래스입니다.
 * [EN] Generator class that bakes per-tile height maps or global terrain height map textures into the VHT atlas texture.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(LandscapeTileStreamer)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (LandscapeTileStreamer).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeVHTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Uint32Array;
    #uniformByteLength: number = 16;

    #globalComputePipeline: GPUComputePipeline | null = null;
    #globalBindGroupLayout: GPUBindGroupLayout | null = null;
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

        this.#initComputeResources();
        this.#initGlobalComputeResources();
    }

    /**
     * [KO] 특정 지형 컴포넌트(타일)의 높이맵 텍스처를 VHT 아틀라스의 지정된 영역으로 베이킹합니다.
     * [EN] Bakes the heightmap texture of a specific terrain component (tile) into the designated region of the VHT atlas.
     * @param srcTileTexture -
     * [KO] 소스 타일 높이맵 GPUTexture
     * [EN] Source tile heightmap GPUTexture
     * @param vhtAtlas -
     * [KO] 대상 VHT 아틀라스 DirectTexture
     * [EN] Target VHT atlas DirectTexture
     * @param pixelX -
     * [KO] 아틀라스 내 베이킹 대상 X 좌표 (픽셀)
     * [EN] Destination X coordinate in atlas (pixels)
     * @param pixelZ -
     * [KO] 아틀라스 내 베이킹 대상 Z 좌표 (픽셀)
     * [EN] Destination Z coordinate in atlas (pixels)
     * @param pixelW -
     * [KO] 베이킹 영역 너비 (픽셀)
     * [EN] Baking region width (pixels)
     * @param pixelH -
     * [KO] 베이킹 영역 높이 (픽셀)
     * [EN] Baking region height (pixels)
     */
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
                    resource: this.redGPUContext.resourceManager.basicSampler.gpuSampler
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
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_VHT_Bake_ShaderModule', vhtShaderCode);
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
            'Landscape_VHT_Bake_ShaderModule',
            vhtShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            uniformByteLength
        );
    }

    #initGlobalComputeResources(): void {
        const device = this.redGPUContext.gpuDevice;
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_VHT_GlobalBake_ShaderModule', vhtGlobalBakeShaderCode);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);

        this.#globalBindGroupLayout = device.createBindGroupLayout(descriptor);

        const shaderModule = resourceManager.createGPUShaderModule(
            'Landscape_VHT_GlobalBake_ShaderModule',
            {code: vhtGlobalBakeShaderCode}
        );

        const pipelineLayout = device.createPipelineLayout({
            label: 'Landscape_VHT_GlobalBake_PipelineLayout',
            bindGroupLayouts: [this.#globalBindGroupLayout]
        });

        this.#globalComputePipeline = device.createComputePipeline({
            label: 'Landscape_VHT_GlobalBake_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

Object.freeze(LandscapeVHTGenerator);
export default LandscapeVHTGenerator;
