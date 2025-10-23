import DefineForFragment from "../../../../defineProperty/DefineForFragment";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from "../shader/fragment.wgsl";
const SHADER_INFO = parseWGSL(fragmentModuleSource);
/**
 * SkyBoxMaterial - SkyBox 렌더링용 Material
 *
 * @class
 * @extends {ABitmapBaseMaterial}
 */
class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * Indicates if the pipeline is dirty or not.
     *
     * @type {boolean}
     */
    dirtyPipeline = false;
    /**
     * Creates a new instance of the class.
     *
     * @constructor
     * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
     * @param {CubeTexture} cubeTexture - The cube texture object.
     */
    constructor(redGPUContext, cubeTexture) {
        super(redGPUContext, 'SKYBOX_MATERIAL', SHADER_INFO, 2);
        this.skyboxTexture = cubeTexture;
        this.skyboxTextureSampler = new Sampler(this.redGPUContext, {
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            addressModeW: 'clamp-to-edge'
        });
        this.initGPURenderInfos();
    }
}
DefineForFragment.definePositiveNumber(SkyBoxMaterial, [
    ['blur', 0],
]);
DefineForFragment.definePositiveNumber(SkyBoxMaterial, [
    ['transitionProgress', 0],
]);
DefineForFragment.defineCubeTexture(SkyBoxMaterial, [
    'transitionTexture',
]);
DefineForFragment.defineTexture(SkyBoxMaterial, [
    'transitionAlphaTexture',
]);
DefineForFragment.defineCubeTexture(SkyBoxMaterial, [
    'skyboxTexture',
]);
DefineForFragment.defineSampler(SkyBoxMaterial, [
    'skyboxTextureSampler',
]);
Object.freeze(SkyBoxMaterial);
export default SkyBoxMaterial;
