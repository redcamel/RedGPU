import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import Primitive from "./Primitive";
const createPrimitiveGeometry = (redGPUContext, interleaveData, indexData, uniqueKey) => {
    return new Geometry(redGPUContext, new VertexBuffer(redGPUContext, new Float32Array(interleaveData), Primitive.primitiveInterleaveStruct, undefined, `VertexBuffer_${uniqueKey}`), new IndexBuffer(redGPUContext, new Uint32Array(indexData), undefined, `IndexBuffer_${uniqueKey}`));
};
export default createPrimitiveGeometry;
