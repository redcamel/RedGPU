import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Mesh from "../../../mesh/Mesh";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import SpriteSheetInfo from "../SpriteSheetInfo";
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
declare class ASpriteSheet extends Mesh {
    #private;
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
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo, setRenderSize: (texture: unknown, segmentW: number, segmentH: number) => void);
    /**
     * [KO] 현재 애니메이션 상태를 반환합니다.
     * [EN] Returns the current animation state.
     * @returns
     * [KO] 'play', 'pause', 'stop' 중 하나
     * [EN] One of 'play', 'pause', 'stop'
     */
    get state(): string;
    /**
     * [KO] 반복 재생 여부를 반환합니다.
     * [EN] Returns whether to repeat playback.
     */
    get loop(): boolean;
    /**
     * [KO] 반복 재생 여부를 설정합니다.
     * [EN] Sets whether to repeat playback.
     * @param value -
     * [KO] 반복 재생 활성화 여부
     * [EN] Whether to enable loop playback
     */
    set loop(value: boolean);
    /**
     * [KO] 애니메이션 프레임 레이트를 반환합니다.
     * [EN] Returns the animation frame rate.
     * @returns
     * [KO] 초당 프레임 수 (FPS)
     * [EN] Frames per second (FPS)
     */
    get frameRate(): number;
    /**
     * [KO] 애니메이션 프레임 레이트를 설정합니다.
     * [EN] Sets the animation frame rate.
     * @param value -
     * [KO] 초당 프레임 수 (음수인 경우 0으로 설정)
     * [EN] Frames per second (set to 0 if negative)
     */
    set frameRate(value: number);
    /**
     * [KO] 지오메트리를 반환합니다.
     * [EN] Returns the geometry.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] The current geometry
     */
    get geometry(): Geometry | Primitive;
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
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] The current material
     */
    get material(): any;
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
    set material(value: any);
    /**
     * [KO] 스프라이트 시트 정보를 반환합니다.
     * [EN] Returns the sprite sheet information.
     * @returns
     * [KO] 현재 스프라이트 시트 정보
     * [EN] The current sprite sheet information
     */
    get spriteSheetInfo(): SpriteSheetInfo;
    /**
     * [KO] 스프라이트 시트 정보를 설정합니다.
     * [EN] Sets the sprite sheet information.
     * @param value -
     * [KO] 새로운 스프라이트 시트 정보
     * [EN] New sprite sheet information
     */
    set spriteSheetInfo(value: SpriteSheetInfo);
    /**
     * [KO] 애니메이션을 재생합니다. 상태를 'play'로 변경하고 프레임 갱신을 시작합니다.
     * [EN] Plays the animation. Changes state to 'play' and starts updating frames.
     */
    play(): void;
    /**
     * [KO] 애니메이션을 일시정지합니다. 상태를 'pause'로 변경하고 현재 프레임에서 멈춥니다.
     * [EN] Pauses the animation. Changes state to 'pause' and pauses at the current frame.
     */
    pause(): void;
    /**
     * [KO] 애니메이션을 정지합니다. 상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.
     * [EN] Stops the animation. Changes state to 'stop' and resets to the first frame.
     */
    stop(): void;
    /**
     * [KO] 스프라이트 시트를 렌더링합니다. 시간에 따른 프레임 인덱스 업데이트와 애니메이션 로직을 처리합니다.
     * [EN] Renders the sprite sheet. Processes frame index updates and animation logic over time.
     * @param renderViewStateData -
     * [KO] 렌더링 상태 및 디버그 정보
     * [EN] Rendering state and debug info
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default ASpriteSheet;
