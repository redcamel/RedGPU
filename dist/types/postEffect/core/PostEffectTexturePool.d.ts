import RedGPUContext from "../../context/RedGPUContext";
import { IPostEffectResult } from "./types";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] 후처리용 텍스처 풀링 클래스입니다.
 * [EN] Texture pooling class for post-processing.
 *
 * [KO] 후처리 과정에서 발생하는 임시 텍스처들을 재사용하여 비디오 메모리 점유율과 생성/파괴 오버헤드를 줄입니다.
 * [EN] Reduces video memory occupancy and creation/destruction overhead by reusing temporary textures generated during post-processing.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // View3D의 postEffectManager를 통해 접근합니다.
 * // Access through the postEffectManager of View3D.
 * const texturePool = view.postEffectManager.texturePool;
 * ```
 */
declare class PostEffectTexturePool extends RedGPUObject {
    #private;
    /**
     * [KO] PostEffectTexturePool 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectTexturePool instance.
     * @param redGPUContext - RedGPU 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 풀 내의 전체 비디오 메모리 사용량(bytes)을 반환합니다.
     * [EN] Returns the total video memory usage (bytes) in the pool.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 풀 내의 전체 텍스처 개수(활성 + 유휴)를 반환합니다.
     * [EN] Returns the total number of textures in the pool (active + idle).
     *
     * @returns
     * [KO] 전체 텍스처 수
     * [EN] Total texture count
     */
    get totalCount(): number;
    /**
     * [KO] 현재 사용 중인 활성 텍스처 개수를 반환합니다.
     * [EN] Returns the number of currently active textures.
     *
     * @returns
     * [KO] 활성 텍스처 수
     * [EN] Active texture count
     */
    get activeCount(): number;
    /**
     * [KO] 풀에서 대기 중인 유휴 텍스처 개수를 반환합니다.
     * [EN] Returns the number of idle textures waiting in the pool.
     *
     * @returns
     * [KO] 유휴 텍스처 수
     * [EN] Idle texture count
     */
    get idleCount(): number;
    /**
     * [KO] 역대 최대 동시 활성 텍스처 수를 반환합니다.
     * [EN] Returns the historical peak number of concurrently active textures.
     *
     * @returns
     * [KO] 최대 활성 텍스처 수
     * [EN] Peak active texture count
     */
    get peakActiveCount(): number;
    /**
     * [KO] 신규로 생성된 총 텍스처 횟수를 반환합니다.
     * [EN] Returns the total number of newly created textures.
     *
     * @returns
     * [KO] 총 생성 횟수
     * [EN] Total allocation count
     */
    get allocationCount(): number;
    /**
     * [KO] 재사용 적중률(Hit Rate)을 반환합니다. (0~1)
     * [EN] Returns the reuse hit rate. (0~1)
     *
     * @returns
     * [KO] 적중률 (0에서 1 사이)
     * [EN] Hit rate (between 0 and 1)
     */
    get hitRate(): number;
    /**
     * [KO] 풀에 담긴 상세 내역을 반환합니다.
     * [EN] Returns the detailed breakdown of the pool.
     *
     * @returns
     * [KO] 풀의 상세 상태 객체 배열
     * [EN] Array of detailed pool status objects
     */
    getDetails(): any[];
    /**
     * [KO] 적절한 텍스처를 풀에서 가져오거나 새로 생성하여 IPostEffectResult 형식으로 반환합니다.
     * [EN] Gets a suitable texture from the pool or creates a new one, returning it as IPostEffectResult.
     *
     * @param width -
     * [KO] 텍스처 가로 크기
     * [EN] Texture width
     * @param height -
     * [KO] 텍스처 세로 크기
     * [EN] Texture height
     * @param format -
     * [KO] 텍스처 포맷 (기본값: 'rgba16float')
     * [EN] Texture format (Default: 'rgba16float')
     * @returns
     * [KO] 할당된 텍스처 및 뷰 정보 객체
     * [EN] Allocated texture and view information object
     */
    allocResult(width: number, height: number, format?: GPUTextureFormat): IPostEffectResult;
    /**
     * [KO] 특정 텍스처를 풀로 반환합니다.
     * [EN] Returns a specific texture to the pool.
     *
     * @param texture -
     * [KO] 반환할 GPUTexture
     * [EN] GPUTexture to return
     */
    release(texture: GPUTexture): void;
    /**
     * [KO] 사용 중인 모든 텍스처를 풀로 반환합니다.
     * [EN] Returns all active textures to the pool.
     */
    releaseAll(): void;
    /**
     * [KO] 풀에 있는 모든 텍스처를 파기합니다.
     * [EN] Destroys all textures in the pool.
     */
    clear(): void;
}
export default PostEffectTexturePool;
