import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../../defineProperty/core/updateTargetUniform";
import {
    WaterActiveMeshEntry,
    WaterCapturePass,
    WaterInteractionManager,
    WaterInteractionRegistry,
    WaterWaveSimulator
} from "../interaction";
import DirectTexture from "../../../resources/texture/DirectTexture";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RenderViewStateData from "../../view/core/RenderViewStateData";

interface WaterLake {
    waveAmplitude: number;
    waveWavelength: number;
    waveSpeed: number;
    maxPenetration: number;
}

/**
 * [KO] 실시간 PBR 호수 수체 (인터랙티브 파동 시뮬레이션 및 계층 객체 추적 지원)
 * [EN] Real-time PBR Lake water body (supports interactive wave simulation and hierarchical object tracking)
 */
class WaterLake extends Mesh {
    readonly isWater: boolean = true;
    /**
     * [KO] 인터랙티브 파동 시뮬레이션 활성화 여부
     */
    interactionEnabled: boolean = true;
    #interactionDomainSize: number = 16.0;

    /**
     * [KO] 로컬 인터랙션 시뮬레이션 윈도우 크기 (미터 단위, 기본값: 16.0m)
     * [EN] Local interaction simulation window size (in meters, default: 16.0m)
     */
    get interactionDomainSize(): number {
        return this.#interactionDomainSize;
    }

    set interactionDomainSize(value: number) {
        this.#interactionDomainSize = value;
        if (this._material) {
            this.waterMaterial.rippleDomainSize = value;
        }
    }
    /**
     * [KO] 시뮬레이션 윈도우가 추적할 중심 대상 객체 (미지정 시 첫 번째 등록 객체 또는 호수 중심)
     */
    interactionFollowTarget: Object3DContainer | null = null;
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
            this.#updateInteraction(renderViewStateData.deltaTime);
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

        // 인터랙션 서브시스템 초기화
        this.#interactionManager = new WaterInteractionManager(redGPUContext);
        this.#capturePass = new WaterCapturePass(redGPUContext, 512);
        this.#waveSimulator = new WaterWaveSimulator(redGPUContext, 512);
        this.#waveSimulator.updateCaptureBinding(this.#capturePass.captureTextureView);

        // 시뮬레이션 결과물을 DirectTexture로 래핑하여 머티리얼에 바인딩
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

    /**
     * [KO] 인터랙션 물결 시뮬레이션 전파 속도 (기본값: 0.32)
     * [EN] Interaction ripple simulation propagation speed (default: 0.32)
     */
    get rippleWaveSpeed(): number {
        return this.#waveSimulator.waveSpeed;
    }

    set rippleWaveSpeed(value: number) {
        this.#waveSimulator.waveSpeed = value;
    }

    /**
     * [KO] 인터랙션 물결 감쇄율 (기본값: 0.012)
     * [EN] Interaction ripple damping factor (default: 0.012)
     */
    get rippleDamping(): number {
        return this.#waveSimulator.damping;
    }

    set rippleDamping(value: number) {
        this.#waveSimulator.damping = value;
    }

    /**
     * [KO] 인터랙션 물결 법선 벡터 강도 (기본값: 1.0)
     * [EN] Interaction ripple normal vector strength (default: 1.0)
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

    /**
     * [KO] 매 프레임 인터랙션 캡처 및 파동 시뮬레이션을 실행합니다.
     *      호수가 카메라 프러스텀 밖에 위치하여 컬링되면 즉각 연산을 건너뜁니다.
     * [EN] Runs interaction capture and wave simulation each frame.
     *      Immediately skips computation if the lake is culled outside the camera frustum.
     */
    #updateInteraction(deltaTime?: number): void {
        // 호수가 프러스텀 컬링에 의해 화면에 보이지 않거나 인터랙션이 비활성화된 경우 즉각 스킵
        if (!this.interactionEnabled || !this.passFrustumCulling) return;

        const hasMeshes = WaterInteractionRegistry.meshes.size > 0;
        if (hasMeshes) {
            this.#decayFramesRemaining = 90; // 활성 객체가 있으면 감쇄 카운터 리셋 (약 1.5초 유예)
        } else if (this.#decayFramesRemaining > 0) {
            this.#decayFramesRemaining--;   // 잔여 파동이 마찰 감쇄로 소멸할 때까지 시뮬레이션 지속
        } else {
            return; // 완전히 잔잔해진 후 안전하게 연산 건너뜀 (GPU 0ms 유지)
        }

        const currentTime = this.redGPUContext.currentTime || performance.now();
        const dt = deltaTime !== undefined
            ? deltaTime
            : Math.min(0.05, Math.max(0.001, (currentTime - this.#lastInteractionTime) * 0.001));
        this.#lastInteractionTime = currentTime;

        // 중심 추적 좌표 결정 (월드 좌표 기준, 유예 기간 중에는 이전 스냅 좌표 유지로 도메인 지터링 방지)
        let targetX = this.#prevSnapX || this.x;
        let targetZ = this.#prevSnapZ || this.z;

        if (this.interactionFollowTarget) {
            const m = this.interactionFollowTarget.modelMatrix;
            if (m) {
                targetX = m[12];
                targetZ = m[14];
            } else {
                targetX = (this.interactionFollowTarget as any).x ?? 0;
                targetZ = (this.interactionFollowTarget as any).z ?? 0;
            }
        } else if (hasMeshes) {
            for (const mesh of WaterInteractionRegistry.meshes) {
                const m = mesh.modelMatrix;
                targetX = m ? m[12] : mesh.x;
                targetZ = m ? m[14] : mesh.z;
                break;
            }
        }

        // 텍셀 스냅핑 (Texel Snapping으로 화면 수평 지터 원천 방지)
        const domainSize = this.interactionDomainSize;
        const texelSize = domainSize / this.#waveSimulator.textureSize;
        const snapX = Math.floor(targetX / texelSize) * texelSize;
        const snapZ = Math.floor(targetZ / texelSize) * texelSize;

        // 도메인 이동에 따른 텍셀 오프셋 계산 (월드 공간 파동 고정 및 발 추적 방지)
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

        // 등록된 선언적 활성 메쉬 자동 수집 (Zero-GC)
        const activeMeshes = this.#interactionManager.collectActiveMeshes(
            dt,
            snapX,
            snapZ,
            domainSize * 0.75,
            this.waterLevel,
            6.0
        );

        // PRE_PROCESS 단계에서 캡처 및 컴퓨트 시뮬레이션 일괄 인코딩 (Zero-GC 바운드 콜백 활용)
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
