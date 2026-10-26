/**
 * [KO] 정점 인터리브 속성 요소의 구성 정보를 정의하는 타입입니다.
 * [EN] Type that defines the configuration information of a vertex interleaved attribute element.
 *
 * @category Buffer
 */
export type TypeInterleave = { numElements: number; stride: number, gpuVertexFormat: GPUVertexFormat, offset: number };

/**
 * [KO] 정점 데이터의 인터리브 포맷 규격을 제공하는 클래스입니다.
 * [EN] Class that provides interleaved format specifications for vertex data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const type = RedGPU.Resource.VertexInterleaveType.float32x3;
 * ```
 *
 * @category Buffer
 */
class VertexInterleaveType {
    /**
     * [KO] float32 포맷 (요소 1개, 4바이트)을 반환합니다.
     * [EN] Returns the float32 format (1 element, 4 bytes).
     *
     * @returns
     * [KO] float32 인터리브 포맷 정보
     * [EN] float32 interleave format information
     */
    static get float32(): TypeInterleave {
        return {numElements: 1, stride: Float32Array.BYTES_PER_ELEMENT, gpuVertexFormat: 'float32', offset: 0};
    }

    /**
     * [KO] float32x2 포맷 (요소 2개, 8바이트)을 반환합니다.
     * [EN] Returns the float32x2 format (2 elements, 8 bytes).
     *
     * @returns
     * [KO] float32x2 인터리브 포맷 정보
     * [EN] float32x2 interleave format information
     */
    static get float32x2(): TypeInterleave {
        return {numElements: 2, stride: Float32Array.BYTES_PER_ELEMENT * 2, gpuVertexFormat: 'float32x2', offset: 0}
    }

    /**
     * [KO] float32x3 포맷 (요소 3개, 12바이트)을 반환합니다.
     * [EN] Returns the float32x3 format (3 elements, 12 bytes).
     *
     * @returns
     * [KO] float32x3 인터리브 포맷 정보
     * [EN] float32x3 interleave format information
     */
    static get float32x3(): TypeInterleave {
        return {numElements: 3, stride: Float32Array.BYTES_PER_ELEMENT * 3, gpuVertexFormat: 'float32x3', offset: 0}
    }

    /**
     * [KO] float32x4 포맷 (요소 4개, 16바이트)을 반환합니다.
     * [EN] Returns the float32x4 format (4 elements, 16 bytes).
     *
     * @returns
     * [KO] float32x4 인터리브 포맷 정보
     * [EN] float32x4 interleave format information
     */
    static get float32x4(): TypeInterleave {
        return {numElements: 4, stride: Float32Array.BYTES_PER_ELEMENT * 4, gpuVertexFormat: 'float32x4', offset: 0}
    }

    /**
     * [KO] uint32x4 포맷 (요소 4개, 16바이트)을 반환합니다.
     * [EN] Returns the uint32x4 format (4 elements, 16 bytes).
     *
     * @returns
     * [KO] uint32x4 인터리브 포맷 정보
     * [EN] uint32x4 interleave format information
     */
    static get uint32x4(): TypeInterleave {
        return {numElements: 4, stride: Uint32Array.BYTES_PER_ELEMENT * 4, gpuVertexFormat: 'uint32x4', offset: 0}
    }
}

Object.freeze(VertexInterleaveType)
export default VertexInterleaveType