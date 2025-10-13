import RedGPUContext from "../../../context/RedGPUContext";
import ABaseBuffer, { GPU_BUFFER_DATA_SYMBOL } from "../core/ABaseBuffer";
import VertexInterleavedStruct from "./VertexInterleavedStruct";
/**
 * VertexBuffer
 * @category Buffer
 */
declare class VertexBuffer extends ABaseBuffer {
    #private;
    /**
     * 버텍스 데이터가 저장되는 내부 버퍼입니다.
     * @category Buffer
     */
    [GPU_BUFFER_DATA_SYMBOL]: Float32Array;
    /**
     * VertexBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param data - 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param interleavedStruct - 버텍스 데이터 구조 정의
     * @param usage - GPUBufferUsageFlags (기본값: VERTEX | COPY_DST | STORAGE)
     * @param cacheKey - 버퍼 캐시 키(옵션)
     */
    constructor(redGPUContext: RedGPUContext, data: Array<number> | Float32Array, interleavedStruct: VertexInterleavedStruct, usage?: GPUBufferUsageFlags, cacheKey?: string);
    get data(): Float32Array;
    /**
     * stride(버텍스 당 바이트 수)를 반환합니다.
     * @category Buffer
     */
    get stride(): number;
    /**
     * 버텍스 데이터 구조를 반환합니다.
     * @category Buffer
     */
    get interleavedStruct(): VertexInterleavedStruct;
    /**
     * 버텍스 개수를 반환합니다.
     * @category Buffer
     */
    get vertexCount(): number;
    /**
     * 삼각형 개수를 반환합니다.
     * @category Buffer
     */
    get triangleCount(): number;
    /**
     * 버텍스 버퍼의 데이터를 변경합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param interleavedStruct - 버텍스 데이터 구조 정의(옵션)
     * @category Buffer
     */
    changeData(data: Array<number> | Float32Array, interleavedStruct?: VertexInterleavedStruct): void;
    /**
     * 버텍스 버퍼의 일부 데이터를 오프셋부터 업데이트합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @param offset - 업데이트 시작 오프셋(기본값: 0)
     * @category Buffer
     */
    updateData(data: Array<number> | Float32Array, offset?: number): void;
    /**
     * 버텍스 버퍼의 전체 데이터를 GPU에 다시 업로드합니다.
     * @param data - 새로운 버텍스 데이터 (Array<number> 또는 Float32Array)
     * @category Buffer
     */
    updateAllData(data: Array<number> | Float32Array): void;
}
export default VertexBuffer;
