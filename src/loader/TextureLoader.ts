import RedGPUContext from "../context/RedGPUContext";
import BitmapTexture from "../resources/texture/BitmapTexture";
import CubeTexture from "../resources/texture/CubeTexture";
import RedGPUObject from "../base/RedGPUObject";

/**
 * [KO] 단일 텍스처 로딩 항목의 소스 정보와 로드 상태를 보관하는 데이터 클래스입니다.
 * [EN] Data class that holds source information and loading status for a single texture loading item.
 *
 * @category Loader
 */
export class TextureLoaderData {
    /**
     * [KO] 텍스처 소스 경로 또는 경로 배열
     * [EN] Texture source path or array of paths
     */
    src: any;
    /**
     * [KO] 생성된 텍스처 인스턴스 (`BitmapTexture` 또는 `CubeTexture`)
     * [EN] Created texture instance (`BitmapTexture` or `CubeTexture`)
     */
    texture: null;
    /**
     * [KO] 텍스처 로딩 완료 여부 (성공 및 실패 포함)
     * [EN] Whether texture loading has finished (including success and failure)
     */
    loadEnd: boolean;
    /**
     * [KO] 텍스처 로딩 성공 여부
     * [EN] Whether texture loading succeeded
     */
    loadSuccess: boolean;
    /**
     * [KO] 원본 소스 설정 정보
     * [EN] Original source configuration information
     */
    srcInfo: any;
    /**
     * [KO] 로더 목록 내 인덱스
     * [EN] Index within the loader list
     */
    idx: number;

    /**
     * [KO] 새로운 TextureLoaderData 인스턴스를 생성합니다.
     * [EN] Creates a new TextureLoaderData instance.
     *
     * @param src -
     * [KO] 텍스처 소스 경로 또는 데이터
     * [EN] Texture source path or data
     * @param srcInfo -
     * [KO] 원본 소스 설정 정보
     * [EN] Original source configuration information
     * @param idx -
     * [KO] 로더 목록 내 인덱스
     * [EN] Index within the loader list
     */
    constructor(src: any, srcInfo: any, idx: number) {
        this.src = src;
        this.texture = null;
        this.loadEnd = false;
        this.loadSuccess = false;
        this.srcInfo = srcInfo;
        this.idx = idx;
    }
}

/**
 * [KO] 다수의 2D 비트맵 텍스처(`BitmapTexture`) 및 큐브 텍스처(`CubeTexture`)를 일괄 비동기 로드하고 진행률을 추적하는 로더 클래스입니다.
 * [EN] Loader class that asynchronously batch-loads multiple 2D bitmap textures (`BitmapTexture`) and cube textures (`CubeTexture`) and tracks loading progress.
 *
 * ### Example
 * ```typescript
 * const textureLoader = new RedGPU.TextureLoader(
 *     redGPUContext,
 *     ['assets/diffuse.png', 'assets/normal.png'],
 *     (loader) => {
 *         const diffuseTexture = loader.getTextureByIndex(0);
 *     },
 *     (progress) => {
 *         console.log(progress.percent);
 *     }
 * );
 * ```
 *
 * @category Loader
 */
export default class TextureLoader extends RedGPUObject {
    /**
     * [KO] 로드 대상 텍스처 데이터(`TextureLoaderData`) 목록
     * [EN] List of target texture data (`TextureLoaderData`)
     */
    textures = [];
    #loaded = 0;
    readonly #srcInfoList;
    readonly #callback;
    readonly #progressCallback;

    /**
     * [KO] 새로운 TextureLoader 인스턴스를 생성하고 텍스처 목록 로딩을 시작합니다.
     * [EN] Creates a new TextureLoader instance and starts loading the texture list.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param srcInfoList -
     * [KO] 로드할 텍스처 소스 정보 배열 (기본값: `[]`)
     * [EN] Array of texture source information to load (default: `[]`)
     * @param callback -
     * [KO] 모든 텍스처 로딩이 완료되었을 때 호출되는 콜백 함수
     * [EN] Callback function invoked when all textures have finished loading
     * @param progressCallback -
     * [KO] 개별 텍스처 로딩 진행 시 호출되는 진행률 콜백 함수 (선택)
     * [EN] Progress callback function invoked as individual textures load (optional)
     */
    constructor(redGPUContext: RedGPUContext, srcInfoList = [], callback: Function, progressCallback?: Function) {
        super(redGPUContext);
        this.#srcInfoList = srcInfoList;
        this.#callback = callback;
        this.#progressCallback = progressCallback;
        if (this.#srcInfoList.length) {
            this.#srcInfoList.forEach((srcInfo, index: number) => this.#loadTexture(srcInfo, index));
        } else {
            this.#reportCompletion();
        }
    }

    /**
     * [KO] 지정된 인덱스에 해당하는 로드된 텍스처 인스턴스를 반환합니다.
     * [EN] Returns the loaded texture instance corresponding to the specified index.
     *
     * @param index -
     * [KO] 조회할 텍스처 인덱스
     * [EN] Texture index to retrieve
     * @returns
     * [KO] 텍스처 인스턴스 (`BitmapTexture` 또는 `CubeTexture`)
     * [EN] Texture instance (`BitmapTexture` or `CubeTexture`)
     */
    getTextureByIndex(index: number) {
        if (this.textures[index]) return this.textures[index].texture;
    }

    #loadTexture(srcInfo, index: number): void {
        const {redGPUContext} = this;
        let targetTexture, srcTarget;
        let targetClass: any = BitmapTexture;
        if (srcInfo.hasOwnProperty('src')) {
            srcTarget = srcInfo.src;
        } else {
            srcTarget = srcInfo;
        }
        if (srcTarget instanceof Array) {
            targetClass = CubeTexture;
        }
        targetTexture = new TextureLoaderData(srcTarget, srcInfo, index);
        const onLoadHandler = () => {
            targetTexture.loadSuccess = true;
            targetTexture.loadEnd = true;
            this.#checkCompletion();
        };
        const onErrorHandler = () => {
            targetTexture.loadSuccess = false;
            targetTexture.loadEnd = true;
            this.#checkCompletion();
        };
        if (targetClass === BitmapTexture) {
            targetTexture.texture = new targetClass(redGPUContext, {
                src: srcInfo.src,
                cacheKey: srcInfo.cacheKey
            }, srcInfo.useMipmap, onLoadHandler, onErrorHandler, srcInfo.format, false);
        } else {
            targetTexture.texture = new targetClass(redGPUContext, {
                src: srcInfo.src,
                cacheKey: srcInfo.cacheKey
            }, srcInfo.useMipmap, onLoadHandler, onErrorHandler, srcInfo.format);
        }
        this.textures.push(targetTexture);
        this.#checkProgress();
    }

    #checkProgress() {
        const total = this.#srcInfoList.length;
        const loaded = this.#loaded;
        if (this.#progressCallback) this.#progressCallback.call(this, {
            total,
            loaded,
            percent: Math.min(100, parseFloat(((loaded / total) * 100).toFixed(2)))
        });
    }

    #checkCompletion() {
        this.#loaded++;
        this.#checkProgress();
        if (this.#loaded === this.#srcInfoList.length) {
            this.#reportCompletion();
        }
    }

    #reportCompletion() {
        requestAnimationFrame(() => {
            if (this.#callback) this.#callback.call(this, this);
        });
    }
}
