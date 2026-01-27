import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Mesh from "../../../mesh/Mesh";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import SpriteSheetInfo from "../SpriteSheetInfo";
/**
 * 스프라이트 시트의 기본 속성을 정의하는 인터페이스
 */
interface ASpriteSheet {
    /** 세그먼트 너비 */
    segmentW: number;
    /** 세그먼트 높이 */
    segmentH: number;
    /** 총 프레임 수 */
    totalFrame: number;
    /** 현재 프레임 인덱스 */
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
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
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
     * 현재 애니메이션 상태를 반환합니다.
     * @returns 'play', 'pause', 'stop' 중 하나
     */
    get state(): string;
    /**
     * 반복 재생 여부를 반환합니다.
     * @returns 반복 재생 활성화 여부
     */
    get loop(): boolean;
    /**
     * 반복 재생 여부를 설정합니다.
     * @param value - 반복 재생 활성화 여부
     */
    set loop(value: boolean);
    /**
     * 애니메이션 프레임 레이트를 반환합니다.
     * @returns 초당 프레임 수 (FPS)
     */
    get frameRate(): number;
    /**
     * 애니메이션 프레임 레이트를 설정합니다.
     * @param value - 초당 프레임 수 (음수인 경우 0으로 설정)
     */
    set frameRate(value: number);
    /**
     * 지오메트리를 반환합니다.
     * @returns 현재 지오메트리
     */
    get geometry(): Geometry | Primitive;
    /**
     * 지오메트리 설정을 시도합니다.
     * @param value - 설정하려는 지오메트리
     * @throws {Error} ASpriteSheet는 지오메트리를 변경할 수 없습니다
     */
    set geometry(value: Geometry | Primitive);
    /**
     * 머티리얼을 반환합니다.
     * @returns 현재 머티리얼
     */
    get material(): any;
    /**
     * 머티리얼 설정을 시도합니다.
     * @param value - 설정하려는 머티리얼
     * @throws {Error} ASpriteSheet는 머티리얼을 변경할 수 없습니다
     */
    set material(value: any);
    /**
     * 스프라이트 시트 정보를 반환합니다.
     * @returns 현재 스프라이트 시트 정보
     */
    get spriteSheetInfo(): SpriteSheetInfo;
    /**
     * 스프라이트 시트 정보를 설정합니다.
     * @param value - 새로운 스프라이트 시트 정보
     */
    set spriteSheetInfo(value: SpriteSheetInfo);
    /**
     * 애니메이션을 재생합니다.
     * 상태를 'play'로 변경하고 재생을 시작합니다.
     */
    play(): void;
    /**
     * 애니메이션을 일시정지합니다.
     * 상태를 'pause'로 변경하고 현재 프레임에서 정지합니다.
     */
    pause(): void;
    /**
     * 애니메이션을 정지합니다.
     * 상태를 'stop'으로 변경하고 첫 번째 프레임으로 되돌립니다.
     */
    stop(): void;
    /**
     * 스프라이트 시트를 렌더링합니다.
     *
     * 시간에 따른 프레임 업데이트와 애니메이션 로직을 처리한 후 렌더링을 수행합니다.
     *
     * @param renderViewStateData - 렌더링 상태 및 디버그 정보
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default ASpriteSheet;
