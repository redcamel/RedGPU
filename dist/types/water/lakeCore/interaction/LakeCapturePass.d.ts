import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import { LakeActiveMeshEntry } from "./LakeInteractionManager";
/**
 * [KO] 활성 메시의 수면 침투 깊이 및 파동 자극 데이터를 캡처하는 렌더 패스 클래스입니다.
 * [EN] Render pass class that captures water penetration depth and wave impulse data of active meshes.
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
declare class LakeCapturePass extends RedGPUObject {
    #private;
    /**
     * [KO] 캡처 텍스처의 가로·세로 해상도(픽셀)입니다. (기본값: `512`)
     * [EN] Width and height resolution of the capture texture in pixels. (Default: `512`)
     */
    textureSize: number;
    /**
     * [KO] 침투 깊이 및 속도 자극이 기록되는 `GPUTexture`입니다.
     * [EN] `GPUTexture` where penetration depth and velocity impulses are recorded.
     */
    captureTexture: GPUTexture;
    /**
     * [KO] `captureTexture`의 `GPUTextureView`입니다.
     * [EN] `GPUTextureView` of `captureTexture`.
     */
    captureTextureView: GPUTextureView;
    /**
     * [KO] `LakeCapturePass` 인스턴스를 생성합니다.
     * [EN] Creates a `LakeCapturePass` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param textureSize -
     * [KO] 캡처 텍스처 해상도 (기본값: `512`)
     * [EN] Capture texture resolution (default: `512`)
     */
    constructor(redGPUContext: RedGPUContext, textureSize?: number);
    /**
     * [KO] 활성 메시 목록을 렌더링하여 수면 침투 깊이를 캡처 텍스처에 기록합니다.
     * [EN] Renders the active mesh list to record water penetration depth into the capture texture.
     *
     * @param commandEncoder -
     * [KO] 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the pass
     * @param activeMeshes -
     * [KO] 활성 메시 엔트리 배열 (`LakeActiveMeshEntry[]`)
     * [EN] Array of active mesh entries (`LakeActiveMeshEntry[]`)
     * @param domainCenterX -
     * [KO] 캡처 도메인 중심 월드 X 좌표
     * [EN] Capture domain center world X coordinate
     * @param domainCenterZ -
     * [KO] 캡처 도메인 중심 월드 Z 좌표
     * [EN] Capture domain center world Z coordinate
     * @param domainSize -
     * [KO] 캡처 도메인의 월드 단위 한 변 크기
     * [EN] Side length of the capture domain in world units
     * @param waterLevel -
     * [KO] 호수 수면의 월드 Y 좌표
     * [EN] World Y coordinate of the lake water surface
     * @param maxPenetration -
     * [KO] 최대 허용 침투 깊이 (기본값: `0.35`)
     * [EN] Maximum allowable penetration depth (default: `0.35`)
     */
    render(commandEncoder: GPUCommandEncoder, activeMeshes: LakeActiveMeshEntry[], domainCenterX: number, domainCenterZ: number, domainSize: number, waterLevel: number, maxPenetration?: number): void;
    /**
     * [KO] 할당된 GPU 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU resources.
     */
    destroy(): void;
}
export default LakeCapturePass;
