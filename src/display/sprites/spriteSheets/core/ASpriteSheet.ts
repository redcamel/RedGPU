import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import GPU_ADDRESS_MODE from "../../../../gpuConst/GPU_ADDRESS_MODE";
import BitmapMaterial from "../../../../material/bitmapMaterial/BitmapMaterial";
import Primitive from "../../../../primitive/core/Primitive";
import Sampler from "../../../../resources/sampler/Sampler";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import Mesh from "../../../mesh/Mesh";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import SpriteSheetInfo from "../SpriteSheetInfo";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

/**
 * [KO] 스프라이트 시트의 격자 분할 및 프레임 인덱싱 속성을 정의하는 인터페이스입니다.
 * [EN] Interface defining grid division and frame indexing properties of a sprite sheet.
 *
 * @category Core
 */
interface ASpriteSheet {
    /**
     * [KO] 가로 세그먼트 분할 수
     * [EN] Number of horizontal segments
     */
    segmentW: number;
    /**
     * [KO] 세로 세그먼트 분할 수
     * [EN] Number of vertical segments
     */
    segmentH: number;
    /**
     * [KO] 총 프레임 수
     * [EN] Total number of frames
     */
    totalFrame: number;
    /**
     * [KO] 현재 프레임 인덱스
     * [EN] Current frame index
     */
    currentIndex: number;
}

/**
 * [KO] 2D 및 3D 스프라이트 시트 애니메이션의 공통 동작을 정의하는 추상 클래스입니다.
 * [EN] Abstract class that defines common behavior for 2D and 3D sprite sheet animations.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [SpriteSheet2D Basic Example](/RedGPU/examples/2d/spriteSheet2D/basic/)
 * @see [SpriteSheet3D Basic Example](/RedGPU/examples/3d/sprite/spriteSheet3D/)
 * @see [SpriteSheet3D Compare Example](/RedGPU/examples/3d/sprite/spriteSheet3DCompare/)
 * @see [SpriteSheet2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/spriteSheet2D/)
 * @see [SpriteSheet3D MouseEvent Example](/RedGPU/examples/3d/interaction/mouseEvent/spriteSheet3D/)
 * @category Core
 */
class ASpriteSheet extends Mesh {
    #frameRate: number = 0
    #nextFrameTime: number = 0
    #perFrameTime: number = 0
    #playYn: boolean = true
    #loop: boolean = true
    #spriteSheetInfo: SpriteSheetInfo
    #setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void
    #state: string = 'play'

    /**
     * [KO] ASpriteSheet 인스턴스를 초기화합니다.
     * [EN] Initializes an ASpriteSheet instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체
     * [EN] Sprite sheet information object
     * @param setRenderSize -
     * [KO] 세그먼트 크기 갱신 콜백 함수
     * [EN] Callback function to update segment render size
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo, setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void) {
        super(redGPUContext);
        this.#setRenderSize = setRenderSize
        this._material = new BitmapMaterial(redGPUContext)
        this._material.transparent = true
        this.dirtyPipeline = true
        this.dirtyTransform = true
        this.spriteSheetInfo = spriteSheetInfo;
        this._material.diffuseTextureSampler = new Sampler(redGPUContext)
        this._material.diffuseTextureSampler.addressModeU = GPU_ADDRESS_MODE.REPEAT
        this._material.diffuseTextureSampler.addressModeV = GPU_ADDRESS_MODE.REPEAT
    }

    /**
     * [KO] 현재 애니메이션 재생 상태를 반환합니다.
     * [EN] Returns the current animation playback state.
     *
     * @returns
     * [KO] 재생 상태 문자열 (`'play'`, `'pause'`, `'stop'`)
     * [EN] Playback state string (`'play'`, `'pause'`, `'stop'`)
     */
    get state(): string {
        return this.#state;
    }

    /**
     * [KO] 애니메이션 반복 재생 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether the animation loops.
     *
     * @returns
     * [KO] 반복 재생 여부
     * [EN] Whether playback loops
     */
    get loop(): boolean {
        return this.#loop;
    }

    set loop(value: boolean) {
        this.#loop = value;
    }

    /**
     * [KO] 초당 프레임 수(FPS)를 반환하거나 설정합니다. 음수 입력 시 `0`으로 보정됩니다.
     * [EN] Returns or sets the frame rate (FPS). Negative values are clamped to `0`.
     *
     * @returns
     * [KO] 초당 프레임 수 (FPS)
     * [EN] Frames per second (FPS)
     */
    get frameRate() {
        return this.#frameRate;
    }

    set frameRate(value) {
        if (value < 0) value = 0;
        if (this.#frameRate === 0 && value) {
            this.#nextFrameTime = 0;
        }
        this.#frameRate = value;
        this.#perFrameTime = 1000 / this.#frameRate;
    }

    /**
     * [KO] 현재 지오메트리를 반환합니다. 지오메트리 변경 시도는 에러를 발생시킵니다.
     * [EN] Returns the current geometry. Attempting to change the geometry throws an error.
     *
     * @returns
     * [KO] 지오메트리 인스턴스
     * [EN] Geometry instance
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('ASpriteSheet can not change geometry')
    }

    /**
     * [KO] 현재 머티리얼을 반환합니다. 머티리얼 변경 시도는 에러를 발생시킵니다.
     * [EN] Returns the current material. Attempting to change the material throws an error.
     *
     * @returns
     * [KO] 머티리얼 인스턴스
     * [EN] Material instance
     */
    get material() {
        return this._material
    }

    set material(value) {
        consoleAndThrowError('ASpriteSheet can not change material')
    }

    /**
     * [KO] 적용된 스프라이트 시트 정보를 반환하거나 설정합니다.
     * [EN] Returns or sets the applied sprite sheet information.
     *
     * @returns
     * [KO] SpriteSheetInfo 인스턴스
     * [EN] SpriteSheetInfo instance
     */
    get spriteSheetInfo(): SpriteSheetInfo {
        return this.#spriteSheetInfo;
    }

    set spriteSheetInfo(value: SpriteSheetInfo) {
        this.#spriteSheetInfo = value;
        this.frameRate = value.frameRate;
        this.segmentW = value.segmentW;
        this.segmentH = value.segmentH;
        this.totalFrame = value.totalFrame;
        this.currentIndex = value.startIndex;
        this.#loop = true;
        this.#nextFrameTime = 0;
        this._material.diffuseTexture = value.texture;
    }

    /**
     * [KO] 애니메이션 재생을 시작하고 상태를 `'play'`로 변경합니다.
     * [EN] Starts animation playback and changes the state to `'play'`.
     */
    play() {
        this.#playYn = true;
        this.#state = 'play';
        this.#nextFrameTime = 0;
    };

    /**
     * [KO] 현재 프레임에서 애니메이션을 일시정지하고 상태를 `'pause'`로 변경합니다.
     * [EN] Pauses the animation at the current frame and changes the state to `'pause'`.
     */
    pause() {
        this.#playYn = false;
        this.#state = 'pause';
    };

    /**
     * [KO] 애니메이션을 정지하고 첫 번째 프레임(`0`)으로 초기화한 뒤 상태를 `'stop'`으로 변경합니다.
     * [EN] Stops the animation, resets to the first frame (`0`), and changes the state to `'stop'`.
     */
    stop() {
        this.#playYn = false;
        this.currentIndex = 0;
        this.#state = 'stop';
    };

    /**
     * [KO] 경과 시간에 따라 현재 프레임 인덱스를 갱신하고 스프라이트 시트를 렌더링합니다.
     * [EN] Updates the current frame index based on elapsed time and renders the sprite sheet.
     *
     * @param renderViewStateData -
     * [KO] 뷰 렌더링 상태 데이터
     * [EN] View rendering state data
     */
    render(renderViewStateData: RenderViewStateData) {
        const {diffuseTexture} = this._material;
        this.#setRenderSize(diffuseTexture, this.segmentW, this.segmentH)
        const {timestamp} = renderViewStateData;
        if (!this.#nextFrameTime) this.#nextFrameTime = this.#perFrameTime + timestamp;
        if (this.#playYn && this.#nextFrameTime < timestamp && this.#frameRate) {
            const rawGapFrame = Math.floor((timestamp - this.#nextFrameTime) / this.#perFrameTime);
            const gapFrame = (Number.isFinite(rawGapFrame) ? rawGapFrame : 0) || 1;
            this.#nextFrameTime = this.#perFrameTime + timestamp;
            this.currentIndex += gapFrame;
            if (this.currentIndex >= this.totalFrame) {
                if (this.loop) {
                    this.#playYn = true
                    this.currentIndex = 0;
                } else {
                    this.#playYn = false
                    this.currentIndex = this.totalFrame - 1;
                }
            }
        }
        super.render(renderViewStateData);
    }
}

definePositiveNumber(ASpriteSheet, [
    {key: 'segmentW', value: 5},
    {key: 'segmentH', value: 3},
    {key: 'totalFrame', value: 15},
    {key: 'currentIndex', value: 0}
])
Object.freeze(ASpriteSheet)
export default ASpriteSheet
