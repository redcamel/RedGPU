import RedGPUContext from "../../../context/RedGPUContext";
import Ground from "../../../primitive/Ground";
import Mesh from "../../mesh/Mesh";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import SingleLayerWaterMaterial from "../core/SingleLayerWaterMaterial";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import vertexModuleSource from "./shader/waterLakeVertex.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import {
    WaterCapturePass,
    WaterInteractionManager,
    WaterInteractionOptions,
    WaterInteractiveTarget,
    WaterWaveSimulator
} from "../interaction";
import DirectTexture from "../../../resources/texture/DirectTexture";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RenderViewStateData from "../../view/core/RenderViewStateData";

interface WaterLake {
    waveAmplitude: number;
    waveWavelength: number;
    waveSpeed: number;
}

/**
 * [KO] 실시간 PBR 호수 수체 (인터랙티브 파동 시뮬레이션 및 계층 객체 추적 지원)
 * [EN] Real-time PBR Lake water body (supports interactive wave simulation and hierarchical object tracking)
 */
class WaterLake extends Mesh {
    /**
     * [KO] 인터랙티브 파동 시뮬레이션 활성화 여부
     */
    interactionEnabled: boolean = true;
    /**
     * [KO] 로컬 인터랙션 시뮬레이션 윈도우 크기 (미터 단위, 기본값: 16.0m)
     */
    interactionDomainSize: number = 16.0;
    /**
     * [KO] 시뮬레이션 윈도우가 추적할 중심 대상 객체 (미지정 시 첫 번째 등록 객체 또는 호수 중심)
     */
    interactionFollowTarget: Object3DContainer | null = null;
    private readonly _interactionManager: WaterInteractionManager;
    private readonly _capturePass: WaterCapturePass;
    private readonly _waveSimulator: WaterWaveSimulator;
    private readonly _rippleDirectTexture: DirectTexture;
    private _lastInteractionTime: number = 0;
    private _prevSnapX: number = 0;
    private _prevSnapZ: number = 0;
    private _isFirstSnap: boolean = true;

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

        // 인터랙션 서브시스템 초기화
        this._interactionManager = new WaterInteractionManager(redGPUContext);
        this._capturePass = new WaterCapturePass(redGPUContext, 512);
        this._waveSimulator = new WaterWaveSimulator(redGPUContext, 512);
        this._waveSimulator.updateCaptureBinding(this._capturePass.captureTextureView);

        // 시뮬레이션 결과물을 DirectTexture로 래핑하여 머티리얼에 바인딩
        this._rippleDirectTexture = new DirectTexture(
            redGPUContext,
            `WaterLake_Ripple_${this.uuid}`,
            this._waveSimulator.rippleNormalTexture
        );
        this.waterMaterial.rippleTexture = this._rippleDirectTexture;
        this.waterMaterial.rippleDomainSize = this.interactionDomainSize;
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

    /**
     * [KO] 인터랙션 매니저 인스턴스를 반환합니다.
     */
    get interactionManager(): WaterInteractionManager {
        return this._interactionManager;
    }

    /**
     * [KO] 파동 시뮬레이터 인스턴스를 반환합니다.
     */
    get waveSimulator(): WaterWaveSimulator {
        return this._waveSimulator;
    }

    /**
     * [KO] 인터랙션 대상 객체를 등록합니다 (하이라키 자식 메쉬 자동 수집).
     * [EN] Registers interactive target object (automatically collects child hierarchy meshes).
     */
    addInteractiveObject(target: WaterInteractiveTarget, options?: WaterInteractionOptions) {
        return this._interactionManager.addInteractiveObject(target, options);
    }

    /**
     * [KO] 등록된 인터랙션 대상 객체를 제거합니다.
     * [EN] Removes registered interactive target object.
     */
    removeInteractiveObject(target: WaterInteractiveTarget): boolean {
        return this._interactionManager.removeInteractiveObject(target);
    }

    /**
     * [KO] 등록된 모든 인터랙션 대상 객체를 초기화합니다.
     * [EN] Clears all registered interactive target objects.
     */
    clearInteractiveObjects(): void {
        this._interactionManager.clearInteractiveObjects();
    }

    /**
     * [KO] 매 프레임 인터랙션 캡처 및 파동 시뮬레이션을 실행합니다.
     */
    updateInteraction(deltaTime?: number): void {
        if (!this.interactionEnabled || this._interactionManager.count === 0) return;

        const currentTime = this.redGPUContext.currentTime || performance.now();
        const dt = deltaTime !== undefined
            ? deltaTime
            : Math.min(0.05, Math.max(0.001, (currentTime - this._lastInteractionTime) * 0.001));
        this._lastInteractionTime = currentTime;

        // 중심 추적 좌표 결정 (월드 좌표 기준)
        let targetX = this.x;
        let targetZ = this.z;

        if (this.interactionFollowTarget) {
            const m = this.interactionFollowTarget.modelMatrix;
            if (m) {
                targetX = m[12];
                targetZ = m[14];
            }
        } else {
            for (const item of this._interactionManager.items) {
                targetX = item.currentWorldPos[0];
                targetZ = item.currentWorldPos[2];
                break;
            }
        }

        // 텍셀 스냅핑 (Texel Snapping으로 화면 수평 지터 원천 방지)
        const domainSize = this.interactionDomainSize;
        const texelSize = domainSize / this._waveSimulator.textureSize;
        const snapX = Math.floor(targetX / texelSize) * texelSize;
        const snapZ = Math.floor(targetZ / texelSize) * texelSize;

        // 도메인 이동에 따른 텍셀 오프셋 계산 (월드 공간 파동 고정 및 발 추적 방지)
        let shiftX = 0;
        let shiftZ = 0;
        if (!this._isFirstSnap) {
            shiftX = Math.round((snapX - this._prevSnapX) / texelSize);
            shiftZ = Math.round((snapZ - this._prevSnapZ) / texelSize);
        } else {
            this._isFirstSnap = false;
        }
        this._prevSnapX = snapX;
        this._prevSnapZ = snapZ;

        this.waterMaterial.rippleDomainCenter = [snapX, snapZ];
        this.waterMaterial.rippleDomainSize = domainSize;

        // 객체 속도 갱신 및 가시 영역 메쉬 수집
        this._interactionManager.update(dt);
        const activeMeshes = this._interactionManager.collectActiveMeshes(
            snapX,
            snapZ,
            domainSize * 0.75,
            this.waterLevel,
            6.0
        );

        // PRE_PROCESS 단계에서 캡처 및 컴퓨트 시뮬레이션 일괄 인코딩 (월드 텍셀 시프트 전달)
        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.PRE_PROCESS, (encoder) => {
            this._capturePass.render(
                encoder,
                activeMeshes,
                snapX,
                snapZ,
                domainSize,
                this.waterLevel
            );
            this._waveSimulator.simulate(encoder, shiftX, shiftZ);
        });
    }

    override render(renderViewStateData: RenderViewStateData): void {
        if (renderViewStateData.viewIndex === 0) {
            this.updateInteraction();
        }
        super.render(renderViewStateData);
    }

    override destroy(): void {
        if (this._capturePass) this._capturePass.destroy();
        if (this._waveSimulator) this._waveSimulator.destroy();
        if (this._rippleDirectTexture) this._rippleDirectTexture.destroy();
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
]);

defineNumber(WaterLake, [
    {key: 'waveSpeed', value: 1.0},
]);

Object.freeze(WaterLake);
export default WaterLake;
