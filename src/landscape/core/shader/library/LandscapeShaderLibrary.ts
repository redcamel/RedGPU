import WGSLParser from '../../../../resources/wgslParser/WGSLParser';
import rotateVectorByQuat from '../common/rotateVectorByQuat.wgsl';
import testSphereInFrustum from '../common/testSphereInFrustum.wgsl';
import checkAABBInHZB from '../common/checkAABBInHZB.wgsl';

/**
 * [KO] 지형 및 식생 셰이더에서 공용으로 참조하는 WGSL 유틸리티 함수 라이브러리입니다.
 * [EN] WGSL utility function library shared across landscape and foliage shaders.
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
    checkAABBInHZB
});

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;

