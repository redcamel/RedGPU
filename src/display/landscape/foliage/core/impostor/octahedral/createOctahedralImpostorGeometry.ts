import RedGPUContext from "../../../../../../context/RedGPUContext";
import Geometry from "../../../../../../geometry/Geometry";
import VertexBuffer from "../../../../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../../../../resources/buffer/indexBuffer/IndexBuffer";
import VertexInterleavedStruct from "../../../../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../../../../resources/buffer/vertexBuffer/VertexInterleaveType";

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

/**
 * Creates a single quad geometry for Octahedral Impostor rendering.
 * Total vertices: 4, Total triangles: 2 (indices: 6)
 */
function createOctahedralImpostorGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 8.0,
    wireframe: boolean = false,
    bottomOffset: number = 0.0
): Geometry {
    const halfW = width * 0.5;
    const minY = bottomOffset;
    const maxY = bottomOffset + height;

    const rawVertices = [
        // 0: Bottom-Left
        {x: -halfW, y: minY, z: 0.0, nx: 0.0, ny: 0.0, nz: 1.0, u: 0.0, v: 1.0},
        // 1: Bottom-Right
        {x: halfW, y: minY, z: 0.0, nx: 0.0, ny: 0.0, nz: 1.0, u: 1.0, v: 1.0},
        // 2: Top-Right
        {x: halfW, y: maxY, z: 0.0, nx: 0.0, ny: 0.0, nz: 1.0, u: 1.0, v: 0.0},
        // 3: Top-Left
        {x: -halfW, y: maxY, z: 0.0, nx: 0.0, ny: 0.0, nz: 1.0, u: 0.0, v: 0.0},
    ];

    const interleavedData: number[] = [];
    for (const v of rawVertices) {
        interleavedData.push(
            v.x, v.y, v.z,
            v.nx, v.ny, v.nz,
            v.u, v.v,
            v.u, v.v,
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, -999.0
        );
    }

    const indexData: number[] = wireframe
        ? [0, 1, 1, 2, 2, 3, 3, 0, 0, 2]
        : [0, 1, 2, 0, 2, 3];

    const vertexBuffer = new VertexBuffer(
        redGPUContext,
        new Float32Array(interleavedData),
        PBR_INTERLEAVED_STRUCT
    );

    const indexBuffer = new IndexBuffer(
        redGPUContext,
        new Uint32Array(indexData)
    );

    const geometry = new Geometry(redGPUContext, vertexBuffer, indexBuffer);
    (geometry as any)._octahedralWidth = width;
    (geometry as any)._octahedralHeight = height;
    (geometry as any)._octahedralBottomOffset = bottomOffset;

    return geometry;
}

export {createOctahedralImpostorGeometry};
