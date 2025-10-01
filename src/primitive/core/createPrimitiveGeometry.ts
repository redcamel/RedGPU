import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import IndexBuffer from "../../resources/buffer/indexBuffer/IndexBuffer";
import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import Primitive from "./Primitive";

const createPrimitiveGeometry = (redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry => {
	return new Geometry(
		redGPUContext,
		new VertexBuffer(
			redGPUContext,
			new Float32Array(interleaveData),
			Primitive.primitiveInterleaveStruct,
			undefined,
			`VertexBuffer_${uniqueKey}`
		),
		new IndexBuffer(
			redGPUContext,
			new Uint32Array(indexData),
			undefined,
			`IndexBuffer_${uniqueKey}`
		)
	);
}
export default createPrimitiveGeometry
