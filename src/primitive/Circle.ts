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
     * const circle = new RedGPU.Circle(redGPUContext, 1, 32, 0, Math.PI * 2);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 원 반지름 (기본값 1)
     * [EN] Circle radius (default 1)
     * @param segments -
     * [KO] 세그먼트 수 (기본값 32, 최소 3)
     * [EN] Number of segments (default 32, min 3)
     * @param thetaStart -
     * [KO] 시작 각도 (라디안, 기본값 0)
     * [EN] Starting angle (radians, default 0)
     * @param thetaLength -
     * [KO] 원호 각도 (라디안, 기본값 2*PI)
     * [EN] Arc angle (radians, default 2*PI)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 1,
        segments: number = 32,
        thetaStart: number = 0,
        thetaLength: number = Math.PI * 2
    ) {
        // 유효성 검사
        if (segments < 3) {
            throw new Error('segments must be 3 or greater');
        }
        if (radius <= 0) {
            throw new Error('radius must be greater than 0');
        }
        if (thetaLength <= 0) {
            throw new Error('thetaLength must be greater than 0');
        }
        const uniqueKey = `PRIMITIVE_CIRCLE_R${radius}_S${segments}_TS${thetaStart}_TL${thetaLength}`;
        super(redGPUContext, uniqueKey, () => makeData(
            uniqueKey, redGPUContext, radius, segments, thetaStart, thetaLength
        ));
    }
}

const makeData = function (
    uniqueKey: string,
    redGPUContext: RedGPUContext,
    radius: number,
    segments: number,
    thetaStart: number,
    thetaLength: number
) {
    const interleaveData: number[] = [];
    const indexData: number[] = [];

    // Circle 생성 (벡터 기반: XY 평면, Normal +Z)
    PrimitiveUtils.generateCircleData(
        interleaveData, indexData,
        radius, segments,
        thetaStart, thetaLength,
        {x: 0, y: 0, z: 0}, // center
        {x: 1, y: 0, z: 0}, // uVector
        {x: 0, y: 1, z: 0}, // vVector
        {x: 0, y: 0, z: 1}, // normal
        true                // isFront
    );

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
};

export default Circle;
