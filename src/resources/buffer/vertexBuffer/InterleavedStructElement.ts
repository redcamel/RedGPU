import {TypeInterleave} from "../core/type/InterleaveType";

class InterleavedStructElement {
	attributeName: string;
	attributeStride: number;
	interleaveType: TypeInterleave;

	constructor(attributeName: string, attributeStride: number, interleaveType: TypeInterleave) {
		this.attributeName = attributeName;
		this.attributeStride = attributeStride;
		this.interleaveType = interleaveType;
	}
}

export default InterleavedStructElement
