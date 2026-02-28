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

    // 1. Torso 생성 (Unreal Standard: Seam at back, front facing center of texture)
    const indexArray = [];
    let index = 0;
    const slope = (radiusBottom - radiusTop) / height;

    for (let iy = 0; iy <= heightSegments; iy++) {
        const indexRow = [];
        const v = iy / heightSegments;
        const radius = v * (radiusBottom - radiusTop) + radiusTop;

        for (let ix = 0; ix <= radialSegments; ix++) {
            const u = ix / radialSegments;
            // Unreal 스타일: 이음새를 -Z(뒤쪽)로 보내기 위해 PI만큼 오프셋
            const theta = u * thetaLength + thetaStart + Math.PI; 
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            // Position
            const x = radius * sinTheta;
            const y = -v * height + halfHeight;
            const z = radius * cosTheta;
            interleaveData.push(x, y, z);

            // Normal
            const normal = vec3.fromValues(sinTheta, slope, cosTheta);
            vec3.normalize(normal, normal);
            interleaveData.push(normal[0], normal[1], normal[2]);

            // UV
            interleaveData.push(u, v);
            indexRow.push(index++);
        }
        indexArray.push(indexRow);
    }

    // Torso Indices
    for (let ix = 0; ix < radialSegments; ix++) {
        for (let iy = 0; iy < heightSegments; iy++) {
            const a = indexArray[iy][ix];
            const b = indexArray[iy + 1][ix];
            const c = indexArray[iy + 1][ix + 1];
            const d = indexArray[iy][ix + 1];
            indexData.push(a, b, d);
            indexData.push(b, c, d);
        }
    }

    // 2. Caps 생성 (Unreal Standard Alignment)
    if (!openEnded) {
        if (radiusTop > 0) {
            // Top Cap (+Y)
            PrimitiveUtils.generateCircleData(
                interleaveData, indexData,
                radiusTop, radialSegments,
                thetaStart + Math.PI, thetaLength, // 몸체와 동일한 각도 오프셋 적용
                {x: 0, y: halfHeight, z: 0},
                {x: 1, y: 0, z: 0},  // uVector: Right
                {x: 0, y: 0, z: -1}, // vVector: Top
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
                {x: 1, y: 0, z: 0},  // uVector: Right
                {x: 0, y: 0, z: 1},   // vVector: Bottom (Unreal 스타일 바닥면 UV 정렬)
                {x: 0, y: -1, z: 0}, // Normal: Down
                true                 // CCW
            );
        }
    }

    return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
}

export default Cylinder;
