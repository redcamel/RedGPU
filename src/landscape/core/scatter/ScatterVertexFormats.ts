import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";

export const PBR_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
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

export const PBR_STRIDE = 18;

export const PBR_STRIDE_BYTES = PBR_STRIDE * 4;

export const POSITION_ONLY_INTERLEAVED_STRUCT = new VertexInterleavedStruct(
    {
        position: VertexInterleaveType.float32x3,
    },
    'PositionOnly'
);

export const POSITION_ONLY_STRIDE = 3;

export const POSITION_ONLY_STRIDE_BYTES = POSITION_ONLY_STRIDE * 4;

