import RedGPUContext from "../context/RedGPUContext";
import Ground from "../primitive/Ground";
import Mesh from "../display/mesh/Mesh";
import LakeMaterial from "./lakeCore/LakeMaterial";
import GPU_CULL_MODE from "../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./lakeCore/shader/lakeVertex.wgsl";
import updateTargetUniform from "../defineProperty/core/updateTargetUniform";
import {
    LakeActiveMeshEntry,
    LakeCapturePass,
    LakeInteractionManager,
    LakeInteractionRegistry,
    LakeWaveSimulator
} from "./lakeCore/interaction";
import DirectTexture from "../resources/texture/DirectTexture";
import {COMMAND_ENCODER_TYPE} from "../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RenderViewStateData from "../display/view/core/RenderViewStateData";

/**
 * [KO] 실시간 파동 및 객체 상호작용 물결을 표현하는 호수 수면 메시 클래스입니다.
 * [EN] Lake water surface mesh class representing real-time waves and object interaction ripples.
 *
 * ### Example
 * ```typescript
 * const lake = new RedGPU.Water.Lake(redGPUContext);
 * scene.addWater(lake);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/basicLake/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake material example](/RedGPU/examples/3d/water/lake/lakeMaterial/)
 * @see [Multi lake example](/RedGPU/examples/3d/water/lake/multiLake/)
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @see [Lake with landscape example](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)
 * @category Water
 */
class Lake extends Mesh {
    #isWater: boolean = true;
    #width: number;
    #height: number;
    #waveAmplitude: number = 0.025;
    #waveWavelength: number = 16.0;
    #maxPenetration: number = 0.35;
    #interactionFollowTarget: Mesh | null = null;
    #interactionEnabled: boolean = true;
    #interactionDomainSize: number = 20.0;

    #interactionManager: LakeInteractionManager;
    #capturePass: LakeCapturePass;
    #waveSimulator: LakeWaveSimulator;
    #rippleDirectTexture: DirectTexture;
    #lastInteractionTime: number = 0;
    #prevSnapX: number = 0;
    #prevSnapZ: number = 0;
    #isFirstSnap: boolean = true;
    #decayFramesRemaining: number = 0;
    #needsWaveClear: boolean = false;

    #domainCenterBuffer: [number, number] = [0, 0];
    #currentActiveMeshes: LakeActiveMeshEntry[] = [];
    #currentSnapX: number = 0;
    #currentSnapZ: number = 0;
    #currentDomainSize: number = 0;
    #currentShiftX: number = 0;
    #currentShiftZ: number = 0;

    /**
     * [KO] `Lake` 인스턴스를 생성합니다.
     * [EN] Creates a `Lake` instance.
     *
     * ### Example
     * ```typescript
     * const lake = new RedGPU.Water.Lake(redGPUContext, 100, 100, 64, 64);
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param width -
     * [KO] 호수 가로 크기 (기본값: `100`)
     * [EN] Width of the lake (default: `100`)
     * @param height -
     * [KO] 호수 세로 크기 (기본값: `100`)
     * [EN] Height of the lake (default: `100`)
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수 (기본값: `64`)
     * [EN] Number of width segments (default: `64`)
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수 (기본값: `64`)
     * [EN] Number of height segments (default: `64`)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 64,
        heightSegments: number = 64
    ) {
        const waterMaterial = new LakeMaterial(redGPUContext);
        const waterGeometry = new Ground(redGPUContext, width, height, widthSegments, heightSegments);

        super(redGPUContext, waterGeometry, waterMaterial);

        this.#width = width;
        this.#height = height;

        this.depthStencilState.depthWriteEnabled = false;
        this.primitiveState.cullMode = GPU_CULL_MODE.NONE;
        this.dirtyPipeline = true;

        this.#interactionManager = new LakeInteractionManager(redGPUContext);
        this.#capturePass = new LakeCapturePass(redGPUContext, 512);
        this.#waveSimulator = new LakeWaveSimulator(redGPUContext, 512);
        this.#waveSimulator.updateCaptureBinding(this.#capturePass.captureTextureView);

        this.#rippleDirectTexture = new DirectTexture(
            redGPUContext,
            `Lake_Ripple_${this.uuid}`,
            this.#waveSimulator.rippleNormalTexture
        );
        this.material.rippleTexture = this.#rippleDirectTexture;
        this.material.rippleDomainSize = this.#interactionDomainSize;
    }

    /**
     * [KO] 수면 객체 여부를 반환합니다.
     * [EN] Returns whether this object is a water surface.
     *
     * @returns
     * [KO] 수면 객체 여부 (`true`)
     * [EN] Whether this is a water surface (`true`)
     */
    get isWater(): boolean {
        return this.#isWater;
    }

    set waveAmplitude(value: number) {
        this.#waveAmplitude = Math.max(0, value);
        updateTargetUniform(this, 'waveAmplitude', this.#waveAmplitude);
    }

    /**
     * [KO] 정점 파동의 진폭입니다. (최소값: `0`, 기본값: `0.025`)
     * [EN] Vertex wave amplitude. (Min: `0`, default: `0.025`)
     *
     * @returns
     * [KO] 정점 파동 진폭
     * [EN] Vertex wave amplitude
     */
    get waveAmplitude(): number {
        return this.#waveAmplitude;
    }

    set waveWavelength(value: number) {
        this.#waveWavelength = Math.max(0.1, value);
        updateTargetUniform(this, 'waveWavelength', this.#waveWavelength);
    }

    /**
     * [KO] 정점 파동의 파장입니다. (최소값: `0.1`, 기본값: `16.0`)
     * [EN] Vertex wave wavelength. (Min: `0.1`, default: `16.0`)
     *
     * @returns
     * [KO] 정점 파동 파장
     * [EN] Vertex wave wavelength
     */
    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set interactionFollowTarget(target: Mesh | null) {
        this.#interactionFollowTarget = target;
    }

    /**
     * [KO] 상호작용 시뮬레이션 중심이 추적할 대상 메시입니다. `null`이면 호수 중심을 기준으로 동작합니다.
     * [EN] Target mesh tracked as the center of the interaction simulation. If `null`, operates around the lake center.
     *
     * @returns
     * [KO] 추적 대상 `Mesh` 또는 `null`
     * [EN] Tracked target `Mesh` or `null`
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
            } else {
                this.#decayFramesRemaining = 0;
                this.#needsWaveClear = true;
            }
        }
    }

    /**
     * [KO] 수면 상호작용 시뮬레이션 활성화 여부입니다. (기본값: `true`)
     * [EN] Whether water surface interaction simulation is enabled. (Default: `true`)
     *
     * @returns
     * [KO] 상호작용 활성화 여부
     * [EN] Whether interaction is enabled
     */
    get interactionEnabled(): boolean {
        return this.#interactionEnabled;
    }

    /**
     * [KO] 호수 수면에 적용된 `LakeMaterial` 인스턴스를 반환합니다.
     * [EN] Returns the `LakeMaterial` instance applied to the lake surface.
     *
     * @returns
     * [KO] `LakeMaterial` 인스턴스
     * [EN] `LakeMaterial` instance
     */
    override get material(): LakeMaterial {
        return super.material as LakeMaterial;
    }

    /**
     * [KO] 호수 수면의 `Ground` 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the `Ground` geometry instance of the lake surface.
     *
     * @returns
     * [KO] `Ground` 지오메트리 인스턴스
     * [EN] `Ground` geometry instance
     */
    override get geometry(): Ground {
        return super.geometry as Ground;
    }

    /**
     * [KO] 상호작용 물결의 전파 속도입니다. (기본값: `0.32`)
     * [EN] Propagation speed of interaction ripples. (Default: `0.32`)
     *
     * @returns
     * [KO] 물결 전파 속도
     * [EN] Ripple propagation speed
     */
    get rippleWaveSpeed(): number {
        return this.#waveSimulator.waveSpeed;
    }

    set rippleWaveSpeed(value: number) {
        this.#waveSimulator.waveSpeed = value;
    }

    /**
     * [KO] 상호작용 물결의 감쇠율입니다. (기본값: `0.012`)
     * [EN] Damping factor of interaction ripples. (Default: `0.012`)
     *
     * @returns
     * [KO] 물결 감쇠율
     * [EN] Ripple damping factor
     */
    get rippleDamping(): number {
        return this.#waveSimulator.damping;
    }

    set rippleDamping(value: number) {
        this.#waveSimulator.damping = value;
    }

    /**
     * [KO] 상호작용 물결의 노멀 강도입니다. (기본값: `1.0`)
     * [EN] Normal strength of interaction ripples. (Default: `1.0`)
     *
     * @returns
     * [KO] 물결 노멀 강도
     * [EN] Ripple normal strength
     */
    get rippleNormalStrength(): number {
        return this.#waveSimulator.normalStrength;
    }

    set rippleNormalStrength(value: number) {
        this.#waveSimulator.normalStrength = value;
        if (super.material) {
            this.material.rippleNormalStrength = value;
        }
    }

    /**
     * [KO] 호수 수면의 월드 Y 좌표(`this.y`)입니다.
     * [EN] World Y coordinate (`this.y`) of the lake surface.
     *
     * @returns
     * [KO] 수면 높이 Y 좌표
     * [EN] Water surface Y coordinate
     */
    get waterLevel(): number {
        return this.y;
    }

    set waterLevel(value: number) {
        this.y = value;
    }

    /**
     * [KO] 수면 상호작용을 갱신하고 호수 메시를 렌더링합니다.
     * [EN] Updates water surface interaction and renders the lake mesh.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더 상태 데이터
     * [EN] Render state data of the current view
     */
    override render(renderViewStateData: RenderViewStateData): void {
        if (renderViewStateData.viewIndex === 0) {
            this.#updateInteraction(renderViewStateData);
        }
        super.render(renderViewStateData);
    }

    #syncVertexUniforms(): void {
        updateTargetUniform(this, 'waveAmplitude', this.#waveAmplitude);
        updateTargetUniform(this, 'waveWavelength', this.#waveWavelength);
    }

    /**
     * [KO] 호수 정점 셰이더 모듈을 생성합니다.
     * [EN] Creates the lake vertex shader module.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule`
     * [EN] Created `GPUShaderModule`
     */
    override createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const {resourceManager} = this.redGPUContext;
        const {wgslParser} = resourceManager;
        const SHADER_INFO = wgslParser.parse('LAKE_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms?.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('LAKE_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
        this.#syncVertexUniforms();
        return shaderModule;
    };

    /**
     * [KO] `Lake` 인스턴스와 내부 GPU 리소스를 해제합니다.
     * [EN] Destroys the `Lake` instance and releases internal GPU resources.
     */
    override destroy(): void {
        if (this.#capturePass) this.#capturePass.destroy();
        if (this.#waveSimulator) this.#waveSimulator.destroy();
        if (this.#rippleDirectTexture) this.#rippleDirectTexture.destroy();
        if (this.#interactionManager) this.#interactionManager.destroy();
        if (super.material) {
            this.material.rippleTexture = null;
        }
        this.#interactionFollowTarget = null;
        this.#currentActiveMeshes.length = 0;
        super.destroy();
    }

    #encodeClearPass = (encoder: GPUCommandEncoder): void => {
        this.#waveSimulator.clear(encoder);
    };

    #encodePass = (encoder: GPUCommandEncoder): void => {
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
        if (!this.passFrustumCulling) return;

        if (!this.#interactionEnabled) {
            if (this.#needsWaveClear) {
                this.#needsWaveClear = false;
                this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, this.#encodeClearPass);
            }
            return;
        }

        const hasRegisteredMeshes = LakeInteractionRegistry.meshes.size > 0;
        if (!hasRegisteredMeshes && this.#decayFramesRemaining <= 0) {
            if (this.#needsWaveClear) {
                this.#needsWaveClear = false;
                this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, this.#encodeClearPass);
            }
            return;
        }

        const currentTime = this.redGPUContext.currentTime || performance.now();
        const dt = renderViewStateData?.deltaTime !== undefined
            ? renderViewStateData.deltaTime
            : Math.min(0.05, Math.max(0.001, (currentTime - this.#lastInteractionTime) * 0.001));
        this.#lastInteractionTime = currentTime;

        const lakeMatrix = this.modelMatrix;
        const lakeX = lakeMatrix ? lakeMatrix[12] : this.x;
        const lakeZ = lakeMatrix ? lakeMatrix[14] : this.z;

        let targetX = lakeX;
        let targetZ = lakeZ;

        if (this.#interactionFollowTarget) {
            const m = this.#interactionFollowTarget.modelMatrix;
            const rawTargetX = m ? m[12] : this.#interactionFollowTarget.x;
            const rawTargetZ = m ? m[14] : this.#interactionFollowTarget.z;
            const halfW = (this.#width * Math.abs(this.scaleX)) * 0.5;
            const halfH = (this.#height * Math.abs(this.scaleZ)) * 0.5;
            targetX = Math.max(lakeX - halfW, Math.min(lakeX + halfW, rawTargetX));
            targetZ = Math.max(lakeZ - halfH, Math.min(lakeZ + halfH, rawTargetZ));
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
        this.material.rippleDomainCenter = domainCenter;

        const activeMeshes = this.#interactionManager.collectActiveMeshes(
            dt,
            snapX,
            snapZ,
            domainSize * 0.75,
            this.waterLevel,
            6.0
        );

        const requiredDecayFrames = Math.ceil(16.0 / Math.max(0.001, this.rippleDamping));
        if (activeMeshes.length > 0) {
            this.#decayFramesRemaining = requiredDecayFrames;
            this.#needsWaveClear = false;
        } else if (this.#decayFramesRemaining > 0) {
            if (this.#decayFramesRemaining > requiredDecayFrames) {
                this.#decayFramesRemaining = requiredDecayFrames;
            }
            this.#decayFramesRemaining--;
            if (this.#decayFramesRemaining === 0) {
                this.#needsWaveClear = true;
            }
        } else {
            if (this.#needsWaveClear) {
                this.#needsWaveClear = false;
                this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, this.#encodeClearPass);
            }
            return;
        }

        this.#currentActiveMeshes = activeMeshes;
        this.#currentSnapX = snapX;
        this.#currentSnapZ = snapZ;
        this.#currentDomainSize = domainSize;
        this.#currentShiftX = shiftX;
        this.#currentShiftZ = shiftZ;
        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, this.#encodePass);
    }
}

Object.freeze(Lake);
export default Lake;
