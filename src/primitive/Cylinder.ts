import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";
import PrimitiveUtils from "./core/PrimitiveUtils";

/**
 * [KO] Cylinder(실린더) 기본 도형 클래스입니다.
 * [EN] Cylinder primitive geometry class.
 */
class Cylinder extends Primitive {
    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param radiusTop - [KO] 상단 반지름 [EN] Top radius
     * @param radiusBottom - [KO] 하단 반지름 [EN] Bottom radius
     * @param height - [KO] 높이 [EN] Height
     * @param radialSegments - [KO] 원주 방향 분할 수 [EN] Radial segments
     * @param heightSegments - [KO] 높이 방향 분할 수 [EN] Height segments
     * @param capTop - [KO] 상단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the top cap (default true)
     * @param capBottom - [KO] 하단 단면을 닫을지 여부 (기본값 true) [EN] Whether to close the bottom cap (default true)
     * @param thetaStart - [KO] 시작 각도 [EN] Starting angle
     * @param thetaLength - [KO] 원호 각도 [EN] Arc angle
     * @param isRadialTop - [KO] 상단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether top cap uses radial UV (default false)
     * @param isRadialBottom - [KO] 하단 단면의 방사형 UV 여부 (기본값 false) [EN] Whether bottom cap uses radial UV (default false)
     */
    constructor(redGPUContext: RedGPUContext,
                radiusTop: number = 1,
                radiusBottom: number = 1,
                height: number = 1,
                radialSegments: number = 8,
                heightSegments: number = 8,
                capTop: boolean = true,
                capBottom: boolean = true,
                thetaStart: number = 0.0,
                thetaLength: number = Math.PI * 2,
                isRadialTop: boolean = false,
                isRadialBottom: boolean = false
    ) {
        const uniqueKey = `PRIMITIVE_CYLINDER_RT${radiusTop}_RB${radiusBottom}_H${height}_RS${radialSegments}_HS${heightSegments}_CT${capTop}_CB${capBottom}_TS${thetaStart}_TL${thetaLength}_IRT${isRadialTop}_IRB${isRadialBottom}`;
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom));
    }
}

function makeData(uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, capTop, capBottom, thetaStart, thetaLength, isRadialTop, isRadialBottom) {
    const interleaveData = [];
    const indexData = [];
    const halfHeight = height / 2;

    // [업계 표준] 12시(-Z) 기점, 반시계 방향(CCW) 회전 유도 벡터
    const uVector = {x: 1, y: 0, z: 0};  // 로컬 수평축 (+X)
    const vVector = {x: 0, y: 0, z: -1}; // 로컬 수직축 (12시 방향, -Z)

    // 1. Torso 생성
    PrimitiveUtils.generateCylinderTorsoData(
        interleaveData, indexData,
        radiusTop, radiusBottom, height,
        radialSegments, heightSegments,
        thetaStart, thetaLength,
        {x: 0, y: 0, z: 0},
        uVector,
        vVector
    );

    // 2. Caps 생성
    if (capTop && radiusTop > 0) {
        // Top Cap (+Y 바라봄)
        PrimitiveUtils.generateCircleData(
            interleaveData, indexData,
            radiusTop, radialSegments,
            thetaStart, thetaLength,
            {x: 0, y: halfHeight, z: 0},
            uVector,
            vVector,
            {x: 0, y: 1, z: 0},
            true,
            isRadialTop
        );
    }
    if (capBottom && radiusBottom > 0) {
        // Bottom Cap (-Y 바라봄)
        PrimitiveUtils.generateCircleData(
            interleaveData, indexData,
            radiusBottom, radialSegments,
            thetaStart, thetaLength,
            {x: 0, y: -halfHeight, z: 0},
            uVector,
            vVector,
            {x: 0, y: -1, z: 0},
            false, // CCW 생성을 유지하면서 밑면을 앞면으로 설정
            isRadialBottom
        );
    }

    PrimitiveUtils.calculateTangents(interleaveData, indexData);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
}

export default Cylinder;
