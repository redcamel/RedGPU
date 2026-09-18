import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";

class WaterLake extends Mesh {
    #waveAmplitude: number = 0.025;
    #waveWavelength: number = 16.0;
    #waveSpeed: number = 1.0;

    #singleFloatBuffer: Float32Array = new Float32Array(1);
    #allUniformBuffer: Float32Array = new Float32Array(4);

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

        this.depthStencilState.depthWriteEnabled = false;

        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;

        this.dirtyPipeline = true;
    }

    get waveAmplitude(): number {
        return this.#waveAmplitude;
    }

    set waveAmplitude(value: number) {
        this.#waveAmplitude = Math.max(0.0, value);
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveAmplitude;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveAmplitude;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set waveWavelength(value: number) {
        this.#waveWavelength = Math.max(0.1, value);
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveWavelength;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveWavelength;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    get waveSpeed(): number {
        return this.#waveSpeed;
    }

    set waveSpeed(value: number) {
        this.#waveSpeed = value;
        if (this.gpuRenderInfo?.vertexUniformBuffer && this.gpuRenderInfo?.vertexUniformInfo) {
            const member = this.gpuRenderInfo.vertexUniformInfo.members.waveSpeed;
            if (member) {
                this.#singleFloatBuffer[0] = this.#waveSpeed;
                this.redGPUContext.gpuDevice.queue.writeBuffer(
                    this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                    member.uniformOffset,
                    this.#singleFloatBuffer as BufferSource
                );
            }
        }
    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('WATER_LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#updateAllVertexUniforms();
        return shaderModule;
    };

    #updateAllVertexUniforms() {
        if (this.gpuRenderInfo?.vertexUniformBuffer) {
            this.#allUniformBuffer[0] = this.#waveAmplitude;
            this.#allUniformBuffer[1] = this.#waveWavelength;
            this.#allUniformBuffer[2] = this.#waveSpeed;
            this.#allUniformBuffer[3] = 0.0;
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
                0,
                this.#allUniformBuffer as BufferSource
            );
        }
    }

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

Object.freeze(WaterLake);
export default WaterLake;
