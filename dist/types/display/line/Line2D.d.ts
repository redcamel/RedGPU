import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import Line3D from "./Line3D";
import LINE_TYPE from "./LINE_TYPE";
/**
 * [KO] 2D 공간에서 선(라인)을 표현하는 클래스입니다.
 * [EN] Class representing a line in 2D space.
 *
 * [KO] 2D 평면상에서 여러 점을 연결하여 선을 그릴 수 있습니다. geometry와 material은 생성 시 자동으로 할당되며, 이후 변경이 불가능합니다.
 * [EN] You can draw lines by connecting multiple points on a 2D plane. Geometry and material are automatically assigned during creation and cannot be changed thereafter.
 *
 * * ### Example
 * ```typescript
 * const line = new RedGPU.Display.Line2D(redGPUContext);
 * line.addPoint(0, 0);
 * line.addPoint(100, 100);
 * scene.addChild(line);
 * ```
 * @experimental
 * @category Line
 */
declare class Line2D extends Line3D {
    /**
     * [KO] Line2D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Line2D.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param type -
     * [KO] 라인 타입 (기본값: LINE_TYPE.LINEAR)
     * [EN] Line type (default: LINE_TYPE.LINEAR)
     * @param baseColor -
     * [KO] 기본 색상 (기본값: #fff)
     * [EN] Base color (default: #fff)
     */
    constructor(redGPUContext: RedGPUContext, type?: LINE_TYPE, baseColor?: string);
    /**
     * geometry를 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get geometry(): Geometry | Primitive;
    /**
     * geometry를 변경할 수 없습니다.
     */
    set geometry(value: Geometry | Primitive);
    /**
     * material을 반환합니다. (생성 시 자동 할당, 변경 불가)
     */
    get material(): any;
    /**
     * material을 변경할 수 없습니다.
     */
    set material(value: any);
    /**
     * 커스텀 버텍스 셰이더 모듈을 생성합니다.
     * @returns 생성된 셰이더 모듈
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
    /**
     * 2D 평면상에 점을 추가합니다.
     * @param x X 좌표
     * @param y Y 좌표
     * @param color 점 색상 (기본값: baseColor)
     * @param colorAlpha 알파값 (기본값: 1)
     * @param inX in tangent X (기본값: 0)
     * @param inY in tangent Y (기본값: 0)
     * @param outX out tangent X (기본값: 0)
     * @param outY out tangent Y (기본값: 0)
     */
    addPoint(x?: number, y?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, outX?: number, outY?: number): void;
    /**
     * 2D 평면상에 지정한 위치에 점을 추가합니다.
     * @param index 추가할 위치 인덱스
     * @param x X 좌표
     * @param y Y 좌표
     * @param color 점 색상 (기본값: baseColor)
     * @param colorAlpha 알파값 (기본값: 1)
     * @param inX in tangent X (기본값: 0)
     * @param inY in tangent Y (기본값: 0)
     * @param outX out tangent X (기본값: 0)
     * @param outY out tangent Y (기본값: 0)
     */
    addPointAt(index: number, x?: number, y?: number, color?: string, colorAlpha?: number, inX?: number, inY?: number, outX?: number, outY?: number): void;
}
export default Line2D;
