import RedGPUContext from "../../../context/RedGPUContext";
import { PlayAnimationInfo } from "../GLTFLoader";
/**
 * [KO] GLTF 애니메이션의 단일 재생 및 모션 블렌딩을 프레임 단위로 처리하고 회전·이동·스케일·모프 가중치 보간을 수행하는 매니저 클래스입니다.
 * [EN] Manager class that processes single playback and motion blending of GLTF animations per frame and interpolates rotation, translation, scale, and morph weights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
declare class GltfAnimationLooperManager {
    #private;
    /**
     * [KO] 매 프레임 애니메이션을 처리하고 대상 메시의 변환 정보를 갱신합니다.
     * [EN] Processes animation every frame and updates the transform information of target meshes.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param timestamp -
     * [KO] 현재 프레임의 타임스탬프 (ms)
     * [EN] Current frame timestamp (ms)
     * @param computePassEncoder -
     * [KO] GPU 컴퓨트 패스 인코더 (Morph target 가중치 렌더링에 사용)
     * [EN] GPU compute pass encoder (used for morph target weight rendering)
     * @param playAnimationInfoList -
     * [KO] 현재 재생 중인 애니메이션 정보 목록
     * [EN] List of currently playing animation information
     */
    render: (redGPUContext: RedGPUContext, timestamp: number, computePassEncoder: GPUComputePassEncoder, playAnimationInfoList: PlayAnimationInfo[]) => void;
}
export default GltfAnimationLooperManager;
