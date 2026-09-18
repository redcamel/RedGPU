import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";

interface WaterLake {
    waveAmplitude: number;
    waveWavelength: number;
    waveSpeed: number;
}

class WaterLake extends Mesh {
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 64,
        heightSegments: number = 64,
        name: string = 'WaterLake'
    ) {
        const waterMaterial = new SingleLayerWaterMaterial(redGPUContext);
        const waterGeometry = new Ground(redGPUContext, width, height, widthSegments, heightSegments);

        super(redGPUContext, waterGeometry, waterMaterial, name);

        this.waveAmplitude = 0.025;
        this.waveWavelength = 16.0;
        this.waveSpeed = 1.0;

        this.depthStencilState.depthWriteEnabled = false;

        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;

        this.dirtyPipeline = true;
    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('WATER_LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.waveAmplitude = this.waveAmplitude;
        this.waveWavelength = this.waveWavelength;
        this.waveSpeed = this.waveSpeed;
        return shaderModule;
    };

    get waterMaterial(): SingleLayerWaterMaterial {
        return this._material as SingleLayerWaterMaterial;
    }

    get geometry(): Ground {
        return this._geometry as Ground;
    }

    get waterLevel(): number {
        return this.y;
    }

    set waterLevel(value: number) {
        this.y = value;
    }
}

definePositiveNumber(WaterLake, [
    {key: 'waveAmplitude', value: 0.025, min: 0},
    {key: 'waveWavelength', value: 16.0, min: 0.1},
]);

defineNumber(WaterLake, [
    {key: 'waveSpeed', value: 1.0},
]);

Object.freeze(WaterLake);
export default WaterLake;
