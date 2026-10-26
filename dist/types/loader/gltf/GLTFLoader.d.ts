import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import { GLTF } from "./GLTF";
import { ClipAnimState } from "./animationLooper/AnimStateMachine";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] GLTF 파일 파싱 결과 정보를 담고 있는 타입입니다.
 * [EN] Represents the result of parsing a GLTF file.
 *
 * @category Loader
 */
type GLTFParsingResult = {
    /**
     * [KO] GLTF 파일에 정의된 그룹 목록
     * [EN] Groups defined in the GLTF file
     */
    groups: any[];
    /**
     * [KO] GLTF 파일에 정의된 재질 목록
     * [EN] Materials defined in the GLTF file
     */
    materials: any[];
    /**
     * [KO] GLTF 파일에 정의된 URI 버퍼 정보
     * [EN] URI buffer information defined in the GLTF file
     */
    uris: {
        buffers: any[];
    };
    /**
     * [KO] GLTF 파일에 정의된 텍스처 맵
     * [EN] Textures defined in the GLTF file
     */
    textures: Record<string, any>;
    /**
     * [KO] GLTF 파일에 정의된 원시 텍스처 목록
     * [EN] List of raw textures defined in the GLTF file
     */
    textureRawList: any[];
    /**
     * [KO] GLTF 파일에 정의된 카메라 목록
     * [EN] Cameras defined in the GLTF file
     */
    cameras: any[];
    /**
     * [KO] GLTF 파일에 정의된 파싱된 애니메이션 클립 목록
     * [EN] Parsed animation clips defined in the GLTF file
     */
    animations: ClipAnimState[];
};
/**
 * [KO] GLTF 로딩 진행 상태 정보를 나타내는 타입입니다.
 * [EN] Type representing GLTF loading progress information.
 *
 * @category Loader
 */
export type GLTFLoadingProgressInfo = {
    url: string;
    model: {
        loaded: number;
        total: number;
        lengthComputable: boolean;
        percent: number;
        transferred: string;
        totalSize: string;
    };
    buffers?: {
        loaded: number;
        total: number;
        percent: number;
    };
    textures?: {
        loaded: number;
        total: number;
        percent: number;
    };
};
/**
 * [KO] GLTF 2.0 포맷(`.gltf`, `.glb`)의 3D 모델 파일을 로드하고 메쉬, 재질, 텍스처, 애니메이션, 스킨을 RedGPU 객체로 파싱하는 로더 클래스입니다.
 * [EN] Loader class that loads 3D model files in GLTF 2.0 format (`.gltf`, `.glb`) and parses meshes, materials, textures, animations, and skins into RedGPU objects.
 *
 * ### Example
 * ```typescript
 * const loader = new RedGPU.GLTFLoader(
 *     redGPUContext,
 *     'assets/gltf/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
 *     (loader) => {
 *         scene.addChild(loader.resultMesh);
 *
 *         // [KO] 애니메이션 재생
 *         // [EN] Play animation
 *         if (loader.parsingResult.animations.length > 0) {
 *             loader.playAnimation(loader.parsingResult.animations[0]);
 *         }
 *     },
 *     (progress) => {
 *         console.log('Loading Progress:', progress);
 *     },
 *     (error) => {
 *         console.error('Load Error:', error);
 *     }
 * );
 * ```
 *
 * @category Loader
 */
declare class GLTFLoader extends RedGPUObject {
    #private;
    /**
     * [KO] GLTF 파싱 결과 데이터
     * [EN] GLTF parsing result data
     */
    parsingResult: GLTFParsingResult;
    /**
     * [KO] 파싱된 결과가 포함된 루트 메쉬 컨테이너
     * [EN] Root mesh container containing the parsed result
     */
    resultMesh: Mesh;
    /**
     * [KO] GLTF 파싱 옵션
     * [EN] GLTF parsing options
     */
    parsingOption: any;
    /**
     * [KO] 현재 재생 중인 애니메이션 정보 목록
     * [EN] List of currently playing animation information
     */
    activeAnimations: any[];
    /**
     * [KO] GLTFLoader 인스턴스를 생성하고 파일 로딩을 시작합니다.
     * [EN] Creates a GLTFLoader instance and starts file loading.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param url -
     * [KO] 로드할 GLTF/GLB 파일 경로
     * [EN] Path to the GLTF/GLB file to load
     * @param onLoad -
     * [KO] 로딩 완료 시 호출될 콜백 함수
     * [EN] Callback function called when loading is complete
     * @param onProgress -
     * [KO] 로딩 진행 중 호출될 콜백 함수 (선택)
     * [EN] Callback function called during loading progress (optional)
     * @param onError -
     * [KO] 에러 발생 시 호출될 콜백 함수 (선택)
     * [EN] Callback function called when an error occurs (optional)
     */
    constructor(redGPUContext: RedGPUContext, url: string, onLoad: any, onProgress: any, onError: any);
    /**
     * [KO] 현재 로딩 진행 정보를 반환합니다.
     * [EN] Returns the current loading progress information.
     *
     * @returns
     * [KO] 로딩 진행 정보 객체
     * [EN] Loading progress info object
     */
    get loadingProgressInfo(): GLTFLoadingProgressInfo;
    /**
     * [KO] 파일 경로를 반환합니다.
     * [EN] Returns the file path.
     *
     * @returns
     * [KO] 파일 디렉터리 경로 문자열
     * [EN] File directory path string
     */
    get filePath(): string;
    /**
     * [KO] 원본 GLTF 데이터를 가져오거나 설정합니다.
     * [EN] Gets or sets the raw GLTF data.
     *
     * @returns
     * [KO] 원본 GLTF 데이터 객체
     * [EN] Raw GLTF data object
     */
    get gltfData(): GLTF;
    set gltfData(value: GLTF);
    /**
     * [KO] 파일 이름을 반환합니다.
     * [EN] Returns the file name.
     *
     * @returns
     * [KO] 파일 이름 문자열
     * [EN] File name string
     */
    get fileName(): string;
    /**
     * [KO] 파일 URL을 반환합니다.
     * [EN] Returns the file URL.
     *
     * @returns
     * [KO] 파일 URL 문자열
     * [EN] File URL string
     */
    get url(): string;
    /**
     * [KO] 모든 활성화된 애니메이션을 중지합니다.
     * [EN] Stops all active animations.
     *
     * ### Example
     * ```typescript
     * loader.stopAnimation();
     * ```
     */
    stopAnimation(): void;
    /**
     * [KO] 특정 애니메이션 클립을 재생합니다.
     * [EN] Plays a specific animation clip.
     *
     * ### Example
     * ```typescript
     * const clip = loader.parsingResult.animations[0];
     * loader.playAnimation(clip);
     * ```
     *
     * @param clipState -
     * [KO] 재생할 애니메이션 클립 상태
     * [EN] Animation clip state to play
     */
    playAnimation(clipState: ClipAnimState): void;
    /**
     * [KO] GLTFLoader 인스턴스와 파싱된 애니메이션 트랙 및 참조 리소스를 해제합니다.
     * [EN] Releases and destroys the GLTFLoader instance, parsed animation tracks, and referenced resources.
     */
    destroy(): void;
}
export default GLTFLoader;
/**
 * [KO] 재생 중인 애니메이션 상태 및 모션 블렌딩 정보를 담는 클래스입니다.
 * [EN] Class containing active animation state and motion blending information.
 *
 * @category Animation
 */
export declare class PlayAnimationInfo {
    /**
     * [KO] 애니메이션 시작 시간 (ms)
     * [EN] Animation start time (ms)
     */
    startTime: number;
    /**
     * [KO] 재생 중인 애니메이션 클립 상태
     * [EN] Animation clip state being played
     */
    targetGLTFParsedSingleClip: ClipAnimState;
    /**
     * [KO] 모션 블렌딩 활성화 여부
     * [EN] Whether motion blending is active
     */
    isBlending?: boolean;
    /**
     * [KO] 블렌딩 시작 클립 상태
     * [EN] Source clip state for blending
     */
    fromClip?: ClipAnimState;
    /**
     * [KO] 블렌딩 대상 클립 상태
     * [EN] Target clip state for blending
     */
    toClip?: ClipAnimState;
    /**
     * [KO] 블렌딩 가중치 (0~1)
     * [EN] Blending weight (0~1)
     */
    blendWeight?: number;
    /**
     * [KO] 시작 클립의 재생 시작 시간 (ms)
     * [EN] Playback start time of the source clip (ms)
     */
    startTimeFrom?: number;
    /**
     * [KO] 대상 클립의 재생 시작 시간 (ms)
     * [EN] Playback start time of the target clip (ms)
     */
    startTimeTo?: number;
    /**
     * [KO] 연결된 애니메이션 상태 머신 인스턴스
     * [EN] Associated animation state machine instance
     */
    animStateMachine?: any;
    /**
     * [KO] PlayAnimationInfo 인스턴스를 생성합니다.
     * [EN] Creates a PlayAnimationInfo instance.
     *
     * @param startTime -
     * [KO] 시작 시간 (ms)
     * [EN] Start time (ms)
     * @param clipState -
     * [KO] 대상 애니메이션 클립 상태
     * [EN] Target animation clip state
     */
    constructor(startTime: number, clipState: ClipAnimState);
}
