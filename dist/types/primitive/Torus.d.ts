import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
/**
 * [KO] Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * [EN] Torus primitive geometry class.
 *
 * [KO] 반지름, 두께, 세그먼트 등을 기반으로 3D 도넛 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus data based on radius, thickness, segments, etc.
 *
 * * ### Example
 * ```typescript
 * // 반지름 2, 두께 0.5짜리 토러스 생성
 * const torus = new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torus/"></iframe>
 * @category Primitive
 */
declare class Torus extends Primitive {
    #private;
    /**
     * [KO] Torus 인스턴스를 생성합니다.
     * [EN] Creates an instance of Torus.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 중심 원 반지름 (기본값 1)
     * [EN] Major radius (default 1)
     * @param thickness -
     * [KO] 단면(튜브) 반지름 (기본값 0.5)
     * [EN] Minor radius/thickness (default 0.5)
     * @param radialSubdivisions -
     * [KO] 둘레 세그먼트 수 (기본값 16, 최소 3)
     * [EN] Radial segments (default 16, min 3)
     * @param bodySubdivisions -
     * [KO] 단면 세그먼트 수 (기본값 16, 최소 3)
     * [EN] Tubular segments (default 16, min 3)
     * @param startAngle -
     * [KO] 시작 각도 (라디안, 기본값 0)
     * [EN] Starting angle (radians, default 0)
     * @param endAngle -
     * [KO] 끝 각도 (라디안, 기본값 2*PI)
     * [EN] Ending angle (radians, default 2*PI)
     */
    constructor(redGPUContext: RedGPUContext, radius?: number, thickness?: number, radialSubdivisions?: number, bodySubdivisions?: number, startAngle?: number, endAngle?: number);
}
export default Torus;
