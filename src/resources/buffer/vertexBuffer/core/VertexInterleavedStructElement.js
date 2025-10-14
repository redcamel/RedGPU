/**
 */
class VertexInterleavedStructElement {
    attributeName;
    attributeStride;
    interleaveType;
    constructor(attributeName, attributeStride, interleaveType) {
        this.attributeName = attributeName;
        this.attributeStride = attributeStride;
        this.interleaveType = interleaveType;
    }
}
export default VertexInterleavedStructElement;
