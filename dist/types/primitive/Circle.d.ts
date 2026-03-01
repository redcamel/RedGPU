import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Circle(원) 기본 도형 클래스입니다.
 * [EN] Circle primitive geometry class.
 *
 * [KO] 반지름, 세그먼트, 시작 각도 등을 기반으로 2D 원형 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 2D circular data based on radius, segments, start angle, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 2, 세그먼트 64짜리 원 생성
 * const circle = new RedGPU.Circle(redGPUContext, 2, 64);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/circle/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
declare class Circle extends Primitive {
    /**
     * [KO] Circle 인스턴스를 생성합니다.
     * [EN] Creates an instance of Circle.
     *
     * ### Example
     * ```typescript
     * const circle = new RedGPU.Circle(redGPUContext, 1, 32, 0, Math.PI * 2, false);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 원 반지름 (기본값 1)
     * [EN] Circle radius (default 1)
     * @param radialSegments -
     * [KO] 세그먼트 수 (기본값 32, 최소 3)
     * [EN] Number of segments (default 32, min 3)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값 0)
     * [EN] Starting angle (radians, default 0)
     * @param thetaLength -
     * [KO] 원호 각도 (라디안, 기본값 2*PI)
     * [EN] Arc angle (radians, default 2*PI)
     * @param isRadial -
     * [KO] 방사형 UV 매핑 여부 (기본값 false)
     * [EN] Whether to use radial UV mapping (default false)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, radialSegments?: number, thetaStart?: number, thetaLength?: number, isRadial?: boolean);
}
export default Circle;
