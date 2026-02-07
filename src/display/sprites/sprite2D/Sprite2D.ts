import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import Plane from "../../../primitive/Plane";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {mixInMesh2D} from "../../mesh/core";
import Mesh from "../../mesh/Mesh";

/** 2D 메시 기능이 믹스인된 베이스 클래스 */
const BaseSprite2D = mixInMesh2D(Mesh);

/**
 * [KO] 2D 스프라이트 렌더링을 위한 클래스입니다.
 * [EN] Class for 2D sprite rendering.
 *
 * [KO] Sprite2D는 2D 게임이나 UI 요소를 렌더링하기 위한 클래스입니다. 평면 지오메트리를 기반으로 하며, 너비와 높이를 동적으로 조절할 수 있습니다.
 * [EN] Sprite2D is a class for rendering 2D game or UI elements. Based on plane geometry, its width and height can be adjusted dynamically.
 *
 * ### Example
 * ```typescript
 * const sprite = new RedGPU.Display.Sprite2D(redGPUContext, material);
 * sprite.setSize(100, 100);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/sprite2D/basic/"></iframe>
 *
 * [KO] 아래는 Sprite2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Sprite2D.
 * @see [Sprite2D Hierarchy example](/RedGPU/examples/2d/sprite2D/hierarchy/)
 * @see [Sprite2D Pivot example](/RedGPU/examples/2d/sprite2D/pivot/)
 * @see [Sprite2D Child Methods example](/RedGPU/examples/2d/sprite2D/childMethod/)
 * @see [Sprite2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/sprite2D/)
 *
 * @category Sprite
 */
class Sprite2D extends BaseSprite2D {
    /**
     * [KO] 스프라이트의 너비
     * [EN] Width of the sprite
     */
    #width: number = 1
    /**
     * [KO] 스프라이트의 높이
     * [EN] Height of the sprite
     */
    #height: number = 1

    /**
     * [KO] 새로운 Sprite2D 인스턴스를 생성합니다.
     * [EN] Creates a new Sprite2D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param material -
     * [KO] 스프라이트에 적용할 머티리얼 (선택적)
     * [EN] Material to apply to the sprite (optional)
     */
    constructor(redGPUContext: RedGPUContext, material?) {
        super(redGPUContext, new Plane(redGPUContext, 1, 1, 1, 1, 1, true), material);
        this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
    }

    /**
     * [KO] 스프라이트의 너비를 반환합니다.
     * [EN] Returns the width of the sprite.
     */
    get width(): number {
        return this.#width;
    }

    /**
     * [KO] 스프라이트의 너비를 설정합니다.
     * [EN] Sets the width of the sprite.
     * @param value -
     * [KO] 설정할 너비 값 (양수)
     * [EN] Width value to set (positive)
     * @throws
     * [KO] 값이 양수가 아닌 경우 Error 발생
     * [EN] Throws Error if value is not positive
     */
    set width(value: number) {
        validatePositiveNumberRange(value)
        this.#width = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 스프라이트의 높이를 반환합니다.
     * [EN] Returns the height of the sprite.
     */
    get height(): number {
        return this.#height;
    }

    /**
     * [KO] 스프라이트의 높이를 설정합니다.
     * [EN] Sets the height of the sprite.
     * @param value -
     * [KO] 설정할 높이 값 (양수)
     * [EN] Height value to set (positive)
     * @throws
     * [KO] 값이 양수가 아닌 경우 Error 발생
     * [EN] Throws Error if value is not positive
     */
    set height(value: number) {
        validatePositiveNumberRange(value)
        this.#height = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 스프라이트의 크기를 설정합니다.
     * [EN] Sets the size of the sprite.
     *
     * @param width -
     * [KO] 설정할 너비 값
     * [EN] Width value to set
     * @param height -
     * [KO] 설정할 높이 값 (선택적, 생략 시 너비와 같은 값 사용)
     * [EN] Height value to set (optional, uses the same value as width if omitted)
     */
    setSize(width: number, height?: number) {
        this.width = width;
        this.height = height !== undefined ? height : width;
    }
}

Object.freeze(Sprite2D)
export default Sprite2D
