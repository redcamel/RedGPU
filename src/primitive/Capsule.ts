import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Capsule(캡슐) 기본 도형 클래스입니다.
 * [EN] Capsule primitive geometry class.
 *
 * [KO] 반지름, 실린더 높이 등을 기반으로 캡슐 형태의 정점 및 인덱스 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages vertex and index data for a capsule based on radius, cylinder height, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 0.5, 실린더 높이 1, 세그먼트들을 설정하여 캡슐 생성
 * const capsule = new RedGPU.Capsule(redGPUContext, 0.5, 1, 32, 1, 12);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/capsule/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Capsule extends Primitive {
    /**
     * [KO] Capsule 인스턴스를 생성합니다.
     * [EN] Creates an instance of Capsule.
     *
     * ### Example
     * ```typescript
     * const capsule = new RedGPU.Capsule(redGPUContext, 0.5, 1.0, 32, 1, 12);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 반지름 (기본값 0.5)
     * [EN] Radius (default 0.5)
     * @param height -
     * [KO] 실린더 부분 높이 (기본값 1.0)
     * [EN] Cylinder part height (default 1.0)
     * @param radialSegments -
     * [KO] 원주 방향 분할 수 (기본값 32)
     * [EN] Radial segments (default 32)
     * @param heightSegments -
     * [KO] 실린더 부분의 높이 방향 분할 수 (기본값 1)
     * [EN] Height segments for cylinder part (default 1)
     * @param capSegments -
     * [KO] 상/하단 반구의 세로 분할 수 (기본값 12)
     * [EN] Cap segments for hemispheres (default 12)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 0.5,
        height: number = 1.0,
        radialSegments: number = 32,
        heightSegments: number = 1,
        capSegments: number = 12
    ) {
        const uniqueKey = Primitive.generateUniqueKey('CAPSULE', { radius, height, radialSegments, heightSegments, capSegments });
        super(redGPUContext, uniqueKey, () => makeData(
            uniqueKey, redGPUContext, radius, height,
            radialSegments, heightSegments, capSegments
        ));
    }
}

const makeData = function (
    uniqueKey: string,
    redGPUContext: RedGPUContext,
    radius: number,
    height: number,
    radialSegments: number,
    heightSegments: number,
    capSegments: number
) {
    const interleaveData: number[] = [];
    const indexData: number[] = [];
    const gridX1 = radialSegments + 1;

    const totalVerticalSegments = capSegments * 2 + heightSegments;
    const halfCylinderHeight = height / 2;

    const capArcLength = (Math.PI / 2) * radius;
    const totalArcLength = capArcLength * 2 + height;

    // 1. Top Cap (반구)
    PrimitiveUtils.generateSphericalData(
        interleaveData,
        radius, radialSegments, capSegments,
        0, Math.PI * 2,
        0, Math.PI / 2,
        halfCylinderHeight,
        0, capArcLength / totalArcLength
    );

    // 2. Cylinder Body (몸통)
    const bodyVStart = capArcLength / totalArcLength;
    const bodyVEnd = (capArcLength + height) / totalArcLength;
    
    for (let iy = 1; iy <= heightSegments; iy++) {
        const vRatio = iy / heightSegments;
        const y = halfCylinderHeight - vRatio * height;
        const v = bodyVStart + vRatio * (bodyVEnd - bodyVStart);

        for (let ix = 0; ix <= radialSegments; ix++) {
            const u = ix / radialSegments;
            const phi = u * Math.PI * 2;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = radius * (-sinPhi);
            const z = radius * (-cosPhi);

            PrimitiveUtils.interleavePacker(
                interleaveData,
                x, y, z,
                -sinPhi, 0, -cosPhi, // Normal (수평 방향)
                u, v
            );
        }
    }

    // 3. Bottom Cap (반구)
    PrimitiveUtils.generateSphericalData(
        interleaveData,
        radius, radialSegments, capSegments,
        0, Math.PI * 2,
        Math.PI / 2, Math.PI / 2,
        -halfCylinderHeight,
        bodyVEnd, 1
    );

    // Indices (PrimitiveUtils.generateGridIndices 사용)
    PrimitiveUtils.generateGridIndices(indexData, 0, radialSegments, totalVerticalSegments, gridX1);

    return PrimitiveUtils.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
};

export default Capsule;
