import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Cone(원뿔) 기본 도형 클래스입니다.
 * [EN] Cone primitive geometry class.
 *
 * [KO] 반지름, 높이, 세그먼트 등을 기반으로 3D 원뿔 형태의 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages 3D cone data based on radius, height, segments, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 1, 높이 2짜리 원뿔 생성
 * const cone = new RedGPU.Primitive.Cone(redGPUContext, 1, 2);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cone/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Cone extends Primitive {
    /**
     * [KO] Cone 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cone.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radius - [KO] 밑면 반지름 (기본값 1) [EN] Base radius (default 1)
     * @param height - [KO] 높이 (기본값 1) [EN] Height (default 1)
     * @param radialSegments - [KO] 원주 방향 분할 수 (기본값 32) [EN] Radial segments (default 32)
     * @param heightSegments - [KO] 높이 방향 분할 수 (기본값 1) [EN] Height segments (default 1)
     * @param capBottom - [KO] 밑면을 닫을지 여부 (기본값 true) [EN] Whether to close the bottom cap (default true)
     * @param thetaStart - [KO] 시작 각도 (라디안, 기본값 0) [EN] Start angle (radians, default 0)
     * @param thetaLength - [KO] 원호 각도 (라디안, 기본값 2*PI) [EN] Arc angle (radians, default 2*PI)
     */
    constructor(redGPUContext: RedGPUContext,
                radius: number = 1,
                height: number = 1,
                radialSegments: number = 32,
                heightSegments: number = 1,
                capBottom: boolean = true,
                thetaStart: number = 0.0,
                thetaLength: number = Math.PI * 2
                ) {
                const uniqueKey = Primitive.generateUniqueKey('CONE', { radius, height, radialSegments, heightSegments, capBottom, thetaStart, thetaLength });
                super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, radius, height, radialSegments, heightSegments, capBottom, thetaStart, thetaLength));
                }}

function makeData(uniqueKey, redGPUContext, radius, height, radialSegments, heightSegments, capBottom, thetaStart, thetaLength) {
    const interleaveData = [];
    const indexData = [];
    const halfHeight = height / 2;

    // [업계 표준] 12시(-Z) 기점, 반시계 방향(CCW) 회전 유도 벡터
    const uVector = {x: 1, y: 0, z: 0};  // +X
    const vVector = {x: 0, y: 0, z: -1}; // -Z (12시 방향)

    // 1. Torso 생성 (상단 반지름을 0으로 설정하여 원뿔 형성)
    PrimitiveUtils.generateCylinderTorsoData(
        interleaveData, indexData,
        0, radius, height,
        radialSegments, heightSegments,
        thetaStart, thetaLength,
        {x: 0, y: 0, z: 0},
        uVector,
        vVector
    );

    // 2. Bottom Cap 생성
    if (capBottom && radius > 0) {
        PrimitiveUtils.generateCircleData(
            interleaveData, indexData,
            radius, radialSegments,
            thetaStart, thetaLength,
            {x: 0, y: -halfHeight, z: 0},
            uVector,
            vVector,
            {x: 0, y: -1, z: 0},
            false // CCW 생성을 유지하면서 밑면을 앞면으로 설정
        );
    }

    return PrimitiveUtils.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
}

export default Cone;
