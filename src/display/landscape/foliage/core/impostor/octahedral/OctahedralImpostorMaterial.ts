import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import fragmentModuleSource from './octahedralImpostorFragment.wgsl';
import AUVTransformBaseMaterial from "../../../../../../material/core/AUVTransformBaseMaterial";
import defineSampler from "../../../../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../../../../defineProperty/funcs/texture/defineTexture";
import GPU_MIPMAP_FILTER_MODE from "../../../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";

interface OctahedralImpostorMaterial {
    diffuseTexture: BitmapTexture | DirectTexture;
    diffuseTextureSampler: Sampler;
    normalTexture: BitmapTexture | DirectTexture;
    normalTextureSampler: Sampler;
    useCutOff: boolean;
    cutOff: number;
    doubleSided: boolean;
    alphaBlend: number;
    gridSize: number;
}

class OctahedralImpostorMaterial extends AUVTransformBaseMaterial {
    constructor(
        redGPUContext: RedGPUContext,
        diffuseTexture?: BitmapTexture | DirectTexture,
        normalTexture?: BitmapTexture | DirectTexture,
        name?: string,
        gridSize: number = 8.0
    ) {
        super(
            redGPUContext,
            'OCTAHEDRAL_IMPOSTOR_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) this.name = name;
        this.diffuseTexture = diffuseTexture;
        this.diffuseTextureSampler = new Sampler(this.redGPUContext);
        this.diffuseTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;

        this.normalTexture = normalTexture;
        this.normalTextureSampler = new Sampler(this.redGPUContext);
        this.normalTextureSampler.mipmapFilter = GPU_MIPMAP_FILTER_MODE.LINEAR;

        this.useCutOff = true;
        this.cutOff = 0.35;
        this.doubleSided = true;
        this.transparent = false;
        this.alphaBlend = 0;
        this.gridSize = gridSize;

        this.initGPURenderInfos();
    }
}

defineSampler(OctahedralImpostorMaterial, [
    {key: 'diffuseTextureSampler'},
    {key: 'normalTextureSampler'}
]);
defineTexture(OctahedralImpostorMaterial, [
    {key: 'diffuseTexture'},
    {key: 'normalTexture'}
]);
Object.defineProperty(OctahedralImpostorMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

Object.freeze(OctahedralImpostorMaterial);
export default OctahedralImpostorMaterial;
