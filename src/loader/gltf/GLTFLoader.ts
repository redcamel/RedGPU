import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import getFileExtension from "../../utils/file/getFileExtension";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import {GLTF} from "./GLTF";
import {GLTFParsedSingleClip} from "./parsers/animation/parseAnimations";
import parseFileGLB from "./parsers/loadFile/parseFileGLB";
import parseFileGLTF from "./parsers/loadFile/parseFileGLTF";

/**
 * [KO] GLTF 파일 파싱 결과 정보를 담고 있는 타입입니다.
 * [EN] Represents the result of parsing a GLTF file.
 */
type GLTFParsingResult = {
    /**
     * [KO] GLTF 파일에 정의된 그룹 목록
     * [EN] The groups defined in the GLTF file.
     */
    groups: any[],
    /**
     * [KO] GLTF 파일에 정의된 재질 목록
     * [EN] The materials defined in the GLTF file.
     */
    materials: any[],
    /**
     * [KO] GLTF 파일에 정의된 URI 정보
     * [EN] The URIs defined in the GLTF file.
     */
    uris: {
        buffers: any[]
    },
    /**
     * [KO] GLTF 파일에 정의된 텍스처 맵
     * [EN] The textures defined in the GLTF file.
     */
    textures: Record<string, any>,
    /**
     * [KO] GLTF 파일에 정의된 원시 텍스처 목록
     * [EN] The list of raw textures defined in the GLTF file.
     */
    textureRawList: any[],
    /**
     * [KO] GLTF 파일에 정의된 카메라 목록
     * [EN] The cameras defined in the GLTF file.
     */
    cameras: any[],
    /**
     * [KO] GLTF 파일에 정의된 파싱된 애니메이션 클립 목록
     * [EN] The parsed animation clips defined in the GLTF file.
     */
    animations: GLTFParsedSingleClip[]
}

/**
 * [KO] GLTF 로딩 진행 상황 정보를 담고 있는 타입입니다.
 * [EN] Represents information about the GLTF loading progress.
 */
export type GLTFLoadingProgressInfo = {
    url: string,
    model: {
        loaded: number;
        total: number;
        lengthComputable: boolean;
        percent: number;
        transferred: string;
        totalSize: string;
    },
    buffers?: {
        loaded: number;
        total: number;
        percent: number
    }
    textures?: {
        loaded: number;
        total: number;
        percent: number
    }
};

/**
 * [KO] GLTF 2.0 포맷의 3D 모델 파일을 로드하고 파싱하는 로더입니다.
 * [EN] Loader that loads and parses 3D model files in GLTF 2.0 format.
 *
 * [KO] .gltf (JSON) 및 .glb (Binary) 형식을 모두 지원하며, 메쉬, 재질, 텍스처, 애니메이션, 스킨 등을 자동으로 파싱하여 RedGPU 객체로 변환합니다.
 * [EN] Supports both .gltf (JSON) and .glb (Binary) formats, and automatically parses meshes, materials, textures, animations, skins, etc., converting them into RedGPU objects.
 *
 * * ### Example
 * ```typescript
 * const loader = new RedGPU.GLTFLoader(
 *     redGPUContext,
 *     'assets/gltf/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
 *     (loader) => {
 *         console.log('Load Complete:', loader);
 *         scene.addChild(loader.resultMesh);
 *
 *         // 애니메이션 재생 (Play animation)
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
class GLTFLoader {
    /**
     * [KO] GLTF 파싱 결과 데이터
     * [EN] GLTF parsing result data
     */
    parsingResult: GLTFParsingResult
    /**
     * [KO] 파싱된 결과가 포함된 루트 메쉬 컨테이너
     * [EN] Root mesh container containing the parsed result
     */
    resultMesh: Mesh
    /**
     * @internal
     */
    parsingOption // TODO - 이거뭔지 알아내야함
    /**
     * [KO] 현재 재생 중인 애니메이션 정보 목록
     * [EN] List of currently playing animation information
     */
    activeAnimations: any[] = []
    readonly #redGPUContext: RedGPUContext
    readonly #filePath: string
    readonly #fileName: string
    readonly #url: string
    readonly #fileExtension: string
    #gltfData: GLTF
    readonly #onLoad
    readonly #onError
    readonly #onProgress
    #loadingProgressInfo: GLTFLoadingProgressInfo = {
        url: '',
        model: {loaded: 0, total: 0, lengthComputable: true, percent: 0, transferred: '0', totalSize: '0'},
    }

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
    constructor(redGPUContext: RedGPUContext, url: string, onLoad, onProgress, onError) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#url = url
        this.#filePath = getFilePath(url);
        this.#fileName = getFileName(url)
        this.#fileExtension = getFileExtension(url);
        this.#onLoad = onLoad;
        this.#onProgress = onProgress;
        this.#onError = onError;
        this.parsingResult = {
            groups: [],
            materials: [],
            uris: {
                buffers: []
            },
            textures: {},
            textureRawList: [],
            cameras: [],
            animations: []
        };
        this.resultMesh = new Mesh(this.#redGPUContext);
        this.resultMesh.gltfLoaderInfo = this
        this.resultMesh.animationInfo.animationsList = this.parsingResult.animations
        this.#loadingProgressInfo.url = getFileName(url);
        this.#loadFile();
    }

    /**
     * [KO] 현재 로딩 진행 정보를 반환합니다.
     * [EN] Returns the current loading progress information.
     *
     * @returns
     * [KO] 로딩 진행 정보 객체
     * [EN] Loading progress info object
     */
    get loadingProgressInfo(): GLTFLoadingProgressInfo {
        return this.#loadingProgressInfo;
    }

    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] 파일 경로를 반환합니다.
     * [EN] Returns the file path.
     */
    get filePath(): string {
        return this.#filePath;
    }

    /**
     * [KO] 원본 GLTF 데이터를 반환합니다.
     * [EN] Returns the raw GLTF data.
     */
    get gltfData(): GLTF {
        return this.#gltfData;
    }

    /**
     * [KO] 원본 GLTF 데이터를 설정합니다.
     * [EN] Sets the raw GLTF data.
     * @internal
     */
    set gltfData(value: GLTF) {
        this.#gltfData = value;
    }

    /**
     * [KO] 파일 이름을 반환합니다.
     * [EN] Returns the file name.
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * [KO] 파일 URL을 반환합니다.
     * [EN] Returns the file URL.
     */
    get url(): string {
        return this.#url;
    }

    // stopAnimation(parsedSingleClip: GLTFParsedSingleClip) {
    //     const {activeAnimations} = this
    //     let index = activeAnimations.indexOf(parsedSingleClip);
    //     if (index > -1) {
    //         activeAnimations.splice(index, 1);
    //     }
    // };

    /**
     * [KO] 모든 활성화된 애니메이션을 중지합니다.
     * [EN] Stops all active animations.
     *
     * * ### Example
     * ```typescript
     * loader.stopAnimation();
     * ```
     */
    stopAnimation() {
        this.activeAnimations.length = 0
    }

    /**
     * [KO] 특정 애니메이션 클립을 재생합니다.
     * [EN] Plays a specific animation clip.
     *
     * * ### Example
     * ```typescript
     * const clip = loader.parsingResult.animations[0];
     * loader.playAnimation(clip);
     * ```
     *
     * @param parsedSingleClip -
     * [KO] 재생할 애니메이션 클립
     * [EN] Animation clip to play
     */
    playAnimation(parsedSingleClip: GLTFParsedSingleClip) {
        const {activeAnimations} = this
        activeAnimations.push(
            new PlayAnimationInfo(performance.now(), parsedSingleClip)
        );
    };

    async #loadFile() {
        try {
            if (this.#fileExtension === 'glb') {
                parseFileGLB(this, () => this.#onLoad(this), this.#onProgress)
            } else if (this.#fileExtension === 'gltf') {
                parseFileGLTF(this, () => this.#onLoad(this), this.#onProgress)
            } else {
                consoleAndThrowError('Unknown file extension: ' + this.#fileExtension);
            }
        } catch (error) {
            this.#onError?.(error);
        }
    }
}

Object.freeze(GLTFLoader);
export default GLTFLoader;

/**
 * [KO] 재생 중인 애니메이션 정보를 담는 클래스입니다.
 * [EN] Class containing information about the animation being played.
 *
 * @category Animation
 */
export class PlayAnimationInfo {
    /**
     * [KO] 애니메이션 시작 시간 (ms)
     * [EN] Animation start time (ms)
     */
    startTime: number
    /**
     * [KO] 재생 중인 GLTF 파싱 애니메이션 클립
     * [EN] The parsed GLTF animation clip being played
     */
    targetGLTFParsedSingleClip: GLTFParsedSingleClip

    /**
     * [KO] PlayAnimationInfo 인스턴스를 생성합니다.
     * [EN] Creates a PlayAnimationInfo instance.
     *
     * @param startTime -
     * [KO] 시작 시간
     * [EN] Start time
     * @param targetAniTrackList -
     * [KO] 대상 애니메이션 클립
     * [EN] Target animation clip
     */
    constructor(startTime: number, targetAniTrackList: GLTFParsedSingleClip) {
        this.startTime = startTime
        this.targetGLTFParsedSingleClip = targetAniTrackList
    }
}
