import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import PBRMaterial from "../../material/pbrMaterial/PBRMaterial";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import getFileExtension from "../../utils/file/getFileExtension";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import {GLTF} from "./GLTF";
import {ClipAnimState} from "./animationLooper/AnimStateMachine";
import {MaterialVariantEntry, resolveMaterialVariantIndex} from "./core/materialVariantsHelper";
import parseFileGLB from "./parsers/loadFile/parseFileGLB";
import parseFileGLTF from "./parsers/loadFile/parseFileGLTF";
import RedGPUObject from "../../base/RedGPUObject";

/**
 * [KO] `GLTFLoader.loadAsync()` 호출 시 전달할 수 있는 옵션 인터페이스입니다.
 * [EN] Options interface for `GLTFLoader.loadAsync()`.
 *
 * @category Loader
 */
export interface GLTFLoadAsyncOptions {
    /**
     * [KO] 로딩 진행 중 호출될 콜백 함수
     * [EN] Optional callback function called during loading progress
     */
    onProgress?: (info: GLTFLoadingProgressInfo) => void;
    /**
     * [KO] 로딩 취소를 제어할 `AbortSignal`
     * [EN] Optional `AbortSignal` to cancel loading
     */
    signal?: AbortSignal;
    /**
     * [KO] 노드/메쉬별 커스텀 파싱 옵션
     * [EN] Optional custom parsing options per mesh name
     */
    parsingOption?: Record<string, (mesh: Mesh) => void>;
}

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
    groups: any[],
    /**
     * [KO] GLTF 파일에 정의된 재질 목록
     * [EN] Materials defined in the GLTF file
     */
    materials: any[],
    /**
     * [KO] GLTF 파일에 정의된 URI 버퍼 정보
     * [EN] URI buffer information defined in the GLTF file
     */
    uris: {
        buffers: any[]
    },
    /**
     * [KO] GLTF 파일에 정의된 텍스처 맵
     * [EN] Textures defined in the GLTF file
     */
    textures: Record<string, any>,
    /**
     * [KO] GLTF 파일에 정의된 원시 텍스처 목록
     * [EN] List of raw textures defined in the GLTF file
     */
    textureRawList: any[],
    /**
     * [KO] GLTF 파일에 정의된 카메라 목록
     * [EN] Cameras defined in the GLTF file
     */
    cameras: any[],
    /**
     * [KO] GLTF 파일에 정의된 파싱된 애니메이션 클립 목록
     * [EN] Parsed animation clips defined in the GLTF file
     */
    animations: ClipAnimState[],
    /**
     * [KO] `KHR_materials_variants` 확장에 정의된 재질 바리에이션 이름 목록
     * [EN] List of material variant names defined in `KHR_materials_variants`
     */
    materialVariants: string[],
    /**
     * [KO] 메쉬별 기본/변형 머티리얼 매핑 테이블
     * [EN] Per-mesh mapping table of default and variant materials
     */
    materialVariantEntries: MaterialVariantEntry[],
    /**
     * [KO] glTF 머티리얼 ID별 생성된 `PBRMaterial` 인스턴스 맵 (`KHR_animation_pointer` 연동용)
     * [EN] Map of glTF material ID to created `PBRMaterial` instances (for `KHR_animation_pointer`)
     */
    materialsById: Map<number, PBRMaterial[]>
}

/**
 * [KO] GLTF 로딩 진행 상태 정보를 나타내는 타입입니다.
 * [EN] Type representing GLTF loading progress information.
 *
 * @category Loader
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
class GLTFLoader extends RedGPUObject {
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
     * [KO] GLTF 파싱 옵션
     * [EN] GLTF parsing options
     */
    parsingOption
    /**
     * [KO] 현재 재생 중인 애니메이션 정보 목록
     * [EN] List of currently playing animation information
     */
    activeAnimations: any[] = []
    #filePath: string
    #fileName: string
    #url: string
    #fileExtension: string
    #gltfData: GLTF
    #activeMaterialVariant: string | null = null
    #isDestroyed: boolean = false
    #abortController: AbortController = new AbortController()
    #externalSignal?: AbortSignal
    #externalAbortHandler?: () => void
    #onLoad
    #onError
    #onProgress
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
     * @param signal -
     * [KO] 로딩 취소를 제어할 `AbortSignal` (선택)
     * [EN] Optional `AbortSignal` to cancel loading
     */
    constructor(redGPUContext: RedGPUContext, url: string, onLoad?, onProgress?, onError?, signal?: AbortSignal) {
        super(redGPUContext);
        this.#url = url
        this.#filePath = getFilePath(url);
        this.#fileName = getFileName(url)
        this.#fileExtension = getFileExtension(url);
        this.#onLoad = onLoad;
        this.#onProgress = onProgress;
        this.#onError = onError;
        if (signal) {
            this.#externalSignal = signal;
            if (signal.aborted) {
                this.#abortController.abort();
            } else {
                this.#externalAbortHandler = () => this.#abortController.abort();
                signal.addEventListener('abort', this.#externalAbortHandler, {once: true});
            }
        }
        this.parsingResult = {
            groups: [],
            materials: [],
            uris: {
                buffers: []
            },
            textures: {},
            textureRawList: [],
            cameras: [],
            animations: [],
            materialVariants: [],
            materialVariantEntries: [],
            materialsById: new Map()
        };
        this.resultMesh = new Mesh(redGPUContext);
        this.resultMesh.gltfLoaderInfo = this
        this.resultMesh.animationInfo.animationsList = this.parsingResult.animations
        this.#loadingProgressInfo.url = getFileName(url);
        this.#loadFile();
    }

    /**
     * [KO] GLTF/GLB 파일을 비동기 `Promise`로 로드합니다. `AbortSignal`을 통한 로딩 취소를 지원합니다.
     * [EN] Asynchronously loads a GLTF/GLB file returning a `Promise`. Supports cancellation via `AbortSignal`.
     *
     * ### Example
     * ```typescript
     * const controller = new AbortController();
     * const result = await RedGPU.GLTFLoader.loadAsync(redGPUContext, url, {
     *     onProgress: (info) => console.log(info.model.percent),
     *     signal: controller.signal
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param url -
     * [KO] 로드할 GLTF/GLB 파일 경로
     * [EN] Path to the GLTF/GLB file to load
     * @param options -
     * [KO] 진행 콜백, `AbortSignal`, `parsingOption` 등 추가 옵션 (선택)
     * [EN] Optional progress callback, `AbortSignal`, and `parsingOption`
     * @returns
     * [KO] 로딩 완료된 `GLTFLoader` 인스턴스를 반환하는 `Promise`
     * [EN] `Promise` resolving to the loaded `GLTFLoader` instance
     */
    static loadAsync(
        redGPUContext: RedGPUContext,
        url: string,
        options?: GLTFLoadAsyncOptions
    ): Promise<GLTFLoader> {
        return new Promise<GLTFLoader>((resolve, reject) => {
            const loader = new GLTFLoader(
                redGPUContext,
                url,
                (loaded) => resolve(loaded),
                options?.onProgress,
                (error) => reject(error),
                options?.signal
            );
            if (options?.parsingOption) {
                loader.parsingOption = options.parsingOption;
            }
        });
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
     * [KO] 파일 경로를 반환합니다.
     * [EN] Returns the file path.
     *
     * @returns
     * [KO] 파일 디렉터리 경로 문자열
     * [EN] File directory path string
     */
    get filePath(): string {
        return this.#filePath;
    }

    /**
     * [KO] 원본 GLTF 데이터를 가져오거나 설정합니다.
     * [EN] Gets or sets the raw GLTF data.
     *
     * @returns
     * [KO] 원본 GLTF 데이터 객체
     * [EN] Raw GLTF data object
     */
    get gltfData(): GLTF {
        return this.#gltfData;
    }

    set gltfData(value: GLTF) {
        this.#gltfData = value;
    }

    /**
     * [KO] 파일 이름을 반환합니다.
     * [EN] Returns the file name.
     *
     * @returns
     * [KO] 파일 이름 문자열
     * [EN] File name string
     */
    get fileName(): string {
        return this.#fileName;
    }

    /**
     * [KO] 파일 URL을 반환합니다.
     * [EN] Returns the file URL.
     *
     * @returns
     * [KO] 파일 URL 문자열
     * [EN] File URL string
     */
    get url(): string {
        return this.#url;
    }

    /**
     * [KO] 모델에 정의된 `KHR_materials_variants` 바리에이션 이름 목록을 반환합니다.
     * [EN] Returns the list of `KHR_materials_variants` variant names defined in the model.
     *
     * @returns
     * [KO] 바리에이션 이름 문자열 배열
     * [EN] Array of variant name strings
     */
    get materialVariants(): string[] {
        return this.parsingResult.materialVariants;
    }

    /**
     * [KO] 현재 적용 중인 `KHR_materials_variants` 바리에이션 이름을 반환합니다. 기본 재질 상태이면 `null`입니다.
     * [EN] Returns the currently active `KHR_materials_variants` variant name, or `null` when default materials are active.
     *
     * @returns
     * [KO] 활성 바리에이션 이름 또는 `null`
     * [EN] Active variant name or `null`
     */
    get activeMaterialVariant(): string | null {
        return this.#activeMaterialVariant;
    }

    /**
     * [KO] 지정된 `KHR_materials_variants` 바리에이션을 모델 전체 메쉬에 적용합니다. `null`을 전달하면 기본 재질로 복원합니다.
     * [EN] Applies the specified `KHR_materials_variants` variant across all meshes in the model. Pass `null` to restore default materials.
     *
     * @param variant -
     * [KO] 바리에이션 이름(`string`), 인덱스(`number`), 또는 기본 복원용 `null`
     * [EN] Variant name (`string`), index (`number`), or `null` to restore defaults
     */
    applyMaterialVariant(variant: string | number | null): void {
        const {materialVariants, materialVariantEntries} = this.parsingResult;
        const resolvedIdx = resolveMaterialVariantIndex(materialVariants, variant);
        if (resolvedIdx === undefined) {
            console.warn(`[GLTFLoader] Unknown material variant: ${variant}`);
            return;
        }
        this.#activeMaterialVariant = resolvedIdx === null ? null : materialVariants[resolvedIdx];
        for (let i = 0, len = materialVariantEntries.length; i < len; i++) {
            const entry = materialVariantEntries[i];
            entry.mesh.material = resolvedIdx === null
                ? entry.defaultMaterial
                : (entry.variantMaterials.get(resolvedIdx) ?? entry.defaultMaterial);
        }
    }

    /**
     * [KO] 모든 활성화된 애니메이션을 중지합니다.
     * [EN] Stops all active animations.
     *
     * ### Example
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
    playAnimation(clipState: ClipAnimState) {
        const {activeAnimations} = this
        activeAnimations.push(
            new PlayAnimationInfo(performance.now(), clipState)
        );
    };

    /**
     * [KO] 진행 중인 GLTF/GLB 로딩 및 파싱을 즉시 중단합니다.
     * [EN] Immediately aborts any in-flight GLTF/GLB loading and parsing.
     */
    abort(): void {
        if (!this.#abortController.signal.aborted) {
            this.#abortController.abort();
        }
    }

    /**
     * [KO] `GLTFLoader` 인스턴스가 해제(`destroy()`)되었는지 여부를 반환합니다.
     * [EN] Returns whether this `GLTFLoader` instance has been destroyed.
     *
     * @returns
     * [KO] 해제 여부 (`true`이면 이미 해제됨)
     * [EN] Whether the loader has been destroyed
     */
    get isDestroyed(): boolean {
        return this.#isDestroyed;
    }

    /**
     * [KO] GLTFLoader 인스턴스와 파싱된 애니메이션 트랙, 씬 부착 루트 메쉬 및 내부 참조 리소스를 안전하게 해제합니다.
     * [EN] Safely releases the GLTFLoader instance, parsed animation tracks, attached root mesh, and internal referenced resources.
     */
    destroy(): void {
        if (this.#isDestroyed) return;
        this.#isDestroyed = true;

        this.abort();
        this.#cleanupAbortListener();
        this.stopAnimation();

        if (this.parsingResult) {
            if (this.parsingResult.animations) {
                this.parsingResult.animations.forEach(clipState => {
                    if (clipState.clip && clipState.clip.tracks) {
                        clipState.clip.tracks.forEach(track => {
                            if (typeof track.destroy === 'function') {
                                track.destroy();
                            }
                        });
                    }
                });
                this.parsingResult.animations = [];
            }
            this.parsingResult.groups = [];
            this.parsingResult.materials = [];
            if (this.parsingResult.uris) {
                this.parsingResult.uris.buffers = [];
            }
            this.parsingResult.textures = {};
            this.parsingResult.textureRawList = [];
            this.parsingResult.cameras = [];
            this.parsingResult.materialVariants = [];
            this.parsingResult.materialVariantEntries = [];
            this.parsingResult.materialsById?.clear();
        }

        this.#activeMaterialVariant = null;
        this.#gltfData = null;
        this.parsingOption = null;
        this.#onLoad = undefined;
        this.#onError = undefined;
        this.#onProgress = undefined;

        if (this.resultMesh) {
            const parent = this.resultMesh.parent;
            if (parent && typeof parent.removeChild === 'function') {
                parent.removeChild(this.resultMesh);
            }
            this.resultMesh.gltfLoaderInfo = null;
            this.resultMesh = null;
        }
    }

    #cleanupAbortListener(): void {
        if (this.#externalSignal && this.#externalAbortHandler) {
            this.#externalSignal.removeEventListener('abort', this.#externalAbortHandler);
            this.#externalAbortHandler = undefined;
        }
    }

    async #loadFile() {
        const signal = this.#abortController.signal;
        try {
            if (this.#fileExtension === 'glb') {
                await parseFileGLB(this, () => this.#onLoad?.(this), this.#onProgress, signal);
            } else if (this.#fileExtension === 'gltf') {
                await parseFileGLTF(this, () => this.#onLoad?.(this), this.#onProgress, signal);
            } else {
                consoleAndThrowError('Unknown file extension: ' + this.#fileExtension);
            }
        } catch (error) {
            if (this.#onError) {
                this.#onError(error);
            } else if ((error as any)?.name !== 'AbortError') {
                console.error(error);
            }
        } finally {
            this.#cleanupAbortListener();
        }
    }
}

Object.freeze(GLTFLoader);
export default GLTFLoader;

/**
 * [KO] 재생 중인 애니메이션 상태 및 모션 블렌딩 정보를 담는 클래스입니다.
 * [EN] Class containing active animation state and motion blending information.
 *
 * @category Loader
 */
export class PlayAnimationInfo {
    /**
     * [KO] 애니메이션 시작 시간 (ms)
     * [EN] Animation start time (ms)
     */
    startTime: number
    /**
     * [KO] 재생 중인 애니메이션 클립 상태
     * [EN] Animation clip state being played
     */
    targetGLTFParsedSingleClip: ClipAnimState
    /**
     * [KO] 모션 블렌딩 활성화 여부
     * [EN] Whether motion blending is active
     */
    isBlending?: boolean
    /**
     * [KO] 블렌딩 시작 클립 상태
     * [EN] Source clip state for blending
     */
    fromClip?: ClipAnimState
    /**
     * [KO] 블렌딩 대상 클립 상태
     * [EN] Target clip state for blending
     */
    toClip?: ClipAnimState
    /**
     * [KO] 블렌딩 가중치 (0~1)
     * [EN] Blending weight (0~1)
     */
    blendWeight?: number
    /**
     * [KO] 시작 클립의 재생 시작 시간 (ms)
     * [EN] Playback start time of the source clip (ms)
     */
    startTimeFrom?: number
    /**
     * [KO] 대상 클립의 재생 시작 시간 (ms)
     * [EN] Playback start time of the target clip (ms)
     */
    startTimeTo?: number
    /**
     * [KO] 연결된 애니메이션 상태 머신 인스턴스
     * [EN] Associated animation state machine instance
     */
    animStateMachine?: any

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
    constructor(startTime: number, clipState: ClipAnimState) {
        this.startTime = startTime
        this.targetGLTFParsedSingleClip = clipState
    }
}
