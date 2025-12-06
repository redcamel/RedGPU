import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
/** 2D 메시 기능이 믹스인된 베이스 클래스 */
declare const BaseSprite2D: {
    new (...args: any[]): {
        "__#34959@#rotation": number;
        "__#34959@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: import("../../../material").BLEND_MODE | keyof typeof import("../../../material").BLEND_MODE);
        rotation: number;
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#34959@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & typeof Mesh;
/**
 * 2D 스프라이트 렌더링을 위한 클래스
 *
 * Sprite2D는 2D 게임이나 UI 요소를 렌더링하기 위한 클래스입니다.
 * 평면 지오메트리를 기반으로 하며, 너비와 높이를 동적으로 조절할 수 있습니다
 * <iframe src="/RedGPU/examples/2d/sprite2D/basic/"></iframe>
 *
 *
 * 아래는 Sprite2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Sprite2D Hierarchy example](/RedGPU/examples/2d/sprite2D/hierarchy/)
 * @see [Sprite2D Pivot example](/RedGPU/examples/2d/sprite2D/pivot/)
 * @see [Sprite2D Child Methods example](/RedGPU/examples/2d/sprite2D/childMethod/)
 * @see [Sprite2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/sprite2D/)
 *
 * @category Sprite
 */
declare class Sprite2D extends BaseSprite2D {
    #private;
    /**
     * 새로운 Sprite2D 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param material - 스프라이트에 적용할 머티리얼 (옵션)
     */
    constructor(redGPUContext: RedGPUContext, material?: any);
    /**
     * 스프라이트의 너비를 반환합니다.
     * @returns 현재 너비 값
     */
    get width(): number;
    /**
     * 스프라이트의 너비를 설정합니다.
     * @param value - 설정할 너비 값 (양수)
     * @throws {Error} 값이 양수가 아닌 경우
     */
    set width(value: number);
    /**
     * 스프라이트의 높이를 반환합니다.
     * @returns 현재 높이 값
     */
    get height(): number;
    /**
     * 스프라이트의 높이를 설정합니다.
     * @param value - 설정할 높이 값 (양수)
     * @throws {Error} 값이 양수가 아닌 경우
     */
    set height(value: number);
    /**
     * 스프라이트의 크기를 설정합니다.
     *
     * @param width - 설정할 너비 값
     * @param height - 설정할 높이 값 (옵션, 생략 시 너비와 같은 값 사용)
     */
    setSize(width: number, height?: number): void;
}
export default Sprite2D;
