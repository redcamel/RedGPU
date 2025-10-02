import RedGPUContext from "../../../context/RedGPUContext";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";
/**
 * StorageBuffer
 * @category Buffer
 */
declare class StorageBuffer extends AUniformBaseBuffer {
    /**
     * StorageBuffer 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param uniformData - 업로드할 ArrayBuffer 데이터
     * @param label - 버퍼 레이블(옵션)
     * @param cacheKey - 버퍼 캐시 키(옵션)
     */
    constructor(redGPUContext: RedGPUContext, uniformData: ArrayBuffer, label?: string, cacheKey?: string);
}
export default StorageBuffer;
