import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] 2D 원형 평면의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 2D circular plane.
 *
 * ### Example
 * ```typescript
 * const circle = new RedGPU.Primitive.Circle(redGPUContext, 1, 32);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/circle/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Circle example](/RedGPU/examples/3d/primitive/circle/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
declare class Circle extends Primitive {
    /**
     * [KO] Circle 인스턴스를 생성합니다.
     * [EN] Creates an instance of Circle.
     *
     * ### Example
     * ```typescript
     * const circle = new RedGPU.Primitive.Circle(redGPUContext, 1, 32);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 반지름 (기본값: 1)
     * [EN] Radius (default: 1)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값: 8)
     * [EN] Number of radial segments (default: 8)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값: 0)
     * [EN] Start angle in radians (default: 0)
     * @param thetaLength -
     * [KO] 원호 중심각 (라디안, 기본값: `Math.PI * 2`)
     * [EN] Central angle of the circular sector in radians (default: `Math.PI * 2`)
     * @param isRadial -
     * [KO] 방사형 UV 매핑 사용 여부 (기본값: false)
     * [EN] Whether to use radial UV mapping (default: false)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, radialSegments?: number, thetaStart?: number, thetaLength?: number, isRadial?: boolean);
}
export default Circle;
