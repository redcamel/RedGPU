import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import InterleaveType from "../../../resources/buffer/core/type/InterleaveType";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import InterleavedStruct from "../../../resources/buffer/vertexBuffer/InterleavedStruct";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";

class MeshInfo_OBJ {
	name: string;
	groupName: string;
	materialKey: string
	index: any[];
	position: any[];
	resultPosition: any[];
	resultNormal: any[];
	resultUV: any[];
	resultInterleave: any[];
	use: boolean;
	childrenInfo: object;
	ableUV: boolean
	ableNormal: boolean
	ableLight: boolean
	mesh: Mesh

	constructor(tName: string, currentGroupName: string) {
		this.name = tName;
		this.groupName = currentGroupName;
		this.index = [];
		this.position = [];
		this.resultPosition = [];
		this.resultNormal = [];
		this.resultUV = [];
		this.resultInterleave = [];
		this.use = true;
		this.childrenInfo = {};
	}

	createVertexBuffer(redGPUContext: RedGPUContext, key: string) {
		let interleaveInfo: any = {};
		if (this.resultPosition.length) interleaveInfo.aVertexPosition = InterleaveType.float32x3
		if (this.resultNormal.length) interleaveInfo.aVertexNormal = InterleaveType.float32x3
		if (this.resultUV.length) interleaveInfo.aTexcoord = InterleaveType.float32x2
		return new VertexBuffer(
			redGPUContext,
			new Float32Array(this.resultInterleave.length ? this.resultInterleave : this.resultPosition),
			new InterleavedStruct(interleaveInfo, `InterleavedStruct_${key}}`),
			undefined,
			`VertexBuffer_${key}`
		);
	}

	createBufferIndex(redGPUContext: RedGPUContext, key: string) {
		if (this['index'].length) {
			return new IndexBuffer(
				redGPUContext,
				this['index'],
				undefined,
				`IndexBuffer_${key}`
			);
		}
	}

	createColorMaterial(redGPUContext: RedGPUContext) {
		if (this.resultUV.length && this.resultNormal.length)
			return new ColorMaterial(redGPUContext, '#00ff00');
		if (this.resultNormal.length)
			return new ColorMaterial(redGPUContext, '#00ff00');
		return new ColorMaterial(redGPUContext, '#0000ff');
	}
}

Object.freeze(MeshInfo_OBJ)
export default MeshInfo_OBJ
