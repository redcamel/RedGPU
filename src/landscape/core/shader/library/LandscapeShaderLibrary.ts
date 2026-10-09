/**
 * [KO] 대규모 지형(Landscape) 시스템 전용 WGSL 셰이더 조각 라이브러리 모듈입니다.
 * [EN] WGSL shader chunk library module dedicated to the large-scale Landscape system.
 * @packageDocumentation
 */
import LandscapeLayerParams_wgsl from './struct/LandscapeLayerParams.wgsl';
import DrawIndexedIndirectArgs_wgsl from './struct/DrawIndexedIndirectArgs.wgsl';
import FoliageInstance_wgsl from './struct/FoliageInstance.wgsl';
import GrassInstance_wgsl from './struct/GrassInstance.wgsl';
import FoliageLODUniformInfo_wgsl from './struct/FoliageLODUniformInfo.wgsl';
import FoliageTypeParam_wgsl from './struct/FoliageTypeParam.wgsl';
import GrassTypeParam_wgsl from './struct/GrassTypeParam.wgsl';
import GrassParams_wgsl from './struct/GrassParams.wgsl';
import LandscapeUniforms_wgsl from './struct/LandscapeUniforms.wgsl';
import LandscapeTile_wgsl from './struct/LandscapeTile.wgsl';
import GrassVertexOutput_wgsl from './struct/GrassVertexOutput.wgsl';
import ImpostorBakeVertexOutput_wgsl from './struct/ImpostorBakeVertexOutput.wgsl';
import stochasticTiling_wgsl from './tiling/stochasticTiling.wgsl';
import textureDebuggerFragment_wgsl from './debugger/textureDebuggerFragment.wgsl';
import rotateVectorByQuat_wgsl from './math/rotateVectorByQuat.wgsl';
import quatMultiply_wgsl from './math/quatMultiply.wgsl';
import scatterColorPack_wgsl from './math/scatterColorPack.wgsl';
import scatterSpatialPrng_wgsl from './math/scatterSpatialPrng.wgsl';
import transformFoliagePosition_wgsl from './math/transformFoliagePosition.wgsl';
import ditherFadeDiscard_wgsl from './math/ditherFadeDiscard.wgsl';
import evaluateMipScaledAlphaCutoff_wgsl from './math/evaluateMipScaledAlphaCutoff.wgsl';
import testSphereInFrustum_wgsl from './math/testSphereInFrustum.wgsl';
import blendGrassGround_wgsl from './math/blendGrassGround.wgsl';
import transformGrassPosition_wgsl from './math/transformGrassPosition.wgsl';
import sampleNormalizedLayerWeight_wgsl from './math/sampleNormalizedLayerWeight.wgsl';
import checkAABBInHZB_wgsl from './math/checkAABBInHZB.wgsl';
import perturbNormalOrthonormal_wgsl from './math/perturbNormalOrthonormal.wgsl';
import WGSLParser from '../../../../resources/wgslParser/WGSLParser';

export namespace LandscapeShaderLibrary {
    /**
     * [KO] 지형 및 스캐터 관련 공통 WGSL 구조체 컬렉션
     * [EN] Common WGSL structure collection for terrain and scatter systems
     */
    export namespace struct {
        /**
         * [KO] 지형 스플랫 레이어 파라미터 구조체 (16 floats / 64바이트)
         * [EN] Landscape splat layer parameters struct (16 floats / 64 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeLayerParams;
         * ```
         */
        export const LandscapeLayerParams = LandscapeLayerParams_wgsl;

        /**
         * [KO] WebGPU 간접 드로우 인자 구조체 (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
         * [EN] WebGPU indirect draw arguments struct (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.DrawIndexedIndirectArgs;
         * ```
         */
        export const DrawIndexedIndirectArgs = DrawIndexedIndirectArgs_wgsl;

        /**
         * [KO] 3D 수목 식생(Foliage) 인스턴스 패킹 구조체 (8 x u32 / 32바이트)
         * [EN] 3D foliage instance packed struct (8 x u32 / 32 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.FoliageInstance;
         * ```
         */
        export const FoliageInstance = FoliageInstance_wgsl;

        /**
         * [KO] 절차적 잔디(Grass) 인스턴스 패킹 구조체 (8 x u32 / 32바이트)
         * [EN] Procedural grass instance packed struct (8 x u32 / 32 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.GrassInstance;
         * ```
         */
        export const GrassInstance = GrassInstance_wgsl;

        /**
         * [KO] 식생 LOD 거리 임계값 및 렌더 유닛 오프셋 구조체
         * [EN] Foliage LOD distance thresholds and render unit offsets struct
         *
         * ```wgsl
         * #redgpu_include landscape.struct.FoliageLODUniformInfo;
         * ```
         */
        export const FoliageLODUniformInfo = FoliageLODUniformInfo_wgsl;

        /**
         * [KO] 식생 타입별 컬링 및 렌더링 파라미터 구조체 (320바이트 / 80 floats)
         * [EN] Foliage type culling and rendering parameters struct (320 bytes / 80 floats)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.FoliageTypeParam;
         * ```
         */
        export const FoliageTypeParam = FoliageTypeParam_wgsl;

        /**
         * [KO] 잔디 타입별 컬링 및 렌더링 파라미터 구조체 (64바이트 / 16 floats)
         * [EN] Grass type culling and rendering parameters struct (64 bytes / 16 floats)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.GrassTypeParam;
         * ```
         */
        export const GrassTypeParam = GrassTypeParam_wgsl;

        /**
         * [KO] 잔디 렌더링 파라미터 구조체 (80바이트 / 20 floats/uints)
         * [EN] Grass rendering parameters struct (80 bytes / 20 floats/uints)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.GrassParams;
         * ```
         */
        export const GrassParams = GrassParams_wgsl;

        /**
         * [KO] 지형 버텍스 및 프래그먼트 셰이더 메인 유니폼 버퍼 구조체 (26개 필드)
         * [EN] Terrain vertex and fragment shader main uniform buffer struct (26 fields)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeUniforms;
         * ```
         */
        export const LandscapeUniforms = LandscapeUniforms_wgsl;

        /**
         * [KO] 지형 단일 타일 청크 공간 위치(centerWorldX, centerWorldZ) 및 정규화 높이 범위(minHeightNorm, maxHeightNorm) 구조체 (16바이트)
         * [EN] Static spatial world center coordinates and normalized height bounds (minHeightNorm, maxHeightNorm) struct for an individual landscape tile chunk (16 bytes)
         *
         * ```wgsl
         * #redgpu_include landscape.struct.LandscapeTile;
         * ```
         */
        export const LandscapeTile = LandscapeTile_wgsl;

        /**
         * [KO] 잔디 렌더링 파이프라인 버텍스 출력 구조체 (clipPos, worldPos, uv, normal, heightRatio, alphaFade, currentClipPos, prevClipPos, groundColor)
         * [EN] Grass rendering pipeline vertex output structure
         *
         * ```wgsl
         * #redgpu_include landscape.struct.GrassVertexOutput;
         * ```
         */
        export const GrassVertexOutput = GrassVertexOutput_wgsl;

        /**
         * [KO] 임포스터 베이킹 파이프라인 버텍스 출력 구조체 (position, uv, vertexColor_0, worldNormal, worldTangent, worldPos, baseColorFactor, materialParams, textureFlags, sphereCenterRadius, cameraDir)
         * [EN] Foliage impostor baking pipeline vertex output structure
         *
         * ```wgsl
         * #redgpu_include landscape.struct.ImpostorBakeVertexOutput;
         * ```
         */
        export const ImpostorBakeVertexOutput = ImpostorBakeVertexOutput_wgsl;
    }

    /**
     * [KO] 텍스처 타일링 아티팩트 방지 수학 및 샘플링 모듈
     * [EN] Texture tiling artifact elimination math and sampling modules
     */
    export namespace tiling {
        /**
         * [KO] 삼각 그리드 기반 확률적(Stochastic) 텍스처 타일링 수학 및 해시 함수 (stochasticHash2D, rotate2D, StochasticGridTri, getStochasticGridTri, StochasticSampleResult)
         * [EN] Triangular grid-based stochastic texture tiling math and hash functions
         *
         * ```wgsl
         * #redgpu_include landscape.tiling.stochasticTiling;
         * ```
         */
        export const stochasticTiling = stochasticTiling_wgsl;
    }

    /**
     * [KO] 지형 및 스캐터 관련 공통 수학(Math) 함수 컬렉션
     * [EN] Common math function collection for terrain and scatter systems
     */
    export namespace math {
        /**
         * [KO] 단위 쿼터니언(vec4<f32>)으로 3차원 벡터(vec3<f32>)를 고속 회전하는 함수 (rotateVectorByQuat)
         * [EN] Fast vector rotation function using unit quaternion (vec4<f32>) (rotateVectorByQuat)
         *
         * ```wgsl
         * #redgpu_include landscape.math.rotateVectorByQuat;
         * ```
         */
        export const rotateVectorByQuat = rotateVectorByQuat_wgsl;

        /**
         * [KO] 두 쿼터니언(vec4<f32>)의 곱셈을 수행하여 합성 회전을 계산하는 함수 (quatMultiply)
         * [EN] Multiplies two quaternions (vec4<f32>) to compute composite rotation (quatMultiply)
         *
         * ```wgsl
         * #redgpu_include landscape.math.quatMultiply;
         * ```
         */
        export const quatMultiply = quatMultiply_wgsl;

        /**
         * [KO] 스캐터 인스턴스 지면 색상(RGB) 및 식생/잔디 타입 ID(또는 알파) 패킹/언패킹 함수 모음 (packGroundColorAndType, unpackTypeId, unpackGroundColor, replacePackedAlpha)
         * [EN] Scatter instance ground color (RGB) and type ID (or alpha) bit packing/unpacking functions (packGroundColorAndType, unpackTypeId, unpackGroundColor, replacePackedAlpha)
         *
         * ```wgsl
         * #redgpu_include landscape.math.scatterColorPack;
         * ```
         */
        export const scatterColorPack = scatterColorPack_wgsl;

        /**
         * [KO] 절차적 스캐터링 그리드 시드 생성 및 SplitMix32 고속 의사난수(PRNG) 생성 함수 (computeScatterGridSeed, splitMix32)
         * [EN] Procedural scattering grid seed generation and SplitMix32 fast PRNG functions (computeScatterGridSeed, splitMix32)
         *
         * ```wgsl
         * #redgpu_include landscape.math.scatterSpatialPrng;
         * ```
         */
        export const scatterSpatialPrng = scatterSpatialPrng_wgsl;

        /**
         * [KO] 인스턴스 정점의 렌더 유닛 계층 행렬 변환 및 쿼터니언 회전/스케일/월드 이동 수식 (transformFoliagePosition)
         * [EN] Render unit hierarchy matrix transform, quaternion rotation, scale and world translation for foliage vertex (transformFoliagePosition)
         *
         * ```wgsl
         * #redgpu_include landscape.math.transformFoliagePosition;
         * ```
         */
        export const transformFoliagePosition = transformFoliagePosition_wgsl;

        /**
         * [KO] TAA 친화적 시간 축 지터(Temporal Jitter) 4x4 Bayer 매트릭스 디더 페이드 디스카드 함수 (ditherFadeDiscard)
         * [EN] TAA-friendly temporal jittered 4x4 Bayer matrix dither fade discard function (ditherFadeDiscard)
         *
         * ```wgsl
         * #redgpu_include landscape.math.ditherFadeDiscard;
         * ditherFadeDiscard(fragCoordXY, fadeValue, frameIndex);
         * ```
         */
        export const ditherFadeDiscard = ditherFadeDiscard_wgsl;

        /**
         * [KO] 밉맵 보정 알파 컷오프(Mip-Scaled Cutoff) 디스카드 함수 (evaluateMipScaledAlphaCutoff)
         * [EN] Mip-scaled alpha cutoff discard function (evaluateMipScaledAlphaCutoff)
         *
         * ```wgsl
         * #redgpu_include landscape.math.evaluateMipScaledAlphaCutoff;
         * ```
         */
        export const evaluateMipScaledAlphaCutoff = evaluateMipScaledAlphaCutoff_wgsl;

        /**
         * [KO] 3D 구체와 6개 평면 절두체(Frustum) 간의 교차 판정 함수 (testSphereInFrustum)
         * [EN] 3D bounding sphere and 6-plane frustum intersection test function (testSphereInFrustum)
         *
         * ```wgsl
         * #redgpu_include landscape.math.testSphereInFrustum;
         * ```
         */
        export const testSphereInFrustum = testSphereInFrustum_wgsl;

        /**
         * [KO] 잔디 지면 색상 블렌딩, 알파 림 필터링 및 상향 노멀 연산 모듈
         * [EN] Grass ground color blending, alpha rim filtering, and upward normal calculation module
         *
         * ```wgsl
         * #redgpu_include landscape.math.blendGrassGround;
         * ```
         */
        export const blendGrassGround = blendGrassGround_wgsl;

        /**
         * [KO] 잔디 인스턴스 정점 변환, 쿼터니언 회전 및 지면 침하 보정 모듈
         * [EN] Grass instance vertex transformation, quaternion rotation, and ground sink compensation module
         *
         * ```wgsl
         * #redgpu_include landscape.math.transformGrassPosition;
         * ```
         */
        export const transformGrassPosition = transformGrassPosition_wgsl;

        /**
         * [KO] 지형 스플랫 가중치 텍스처를 샘플링하여 지정된 채널의 정규화된 레이어 가중치를 평가하는 함수 (sampleNormalizedLayerWeight)
         * [EN] Function to sample terrain splat weight texture and evaluate normalized layer weight for a specified channel (sampleNormalizedLayerWeight)
         *
         * ```wgsl
         * #redgpu_include landscape.math.sampleNormalizedLayerWeight;
         * ```
         */
        export const sampleNormalizedLayerWeight = sampleNormalizedLayerWeight_wgsl;

        /**
         * [KO] 3D 바운딩 박스(AABB) 8개 정점을 NDC로 투영하여 HZB 깊이 피라미드 기반 오클루전 가시성을 판정하는 함수 (checkAABBInHZB)
         * [EN] Function to project 3D AABB 8 corners to NDC and evaluate occlusion visibility against HZB depth pyramid (checkAABBInHZB)
         *
         * ```wgsl
         * #redgpu_include landscape.math.checkAABBInHZB;
         * ```
         */
        export const checkAABBInHZB = checkAABBInHZB_wgsl;

        /**
         * [KO] 그람-슈미트 정규직교 기저(Gram-Schmidt Orthonormal Basis)를 구축하여 탄젠트 노멀을 월드 노멀에 섭동하는 함수 (perturbNormalOrthonormal)
         * [EN] Function to perturb world normal with tangent normal via Gram-Schmidt orthonormal basis (perturbNormalOrthonormal)
         *
         * ```wgsl
         * #redgpu_include landscape.math.perturbNormalOrthonormal;
         * ```
         */
        export const perturbNormalOrthonormal = perturbNormalOrthonormal_wgsl;
    }

    /**
     * [KO] 온스크린 지형 가상 텍스처 디버깅 셰이더 모듈
     * [EN] On-screen terrain virtual texture debugger shader modules
     */
    export namespace debug {
        /**
         * [KO] 전체 화면 쿼드 2D 텍스처 샘플링 프래그먼트 셰이더 (VBT/VNT 등 공통)
         * [EN] Fullscreen quad 2D texture sampling fragment shader (common for VBT/VNT, etc.)
         *
         * ```wgsl
         * #redgpu_include landscape.debug.textureDebuggerFragment;
         * ```
         */
        export const textureDebuggerFragment = textureDebuggerFragment_wgsl;
    }
}

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;
