import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ATextField from "../core/ATextField";
declare const BaseTextField2D: {
    new (...args: any[]): {
        "__#97@#rotation": number;
        "__#97@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: import("../../../material").BLEND_MODE | keyof typeof import("../../../material").BLEND_MODE);
        rotation: number;
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#97@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & typeof ATextField;
/**
 * TextField2D 클래스는 2D 공간에서 텍스트를 표현하는 객체입니다.
 *
 * 내부적으로 Plane 지오메트리를 사용하며, 텍스트 렌더링 결과를 텍스처로 출력하여 화면에 표시합니다.
 * 텍스트 크기와 smoothing 설정에 따라 텍스처 필터링 방식이 자동으로 조정됩니다.
 *
 * @remarks
 * geometry와 material은 고정되어 있으며 외부에서 변경할 수 없습니다.
 *
 * <iframe src="/RedGPU/examples/2d/textField2D/basic/"></iframe>
 *
 * 아래는 TextField2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [TextField2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/textField2D/)
 *
 * @category TextField
 */
declare class TextField2D extends BaseTextField2D {
    #private;
    /**
     * TextField2D 생성자입니다.
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param useSmoothing - 텍스처 필터링에 smoothing 적용 여부
     */
    constructor(redGPUContext: RedGPUContext, useSmoothing?: boolean);
    /**
     * 텍스처 필터링에 smoothing을 사용할지 여부를 반환합니다.
     */
    get useSmoothing(): boolean;
    /**
     * 텍스처 필터링에 smoothing을 설정합니다.
     * true일 경우 LINEAR 필터를 사용하고, false일 경우 NEAREST 필터를 사용합니다.
     */
    set useSmoothing(value: boolean);
    /**
     * 텍스트 렌더링 결과의 너비를 반환합니다.
     */
    get width(): number;
    /**
     * 텍스트 렌더링 결과의 높이를 반환합니다.
     */
    get height(): number;
    /**
     * 텍스트가 출력되는 지오메트리입니다. Plane으로 고정됩니다.
     */
    get geometry(): Geometry | Primitive;
    /**
     * geometry는 외부에서 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive);
    /**
     * 텍스트에 사용되는 머티리얼입니다.
     */
    get material(): any;
    /**
     * material은 외부에서 변경할 수 없습니다.
     */
    set material(value: any);
    /**
     * TextField2D 전용 버텍스 셰이더 모듈을 생성합니다.
     * @returns {GPUShaderModule}
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default TextField2D;
