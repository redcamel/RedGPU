import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ATextField from "../core/ATextField";
declare const BaseTextField2D: {
    new (...args: any[]): {
        "__#private@#rotation": number;
        "__#private@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: import("../../../material").BLEND_MODE | keyof typeof import("../../../material").BLEND_MODE);
        get rotation(): number;
        set rotation(value: number);
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#private@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & typeof ATextField;
/**
 * [KO] 2D 공간에서 HTML/SVG 기반 텍스트를 텍스처로 변환하여 표시하는 2D 텍스트 필드 클래스입니다.
 * [EN] 2D text field class that converts HTML/SVG-based text into a texture and displays it in 2D space.
 *
 * [KO] 렌더링된 텍스트 크기에 맞춰 가로/세로 픽셀 크기가 자동으로 결정되며, `geometry`와 `material`은 고정되어 외부에서 변경할 수 없습니다.
 * [EN] Width and height in pixels are automatically determined by the rendered text size, and `geometry` and `material` are fixed and cannot be changed externally.
 *
 * ### Example
 * ```typescript
 * const textField = new RedGPU.Display.TextField2D(redGPUContext);
 * textField.text = "Hello 2D Text!";
 * scene.addChild(textField);
 * ```
 *
 * <iframe src="/RedGPU/examples/2d/textField2D/basic/" style="width:100%; height:500px;"></iframe>
 *
 * @see [TextField2D Basic Example](/RedGPU/examples/2d/textField2D/basic/)
 * @see [TextField2D MouseEvent Example](/RedGPU/examples/2d/interaction/mouseEvent/textField2D/)
 * @category TextField
 */
declare class TextField2D extends BaseTextField2D {
    #private;
    /**
     * [KO] TextField2D 인스턴스를 생성합니다.
     * [EN] Creates a TextField2D instance.
     *
     * ### Example
     * ```typescript
     * const textField = new RedGPU.Display.TextField2D(redGPUContext, true);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param useSmoothing -
     * [KO] 텍스처 스무딩(선형 필터링) 사용 여부 (기본값: `true`)
     * [EN] Whether to use texture smoothing (linear filtering) (default: `true`)
     */
    constructor(redGPUContext: RedGPUContext, useSmoothing?: boolean);
    /**
     * [KO] 텍스처 스무딩 사용 여부를 반환하거나 설정합니다. `true`일 경우 `LINEAR` 필터, `false`일 경우 `NEAREST` 필터가 적용됩니다.
     * [EN] Returns or sets whether texture smoothing is used. Applies `LINEAR` filter if `true`, or `NEAREST` filter if `false`.
     *
     * @returns
     * [KO] 스무딩 사용 여부
     * [EN] Whether smoothing is enabled
     */
    get useSmoothing(): boolean;
    set useSmoothing(value: boolean);
    /**
     * [KO] 렌더링된 텍스트 영역의 픽셀 너비를 반환합니다.
     * [EN] Returns the pixel width of the rendered text area.
     *
     * @returns
     * [KO] 너비 (픽셀 단위)
     * [EN] Width (in pixels)
     */
    get width(): number;
    /**
     * [KO] 렌더링된 텍스트 영역의 픽셀 높이를 반환합니다.
     * [EN] Returns the pixel height of the rendered text area.
     *
     * @returns
     * [KO] 높이 (픽셀 단위)
     * [EN] Height (in pixels)
     */
    get height(): number;
    /**
     * [KO] 고정된 Plane 지오메트리를 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the fixed Plane geometry. Cannot be changed externally.
     *
     * @returns
     * [KO] 지오메트리 인스턴스
     * [EN] Geometry instance
     */
    get geometry(): Geometry | Primitive;
    set geometry(value: Geometry | Primitive);
    /**
     * [KO] 고정된 내부 머티리얼을 반환합니다. 외부에서 변경할 수 없습니다.
     * [EN] Returns the fixed internal material. Cannot be changed externally.
     *
     * @returns
     * [KO] 머티리얼 인스턴스
     * [EN] Material instance
     */
    get material(): any;
    set material(value: any);
    /**
     * [KO] TextField2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * [EN] Creates a custom vertex shader module dedicated to TextField2D.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule` 인스턴스
     * [EN] Created `GPUShaderModule` instance
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default TextField2D;
