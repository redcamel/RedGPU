import { TypeInterleave } from "../VertexInterleaveType";
/**
 */
declare class VertexInterleavedStructElement {
    attributeName: string;
    attributeStride: number;
    interleaveType: TypeInterleave;
    constructor(attributeName: string, attributeStride: number, interleaveType: TypeInterleave);
}
export default VertexInterleavedStructElement;
