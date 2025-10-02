import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * 반지름, 두께, 세그먼트, 시작/끝 각도 등 다양한 파라미터로 3D 도넛 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 2, 두께 0.5, 32x16 세그먼트 토러스 생성 및 씬에 추가
 * const torus = new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 16);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/torus/"></iframe>
 *
 * @param redGPUContext RedGPUContext 인스턴스
 * @param radius 중심 원 반지름 (기본값 1)
 * @param thickness 단면(튜브) 반지름 (기본값 0.5)
 * @param radialSubdivisions 둘레 세그먼트 수 (기본값 16, 최소 3)
 * @param bodySubdivisions 단면 세그먼트 수 (기본값 16, 최소 3)
 * @param startAngle 시작 각도(라디안, 기본값 0)
 * @param endAngle 끝 각도(라디안, 기본값 2*PI)
 */
declare class Torus extends Primitive {
    #private;
    constructor(redGPUContext: RedGPUContext, radius?: number, thickness?: number, radialSubdivisions?: number, bodySubdivisions?: number, startAngle?: number, endAngle?: number);
}
export default Torus;
