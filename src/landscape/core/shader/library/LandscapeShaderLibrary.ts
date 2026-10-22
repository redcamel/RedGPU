import WGSLParser from '../../../../resources/wgslParser/WGSLParser';
import rotateVectorByQuat from './common/rotateVectorByQuat.wgsl';
import testSphereInFrustum from './common/testSphereInFrustum.wgsl';
import checkAABBInHZB from './common/checkAABBInHZB.wgsl';
import stochasticSampling from './common/stochasticSampling.wgsl';
import scatterBakeCommon from './common/scatterBakeCommon.wgsl';
import scatterCullCommon from './common/scatterCullCommon.wgsl';
import foliageOctahedralCommon from './common/foliageOctahedralCommon.wgsl';
import grassVertexCommon from './common/grassVertexCommon.wgsl';
import grassFragmentCommon from './common/grassFragmentCommon.wgsl';
import LandscapeTile from './struct/LandscapeTile.wgsl';
import LandscapeUniforms from './struct/LandscapeUniforms.wgsl';
import LandscapeLayerParams from './struct/LandscapeLayerParams.wgsl';
import StochasticGridTri from './struct/StochasticGridTri.wgsl';
import StochasticSampleResult from './struct/StochasticSampleResult.wgsl';
import DrawIndexedIndirectArgs from './struct/DrawIndexedIndirectArgs.wgsl';
import LandscapeSurfaceSample from './struct/LandscapeSurfaceSample.wgsl';
import FoliageInstance from './struct/FoliageInstance.wgsl';
import ImpostorBakeVertexOutput from './struct/ImpostorBakeVertexOutput.wgsl';
import GrassInstance from './struct/GrassInstance.wgsl';
import GrassRenderParams from './struct/GrassRenderParams.wgsl';
import GrassVertexOutput from './struct/GrassVertexOutput.wgsl';
import GrassShadowVertexOutput from './struct/GrassShadowVertexOutput.wgsl';
import GrassPositionResult from './struct/GrassPositionResult.wgsl';

/**
 * [KO] 지형, 식생 및 잔디 셰이더에서 공용으로 참조하는 WGSL 구조체 및 유틸리티 함수 라이브러리입니다.
 * [EN] WGSL struct and utility function library shared across landscape, foliage, and grass shaders.
 *
 * @category Landscape
 */
export const LandscapeShaderLibrary = Object.freeze({
    /**
     * [KO] 쿼터니언을 사용하여 3차원 벡터를 회전시키는 WGSL 함수 코드입니다.
     * [EN] WGSL function code that rotates a 3D vector using a quaternion.
     */
    rotateVectorByQuat,
    /**
     * [KO] 구(Sphere)와 절두체(Frustum) 평면 간의 교차 여부를 판정하는 WGSL 함수 코드입니다.
     * [EN] WGSL function code that tests intersection between a sphere and frustum planes.
     */
    testSphereInFrustum,
    /**
     * [KO] 계층적 Z-버퍼(HZB)를 사용하여 AABB의 오클루전 컬링 여부를 검사하는 WGSL 함수 코드입니다.
     * [EN] WGSL function code that checks AABB occlusion culling against the Hierarchical Z-Buffer (HZB).
     */
    checkAABBInHZB,
    /**
     * [KO] 지형, 식생 및 잔디 셰이더에서 공용으로 사용하는 WGSL 구조체 모음입니다.
     * [EN] Collection of shared WGSL structs used across landscape, foliage, and grass shaders.
     */
    struct: Object.freeze({
        LandscapeTile,
        LandscapeUniforms,
        LandscapeLayerParams,
        StochasticGridTri,
        StochasticSampleResult,
        DrawIndexedIndirectArgs,
        LandscapeSurfaceSample,
        FoliageInstance,
        ImpostorBakeVertexOutput,
        GrassInstance,
        GrassRenderParams,
        GrassVertexOutput,
        GrassShadowVertexOutput,
        GrassPositionResult
    }),
    /**
     * [KO] 지형 스플래팅 레이어의 스토캐스틱 타일링 샘플링 헬퍼 함수 및 구조체 번들입니다.
     * [EN] Stochastic tiling sampling helper function and struct bundle for landscape splatting layers.
     */
    stochasticSampling,
    /**
     * [KO] 식생 및 잔디 인스턴스 베이킹 컴퓨트 셰이더의 공통 지형 고도/법선/가중치 샘플링 함수 번들입니다.
     * [EN] Common terrain height, normal, and weight sampling function bundle for foliage and grass instance baking compute shaders.
     */
    scatterBakeCommon,
    /**
     * [KO] 스캐터 인스턴스 컬링 컴퓨트 셰이더의 공통 간접 드로우 구조체 및 언패킹 함수 번들입니다.
     * [EN] Common indirect draw struct and unpacking function bundle for scatter instance culling compute shaders.
     */
    scatterCullCommon,
    /**
     * [KO] 식생 인스턴스 및 팔면체 임포스터 셰이더의 공통 디더 페이드 및 반구형 UV 변환 함수 번들입니다.
     * [EN] Common dither fade and hemi-octahedral UV conversion function bundle for foliage instance and octahedral impostor shaders.
     */
    foliageOctahedralCommon,
    /**
     * [KO] 잔디 메인 및 그림자 버텍스 셰이더의 공통 월드 정점 변환 함수 번들입니다.
     * [EN] Common world vertex transformation function bundle for grass main and shadow vertex shaders.
     */
    grassVertexCommon,
    /**
     * [KO] 잔디 근거리(Near) 및 원거리(Far) 프래그먼트 셰이더의 공통 알파 필터링, 지면 색상 블렌딩 및 AO 계산 함수 번들입니다.
     * [EN] Common alpha filtering, ground color blending, and AO calculation function bundle for grass near and far fragment shaders.
     */
    grassFragmentCommon
});

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;
