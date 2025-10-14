/**
 * @category Buffer
 */
class VertexInterleaveType {
    static get float32() {
        return { numElements: 1, stride: Float32Array.BYTES_PER_ELEMENT, gpuVertexFormat: 'float32', offset: 0 };
    }
    static get float32x2() {
        return { numElements: 2, stride: Float32Array.BYTES_PER_ELEMENT * 2, gpuVertexFormat: 'float32x2', offset: 0 };
    }
    static get float32x3() {
        return { numElements: 3, stride: Float32Array.BYTES_PER_ELEMENT * 3, gpuVertexFormat: 'float32x3', offset: 0 };
    }
    static get float32x4() {
        return { numElements: 4, stride: Float32Array.BYTES_PER_ELEMENT * 4, gpuVertexFormat: 'float32x4', offset: 0 };
    }
}
Object.freeze(VertexInterleaveType);
export default VertexInterleaveType;
