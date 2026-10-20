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
 * [KO] 실시간 파동 시뮬레이션 및 객체 상호작용 물결을 지원하는 호수 수면 메시 클래스입니다.
 * [EN] Lake water surface mesh class supporting real-time wave simulation and object interaction ripples.
 *
 * [KO] 내부적으로 `Ground` 지오메트리와 `LakeMaterial`을 생성하며, `PRE_PROCESS` 단계에서 침투 깊이 캡처(`LakeCapturePass`)와 FDTD 파동 시뮬레이션(`LakeWaveSimulator`)을 수행합니다.
 * [EN] Internally creates a `Ground` geometry and `LakeMaterial`, and executes penetration depth capture (`LakeCapturePass`) and FDTD wave simulation (`LakeWaveSimulator`) during the `PRE_PROCESS` stage.
 *
 * ### Example
 * ```typescript
 * const lake = new RedGPU.Water.Lake(redGPUContext, 200, 200);
 * scene.addChild(lake);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/basicLake/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake settings example](/RedGPU/examples/3d/water/lake/lakeSettings/)
 * @see [Lake material example](/RedGPU/examples/3d/water/lake/lakeMaterial/)
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @see [Lake with landscape example](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)
 * @see [Multi lake example](/RedGPU/examples/3d/water/lake/multiLake/)
 * @category Water
 */
class Lake extends Mesh {
    #isWater: boolean = true;
    #waveAmplitude: number = 0.025;
    #waveWavelength: number = 16.0;
    #maxPenetration: number = 0.35;
    #interactionFollowTarget: Mesh | null = null;
    #interactionEnabled: boolean = true;
    #interactionDomainSize: number = 16.0;

    #interactionManager: LakeInteractionManager;
    #capturePass: LakeCapturePass;
    #waveSimulator: LakeWaveSimulator;
    #rippleDirectTexture: DirectTexture;
    #lastInteractionTime: number = 0;
    #prevSnapX: number = 0;
    #prevSnapZ: number = 0;
    #isFirstSnap: boolean = true;
    #decayFramesRemaining: number = 0;

    #domainCenterBuffer: [number, number] = [0, 0];
    #currentActiveMeshes: LakeActiveMeshEntry[] = [];
    #currentSnapX: number = 0;
    #currentSnapZ: number = 0;
    #currentDomainSize: number = 0;
    #currentShiftX: number = 0;
    #currentShiftZ: number = 0;

    /**
     * [KO] `Lake` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `Lake`.
     *
     * ### Example
     * ```typescript
     * const lake = new RedGPU.Water.Lake(redGPUContext, 100, 100, 64, 64, 'MainLake');
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
     * [KO] 가로 방향 분할 세그먼트 수 (기본값: `64`)
     * [EN] Number of width segments (default: `64`)
     * @param heightSegments -
     * [KO] 세로 방향 분할 세그먼트 수 (기본값: `64`)
     * [EN] Number of height segments (default: `64`)
     * @param name -
     * [KO] 메시 이름 (기본값: `'Lake'`)
     * [EN] Mesh name (default: `'Lake'`)
     */
    constructor(
        redGPUContext: RedGPUContext,
        width: number = 100,
        height: number = 100,
        widthSegments: number = 64,
        heightSegments: number = 64,
        name: string = 'Lake'
    ) {
        const waterMaterial = new LakeMaterial(redGPUContext);
        const waterGeometry = new Ground(redGPUContext, width, height, widthSegments, heightSegments);

        super(redGPUContext, waterGeometry, waterMaterial, name);

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
        this.waterMaterial.rippleTexture = this.#rippleDirectTexture;
        this.waterMaterial.rippleDomainSize = this.interactionDomainSize;
    }

    /**
     * [KO] 수면 객체 여부를 반환합니다. (항상 `true`)
     * [EN] Returns whether this object is a water surface. (Always `true`)
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
     * [KO] 정점 파동의 진폭을 반환하거나 설정합니다. (최소값: `0`, 기본값: `0.025`)
     * [EN] Gets or sets the vertex wave amplitude. (Min: `0`, default: `0.025`)
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
     * [KO] 정점 파동의 파장을 반환하거나 설정합니다. (최소값: `0.1`, 기본값: `16.0`)
     * [EN] Gets or sets the vertex wave wavelength. (Min: `0.1`, default: `16.0`)
     *
     * @returns
     * [KO] 정점 파동 파장
     * [EN] Vertex wave wavelength
     */
    get waveWavelength(): number {
        return this.#waveWavelength;
    }

    set maxPenetration(value: number) {
        this.#maxPenetration = Math.max(0.05, value);
    }

    /**
     * [KO] 상호작용 캡처 시 허용되는 최대 수면 침투 깊이를 반환하거나 설정합니다. (최소값: `0.05`, 기본값: `0.35`)
     * [EN] Gets or sets the maximum penetration depth into the water surface for interaction capture. (Min: `0.05`, default: `0.35`)
     *
     * @returns
     * [KO] 최대 침투 깊이
     * [EN] Maximum penetration depth
     */
    get maxPenetration(): number {
        return this.#maxPenetration;
    }

    set interactionFollowTarget(target: Mesh | null) {
        this.#interactionFollowTarget = target;
    }

    /**
     * [KO] 상호작용 시뮬레이션 도메인 중심이 추적할 대상 메시를 반환하거나 설정합니다. `null`이면 첫 번째 등록 메시 또는 호수 중심을 기준으로 동작합니다.
     * [EN] Gets or sets the target mesh tracked as the center of the interaction simulation domain. If `null`, uses the first registered mesh or the lake center.
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
            }
        }
    }

    /**
     * [KO] 수면 상호작용 시뮬레이션 활성화 여부를 반환하거나 설정합니다. (기본값: `true`)
     * [EN] Gets or sets whether water surface interaction simulation is enabled. (Default: `true`)
     *
     * @returns
     * [KO] 상호작용 활성화 여부
     * [EN] Whether interaction is enabled
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

    /**
     * [KO] 상호작용 파동 시뮬레이션 영역의 월드 단위 한 변 크기를 반환하거나 설정합니다. (기본값: `16.0`)
     * [EN] Gets or sets the side length of the interaction wave simulation domain in world units. (Default: `16.0`)
     *
     * @returns
     * [KO] 시뮬레이션 도메인 크기
     * [EN] Simulation domain size
     */
    get interactionDomainSize(): number {
        return this.#interactionDomainSize;
    }

    /**
     * [KO] 호수 수면에 적용된 `LakeMaterial` 인스턴스를 반환합니다.
     * [EN] Returns the `LakeMaterial` instance applied to the lake surface.
     *
     * @returns
     * [KO] `LakeMaterial` 인스턴스
     * [EN] `LakeMaterial` instance
     */
    get waterMaterial(): LakeMaterial {
        return this.material as LakeMaterial;
    }

    /**
     * [KO] 호수 수면의 `Ground` 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the `Ground` geometry instance of the lake surface.
     *
     * @returns
     * [KO] `Ground` 지오메트리 인스턴스
     * [EN] `Ground` geometry instance
     */
    get geometry(): Ground {
        return super.geometry as Ground;
    }

    /**
     * [KO] 상호작용 물결의 파동 전파 속도를 반환하거나 설정합니다. (기본값: `0.32`)
     * [EN] Gets or sets the propagation speed of interaction ripple waves. (Default: `0.32`)
     *
     * @returns
     * [KO] 물결 파동 전파 속도
     * [EN] Ripple wave propagation speed
     */
    get rippleWaveSpeed(): number {
        return this.#waveSimulator.waveSpeed;
    }

    /**
     * [KO] 상호작용 물결의 감쇠율을 반환하거나 설정합니다. (기본값: `0.012`)
     * [EN] Gets or sets the damping factor of interaction ripples. (Default: `0.012`)
     *
     * @returns
     * [KO] 물결 감쇠율
     * [EN] Ripple damping factor
     */
    get rippleDamping(): number {
        return this.#waveSimulator.damping;
    }

    set rippleWaveSpeed(value: number) {
        this.#waveSimulator.waveSpeed = value;
    }

    /**
     * [KO] 상호작용 물결의 노멀 강도를 반환하거나 설정합니다. (기본값: `1.0`)
     * [EN] Gets or sets the normal strength of interaction ripples. (Default: `1.0`)
     *
     * @returns
     * [KO] 물결 노멀 강도
     * [EN] Ripple normal strength
     */
    get rippleNormalStrength(): number {
        return this.#waveSimulator.normalStrength;
    }

    set rippleDamping(value: number) {
        this.#waveSimulator.damping = value;
    }

    /**
     * [KO] 호수 수면의 월드 Y 좌표(`this.y`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the world Y coordinate (`this.y`) of the lake surface.
     *
     * @returns
     * [KO] 수면 높이 Y 좌표
     * [EN] Water surface Y coordinate
     */
    get waterLevel(): number {
        return this.y;
    }

    set rippleNormalStrength(value: number) {
        this.#waveSimulator.normalStrength = value;
        if (this.material) {
            this.waterMaterial.rippleNormalStrength = value;
        }
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
     * [KO] 호수 전용 정점 셰이더 모듈(`LAKE_VERTEX`)을 생성하고 정점 유니폼을 동기화합니다.
     * [EN] Creates the lake vertex shader module (`LAKE_VERTEX`) and synchronizes vertex uniforms.
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
     * [KO] `Lake` 인스턴스와 내부 캡처 패스, 파동 시뮬레이터, 리플 텍스처 리소스를 해제합니다.
     * [EN] Destroys the `Lake` instance and releases internal capture pass, wave simulator, and ripple texture resources.
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
        if (!this.#interactionEnabled || !this.passFrustumCulling) return;

        const hasMeshes = LakeInteractionRegistry.meshes.size > 0;
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
            const firstMesh = LakeInteractionRegistry.firstMesh;
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

    set waterLevel(value: number) {
        this.y = value;
    }
}

Object.freeze(Lake);
export default Lake;
