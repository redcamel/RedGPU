import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vhtShaderCode from "../shader/landscapeVHTBake.wgsl";
import vhtGlobalBakeShaderCode from "../shader/landscapeVHTGlobalBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 타일별 또는 전역 하이트맵 텍스처를 가상 하이트 텍스처(VHT) 아틀라스에 베이킹하는 생성기 클래스입니다.
 * [EN] Generator class that bakes per-tile or global heightmap textures into the Virtual Height Texture (VHT) atlas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class LandscapeVHTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Uint32Array;
    #uniformByteLength: number = 16;

    #globalComputePipeline: GPUComputePipeline | null = null;
    #globalBindGroupLayout: GPUBindGroupLayout | null = null;
    #globalUniformBuffer: ArrayBuffer;
    #globalUniformU32: Uint32Array;
    #globalUniformF32: Float32Array;
    #globalUniformByteLength: number = 32;

    /**
     * [KO] `LandscapeVHTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVHTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VHT');

        this.#globalUniformBuffer = new ArrayBuffer(32);
        this.#globalUniformU32 = new Uint32Array(this.#globalUniformBuffer);
        this.#globalUniformF32 = new Float32Array(this.#globalUniformBuffer);

        this.#initComputeResources();
        this.#initGlobalComputeResources();
    }

    /**
     * [KO] 개별 타일 하이트맵 텍스처를 VHT 아틀라스의 지정된 픽셀 영역에 베이킹합니다.
     * [EN] Bakes an individual tile heightmap texture into the specified pixel region of the VHT atlas.
     *
     * @param srcTileTexture -
     * [KO] 원본 타일 하이트맵 `GPUTexture`
     * [EN] Source tile heightmap `GPUTexture`
     * @param vhtAtlas -
     * [KO] 대상 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Target Virtual Height Texture (VHT) atlas
     * @param pixelX -
     * [KO] 아틀라스 내 기록할 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset in the atlas
     * @param pixelZ -
     * [KO] 아틀라스 내 기록할 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset in the atlas
     * @param pixelW -
     * [KO] 베이킹할 영역의 가로 픽셀 크기
     * [EN] Width of the baking region in pixels
     * @param pixelH -
     * [KO] 베이킹할 영역의 세로 픽셀 크기
     * [EN] Height of the baking region in pixels
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
        const {width, height} = vhtAtlas.gpuTexture;
        if (pixelX >= width || pixelZ >= height || pixelW <= 0 || pixelH <= 0) return;

        const {gpuDevice} = this.redGPUContext;

        const arr = this.#uniformArray;
        arr[0] = pixelX;
        arr[1] = pixelZ;
        arr[2] = pixelW;
        arr[3] = pixelH;

        const uniformBuffer = this.acquireUniformBuffer(this.#uniformByteLength);
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, this.#uniformByteLength);

        const srcView = srcTileTexture.createView();
        const bindGroup = gpuDevice.createBindGroup({
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

    /**
     * [KO] 전역 하이트맵 텍스처를 전체 VHT 아틀라스 영역에 리샘플링하여 베이킹합니다.
     * [EN] Resamples and bakes a global heightmap texture across the entire VHT atlas region.
     *
     * @param globalTexture -
     * [KO] 전역 하이트맵 `GPUTexture`
     * [EN] Global heightmap `GPUTexture`
     * @param vhtAtlas -
     * [KO] 대상 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Target Virtual Height Texture (VHT) atlas
     * @param compCountX -
     * [KO] X축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the X-axis
     * @param compCountZ -
     * [KO] Z축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the Z-axis
     */
    bakeGlobalBase(
        globalTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        compCountX: number,
        compCountZ: number
    ): void {
        const atlasW = compCountX * 512;
        const atlasH = compCountZ * 512;
        this.#bakeGlobalRegion(
            globalTexture,
            vhtAtlas,
            0, 0,
            atlasW, atlasH,
            0.0, 0.0, 1.0, 1.0
        );
    }

    #bakeGlobalRegion(
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
        const pipeline = this.#globalComputePipeline;
        if (!pipeline || !this.#globalBindGroupLayout) return;
        const {width, height} = vhtAtlas.gpuTexture;
        if (pixelX >= width || pixelZ >= height || pixelW <= 0 || pixelH <= 0) return;

        const {gpuDevice} = this.redGPUContext;

        this.#globalUniformU32[0] = pixelX;
        this.#globalUniformU32[1] = pixelZ;

        this.#globalUniformU32[2] = pixelW;
        this.#globalUniformU32[3] = pixelH;

        this.#globalUniformF32[4] = uMin;
        this.#globalUniformF32[5] = vMin;
        this.#globalUniformF32[6] = uMax;
        this.#globalUniformF32[7] = vMax;

        const uniformBuffer = this.acquireUniformBuffer(this.#globalUniformByteLength);
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, this.#globalUniformBuffer, 0, this.#globalUniformByteLength);

        const srcView = globalTexture.createView();
        const bindGroup = gpuDevice.createBindGroup({
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
                pass.setPipeline(pipeline);
                pass.setBindGroup(0, bindGroup);
                pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
                pass.end();
            }
        );
    }

    #initComputeResources(): void {
        const {resourceManager} = this.redGPUContext;
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
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_VHT_GlobalBake_ShaderModule', vhtGlobalBakeShaderCode);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);

        this.#globalBindGroupLayout = resourceManager.createBindGroupLayout(
            'Landscape_VHT_GlobalBake_BindGroupLayout',
            descriptor
        );

        const shaderModule = resourceManager.createGPUShaderModule(
            'Landscape_VHT_GlobalBake_ShaderModule',
            {code: vhtGlobalBakeShaderCode}
        );

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            'Landscape_VHT_GlobalBake_PipelineLayout',
            {
                bindGroupLayouts: [this.#globalBindGroupLayout]
            }
        );

        this.#globalComputePipeline = gpuDevice.createComputePipeline({
            label: 'Landscape_VHT_GlobalBake_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    /**
     * [KO] VHT 베이킹에 사용된 전역 컴퓨트 파이프라인과 유니폼 버퍼 리소스를 해제합니다.
     * [EN] Releases the global compute pipeline and uniform buffer resources used for VHT baking.
     */
    override destroy(): void {
        this.#globalComputePipeline = null;
        this.#globalBindGroupLayout = null;
        super.destroy();
    }
}

Object.freeze(LandscapeVHTGenerator);
export default LandscapeVHTGenerator;
