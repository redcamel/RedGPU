import RedGPUContext from "../../context/RedGPUContext";
import { IPostEffectResult } from "./types";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] 후처리 과정에서 생성되는 임시 텍스처를 재사용하여 비디오 메모리 점유율과 할당 오버헤드를 줄이는 텍스처 풀 클래스입니다.
 * [EN] Texture pool class that reuses temporary textures generated during post-processing to reduce video memory occupancy and allocation overhead.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 postEffectManager를 통해 접근
 * // [EN] Access via View3D's postEffectManager
 * const texturePool = view.postEffectManager.texturePool;
 * ```
 *
 * @category PostEffect
 */
declare class PostEffectTexturePool extends RedGPUObject {
    #private;
    /**
     * [KO] PostEffectTexturePool 인스턴스를 생성합니다.
     * [EN] Creates a PostEffectTexturePool instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 풀 내의 전체 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) in the pool.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
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
     * [KO] 신규로 생성된 총 텍스처 할당 횟수를 반환합니다.
     * [EN] Returns the total number of newly allocated textures.
     *
     * @returns
     * [KO] 총 생성 횟수
     * [EN] Total allocation count
     */
    get allocationCount(): number;
    /**
     * [KO] 텍스처 재사용 적중률(0 ~ 1)을 반환합니다.
     * [EN] Returns the texture reuse hit rate (0 ~ 1).
     *
     * @returns
     * [KO] 적중률 (0 ~ 1)
     * [EN] Hit rate (0 ~ 1)
     */
    get hitRate(): number;
    /**
     * [KO] 해상도 및 포맷 키별 텍스처 풀의 상세 상태 목록을 반환합니다.
     * [EN] Returns the detailed status list of the texture pool by resolution and format key.
     *
     * @returns
     * [KO] 풀의 상세 상태 객체 배열
     * [EN] Array of detailed pool status objects
     */
    getDetails(): any[];
    /**
     * [KO] 지정된 크기와 포맷의 텍스처를 풀에서 가져오거나 새로 할당하여 반환합니다.
     * [EN] Retrieves a texture of the specified size and format from the pool or allocates a new one.
     *
     * @param width -
     * [KO] 텍스처 너비 (단위: 픽셀)
     * [EN] Texture width (in pixels)
     * @param height -
     * [KO] 텍스처 높이 (단위: 픽셀)
     * [EN] Texture height (in pixels)
     * @param format -
     * [KO] 텍스처 포맷
     * [EN] Texture format
     * @returns
     * [KO] 할당된 텍스처 및 뷰 결과 객체 (`IPostEffectResult`)
     * [EN] Allocated texture and view result object (`IPostEffectResult`)
     */
    allocResult(width: number, height: number, format?: GPUTextureFormat): IPostEffectResult;
    /**
     * [KO] 사용이 끝난 특정 텍스처를 풀로 반환합니다.
     * [EN] Releases a specific texture back to the pool.
     *
     * @param texture -
     * [KO] 반환할 `GPUTexture` 인스턴스
     * [EN] `GPUTexture` instance to release
     */
    release(texture: GPUTexture): void;
    /**
     * [KO] 현재 활성 상태인 모든 텍스처를 풀로 반환합니다.
     * [EN] Releases all currently active textures back to the pool.
     */
    releaseAll(): void;
    /**
     * [KO] 풀에 있는 모든 텍스처를 파기하고 통계 상태를 초기화합니다.
     * [EN] Destroys all textures in the pool and resets statistics.
     */
    clear(): void;
}
export default PostEffectTexturePool;
