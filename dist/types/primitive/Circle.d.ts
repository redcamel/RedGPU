import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Circle(원) 기본 도형 클래스입니다.
 * 반지름, 세그먼트, 시작 각도, 각도 길이 등 다양한 파라미터로 2D 원형 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 2, 세그먼트 64짜리 원 생성 및 씬에 추가
 * const circle = new RedGPU.Primitive.Circle(redGPUContext, 2, 64);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/circle/"></iframe>
 */
declare class Circle extends Primitive {
    #private;
    /**
     * Circle 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param radius 원 반지름 (기본값 1)
     * @param segments 세그먼트 수 (기본값 32, 최소 3)
     * @param thetaStart 시작 각도(라디안, 기본값 0)
     * @param thetaLength 원호 각도(라디안, 기본값 2*PI)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, segments?: number, thetaStart?: number, thetaLength?: number);
}
export default Circle;
