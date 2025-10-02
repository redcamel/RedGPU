export type TypeInterleave = {
    numElements: number;
    stride: number;
    gpuVertexFormat: GPUVertexFormat;
    offset: number;
};
/**
 * @category Buffer
 */
declare class VertexInterleaveType {
    static get float32(): TypeInterleave;
    static get float32x2(): TypeInterleave;
    static get float32x3(): TypeInterleave;
    static get float32x4(): TypeInterleave;
}
export default VertexInterleaveType;
