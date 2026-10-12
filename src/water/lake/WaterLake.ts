import RedGPUContext from "../../context/RedGPUContext";
import Ground from "../../primitive/Ground";
import Mesh from "../../display/mesh/Mesh";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
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

class WaterLake extends Mesh {
    #isWater: boolean = true;
    #waveAmplitude: number = 0.025;
    #waveWavelength: number = 16.0;
    #maxPenetration: number = 0.35;
    #interactionFollowTarget: Mesh | null = null;
    #interactionEnabled: boolean = true;
    #interactionDomainSize: number = 16.0;

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

    get isWater(): boolean {
        return this.#isWater;
    }

    get waveAmplitude(): number {
        return this.#waveAmplitude;
    }

    set waveAmplitude(value: number) {
        this.#waveAmplitude = Math.max(0, value);
        updateTargetUniform(this, 'waveAmplitude', this.#waveAmplitude);
    }

    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set waveWavelength(value: number) {
        this.#waveWavelength = Math.max(0.1, value);
        updateTargetUniform(this, 'waveWavelength', this.#waveWavelength);
    }

    get maxPenetration(): number {
        return this.#maxPenetration;
    }

    set maxPenetration(value: number) {
        this.#maxPenetration = Math.max(0.05, value);
    }

    get interactionFollowTarget(): Mesh | null {
        return this.#interactionFollowTarget;
    }

    set interactionFollowTarget(target: Mesh | null) {
        this.#interactionFollowTarget = target;
    }

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
        if (this.material) {
            this.waterMaterial.rippleDomainSize = value;
        }
    }

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

    get waterMaterial(): SingleLayerWaterMaterial {
        return this.material as SingleLayerWaterMaterial;
    }

    get geometry(): Ground {
        return super.geometry as Ground;
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

    override createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const {resourceManager} = this.redGPUContext;
        const {wgslParser} = resourceManager;
        const SHADER_INFO = wgslParser.parse('WATER_LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('WATER_LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#syncVertexUniforms();
        return shaderModule;
    };

    #syncVertexUniforms(): void {
        updateTargetUniform(this, 'waveAmplitude', this.#waveAmplitude);
        updateTargetUniform(this, 'waveWavelength', this.#waveWavelength);
    }

    override destroy(): void {
        if (this.#capturePass) this.#capturePass.destroy();
        if (this.#waveSimulator) this.#waveSimulator.destroy();
        if (this.#rippleDirectTexture) this.#rippleDirectTexture.destroy();
        if (this.#interactionManager) this.#interactionManager.destroy();
        if (this.material) {
            this.waterMaterial.rippleTexture = null;
        }
        this.#interactionFollowTarget = null;
        this.#currentActiveMeshes.length = 0;
        super.destroy();
    }

    readonly #encodePass = (encoder: GPUCommandEncoder): void => {
        this.#capturePass.render(
            encoder,
            this.#currentActiveMeshes,
            this.#currentSnapX,
            this.#currentSnapZ,
            this.#currentDomainSize,
            this.waterLevel,
            this.#maxPenetration
        );
        this.#waveSimulator.simulate(encoder, this.#currentShiftX, this.#currentShiftZ);
    };

    #updateInteraction(renderViewStateData?: RenderViewStateData): void {
        if (!this.#interactionEnabled || !this.passFrustumCulling) return;

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

        let targetX = this.x;
        let targetZ = this.z;

        if (this.#interactionFollowTarget) {
            const m = this.#interactionFollowTarget.modelMatrix;
            targetX = m ? m[12] : this.#interactionFollowTarget.x;
            targetZ = m ? m[14] : this.#interactionFollowTarget.z;
        } else {
            const firstMesh = WaterInteractionRegistry.firstMesh;
            if (firstMesh) {
                const m = firstMesh.modelMatrix;
                targetX = m ? m[12] : firstMesh.x;
                targetZ = m ? m[14] : firstMesh.z;
            }
        }

        const domainSize = this.#interactionDomainSize;
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

    get waterLevel(): number {
        return this.y;
    }

    set waterLevel(value: number) {
        this.y = value;
    }
}

Object.freeze(WaterLake);
export default WaterLake;
