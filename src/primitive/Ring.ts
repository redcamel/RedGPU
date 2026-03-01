import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Ring(링, 고리) 기본 도형 클래스입니다.
 * [EN] Ring primitive geometry class.
 *
 * [KO] 내외부 반지름, 세그먼트 등을 기반으로 2D 고리 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 2D ring data based on inner/outer radius, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 내경 0.5, 외경 1, 32 세그먼트 고리 생성
 * const ring = new RedGPU.Primitive.Ring(redGPUContext, 0.5, 1, 32);
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
     * @param thetaSegments - [KO] 원주 방향 분할 수 (기본값 32) [EN] Theta segments (default 32)
     * @param phiSegments - [KO] 반지름 방향 분할 수 (기본값 1) [EN] Phi segments (default 1)
     * @param thetaStart - [KO] 시작 각도 (라디안, 기본값 0) [EN] Start angle (radians, default 0)
     * @param thetaLength - [KO] 원호 각도 (라디안, 기본값 2*PI) [EN] Arc angle (radians, default 2*PI)
     * @param isRadial - [KO] 방사형 UV 매핑 여부 (기본값 false) [EN] Whether to use radial UV mapping (default false)
     */
    constructor(redGPUContext: RedGPUContext,
                innerRadius: number = 0.5,
                outerRadius: number = 1,
                thetaSegments: number = 32,
                phiSegments: number = 1,
                thetaStart: number = 0.0,
                thetaLength: number = Math.PI * 2,
                isRadial: boolean = false
                ) {
                const uniqueKey = Primitive.generateUniqueKey('RING', { innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial });
                super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial));
                }}

function makeData(uniqueKey, redGPUContext, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, isRadial) {
    const interleaveData = [];
    const indexData = [];

    // Ring 생성 (벡터 기반: XY 평면, Normal +Z)
    // [업계 표준] 12시(+Y) 기점, 반시계 방향(CCW) 회전
    PrimitiveUtils.generateRingData(
        interleaveData, indexData,
        innerRadius, outerRadius,
        thetaSegments, phiSegments,
        thetaStart, thetaLength,
        {x: 0, y: 0, z: 0}, // center
        {x: 1, y: 0, z: 0},  // uVector (+X)
        {x: 0, y: 1, z: 0},  // vVector (+Y, 12시 기점)
        {x: 0, y: 0, z: 1},  // normal (+Z)
        true,               // isFront
        isRadial
    );

    return PrimitiveUtils.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
}

export default Ring;
