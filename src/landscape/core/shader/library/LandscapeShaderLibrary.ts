/**
 * [KO] 대규모 지형(Landscape) 시스템 전용 WGSL 셰이더 공통 수학 함수 라이브러리 레지스트리 모듈입니다.
 * [EN] WGSL shader common math function library registry module dedicated to the large-scale Landscape system.
 * @packageDocumentation
 */
import WGSLParser from '../../../../resources/wgslParser/WGSLParser';
import rotateVectorByQuat from '../common/rotateVectorByQuat.wgsl';
import testSphereInFrustum from '../common/testSphereInFrustum.wgsl';
import checkAABBInHZB from '../common/checkAABBInHZB.wgsl';

/**
 * [KO] 대규모 지형(Landscape) 시스템 전용 WGSL 셰이더 공통 수학 함수 라이브러리 네임스페이스.
 * [EN] WGSL shader common math function library namespace dedicated to the large-scale Landscape system.
 */
export const LandscapeShaderLibrary = Object.freeze({
    rotateVectorByQuat,
    testSphereInFrustum,
    checkAABBInHZB
});

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;
