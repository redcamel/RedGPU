import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "../core/ABaseBuffer";
type NumberArray = Array<number> | Uint32Array;
/**
 * IndexBuffer
 * @category Buffer
 */
declare class IndexBuffer extends ABaseBuffer {
    #private;
    /**
     * 인덱스 데이터가 저장되는 내부 버퍼입니다.

     */
    [GPU_BUFFER_DATA_SYMBOL]: Uint32Array;
    /**
     * IndexBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param data - 인덱스 데이터 (Array<number> 또는 Uint32Array)
     * @param usage - GPUBufferUsageFlags (기본값: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST)
     * @param cacheKey - 버퍼 캐시 키 (옵션)
     */
    constructor(redGPUContext: RedGPUContext, data: NumberArray, usage?: GPUBufferUsageFlags, cacheKey?: string);
    get format(): GPUIndexFormat;
    /**
     * 삼각형 개수를 반환합니다.
     * @category Buffer
     */
    get triangleCount(): number;
    /**
     * 인덱스 개수를 반환합니다.
     * @category Buffer
     */
    get indexCount(): number;
    /**
     * 인덱스 버퍼의 데이터를 변경합니다.
     *
     * @param data - 새로운 인덱스 데이터 (Array<number> 또는 Uint32Array)
     * @category Buffer
     */
    changeData(data: NumberArray): void;
}
export default IndexBuffer;
