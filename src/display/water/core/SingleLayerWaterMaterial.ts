import RedGPUContext from "../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../material/core/ABitmapBaseMaterial";
import fragmentModuleSource from './shader/singleLayerWaterFragment.wgsl';
import ColorRGB from "../../../color/ColorRGB";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Sampler from "../../../resources/sampler/Sampler";
import defineUint from "../../../defineProperty/funcs/number/defineUint";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
import defineVector2 from "../../../defineProperty/funcs/vector/defineVector2";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import defineBoolean from "../../../defineProperty/funcs/defineBoolean";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";

interface SingleLayerWaterMaterial {
    baseColor: ColorRGB;
    deepColor: ColorRGB;
    normalTexture: BitmapTexture;
    normalTextureSampler: Sampler;
    normalDetailTexture: BitmapTexture;
    normalScale: number;
    normalDetailScale: number;
    normalTiling: number;
    normalDetailTiling: number;
    windSpeed: number;
    normalDetailWindSpeed: number;
    windDirection: [number, number];
    normalDetailWindDirection: [number, number];
    refractionStrength: number;
    extinctionFactor: number;
    opacity: number;
    depthFadeDistance: number;
    roughness: number;
    specularFactor: number;
    debugMode: number;
    debugMaxDepth: number;
    invertNormalY: boolean;
    invertNormalDetailY: boolean;
    causticsStrength: number;
    causticsScale: number;
    causticsSpeed: number;
    enableSSR: boolean;
    ssrMaxDistance: number;
    ssrStepCount: number;
    ssrThickness: number;
    turbidity: number;
}

class SingleLayerWaterMaterial extends ABitmapBaseMaterial {
    constructor(redGPUContext: RedGPUContext, baseColor: string = '#18d8b6', deepColor: string = '#065279', opacity: number = 1.0) {
        super(
            redGPUContext,
            'SINGLE_LAYER_WATER_MATERIAL',
            fragmentModuleSource,
            2
        );

        this.use2PathRender = true;

        this.normalTextureSampler = new Sampler(this.redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,
            addressModeW: GPU_ADDRESS_MODE.REPEAT,
        });

        this.initGPURenderInfos();

        this.baseColor.setColorByHEX(baseColor);
        this.deepColor.setColorByHEX(deepColor);
        this.opacity = opacity;
        this.refractionStrength = 1.0;
        this.normalScale = 1.0;
        this.normalDetailScale = 0.5;
        this.normalTiling = 18.0;
        this.normalDetailTiling = 36.0;
        this.windSpeed = 0.025;
        this.normalDetailWindSpeed = 0.040;
        this.windDirection = [1.0, 0.3];
        this.normalDetailWindDirection = [-0.6, 0.8];
        this.extinctionFactor = 0.22;
        this.depthFadeDistance = 0.8;
        this.roughness = 0.07;
        this.specularFactor = 1.0;
        this.invertNormalY = false;
        this.invertNormalDetailY = false;
        this.causticsStrength = 1.0;
        this.causticsScale = 1.0;
        this.causticsSpeed = 1.0;
        this.enableSSR = true;
        this.ssrMaxDistance = 35.0;
        this.ssrStepCount = 48;
        this.ssrThickness = 0.8;
        this.turbidity = 0.35;

        this.debugMode = 0;
        this.debugMaxDepth = 5.0;
    }
}

defineColorRGB(SingleLayerWaterMaterial, [
    {key: 'baseColor', value: '#18d8b6'},
    {key: 'deepColor', value: '#065279'},
]);

defineTexture(SingleLayerWaterMaterial, [
    {key: 'normalTexture'},
    {key: 'normalDetailTexture'},
]);

defineSampler(SingleLayerWaterMaterial, [
    {key: 'normalTextureSampler'},
]);

defineVector2(SingleLayerWaterMaterial, [
    {key: 'windDirection', value: [1.0, 0.3]},
    {key: 'normalDetailWindDirection', value: [-0.6, 0.8]},
]);

definePositiveNumber(SingleLayerWaterMaterial, [
    {key: 'opacity', value: 1.0, min: 0, max: 1},
    {key: 'refractionStrength', value: 1.0, min: 0, max: 1},
    {key: 'normalScale', value: 1.0, min: 0.0, max: 1.0},
    {key: 'normalDetailScale', value: 0.5, min: 0.0, max: 1.0},
    {key: 'normalTiling', value: 18.0},
    {key: 'normalDetailTiling', value: 36.0},
    {key: 'windSpeed', value: 0.025},
    {key: 'normalDetailWindSpeed', value: 0.040},
    {key: 'extinctionFactor', value: 0.22},
    {key: 'depthFadeDistance', value: 0.8},
    {key: 'roughness', value: 0.07, min: 0, max: 1},
    {key: 'specularFactor', value: 1.0, min: 0, max: 2},
    {key: 'debugMaxDepth', value: 5.0},
    {key: 'causticsStrength', value: 1.0, min: 0, max: 2},
    {key: 'causticsScale', value: 1.0, min: 0.1, max: 5},
    {key: 'causticsSpeed', value: 1.0, min: 0, max: 5},
    {key: 'ssrMaxDistance', value: 35.0, min: 2.0, max: 100.0},
    {key: 'ssrThickness', value: 0.8, min: 0.05, max: 5.0},
    {key: 'turbidity', value: 0.35, min: 0.0, max: 1.0},
]);

defineUint(SingleLayerWaterMaterial, [
    {key: 'debugMode', value: 0},
    {key: 'ssrStepCount', value: 48},
]);

defineBoolean(SingleLayerWaterMaterial, [
    {key: 'invertNormalY', value: false},
    {key: 'invertNormalDetailY', value: false},
    {key: 'enableSSR', value: true},
]);

Object.freeze(SingleLayerWaterMaterial);
export default SingleLayerWaterMaterial;
