import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import HDRTexture from "../../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../../resources/texture/noiseTexture/core/ANoiseTexture";
interface SkyBoxMaterial {
    skyboxTexture: CubeTexture | HDRTexture;
    transitionTexture: CubeTexture | HDRTexture;
    transitionAlphaTexture: ANoiseTexture | BitmapTexture;
    skyboxTextureSampler: Sampler;
    blur: number;
    transitionProgress: number;
}
/**
 * SkyBoxMaterial - SkyBox 렌더링용 Material
 *
 * @class
 * @extends {ABitmapBaseMaterial}
 */
declare class SkyBoxMaterial extends ABitmapBaseMaterial {
    /**
     * Indicates if the pipeline is dirty or not.
     *
     * @type {boolean}
     */
    dirtyPipeline: boolean;
    /**
     * Creates a new instance of the class.
     *
     * @constructor
     * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
     * @param {CubeTexture} cubeTexture - The cube texture object.
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture);
}
export default SkyBoxMaterial;
