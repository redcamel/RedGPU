export type TypeInterleave = { numElements: number; stride: number, gpuVertexFormat: GPUVertexFormat, offset: number };

/**
 * [KO] 정점 데이터의 인터리브 형식을 정의하는 클래스입니다.
 * [EN] Class that defines the interleaved format of vertex data.
 *
 * * ### Example
 * ```typescript
 * const type = RedGPU.Resource.VertexInterleaveType.float32x3;
 * ```
 * @category Buffer
 */
class VertexInterleaveType {
    /**
     * [KO] float32 형식 (요소 1개, 4바이트)
     * [EN] float32 format (1 element, 4 bytes)
     */
    static get float32(): TypeInterleave {
        return {numElements: 1, stride: Float32Array.BYTES_PER_ELEMENT, gpuVertexFormat: 'float32', offset: 0};
    }

    /**
     * [KO] float32x2 형식 (요소 2개, 8바이트)
     * [EN] float32x2 format (2 elements, 8 bytes)
     */
    static get float32x2(): TypeInterleave {
        return {numElements: 2, stride: Float32Array.BYTES_PER_ELEMENT * 2, gpuVertexFormat: 'float32x2', offset: 0}
    }

    /**
     * [KO] float32x3 형식 (요소 3개, 12바이트)
     * [EN] float32x3 format (3 elements, 12 bytes)
     */
    static get float32x3(): TypeInterleave {
        return {numElements: 3, stride: Float32Array.BYTES_PER_ELEMENT * 3, gpuVertexFormat: 'float32x3', offset: 0}
    }

    /**
     * [KO] float32x4 형식 (요소 4개, 16바이트)
     * [EN] float32x4 format (4 elements, 16 bytes)
     */
    static get float32x4(): TypeInterleave {
        return {numElements: 4, stride: Float32Array.BYTES_PER_ELEMENT * 4, gpuVertexFormat: 'float32x4', offset: 0}
    }
}

Object.freeze(VertexInterleaveType)
export default VertexInterleaveType