import WGSLParser from '../../../../resources/wgslParser/WGSLParser';
import rotateVectorByQuat from '../common/rotateVectorByQuat.wgsl';
import testSphereInFrustum from '../common/testSphereInFrustum.wgsl';
import checkAABBInHZB from '../common/checkAABBInHZB.wgsl';

export const LandscapeShaderLibrary = Object.freeze({
    rotateVectorByQuat,
    testSphereInFrustum,
    checkAABBInHZB
});

WGSLParser.registerLibrary('landscape', LandscapeShaderLibrary);

export default LandscapeShaderLibrary;

