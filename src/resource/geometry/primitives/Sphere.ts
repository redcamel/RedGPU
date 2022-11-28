"use strict";
import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../Geometry";
import InterleaveInfo from "../../buffers/interleaveInfo/InterleaveInfo";
import InterleaveUnit from "../../buffers/interleaveInfo/InterleaveUnit";
import {vec3} from "../../../util/gl-matrix";

export default class Sphere extends Geometry {
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
        const tData = makeData(redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize);
        // console.log('tData', tData)
        const data: Float32Array = tData['vertexData'];
        const interleaveInfo: InterleaveInfo = tData['interleaveInfo']
        const indexData: Uint32Array = tData['indexData']
        super(redGPUContext, data, interleaveInfo, indexData);
    }

}

const makeData = (function () {
    let thetaEnd;
    let ix, iy;
    let index;
    let grid = [];
    let a, b, c, d;
    let vertex = new Float32Array([0, 0, 0]);
    let normal = new Float32Array([0, 0, 0]);
    return function (redGPUContext, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, uvSize) {
        thetaEnd = thetaStart + thetaLength;
        index = 0;
        grid.length = 0;
        vertex[0] = 0, vertex[1] = 0, vertex[2] = 0;
        normal[0] = 0, normal[1] = 0, normal[2] = 0;
        ////////////////////////////////////////////////////////////////////////////
        // 데이터 생성!
        // buffers Data
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
        return {
            vertexData: new Float32Array(interleaveData),
            interleaveInfo: new InterleaveInfo(
                [
                    new InterleaveUnit(InterleaveUnit.VERTEX_POSITION, "float32x3"),
                    new InterleaveUnit(InterleaveUnit.VERTEX_NORMAL, "float32x3"),
                    new InterleaveUnit(InterleaveUnit.TEXCOORD, 'float32x2')
                ]
            ),
            indexData: new Uint32Array(indexData)
        }
    };

})();
