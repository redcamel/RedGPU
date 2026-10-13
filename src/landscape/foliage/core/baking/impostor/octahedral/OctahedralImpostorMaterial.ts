import RedGPUContext from "../../../../../../context/RedGPUContext";
import type Sampler from "../../../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import fragmentModuleSource from './octahedralImpostorFragment.wgsl';
import AUVTransformBaseMaterial from "../../../../../../material/core/AUVTransformBaseMaterial";

import defineSampler from "../../../../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../../../../defineProperty/funcs/texture/defineTexture";
import definePositiveNumber from "../../../../../../defineProperty/funcs/number/definePositiveNumber";
import defineBoolean from "../../../../../../defineProperty/funcs/defineBoolean";

interface OctahedralImpostorMaterial {
    baseColorTexture: BitmapTexture | DirectTexture;
    baseColorTextureSampler: Sampler;

    normalTexture: BitmapTexture | DirectTexture;
    normalTextureSampler: Sampler;

    packedORMTexture: BitmapTexture | DirectTexture;

    useCutOff: boolean;
    cutOff: number;
    doubleSided: boolean;
    isFoliage: boolean;
    boundingRadius: number;
}

class OctahedralImpostorMaterial extends AUVTransformBaseMaterial {
    constructor(
        redGPUContext: RedGPUContext,
        baseColorTexture?: BitmapTexture | DirectTexture,
        normalTexture?: BitmapTexture | DirectTexture,
        packedORMTexture?: BitmapTexture | DirectTexture,
        boundingRadius: number = 3.0,
        name?: string
    ) {
        super(
            redGPUContext,
            'OCTAHEDRAL_IMPOSTOR_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) this.name = name;
        const {resourceManager} = redGPUContext;
        const {basicSampler} = resourceManager;
        this.baseColorTexture = baseColorTexture;
        this.baseColorTextureSampler = basicSampler;

        this.normalTexture = normalTexture;
        this.normalTextureSampler = basicSampler;

        this.packedORMTexture = packedORMTexture;

        this.useCutOff = true;
        this.cutOff = 0.3333;
        this.doubleSided = false;

        this.isFoliage = true;
        this.boundingRadius = boundingRadius;
        this.transparent = false;

        this.initGPURenderInfos();

    }
}

defineSampler(OctahedralImpostorMaterial, [
    {key: 'baseColorTextureSampler'},
    {key: 'normalTextureSampler'}
]);
defineTexture(OctahedralImpostorMaterial, [
    {key: 'baseColorTexture'},
    {key: 'normalTexture'},
    {key: 'packedORMTexture'}
]);

definePositiveNumber(OctahedralImpostorMaterial, [
    {key: 'cutOff', value: 0.35},
    {key: 'boundingRadius', value: 3.0}
]);
defineBoolean(OctahedralImpostorMaterial, [
    {key: 'isFoliage', value: true}
]);
Object.defineProperty(OctahedralImpostorMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

Object.freeze(OctahedralImpostorMaterial);
export default OctahedralImpostorMaterial;

