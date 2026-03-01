import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Ring(고리, 도넛형 평면) 기본 도형 클래스입니다.
 * [EN] Ring primitive geometry class.
 *
 * [KO] 내경, 외경, 세그먼트 등을 기반으로 2D 고리 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 2D ring data based on inner/outer radius, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 내경 0.5, 외경 1짜리 링 생성
 * const ring = new RedGPU.Ring(redGPUContext, 0.5, 1);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ring/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Ring extends Primitive {
    /**
     * [KO] Ring 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ring.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param innerRadius - [KO] 내부 반지름 (기본값 0.5) [EN] Inner radius (default 0.5)
     * @param outerRadius - [KO] 외부 반지름 (기본값 1) [EN] Outer radius (default 1)
     * @param thetaSegments - [KO] 원주 방향 분할 수 (기본값 8) [EN] Theta segments (default 8)
     * @param phiSegments - [KO] 반경 방향 분할 수 (기본값 1) [EN] Phi segments (default 1)
     * @param thetaStart - [KO] 시작 각도 (라디안, 기본값 0) [EN] Starting angle (radians, default 0)
     * @param thetaLength - [KO] 원호 각도 (라디안, 기본값 2*PI) [EN] Arc angle (radians, default 2*PI)
     * @param isRadial - [KO] 방사형 UV 사용 여부 (기본값 false) [EN] Whether to use radial UV (default false)
     */
    constructor(
        redGPUContext: RedGPUContext,
        innerRadius: number = 0.5,
        outerRadius: number = 1,
        thetaSegments: number = 8,
        phiSegments: number = 1,
        thetaStart: number = 0,
        thetaLength: number = Math.PI * 2,
        isRadial: boolean = false
    ) {
        const uniqueKey = Primitive.generateUniqueKey('RING', { innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateRingEntryData(
            redGPUContext, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial, uniqueKey
        ));
    }
}

export default Ring;
