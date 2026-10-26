import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] 내경과 외경을 기반으로 2D 고리(도넛형 평면) 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a 2D ring (annulus) based on inner and outer radii.
 *
 * ### Example
 * ```typescript
 * const ring = new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 32, 1);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ring/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Ring example](/RedGPU/examples/3d/primitive/ring/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class Ring extends Primitive {
    /**
     * [KO] Ring 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ring.
     *
     * ### Example
     * ```typescript
     * const ring = new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 32, 1);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param innerRadius -
     * [KO] 내부 반지름 (기본값: 0.5)
     * [EN] Inner radius (default: 0.5)
     * @param outerRadius -
     * [KO] 외부 반지름 (기본값: 1)
     * [EN] Outer radius (default: 1)
     * @param thetaSegments -
     * [KO] 원주 방향 분할 수 (기본값: 8)
     * [EN] Number of circumferential segments (default: 8)
     * @param phiSegments -
     * [KO] 반경 방향 분할 수 (기본값: 1)
     * [EN] Number of radial segments (default: 1)
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
        const uniqueKey = Primitive.generateUniqueKey('RING', {
            innerRadius,
            outerRadius,
            thetaSegments,
            phiSegments,
            thetaStart,
            thetaLength,
            isRadial
        });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateRingEntryData(
            redGPUContext, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial, uniqueKey
        ));
    }
}

export default Ring;
