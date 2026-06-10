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
 * [KO] 스프라이트 시트의 기본 속성을 정의하는 인터페이스
 * [EN] Interface defining the base properties of a sprite sheet
 */
interface ASpriteSheet {
    /**
     * [KO] 세그먼트 너비 (격자 가로 개수)
     * [EN] Segment width (horizontal grid count)
     */
    segmentW: number;
    /**
     * [KO] 세그먼트 높이 (격자 세로 개수)
     * [EN] Segment height (vertical grid count)
     */
    segmentH: number;
    /**
     * [KO] 총 프레임 수
     * [EN] Total frame count
     */
    totalFrame: number;
    /**
     * [KO] 현재 프레임 인덱스
     * [EN] Current frame index
     */
    currentIndex: number;
}

/**
 * [KO] 스프라이트 시트 애니메이션을 처리하는 추상 기본 클래스입니다.
 * [EN] Abstract base class for handling sprite sheet animations.
 *
 * [KO] ASpriteSheet는 2D/3D 스프라이트 애니메이션을 위한 공통 기능을 제공합니다. 하나의 텍스처에 여러 프레임이 격자 형태로 배열된 스프라이트 시트를 시간에 따라 순차적으로 표시하여 애니메이션 효과를 만듭니다.
 * [EN] ASpriteSheet provides common functionality for 2D/3D sprite animations. It creates animation effects by sequentially displaying sprite sheets, where multiple frames are arranged in a grid within a single texture over time.
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
 * @see [SpriteSheet3D MouseEvent Example](/RedGPU/examples/3d/mouseEvent/spriteSheet3D/)
 *
 * @category Core
 */
class ASpriteSheet extends Mesh {
    /**
     * [KO] 애니메이션 프레임 레이트 (FPS)
     * [EN] Animation frame rate (FPS)
     */
    #frameRate: number = 0
    /**
     * [KO] 다음 프레임 표시 시각 (밀리초)
     * [EN] Time to display the next frame (ms)
     */
    #nextFrameTime: number = 0
    /**
     * [KO] 프레임 간 간격 시간 (밀리초)
     * [EN] Interval time between frames (ms)
     */
    #perFrameTime: number = 0
    /**
     * [KO] 재생 상태 여부
     * [EN] Playback status
     */
    #playYn: boolean = true
    /**
     * [KO] 반복 재생 여부
     * [EN] Whether to repeat playback
     */
    #loop: boolean = true
    /**
     * [KO] 스프라이트 시트 정보 객체
     * [EN] Sprite sheet information object
     */
    #spriteSheetInfo: SpriteSheetInfo
    /**
     * [KO] 렌더링 크기 설정 함수
     * [EN] Function to set rendering size
     */
    #setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void
    /**
     * [KO] 현재 애니메이션 상태 ('play', 'pause', 'stop')
     * [EN] Current animation state ('play', 'pause', 'stop')
     */
    #state: string = 'play'

    /**
     * [KO] ASpriteSheet 인스턴스를 생성합니다.
     * [EN] Creates an instance of ASpriteSheet.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체
     * [EN] Sprite sheet information object
     * @param setRenderSize -
     * [KO] 렌더링 크기 설정 콜백 함수
     * [EN] Callback function to set rendering size
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
     * [KO] 현재 애니메이션 상태를 반환합니다.
     * [EN] Returns the current animation state.
     * @returns
     * [KO] 'play', 'pause', 'stop' 중 하나
     * [EN] One of 'play', 'pause', 'stop'
     */
    get state(): string {
        return this.#state;
    }

    /**
     * [KO] 반복 재생 여부를 반환합니다.
     * [EN] Returns whether to repeat playback.
     */
    get loop(): boolean {
        return this.#loop;
    }

    /**
     * [KO] 반복 재생 여부를 설정합니다.
     * [EN] Sets whether to repeat playback.
     * @param value -
     * [KO] 반복 재생 활성화 여부
     * [EN] Whether to enable loop playback
     */
    set loop(value: boolean) {
        this.#loop = value;
    }

    /**
     * [KO] 애니메이션 프레임 레이트를 반환합니다.
     * [EN] Returns the animation frame rate.
     * @returns
     * [KO] 초당 프레임 수 (FPS)
     * [EN] Frames per second (FPS)
     */
    get frameRate() {
        return this.#frameRate;
    }

    /**
     * [KO] 애니메이션 프레임 레이트를 설정합니다.
     * [EN] Sets the animation frame rate.
     * @param value -
     * [KO] 초당 프레임 수 (음수인 경우 0으로 설정)
     * [EN] Frames per second (set to 0 if negative)
     */
    set frameRate(value) {
        if (value < 0) value = 0;
        if (this.#frameRate === 0 && value) {
            this.#nextFrameTime = 0;
        }
        this.#frameRate = value;
        this.#perFrameTime = 1000 / this.#frameRate;
    }

    /**
     * [KO] 지오메트리를 반환합니다.
     * [EN] Returns the geometry.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] The current geometry
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * [KO] 지오메트리 설정을 시도합니다. (ASpriteSheet는 지오메트리를 변경할 수 없습니다)
     * [EN] Attempts to set the geometry. (ASpriteSheet cannot change geometry)
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     * @throws
     * [KO] ASpriteSheet는 지오메트리를 변경할 수 없으므로 에러가 발생합니다.
     * [EN] Throws error because ASpriteSheet cannot change geometry.
     */
    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('ASpriteSheet can not change geometry')
    }

    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] The current material
     */
    get material() {
        return this._material
    }

    /**
     * [KO] 머티리얼 설정을 시도합니다. (ASpriteSheet는 머티리얼을 변경할 수 없습니다)
     * [EN] Attempts to set the material. (ASpriteSheet cannot change material)
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     * @throws
     * [KO] ASpriteSheet는 머티리얼을 변경할 수 없으므로 에러가 발생합니다.
     * [EN] Throws error because ASpriteSheet cannot change material.
     */
    set material(value) {
        consoleAndThrowError('ASpriteSheet can not change material')
    }

    /**
     * [KO] 스프라이트 시트 정보를 반환합니다.
     * [EN] Returns the sprite sheet information.
     * @returns
     * [KO] 현재 스프라이트 시트 정보
     * [EN] The current sprite sheet information
     */
    get spriteSheetInfo(): SpriteSheetInfo {
        return this.#spriteSheetInfo;
    }

    /**
     * [KO] 스프라이트 시트 정보를 설정합니다.
     * [EN] Sets the sprite sheet information.
     * @param value -
     * [KO] 새로운 스프라이트 시트 정보
     * [EN] New sprite sheet information
     */
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
     * [KO] 애니메이션을 재생합니다. 상태를 'play'로 변경하고 프레임 갱신을 시작합니다.
     * [EN] Plays the animation. Changes state to 'play' and starts updating frames.
     */
    play() {
        this.#playYn = true;
        this.#state = 'play';
        this.#nextFrameTime = 0;
    };

    /**
     * [KO] 애니메이션을 일시정지합니다. 상태를 'pause'로 변경하고 현재 프레임에서 멈춥니다.
     * [EN] Pauses the animation. Changes state to 'pause' and pauses at the current frame.
     */
    pause() {
        this.#playYn = false;
        this.#state = 'pause';
    };

    /**
     * [KO] 애니메이션을 정지합니다. 상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.
     * [EN] Stops the animation. Changes state to 'stop' and resets to the first frame.
     */
    stop() {
        this.#playYn = false;
        this.currentIndex = 0;
        this.#state = 'stop';
    };

    /**
     * [KO] 스프라이트 시트를 렌더링합니다. 시간에 따른 프레임 인덱스 업데이트와 애니메이션 로직을 처리합니다.
     * [EN] Renders the sprite sheet. Processes frame index updates and animation logic over time.
     * @param renderViewStateData -
     * [KO] 렌더링 상태 및 디버그 정보
     * [EN] Rendering state and debug info
     */
    render(renderViewStateData: RenderViewStateData) {
        // console.log(this._material.diffuseTexture)
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

/**
 * ASpriteSheet 클래스에 스프라이트 시트 관련 속성들을 정의합니다.
 */
definePositiveNumber(ASpriteSheet, [
    {key: 'segmentW', value: 5},
    {key: 'segmentH', value: 3},
    {key: 'totalFrame', value: 15},
    {key: 'currentIndex', value: 0}
])
/**
 * ASpriteSheet 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(ASpriteSheet)
export default ASpriteSheet
