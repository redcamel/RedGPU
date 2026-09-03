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

function createOctahedralImpostorGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 6.0,
    bottomOffset: number = 0.0
): Geometry {
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const centerY = bottomOffset + halfH;

    const interleaved = new Float32Array([

        -halfW, -halfH, centerY, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,

        halfW, -halfH, centerY, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,

        halfW, halfH, centerY, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,

        -halfW, halfH, centerY, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0
    ]);

    const indices = new Uint32Array([0, 1, 2, 0, 2, 3]);

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

    return geometry;
}

export {createOctahedralImpostorGeometry};
