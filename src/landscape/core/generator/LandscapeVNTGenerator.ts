/**
 * [KO] 지형 가상 노멀 텍스처(VNT) 아틀라스 베이킹 제너레이터 모듈입니다.
 * [EN] Terrain virtual normal texture (VNT) atlas baking generator module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vntBakeShaderCode from "../shader/landscapeVNTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] VHT 높이맵 아틀라스를 중앙 차분(Sobel/Central Difference) 방식으로 분석하여 VNT 노멀 아틀라스를 베이킹하는 제너레이터 클래스입니다.
 * [EN] Generator class that analyzes VHT height map atlases via central difference to bake VNT normal atlases.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **해석적 법선 벡터(Normal) 도출**: 사전에 노멀맵 텍스처를 저장해둘 필요 없이, 이미 베이킹된 VHT 높이맵 픽셀들의 경사도(Gradient)를 Sobel/중앙 차분 필터로 실시간 계산하여 정확한 노멀 벡터를 도출합니다.
 * - **물리적 스케일 동기화**: 지형의 월드 크기(`worldSizeX`), 타일 개수(`componentCountX`), 그리고 실제 높이 배율(`heightScale`)을 반영하여 경사도의 탄젠트 공간 및 월드 공간 법선을 완벽하게 일치시킵니다.
 * - **VBT 및 라이팅 파이프라인의 핵심 입력**: 생성된 VNT 아틀라스는 VBT 베이스 재질 굽기 단계에서 슬로프(경사도) 기반 블렌딩 가중치 계산에 사용될 뿐만 아니라 최종 PBR 지형 셰이딩의 기본 법선으로 활용됩니다.
 *
 * **[EN] Architecture & Role:**
 * - **Analytic Normal Vector Derivation**: Computes accurate normal vectors in real time using Sobel/central difference filtering on gradients from baked VHT heightmaps, eliminating the need for pre-authored normal textures.
 * - **Physical Scale Synchronization**: Reflects the terrain world dimensions (`worldSizeX`), tile counts (`componentCountX`), and `heightScale` to perfectly calibrate surface normal steepness.
 * - **Core Input for VBT & Lighting**: The resulting VNT atlas serves both as slope-blending weight inputs for VBT material baking and primary surface normals for final PBR landscape shading.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(LandscapeTileStreamer)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (LandscapeTileStreamer).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeVNTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Float32Array;
    #uniformByteLength: number = 48;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VNT');
        this.#uniformArray = new Float32Array(12);
        this.#initComputeResources();
    }

    /**
     * [KO] 특정 타일 영역에 대해 VHT 높이맵을 기반으로 노멀 벡터를 계산하여 VNT 아틀라스로 베이킹합니다.
     * [EN] Computes normal vectors from the VHT height map for a specific tile region and bakes them into the VNT atlas.
     * @param vhtAtlas -
     * [KO] 소스 VHT 높이맵 아틀라스
     * [EN] Source VHT height map atlas
     * @param vntAtlas -
     * [KO] 대상 VNT 노멀 아틀라스
     * [EN] Target VNT normal atlas
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
     * @param heightScale -
     * [KO] 지형 높이 스케일
     * [EN] Terrain height scale
     * @param worldSizeX -
     * [KO] 지형 월드 X 크기
     * [EN] Terrain world X size
     * @param componentCountX -
     * [KO] X축 컴포넌트(타일) 수
     * [EN] Component (tile) count along X axis
     */
    bakeTileRegion(
        vhtAtlas: DirectTexture,
        vntAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number,
        heightScale: number,
        worldSizeX: number,
        componentCountX: number
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vhtAtlas?.gpuTexture || !vntAtlas?.gpuTexture) return;

        const {gpuDevice} = this.redGPUContext;
        const {width, height} = vhtAtlas.gpuTexture;

        const texelWorldSize = worldSizeX / (componentCountX * 512);

        const bakeX = Math.max(0, pixelX - 1);
        const bakeZ = Math.max(0, pixelZ - 1);
        const bakeW = Math.min(width - bakeX, pixelW + (pixelX > 0 ? 2 : 1));
        const bakeH = Math.min(height - bakeZ, pixelH + (pixelZ > 0 ? 2 : 1));

        if (bakeW <= 0 || bakeH <= 0 || pixelX >= width || pixelZ >= height) return;

        const arr = this.#uniformArray;
        arr[0] = bakeX;
        arr[1] = bakeZ;
        arr[2] = bakeW;
        arr[3] = bakeH;

        arr[4] = width;
        arr[5] = height;
        arr[6] = heightScale;
        arr[7] = texelWorldSize;

        const uniformBuffer = this.acquireUniformBuffer(this.#uniformByteLength);
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, this.#uniformByteLength);

        const bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_VNT_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                },
                {
                    binding: 1,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 2,
                    resource: vntAtlas.gpuTextureView
                }
            ]
        });

        this.dispatchBakePass(bindGroup, bakeW, bakeH, pixelX, pixelZ);
    }

    #initComputeResources(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('Landscape_VNT_Bake_ShaderModule', vntBakeShaderCode);
        const uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 48;
        this.#uniformByteLength = uniformByteLength;
        this.#uniformArray = new Float32Array(uniformByteLength / Float32Array.BYTES_PER_ELEMENT);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0, {
            1: {
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d'
                }
            }
        });

        this.initBaseComputePipeline(
            'Landscape_VNT_Bake_ShaderModule',
            vntBakeShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            uniformByteLength
        );
    }
}

Object.freeze(LandscapeVNTGenerator);
export default LandscapeVNTGenerator;
