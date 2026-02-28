import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

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
class Circle extends Primitive {
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
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 1,
        radialSegments: number = 32,
        thetaStart: number = 0,
        thetaLength: number = Math.PI * 2,
        isRadial: boolean = false
    ) {
        // 유효성 검사
        if (radialSegments < 3) {
            throw new Error('radialSegments must be 3 or greater');
        }
        if (radius < 0) {
            throw new Error('radius must be 0 or greater');
        }
        if (thetaLength < 0) {
            throw new Error('thetaLength must be 0 or greater');
        }
        const uniqueKey = `PRIMITIVE_CIRCLE_R${radius}_S${radialSegments}_TS${thetaStart}_TL${thetaLength}_IR${isRadial}`;
        super(redGPUContext, uniqueKey, () => makeData(
            uniqueKey, redGPUContext, radius, radialSegments, thetaStart, thetaLength, isRadial
        ));
    }
}

const makeData = function (
    uniqueKey: string,
    redGPUContext: RedGPUContext,
    radius: number,
    radialSegments: number,
    thetaStart: number,
    thetaLength: number,
    isRadial: boolean
) {
    const interleaveData: number[] = [];
    const indexData: number[] = [];

    // Circle 생성 (벡터 기반: XY 평면, Normal +Z 복구)
    // [업계 표준] 12시(+Y) 기점, 반시계 방향(CCW) 회전
    PrimitiveUtils.generateCircleData(
        interleaveData, indexData,
        radius, radialSegments,
        thetaStart, thetaLength,
        {x: 0, y: 0, z: 0}, // center
        {x: 1, y: 0, z: 0},  // uVector (+X)
        {x: 0, y: 1, z: 0},  // vVector (+Y, 12시 기점)
        {x: 0, y: 0, z: 1},  // normal (+Z)
        true,               // isFront
        isRadial
    );

    PrimitiveUtils.calculateTangents(interleaveData, indexData);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
};

export default Circle;
