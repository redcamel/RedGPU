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
 * **[KO] 아키텍처 및 역할:**
 * - **가상 높이 텍스처(VHT) 구축**: 지형 지면의 물리적 고도 데이터를 16/32비트 고정밀 부동소수점 포맷으로 VHT 아틀라스에 굽습니다. 이 데이터는 지형 컴포넌트의 버텍스 셰이더 변위(Vertex Displacement) 및 물리 충돌 계산의 원천이 됩니다.
 * - **듀얼 베이킹 파이프라인**:
 *   - **개별 타일 베이킹 (`landscapeVHTBake.wgsl`)**: 스트리밍되는 타일별 개별 높이맵 이미지를 아틀라스의 해당 타일 슬롯 위치에 정밀하게 배치합니다.
 *   - **전역 높이맵 분할 베이킹 (`landscapeVHTGlobalBake.wgsl`)**: 전체 지형을 아우르는 단일 거대 전역 높이맵으로부터 각 타일 영역의 UV를 계산하여 고속 분할 복사합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Virtual Height Texture (VHT) Construction**: Bakes terrain physical elevation data into the VHT atlas in 16/32-bit high-precision floating-point formats, providing the single source of truth for vertex displacement and physics queries.
 * - **Dual Baking Pipelines**:
 *   - **Per-tile Baking (`landscapeVHTBake.wgsl`)**: Precisely places streamed individual tile heightmap images into designated atlas tile slots.
 *   - **Global Heightmap Split Baking (`landscapeVHTGlobalBake.wgsl`)**: Fast-samples and splits localized tile regions from a unified global heightmap texture using UV coordinate transformation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(LandscapeTileStreamer)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (LandscapeTileStreamer).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
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
     * [KO] 전역 지형 높이맵 텍스처 전체를 VHT 아틀라스의 전역 베이스로 일괄 베이킹합니다.
     * [EN] Bakes the entire global terrain heightmap texture into the VHT atlas base in a single batch.
     *
     * @param globalTexture -
     * [KO] 소스 전역 높이맵 GPUTexture
     * [EN] Source global heightmap GPUTexture
     * @param vhtAtlas -
     * [KO] 대상 VHT 아틀라스 DirectTexture
     * [EN] Target VHT atlas DirectTexture
     * @param compCountX -
     * [KO] X축 컴포넌트 타일 개수
     * [EN] Number of component tiles along X axis
     * @param compCountZ -
     * [KO] Z축 컴포넌트 타일 개수
     * [EN] Number of component tiles along Z axis
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

    /**
     * [KO] 전역 지형 높이맵의 특정 UV 서브 영역을 VHT 아틀라스의 지정된 픽셀 영역으로 베이킹합니다.
     * [EN] Bakes a specific UV sub-region of the global terrain heightmap into the designated pixel area of the VHT atlas.
     *
     * @param globalTexture -
     * [KO] 소스 전역 높이맵 GPUTexture
     * [EN] Source global heightmap GPUTexture
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
     * @param uMin -
     * [KO] 소스 텍스처 시작 U 좌표 (0.0 ~ 1.0)
     * [EN] Source texture start U coordinate (0.0 to 1.0)
     * @param vMin -
     * [KO] 소스 텍스처 시작 V 좌표 (0.0 ~ 1.0)
     * [EN] Source texture start V coordinate (0.0 to 1.0)
     * @param uMax -
     * [KO] 소스 텍스처 종료 U 좌표 (0.0 ~ 1.0)
     * [EN] Source texture end U coordinate (0.0 to 1.0)
     * @param vMax -
     * [KO] 소스 텍스처 종료 V 좌표 (0.0 ~ 1.0)
     * [EN] Source texture end V coordinate (0.0 to 1.0)
     */
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
     * [KO] 전역 높이맵 분할 베이킹 컴퓨트 파이프라인, 바인드 그룹 레이아웃 및 부모 자원을 모두 해제합니다.
     * [EN] Releases global heightmap compute pipeline, bind group layout, and parent resources.
     */
    override destroy(): void {
        this.#globalComputePipeline = null;
        this.#globalBindGroupLayout = null;
        super.destroy();
    }
}

Object.freeze(LandscapeVHTGenerator);
export default LandscapeVHTGenerator;
