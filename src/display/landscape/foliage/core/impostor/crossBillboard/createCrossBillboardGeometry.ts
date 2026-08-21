import RedGPUContext from "../../../../../../context/RedGPUContext";
import Geometry from "../../../../../../geometry/Geometry";
import VertexBuffer from "../../../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexInterleavedStruct from "../../../../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import {calculateTangentsInterleaved} from "../../../../../../math/calculateTangents";

const PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
        vertexNormal: VertexInterleaveType.float32x3,
        uv: VertexInterleaveType.float32x2,
        uv1: VertexInterleaveType.float32x2,
        vertexColor_0: VertexInterleaveType.float32x4,
        vertexTangent: VertexInterleaveType.float32x4,
    },
    'PBR'
);

function createCrossBillboardGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 8.0,
    wireframe: boolean = false
): Geometry {
    const halfW = width * 0.5;

    const u0 = 0.0;
    const u1 = 1.0 / 3.0;
    const u2 = 2.0 / 3.0;
    const u3 = 1.0;

    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];
    const uRanges = [
        {start: u0, end: u1},
        {start: u1, end: u2},
        {start: u2, end: u3}
    ];

    const rawVertices: Array<{
        x: number; y: number; z: number;
        u: number; v: number;
        nx: number; ny: number; nz: number;
    }> = [];

    for (let i = 0; i < 3; i++) {
        const rad = angles[i];
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const nx = sin;
        const nz = -cos;

        const leftX = -halfW * cos;
        const leftZ = -halfW * sin;
        const rightX = halfW * cos;
        const rightZ = halfW * sin;

        const uStart = uRanges[i].start;
        const uEnd = uRanges[i].end;

        rawVertices.push({x: leftX, y: 0.0, z: leftZ, u: uStart, v: 1.0, nx, ny: 0, nz});

        rawVertices.push({x: rightX, y: 0.0, z: rightZ, u: uEnd, v: 1.0, nx, ny: 0, nz});

        rawVertices.push({x: rightX, y: height, z: rightZ, u: uEnd, v: 0.0, nx, ny: 0, nz});

        rawVertices.push({x: leftX, y: height, z: leftZ, u: uStart, v: 0.0, nx, ny: 0, nz});
    }

    const interleavedData: number[] = [];
    for (const v of rawVertices) {
        interleavedData.push(
            v.x, v.y, v.z,
            v.nx, v.ny, v.nz,
            v.u, v.v,
            v.u, v.v,
            1.0, 1.0, 1.0, 1.0,
            0.0, 0.0, 0.0, 1.0
        );
    }

    const indexData: number[] = [];
    if (wireframe) {
        for (let i = 0; i < 3; i++) {
            const base = i * 4;
            indexData.push(
                base, base + 1,
                base + 1, base + 2,
                base + 2, base + 3,
                base + 3, base,
                base, base + 2,
                base + 1, base + 3
            );
        }
    } else {
        for (let i = 0; i < 3; i++) {
            const base = i * 4;
            indexData.push(
                base, base + 1, base + 2,
                base, base + 2, base + 3
            );
        }
    }

    const interleavedFloat32 = new Float32Array(interleavedData);
    const indexUint32 = new Uint32Array(indexData);

    calculateTangentsInterleaved(interleavedFloat32, indexUint32, 18, 0, 3, 6, 14);

    const wireframeKey = wireframe ? '_wf' : '';
    const vKey = `CrossBillboard_VB_${width}_${height}${wireframeKey}`;
    const iKey = `CrossBillboard_IB_${width}_${height}${wireframeKey}`;
    const vb = new VertexBuffer(redGPUContext, interleavedFloat32, PBR_INTERLEAVED_STRUCT, undefined, vKey);
    const ib = new IndexBuffer(redGPUContext, indexUint32, undefined, iKey);
    return new Geometry(redGPUContext, vb, ib);
}

Object.freeze(createCrossBillboardGeometry);
export default createCrossBillboardGeometry;
