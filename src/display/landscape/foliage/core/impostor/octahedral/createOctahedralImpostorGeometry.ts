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
    const halfH = height * 0.5;
    const centerY = bottomOffset + halfH;

    // 4 Vertices * 18 floats per vertex = 72 floats
    const interleaved = new Float32Array([
        // 0: Bottom-Left
        -halfW, -halfH, centerY, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        // 1: Bottom-Right
        halfW, -halfH, centerY, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        // 2: Top-Right
        halfW, halfH, centerY, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        // 3: Top-Left
        -halfW, halfH, centerY, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0
    ]);

    const indices = wireframe
        ? new Uint32Array([0, 1, 1, 2, 2, 3, 3, 0, 0, 2])
        : new Uint32Array([0, 1, 2, 0, 2, 3]);

    const vertexBuffer = new VertexBuffer(
        redGPUContext,
        interleaved,
        PBR_INTERLEAVED_STRUCT
    );

    const indexBuffer = new IndexBuffer(
        redGPUContext,
        indices
    );

    const geometry = new Geometry(redGPUContext, vertexBuffer, indexBuffer);
    (geometry as any)._octahedralWidth = width;
    (geometry as any)._octahedralHeight = height;
    (geometry as any)._octahedralBottomOffset = bottomOffset;

    return geometry;
}

export {createOctahedralImpostorGeometry};
