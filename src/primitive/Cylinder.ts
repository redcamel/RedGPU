import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * [KO] Cylinder(실린더) 기본 도형 클래스입니다.
 * [EN] Cylinder primitive geometry class.
 *
 * [KO] 상하 반지름, 높이 등을 기반으로 원기둥 형태의 정점 및 인덱스 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages vertex and index data for a cylinder based on radius, height, etc.
 *
 * ### Example
 * ```typescript
 * // 반지름 1, 높이 2, 세그먼트 32짜리 실린더 생성
 * const cylinder = new RedGPU.Cylinder(redGPUContext, 1, 1, 2, 32);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/cylinder/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Cylinder extends Primitive {
    #makeData = (function () {
        let generateTorso;
        let generateCap;
        return function (uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!
            // vertexBuffer Data
            const interleaveData = [];
            const indexData = [];
            //
            let index = 0;
            const indexArray = [];
            const halfHeight = height / 2;
            let groupStart = 0;
            generateTorso = function () {
                let x, y;
                const normal: any = [];
                const vertex = [];
                let groupCount = 0;
                // this will be used to calculate the normal
                const slope = (radiusBottom - radiusTop) / height;
                // generate vertices, normals and uvs
                for (y = 0; y <= heightSegments; y++) {
                    const indexRow = [];
                    const v = y / heightSegments;
                    // calculate the radius of the current row
                    const radius = v * (radiusBottom - radiusTop) + radiusTop;
                    for (x = 0; x <= radialSegments; x++) {
                        const u = x / radialSegments;
                        const theta = u * thetaLength + thetaStart;
                        const sinTheta = Math.sin(theta);
                        const cosTheta = Math.cos(theta);
                        // vertex
                        vertex[0] = radius * sinTheta;
                        vertex[1] = -v * height + halfHeight;
                        vertex[2] = radius * cosTheta;
                        interleaveData.push(vertex[0], vertex[1], vertex[2]);
                        // normal
                        normal[0] = sinTheta;
                        normal[1] = slope;
                        normal[2] = cosTheta;
                        vec3.normalize(normal, normal);
                        interleaveData.push(normal[0], normal[1], normal[2]);
                        // uv
                        interleaveData.push(u, v);
                        // save index of vertex in respective row
                        indexRow.push(index++);
                    }
                    // now save vertices of the row in our index array
                    indexArray.push(indexRow);
                }
                // generate indices
                for (x = 0; x < radialSegments; x++) {
                    for (y = 0; y < heightSegments; y++) {
                        // we use the index array to access the correct indices
                        const a = indexArray [y][x];
                        const b = indexArray[y + 1][x];
                        const c = indexArray[y + 1][x + 1];
                        const d = indexArray[y][x + 1];
                        // faces
                        indexData.push(a, b, d);
                        indexData.push(b, c, d);
                        // update group counter
                        groupCount += 6;
                    }
                }
                groupStart += groupCount;
            };
            generateCap = function (top) {
                let x, centerIndexStart, centerIndexEnd;
                const uv = [];
                const vertex = [];
                let groupCount = 0;
                const radius = (top === true) ? radiusTop : radiusBottom;
                const sign = (top === true) ? 1 : -1;
                // save the index of the first center vertex
                centerIndexStart = index;
                // first we generate the center vertex data of the cap.
                // because the geometry needs one set of uvs per face,
                // we must generate a center vertex per face/segment
                for (x = 1; x <= radialSegments; x++) {
                    // vertex
                    interleaveData.push(0, halfHeight * sign, 0);
                    // normal
                    interleaveData.push(0, sign, 0);
                    // uv
                    interleaveData.push(0.5, 0.5);
                    // increase index
                    index++;
                }
                // save the index of the last center vertex
                centerIndexEnd = index;
                // now we generate the surrounding vertices, normals and uvs
                for (x = 0; x <= radialSegments; x++) {
                    const u = x / radialSegments;
                    const theta = u * thetaLength + thetaStart;
                    const cosTheta = Math.cos(theta);
                    const sinTheta = Math.sin(theta);
                    // vertex
                    vertex[0] = radius * sinTheta;
                    vertex[1] = halfHeight * sign;
                    vertex[2] = radius * cosTheta;
                    interleaveData.push(vertex[0], vertex[1], vertex[2]);
                    // normal
                    interleaveData.push(0, sign, 0);
                    // uv
                    uv[0] = (cosTheta * 0.5) + 0.5;
                    uv[1] = (sinTheta * 0.5 * sign) + 0.5;
                    interleaveData.push(uv[0], 1 - uv[1]);
                    // increase index
                    index++;
                }
                // generate indices
                for (x = 0; x < radialSegments; x++) {
                    const c = centerIndexStart + x;
                    const i = centerIndexEnd + x;
                    if (top === true) {
                        // face top
                        indexData.push(i, i + 1, c);
                    } else {
                        // face bottom
                        indexData.push(i + 1, i, c);
                    }
                    groupCount += 3;
                }
                // calculate new start value for groups
                groupStart += groupCount;
            };
            generateTorso();
            if (openEnded === false) {
                if (radiusTop > 0) generateCap(true);
                if (radiusBottom > 0) generateCap(false);
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
        };
    })();

    /**
     * [KO] Cylinder 인스턴스를 생성합니다.
     * [EN] Creates an instance of Cylinder.
     * 
     * ### Example
     * ```typescript
     * const cylinder = new RedGPU.Cylinder(redGPUContext, 1, 1, 2, 32);
     * ```
     *
     * @param redGPUContext - 
     * [KO] RedGPUContext 인스턴스 
     * [EN] RedGPUContext instance
     * @param radiusTop - 
     * [KO] 윗면 반지름 (기본값 1) 
     * [EN] Top radius (default 1)
     * @param radiusBottom - 
     * [KO] 아랫면 반지름 (기본값 1) 
     * [EN] Bottom radius (default 1)
     * @param height - 
     * [KO] 높이 (기본값 1) 
     * [EN] Height (default 1)
     * @param radialSegments - 
     * [KO] 둘레 세그먼트 수 (기본값 8) 
     * [EN] Radial segments (default 8)
     * @param heightSegments - 
     * [KO] 높이 세그먼트 수 (기본값 8) 
     * [EN] Height segments (default 8)
     * @param openEnded - 
     * [KO] 캡 사용 안함 여부 (기본값 false) 
     * [EN] Whether the ends are open (default false)
     * @param thetaStart - 
     * [KO] 시작 각도 (라디안, 기본값 0) 
     * [EN] Starting angle (radians, default 0)
     * @param thetaLength - 
     * [KO] 원호 각도 (라디안, 기본값 2*PI) 
     * [EN] Arc angle (radians, default 2*PI)
     */
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
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_CYLINDER_RT${radiusTop}_RB${radiusBottom}_H${height}_RS${radialSegments}_HS${heightSegments}_TS${openEnded}_TS${thetaStart}_TL${thetaLength}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
        }
        this._setData(geometry)
    }
}

export default Cylinder
