import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Torus(토러스, 도넛) 기본 도형 클래스입니다.
 * [EN] Torus primitive geometry class.
 *
 * [KO] 반지름, 두께, 세그먼트 등을 기반으로 3D 도넛 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D torus data based on radius, thickness, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 2, 두께 0.5짜리 토러스 생성
 * const torus = new RedGPU.Torus(redGPUContext, 2, 0.5);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/torus/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Torus extends Primitive {
    /**
     * [KO] Torus 인스턴스를 생성합니다.
     * [EN] Creates an instance of Torus.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radius - [KO] 중심 원 반지름 [EN] Major radius
     * @param thickness - [KO] 단면(튜브) 반지름 [EN] Minor radius/thickness
     * @param radialSegments - [KO] 둘레 세그먼트 수 [EN] Radial segments
     * @param tubularSegments - [KO] 단면 세그먼트 수 [EN] Tubular segments
     * @param thetaStart - [KO] 시작 각도 [EN] Starting angle
     * @param thetaLength - [KO] 원호 각도 [EN] Arc angle
     * @param capStart - [KO] 시작 지점 단면을 닫을지 여부 (기본값 false) [EN] Whether to close the start cap (default false)
     * @param capEnd - [KO] 끝 지점 단면을 닫을지 여부 (기본값 false) [EN] Whether to close the end cap (default false)
     * @param isRadialCapStart - [KO] 시작 단면의 방사형 UV 여부 (기본값 false) [EN] Whether start cap uses radial UV (default false)
     * @param isRadialCapEnd - [KO] 끝 단면의 방사형 UV 여부 (기본값 false) [EN] Whether end cap uses radial UV (default false)
     */
    constructor(redGPUContext: RedGPUContext,
                radius = 1,
                thickness = 0.5,
                radialSegments = 16,
                tubularSegments = 16,
                thetaStart = 0,
                thetaLength = Math.PI * 2,
                capStart = false,
                capEnd = false,
                isRadialCapStart = false,
                isRadialCapEnd = false
    ) {
        if (radialSegments < 3) throw new Error('radialSegments must be 3 or greater');
        if (tubularSegments < 3) throw new Error('tubularSegments must be 3 or greater');
        const uniqueKey = Primitive.generateUniqueKey('TORUS', { radius, thickness, radialSegments, tubularSegments, thetaStart, thetaLength, capStart, capEnd, isRadialCapStart, isRadialCapEnd });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateTorusData(
            redGPUContext, radius, thickness, radialSegments, tubularSegments,
            thetaStart, thetaLength, capStart, capEnd, isRadialCapStart, isRadialCapEnd, uniqueKey
        ));
    }
}

export default Torus;
