import RedGPUContext from "../../../context/RedGPUContext";
import AUniformBaseBuffer from "../core/AUniformBaseBuffer";
/**
 * [KO] Storage 버퍼를 관리하는 클래스입니다.
 * [EN] Class that manages storage buffers.
 *
 * * ### Example
 * ```typescript
 * const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data);
 * ```
 * @category Buffer
 */
declare class StorageBuffer extends AUniformBaseBuffer {
    /**
     * [KO] StorageBuffer 인스턴스를 생성합니다.
     * [EN] Creates a StorageBuffer instance.
     *
     * * ### Example
     * ```typescript
     * const storageBuffer = new RedGPU.Resource.StorageBuffer(redGPUContext, data, 'MyStorageBuffer');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param uniformData -
     * [KO] 업로드할 `ArrayBuffer` 데이터
     * [EN] `ArrayBuffer` data to upload
     * @param label -
     * [KO] 버퍼 레이블 (선택)
     * [EN] Buffer label (optional)
     * @param cacheKey -
     * [KO] 버퍼 캐시 키 (선택)
     * [EN] Buffer cache key (optional)
     */
    constructor(redGPUContext: RedGPUContext, uniformData: ArrayBuffer, label?: string, cacheKey?: string);
}
export default StorageBuffer;
