import RedGPUContext from "../../../context/RedGPUContext";
import GPU_CULL_MODE from "../../../gpuConst/GPU_CULL_MODE";
import Plane from "../../../primitive/Plane";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {mixInMesh2D} from "../../mesh/core";
import Mesh from "../../mesh/Mesh";

const BaseSprite2D = mixInMesh2D(Mesh);

/**
 * [KO] 평면 지오메트리 기반의 2D 스프라이트 객체 클래스입니다.
 * [EN] 2D sprite object class based on plane geometry.
 *
 * [KO] 픽셀 단위로 너비(`width`)와 높이(`height`)를 제어하며 2D 씬 및 UI 요소 렌더링에 사용됩니다.
 * [EN] Controls `width` and `height` in pixels and is used for rendering 2D scenes and UI elements.
 *
 * ### Example
 * ```typescript
 * const sprite = new RedGPU.Display.Sprite2D(redGPUContext, material);
 * sprite.setSize(100, 100);
 * scene.addChild(sprite);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/sprite2D/basic/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sprite2D Basic example](/RedGPU/examples/2d/sprite2D/basic/)
 * @see [Sprite2D Hierarchy example](/RedGPU/examples/2d/sprite2D/hierarchy/)
 * @see [Sprite2D Pivot example](/RedGPU/examples/2d/sprite2D/pivot/)
 * @see [Sprite2D Child Methods example](/RedGPU/examples/2d/sprite2D/childMethod/)
 * @see [Sprite2D MouseEvent example](/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)
 * @category Sprite
 */
class Sprite2D extends BaseSprite2D {
    #width: number = 1
    #height: number = 1

    /**
     * [KO] Sprite2D 인스턴스를 생성합니다.
     * [EN] Creates a Sprite2D instance.
     *
     * ### Example
     * ```typescript
     * const sprite = new RedGPU.Display.Sprite2D(redGPUContext, material);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param material -
     * [KO] 스프라이트에 적용할 머티리얼 (선택)
     * [EN] Material to apply to the sprite (optional)
     */
    constructor(redGPUContext: RedGPUContext, material?) {
        super(redGPUContext, new Plane(redGPUContext, 1, 1, 1, 1, true), material);
        this.primitiveState.cullMode = GPU_CULL_MODE.FRONT
    }

    /**
     * [KO] 스프라이트의 너비(픽셀 단위, 양수)를 가져오거나 설정합니다.
     * [EN] Gets or sets the width of the sprite (in pixels, positive number).
     *
     * @returns
     * [KO] 스프라이트 너비 (단위: px)
     * [EN] Sprite width (unit: px)
     * @throws
     * [KO] 설정 값이 0 미만일 경우 에러가 발생합니다.
     * [EN] Throws an error if the assigned value is less than 0.
     */
    get width(): number {
        return this.#width;
    }

    set width(value: number) {
        validatePositiveNumberRange(value)
        this.#width = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 스프라이트의 높이(픽셀 단위, 양수)를 가져오거나 설정합니다.
     * [EN] Gets or sets the height of the sprite (in pixels, positive number).
     *
     * @returns
     * [KO] 스프라이트 높이 (단위: px)
     * [EN] Sprite height (unit: px)
     * @throws
     * [KO] 설정 값이 0 미만일 경우 에러가 발생합니다.
     * [EN] Throws an error if the assigned value is less than 0.
     */
    get height(): number {
        return this.#height;
    }

    set height(value: number) {
        validatePositiveNumberRange(value)
        this.#height = value;
        this.dirtyTransform = true
    }

    /**
     * [KO] 스프라이트의 너비와 높이를 일괄 설정합니다.
     * [EN] Sets the width and height of the sprite at once.
     *
     * ### Example
     * ```typescript
     * sprite.setSize(200, 100);
     * ```
     *
     * @param width -
     * [KO] 설정할 너비 값 (단위: px)
     * [EN] Width value to set (unit: px)
     * @param height -
     * [KO] 설정할 높이 값 (단위: px, 생략 시 `width`와 동일한 값 적용)
     * [EN] Height value to set (unit: px, uses `width` if omitted)
     */
    setSize(width: number, height?: number) {
        this.width = width;
        this.height = height !== undefined ? height : width;
    }
}

Object.freeze(Sprite2D)
export default Sprite2D
