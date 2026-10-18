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

/**
 * [KO] 실시간 파동 시뮬레이션 및 상호작용 물결을 지원하는 호수(Lake) 수면 메시 클래스입니다.
 * [EN] Lake water surface mesh class supporting real-time wave simulation and interactive ripples.
 *
 * ### Example
 * ```ts
 * const lake = new RedGPU.Water.WaterLake(redGPUContext, 200, 200);
 * scene.addChild(lake);
 * ```
 *
 * @category Water
 */
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

    /**
     * [KO] WaterLake 인스턴스를 생성합니다.
     * [EN] Creates an instance of WaterLake.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 호수 가로 크기 (기본값: 100)
     * [EN] Lake width (default: 100)
     * @param height -
     * [KO] 호수 세로 크기 (기본값: 100)
     * [EN] Lake height (default: 100)
     * @param widthSegments -
     * [KO] 가로 분할 세그먼트 수 (기본값: 64)
     * [EN] Number of width segments (default: 64)
     * @param heightSegments -
     * [KO] 세로 분할 세그먼트 수 (기본값: 64)
     * [EN] Number of height segments (default: 64)
     * @param name -
     * [KO] 메시 이름 (기본값: 'WaterLake')
     * [EN] Mesh name (default: 'WaterLake')
     */
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

    /**
     * [KO] 물 수면 객체 여부를 반환합니다 (항상 true).
     * [EN] Returns whether this is a water surface object (always true).
     */
    get isWater(): boolean {
        return this.#isWater;
    }

    set waveAmplitude(value: number) {
        this.#waveAmplitude = Math.max(0, value);
        updateTargetUniform(this, 'waveAmplitude', this.#waveAmplitude);
    }

    /**
     * [KO] 기본 수면 파동 진폭을 반환하거나 설정합니다.
     * [EN] Gets or sets the base water wave amplitude.
     */
    get waveAmplitude(): number {
        return this.#waveAmplitude;
    }

    set waveWavelength(value: number) {
        this.#waveWavelength = Math.max(0.1, value);
        updateTargetUniform(this, 'waveWavelength', this.#waveWavelength);
    }

    /**
     * [KO] 기본 수면 파동 파장을 반환하거나 설정합니다.
     * [EN] Gets or sets the base water wave wavelength.
     */
    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set maxPenetration(value: number) {
        this.#maxPenetration = Math.max(0.05, value);
    }

    /**
     * [KO] 수면 침투 최대 허용 깊이를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum allowable penetration depth into the water surface.
     */
    get maxPenetration(): number {
        return this.#maxPenetration;
    }

    set interactionFollowTarget(target: Mesh | null) {
        this.#interactionFollowTarget = target;
    }

    /**
     * [KO] 물결 상호작용 추적 중심이 되는 타겟 메시를 반환하거나 설정합니다.
     * [EN] Gets or sets the target mesh tracked as the center for ripple interaction.
     */
    get interactionFollowTarget(): Mesh | null {
        return this.#interactionFollowTarget;
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

    /**
     * [KO] 물 상호작용 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether water interaction is enabled.
     */
    get interactionEnabled(): boolean {
        return this.#interactionEnabled;
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

    /**
     * [KO] 물 상호작용 시뮬레이션 도메인의 크기를 반환하거나 설정합니다.
     * [EN] Gets or sets the size of the water interaction simulation domain.
     */
    get interactionDomainSize(): number {
        return this.#interactionDomainSize;
    }

    /**
     * [KO] 수면에 적용된 SingleLayerWaterMaterial 인스턴스를 반환합니다.
     * [EN] Returns the SingleLayerWaterMaterial instance applied to the water surface.
     */
    get waterMaterial(): SingleLayerWaterMaterial {
        return this.material as SingleLayerWaterMaterial;
    }

    /**
     * [KO] 수면의 Ground 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the Ground geometry instance of the water surface.
     */
    get geometry(): Ground {
        return super.geometry as Ground;
    }

    /**
     * [KO] 물결 파동 전파 속도를 반환하거나 설정합니다.
     * [EN] Gets or sets the ripple wave propagation speed.
     */
    get rippleWaveSpeed(): number {
        return this.#waveSimulator.waveSpeed;
    }

    set rippleWaveSpeed(value: number) {
        this.#waveSimulator.waveSpeed = value;
    }

    /**
     * [KO] 물결 감쇠율을 반환하거나 설정합니다.
     * [EN] Gets or sets the ripple damping factor.
     */
    get rippleDamping(): number {
        return this.#waveSimulator.damping;
    }

    set rippleDamping(value: number) {
        this.#waveSimulator.damping = value;
    }

    /**
     * [KO] 물결 노멀 강도를 반환하거나 설정합니다.
     * [EN] Gets or sets the ripple normal strength.
     */
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

    /**
     * [KO] 수면 높이(Y 좌표)를 반환하거나 설정합니다.
     * [EN] Gets or sets the water surface height (Y coordinate).
     */
    get waterLevel(): number {
        return this.y;
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

    /**
     * [KO] WaterLake 인스턴스를 파괴하고 시뮬레이터 및 상호작용 관련 리소스를 해제합니다.
     * [EN] Destroys the WaterLake instance and releases simulator and interaction resources.
     */
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

    set waterLevel(value: number) {
        this.y = value;
    }
}

Object.freeze(WaterLake);
export default WaterLake;
