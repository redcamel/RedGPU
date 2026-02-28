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
    constructor(redGPUContext: RedGPUContext,
                radiusTop: number = 1,
                radiusBottom: number = 1,
                height: number = 1,
                radialSegments: number = 8,
                heightSegments: number = 8,
                openEnded: boolean = false,
                thetaStart: number = 0.0,
                thetaLength: number = Math.PI * 2
    ) {
        const uniqueKey = `PRIMITIVE_CYLINDER_RT${radiusTop}_RB${radiusBottom}_H${height}_RS${radialSegments}_HS${heightSegments}_OE${openEnded}_TS${thetaStart}_TL${thetaLength}`;
        super(redGPUContext, uniqueKey, () => makeData(uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength));
    }
}

function makeData(uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
    const interleaveData = [];
    const indexData = [];
    const halfHeight = height / 2;
    const uVector = {x: 1, y: 0, z: 0};
    const vVector = {x: 0, y: 0, z: -1};

    // 1. Torso 생성 (PrimitiveUtils.generateCylinderTorsoData 사용)
    PrimitiveUtils.generateCylinderTorsoData(
        interleaveData, indexData,
        radiusTop, radiusBottom, height,
        radialSegments, heightSegments,
        thetaStart + Math.PI, thetaLength, // Unreal Standard: Seam at back
        {x: 0, y: 0, z: 0},
        uVector,
        vVector
    );

    // 2. Caps 생성 (Unreal Standard Alignment)
    if (!openEnded) {
        if (radiusTop > 0) {
            // Top Cap (+Y)
            PrimitiveUtils.generateCircleData(
                interleaveData, indexData,
                radiusTop, radialSegments,
                thetaStart + Math.PI, thetaLength,
                {x: 0, y: halfHeight, z: 0},
                uVector,  // uVector: Right (1, 0, 0)
                vVector,  // vVector: Top in UV / Back in World (0, 0, -1)
                {x: 0, y: 1, z: 0},  // Normal: Up
                true                 // CCW
            );
        }
        if (radiusBottom > 0) {
            // Bottom Cap (-Y)
            PrimitiveUtils.generateCircleData(
                interleaveData, indexData,
                radiusBottom, radialSegments,
                thetaStart + Math.PI, thetaLength,
                {x: 0, y: -halfHeight, z: 0},
                uVector,              // uVector: Right (1, 0, 0)
                {x: 0, y: 0, z: 1},    // vVector: Bottom (0, 0, 1) - 바닥면은 뒤집어서 렌더링되므로 V축 반전
                {x: 0, y: -1, z: 0}, // Normal: Down
                true                 // CCW
            );
        }
    }

    PrimitiveUtils.calculateTangents(interleaveData, indexData);

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
}

export default Cylinder;
