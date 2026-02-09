import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
/** 2D 메시 기능이 믹스인된 베이스 스프라이트 시트 클래스 */
declare const BaseSpriteSheet2D: {
    new (...args: any[]): {
        "__#private@#rotation": number;
        "__#private@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: import("../../../../material").BLEND_MODE | keyof typeof import("../../../../material").BLEND_MODE);
        get rotation(): number;
        set rotation(value: number);
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#private@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & typeof ASpriteSheet;
/**
 * [KO] 2D 스프라이트 시트 애니메이션 클래스입니다.
 * [EN] 2D sprite sheet animation class.
 *
 * [KO] 2D 게임에서 캐릭터나 오브젝트의 애니메이션을 위한 클래스입니다. 하나의 텍스처에 격자 형태로 배열된 여러 프레임을 시간에 따라 순차적으로 표시하여 부드러운 2D 애니메이션을 생성합니다. 텍스처의 세그먼트 크기에 따라 자동으로 렌더링 크기가 조정됩니다.
 * [EN] A class for animating characters or objects in 2D games. It creates smooth 2D animations by sequentially displaying multiple frames arranged in a grid within a single texture over time. Rendering size is automatically adjusted according to the segment size of the texture.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet2D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * [KO] 아래는 SpriteSheet2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet2D.
 * @see [SpriteSheet2D MouseEvent example](/RedGPU/examples/2d/interaction/mouseEvent/spriteSheet2D/)
 *
 * @category SpriteSheet
 */
declare class SpriteSheet2D extends BaseSpriteSheet2D {
    #private;
    /**
     * [KO] 새로운 SpriteSheet2D 인스턴스를 생성합니다.
     * [EN] Creates a new SpriteSheet2D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
     * [EN] Sprite sheet info object (including texture, segment info, and animation settings)
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo);
    /**
     * [KO] 스프라이트 시트 세그먼트의 너비를 반환합니다. (텍스처 전체 너비를 세그먼트 수로 나눈 값)
     * [EN] Returns the width of the sprite sheet segment. (Total texture width divided by the number of segments)
     * @returns
     * [KO] 세그먼트 너비 (픽셀 단위)
     * [EN] Segment width (in pixels)
     */
    get width(): number;
    /**
     * [KO] 스프라이트 시트 세그먼트의 높이를 반환합니다. (텍스처 전체 높이를 세그먼트 수로 나눈 값)
     * [EN] Returns the height of the sprite sheet segment. (Total texture height divided by the number of segments)
     * @returns
     * [KO] 세그먼트 높이 (픽셀 단위)
     * [EN] Segment height (in pixels)
     */
    get height(): number;
    /**
     * [KO] 지오메트리를 반환합니다. SpriteSheet2D는 Plane으로 고정됩니다.
     * [EN] Returns the geometry. SpriteSheet2D is fixed with Plane.
     * @returns
     * [KO] 현재 지오메트리
     * [EN] Current geometry
     */
    get geometry(): Geometry | Primitive;
    /**
     * [KO] SpriteSheet2D는 지오메트리를 변경할 수 없습니다.
     * [EN] SpriteSheet2D cannot change geometry.
     * @param value -
     * [KO] 설정하려는 지오메트리
     * [EN] Geometry to set
     * @throws
     * [KO] 지오메트리 변경 시도 시 Error 발생
     * [EN] Throws Error when attempting to change geometry
     */
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 머티리얼을 반환합니다.
     * [EN] Returns the material.
     * @returns
     * [KO] 현재 머티리얼
     * [EN] Current material
     */
    get material(): any;
    /**
     * [KO] SpriteSheet2D는 머티리얼을 변경할 수 없습니다.
     * [EN] SpriteSheet2D cannot change material.
     * @param value -
     * [KO] 설정하려는 머티리얼
     * [EN] Material to set
     * @throws
     * [KO] 머티리얼 변경 시도 시 Error 발생
     * [EN] Throws Error when attempting to change material
     */
    set material(value: any);
    /**
     * [KO] SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to SpriteSheet2D.
     *
     * [KO] 2D 스프라이트 시트 렌더링에 최적화된 버텍스 셰이더를 생성하며, UV 좌표 계산과 프레임 인덱싱 로직이 포함되어 있습니다.
     * [EN] Creates a vertex shader optimized for 2D sprite sheet rendering, including UV coordinate calculation and frame indexing logic.
     *
     * @returns
     * [KO] 생성된 GPU 셰이더 모듈
     * [EN] Created GPU shader module
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default SpriteSheet2D;
