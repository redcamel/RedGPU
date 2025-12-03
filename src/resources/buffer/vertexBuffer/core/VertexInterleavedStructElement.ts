import {TypeInterleave} from "../VertexInterleaveType";

/**
 */
class VertexInterleavedStructElement {
    attributeName: string;
    attributeStride: number;
    interleaveType: TypeInterleave;

    constructor(attributeName: string, attributeStride: number, interleaveType: TypeInterleave) {
        this.attributeName = attributeName;
        this.attributeStride = attributeStride;
        this.interleaveType = interleaveType;
    }
}

export default VertexInterleavedStructElement
