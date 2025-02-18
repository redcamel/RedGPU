import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

class Sphere extends Primitive {
    #makeData = (function () {
        let thetaEnd;
        let ix, iy;
        let index;
        let grid = [];
        let a, b, c, d;
        let vertex = new Float32Array([0, 0, 0]);
        let normal = new Float32Array([0, 0, 0]);
        return function (uniqueKey, redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize) {
            thetaEnd = thetaStart + thetaLength;
            index = 0;
            grid.length = 0;
            vertex[0] = 0;
            vertex[1] = 0;
            vertex[2] = 0;
            normal[0] = 0;
            normal[1] = 0;
            normal[2] = 0;
            ////////////////////////////////////////////////////////////////////////////
            // 데이터 생성!
            // vertexBuffer Data
            let interleaveData = [];
            let indexData = [];
            // generate vertices, normals and uvs
            for (iy = 0; iy <= heightSegments; iy++) {
                let verticesRow = [];
                let v = iy / heightSegments;
                for (ix = 0; ix <= widthSegments; ix++) {
                    let u = ix / widthSegments;
                    // vertex
                    vertex['x'] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    vertex['y'] = radius * Math.cos(thetaStart + v * thetaLength);
                    vertex['z'] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
                    interleaveData.push(vertex['x'], vertex['y'], vertex['z']);
                    // normal
                    normal[0] = vertex['x'];
                    normal[1] = vertex['y'];
                    normal[2] = vertex['z'];
                    vec3.normalize(normal, normal);
                    interleaveData.push(normal[0], normal[1], normal[2]);
                    // uv
                    interleaveData.push(u * uvSize, v * uvSize);
                    verticesRow.push(index++);
                }
                grid.push(verticesRow);
            }
            // indices
            for (iy = 0; iy < heightSegments; iy++) {
                for (ix = 0; ix < widthSegments; ix++) {
                    a = grid[iy][ix + 1];
                    b = grid[iy][ix];
                    c = grid[iy + 1][ix];
                    d = grid[iy + 1][ix + 1];
                    if (iy !== 0 || thetaStart > 0) indexData.push(a, b, d);
                    if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indexData.push(b, c, d);
                }
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
        };
    })();

    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 1,
        widthSegments: number = 16,
        heightSegments: number = 16,
        phiStart: number = 0,
        phiLength: number = Math.PI * 2,
        thetaStart: number = 0,
        thetaLength: number = Math.PI,
        uvSize: number = 1
    ) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_SPHERE_R${radius}_WS${widthSegments}_HS${heightSegments}_PS${phiStart}_PL${phiLength}_TS${thetaStart}_TL${thetaLength}_UV${uvSize}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
        let geometry = cachedBufferState[uniqueKey]
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize)
        }
        this._setData(geometry)
    }
}

export default Sphere
