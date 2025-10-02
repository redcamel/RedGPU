import VertexInterleavedStructElement from "./core/VertexInterleavedStructElement";
import { TypeInterleave } from "./VertexInterleaveType";
/**
 * Represents a structure for interleaving vertex attributes.
 * @category Buffer
 */
export default class VertexInterleavedStruct {
    #private;
    constructor(attributes: Record<string, TypeInterleave>, name?: string);
    get label(): string;
    get attributes(): any[];
    get arrayStride(): number;
    get define(): Record<string, VertexInterleavedStructElement>;
}
