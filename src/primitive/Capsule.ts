import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] 반구형 상하단 캡과 실린더 몸체로 구성된 캡슐 형태의 정점 및 인덱스 데이터를 생성하는 기본 도형 클래스입니다.
 * [EN] Primitive geometry class that generates vertex and index data for a capsule composed of hemispherical caps and a cylindrical body.
 *
 * ### Example
 * ```typescript
 * const capsule = new RedGPU.Primitive.Capsule(redGPUContext, 0.5, 1.0, 32, 1, 12);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/capsule/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Capsule example](/RedGPU/examples/3d/primitive/capsule/)
 * @see [Primitives example](/RedGPU/examples/3d/primitive/primitives/)
 * @category Primitive
 */
class Capsule extends Primitive {
    /**
     * [KO] Capsule 인스턴스를 생성합니다.
     * [EN] Creates an instance of Capsule.
     *
     * ### Example
     * ```typescript
     * const capsule = new RedGPU.Primitive.Capsule(redGPUContext, 0.5, 1.0, 32, 1, 12);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 반지름 (기본값: 0.5)
     * [EN] Radius (default: 0.5)
     * @param height -
     * [KO] 실린더 몸체 부분의 높이 (기본값: 1.0)
     * [EN] Height of the cylindrical body section (default: 1.0)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값: 32)
     * [EN] Number of radial segments (default: 32)
     * @param heightSegments -
     * [KO] 실린더 몸체 부분의 높이 방향 분할 수 (기본값: 1)
     * [EN] Number of height segments for the cylindrical body section (default: 1)
     * @param capSegments -
     * [KO] 상/하단 반구의 세로 분할 수 (기본값: 12)
     * [EN] Number of vertical segments for the top and bottom hemispheres (default: 12)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 0.5,
        height: number = 1.0,
        radialSegments: number = 32,
        heightSegments: number = 1,
        capSegments: number = 12
    ) {
        const uniqueKey = Primitive.generateUniqueKey('CAPSULE', {
            radius,
            height,
            radialSegments,
            heightSegments,
            capSegments
        });
        super(redGPUContext, uniqueKey, () => PrimitiveUtils.generateCapsuleData(
            redGPUContext, radius, height,
            radialSegments, heightSegments, capSegments, uniqueKey
        ));
    }
}

export default Capsule;
