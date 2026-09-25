import RedGPUContext from "../../context/RedGPUContext";
import Ground from "../../primitive/Ground";
import Mesh from "../../display/mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../defineProperty/core/updateTargetUniform";
import {
    WaterActiveMeshEntry,
    WaterCapturePass,
    WaterInteractionManager,
    WaterInteractionRegistry,
    WaterWaveSimulator
} from "../interaction";
import DirectTexture from "../../resources/texture/DirectTexture";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";

interface WaterLake {
    waveAmplitude: number;
    waveWavelength: number;
    waveSpeed: number;
    maxPenetration: number;
}

class WaterLake extends Mesh {
    readonly isWater: boolean = true;
    #interactionEnabled: boolean = true;
    #interactionDomainSize: number = 16.0;

    get interactionEnabled(): boolean {
        return this.#interactionEnabled;
    }

    set interactionEnabled(value: boolean) {
        const boolVal = !!value;
        if (this.#interactionEnabled !== boolVal) {
            this.#interactionEnabled = boolVal;
            if (boolVal) {
                this.#isFirstSnap = true;
            }
        }
    }

    get interactionDomainSize(): number {
        return this.#interactionDomainSize;
    }

    set interactionDomainSize(value: number) {
        this.#interactionDomainSize = value;
        if (this._material) {
            this.waterMaterial.rippleDomainSize = value;
        }
    }
    #interactionManager: WaterInteractionManager;
    #capturePass: WaterCapturePass;
    #waveSimulator: WaterWaveSimulator;
    #rippleDirectTexture: DirectTexture;
    #lastInteractionTime: number = 0;
    #prevSnapX: number = 0;
    #prevSnapZ: number = 0;
    #isFirstSnap: boolean = true;
    #decayFramesRemaining: number = 0;

    readonly #domainCenterBuffer: [number, number] = [0, 0];
    #currentActiveMeshes: WaterActiveMeshEntry[] = [];
    #currentSnapX: number = 0;
    #currentSnapZ: number = 0;
    #currentDomainSize: number = 0;
    #currentShiftX: number = 0;
    #currentShiftZ: number = 0;

    override render(renderViewStateData: RenderViewStateData): void {
        if (renderViewStateData.viewIndex === 0) {
            this.#updateInteraction(renderViewStateData);
        }
        super.render(renderViewStateData);
    }

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
        this.maxPenetration = 0.35;

        this.depthStencilState.depthWriteEnabled = false;
        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;
        this.dirtyPipeline = true;

        this.#interactionManager = new WaterInteractionManager(redGPUContext);
        this.#capturePass = new WaterCapturePass(redGPUContext, 512);
        this.#waveSimulator = new WaterWaveSimulator(redGPUContext, 512);
        this.#waveSimulator.updateCaptureBinding(this.#capturePass.captureTextureView);

        this.#rippleDirectTexture = new DirectTexture(
            redGPUContext,
            `WaterLake_Ripple_${this.uuid}`,
            this.#waveSimulator.rippleNormalTexture
        );
        this.waterMaterial.rippleTexture = this.#rippleDirectTexture;
        this.waterMaterial.rippleDomainSize = this.interactionDomainSize;
    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('WATER_LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#syncVertexUniforms();
        return shaderModule;
    };

    #syncVertexUniforms(): void {
        updateTargetUniform(this, 'waveAmplitude', this.waveAmplitude);
        updateTargetUniform(this, 'waveWavelength', this.waveWavelength);
        updateTargetUniform(this, 'waveSpeed', this.waveSpeed);
    }

    get rippleWaveSpeed(): number {
        return this.#waveSimulator.waveSpeed;
    }

    set rippleWaveSpeed(value: number) {
        this.#waveSimulator.waveSpeed = value;
    }

    get rippleDamping(): number {
        return this.#waveSimulator.damping;
    }

    set rippleDamping(value: number) {
        this.#waveSimulator.damping = value;
    }

    get rippleNormalStrength(): number {
        return this.#waveSimulator.normalStrength;
    }

    set rippleNormalStrength(value: number) {
        this.#waveSimulator.normalStrength = value;
        if (this.material) {
            this.waterMaterial.rippleNormalStrength = value;
        }
    }

    readonly #encodePass = (encoder: GPUCommandEncoder): void => {
        this.#capturePass.render(
            encoder,
            this.#currentActiveMeshes,
            this.#currentSnapX,
            this.#currentSnapZ,
            this.#currentDomainSize,
            this.waterLevel,
            this.maxPenetration
        );
        this.#waveSimulator.simulate(encoder, this.#currentShiftX, this.#currentShiftZ);
    };

    #updateInteraction(renderViewStateData?: RenderViewStateData): void {
        if (!this.interactionEnabled || !this.passFrustumCulling) return;

        const hasMeshes = WaterInteractionRegistry.meshes.size > 0;
        if (hasMeshes) {
            this.#decayFramesRemaining = 90;
        } else if (this.#decayFramesRemaining > 0) {
            this.#decayFramesRemaining--;
        } else {
            return;
        }

        const currentTime = this.redGPUContext.currentTime || performance.now();
        const dt = renderViewStateData?.deltaTime !== undefined
            ? renderViewStateData.deltaTime
            : Math.min(0.05, Math.max(0.001, (currentTime - this.#lastInteractionTime) * 0.001));
        this.#lastInteractionTime = currentTime;

        let targetX = this.#prevSnapX || this.x;
        let targetZ = this.#prevSnapZ || this.z;

        const camera = renderViewStateData?.view?.rawCamera;
        if (camera) {
            const camX = camera.x;
            const camY = camera.y;
            const camZ = camera.z;
            const vm = camera.viewMatrix;

            if (vm) {
                const dirX = -vm[2];
                const dirY = -vm[6];
                const dirZ = -vm[10];

                if (dirY < -0.01) {
                    const t = (this.waterLevel - camY) / dirY;
                    if (t > 0 && t < 120.0) {
                        targetX = camX + t * dirX;
                        targetZ = camZ + t * dirZ;
                    } else {
                        targetX = camX + dirX * 15.0;
                        targetZ = camZ + dirZ * 15.0;
                    }
                } else if (dirY > 0.01 && camY < this.waterLevel) {
                    const t = (this.waterLevel - camY) / dirY;
                    if (t > 0 && t < 120.0) {
                        targetX = camX + t * dirX;
                        targetZ = camZ + t * dirZ;
                    } else {
                        targetX = camX + dirX * 15.0;
                        targetZ = camZ + dirZ * 15.0;
                    }
                } else {
                    targetX = camX + dirX * 15.0;
                    targetZ = camZ + dirZ * 15.0;
                }
            } else {
                targetX = camX;
                targetZ = camZ;
            }
        } else if (hasMeshes) {
            const mesh = WaterInteractionRegistry.meshes.values().next().value;
            if (mesh) {
                const m = mesh.modelMatrix;
                targetX = m ? m[12] : mesh.x;
                targetZ = m ? m[14] : mesh.z;
            }
        }

        const domainSize = this.interactionDomainSize;
        const texelSize = domainSize / this.#waveSimulator.textureSize;
        const snapX = Math.floor(targetX / texelSize) * texelSize;
        const snapZ = Math.floor(targetZ / texelSize) * texelSize;

        let shiftX = 0;
        let shiftZ = 0;
        if (!this.#isFirstSnap) {
            shiftX = Math.round((snapX - this.#prevSnapX) / texelSize);
            shiftZ = Math.round((snapZ - this.#prevSnapZ) / texelSize);
        } else {
            this.#isFirstSnap = false;
        }
        this.#prevSnapX = snapX;
        this.#prevSnapZ = snapZ;

        const domainCenter = this.#domainCenterBuffer;
        domainCenter[0] = snapX;
        domainCenter[1] = snapZ;
        this.waterMaterial.rippleDomainCenter = domainCenter;

        const activeMeshes = this.#interactionManager.collectActiveMeshes(
            dt,
            snapX,
            snapZ,
            domainSize * 0.75,
            this.waterLevel,
            6.0
        );

        this.#currentActiveMeshes = activeMeshes;
        this.#currentSnapX = snapX;
        this.#currentSnapZ = snapZ;
        this.#currentDomainSize = domainSize;
        this.#currentShiftX = shiftX;
        this.#currentShiftZ = shiftZ;
        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, this.#encodePass);
    }

    override destroy(): void {
        if (this.#capturePass) this.#capturePass.destroy();
        if (this.#waveSimulator) this.#waveSimulator.destroy();
        if (this.#rippleDirectTexture) this.#rippleDirectTexture.destroy();
        if (this.#interactionManager) this.#interactionManager.destroy();
        super.destroy();
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

definePositiveNumber(WaterLake, [
    {key: 'waveAmplitude', value: 0.025, min: 0},
    {key: 'waveWavelength', value: 16.0, min: 0.1},
    {key: 'maxPenetration', value: 0.35, min: 0.05},
]);

defineNumber(WaterLake, [
    {key: 'waveSpeed', value: 1.0},
]);

Object.freeze(WaterLake);
export default WaterLake;
