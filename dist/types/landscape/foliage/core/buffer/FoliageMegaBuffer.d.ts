import { mat4 } from "gl-matrix";
import RedGPUContext from '../../../../context/RedGPUContext';
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import AScatterMegaBuffer, { ScatterBaseSegmentAllocation } from '../../../core/scatter/AScatterMegaBuffer';
import FoliageRenderUnit from '../FoliageRenderUnit';
import { FoliageLODInfo } from '../Foliage';
/**
 * [KO] 메가 버퍼 내 단일 식생 타입에 할당된 세그먼트 정보 인터페이스입니다.
 * [EN] Interface representing segment allocation information for a single foliage type within the mega buffer.
 * @category Landscape
 */
export interface FoliageTypeAllocation extends ScatterBaseSegmentAllocation {
    /**
     * [KO] 할당된 식생 타입의 고유 이름
     * [EN] Unique name of the allocated foliage type
     */
    name: string;
}
/**
 * [KO] 모든 식생(Foliage) 타입의 원시 인스턴스, 메인/그림자 컬링 출력 버퍼, 간접 드로우 버퍼 및 컬링 유니폼을 단일 통합 버퍼 체계로 관리하는 메가 버퍼 클래스입니다.
 * [EN] Mega buffer class that manages raw instances, main/shadow culled output buffers, indirect draw buffers, and culling uniforms for all foliage types in a unified buffer architecture.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliageMegaBuffer extends AScatterMegaBuffer {
    #private;
    /**
     * [KO] `FoliageMegaBuffer` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageMegaBuffer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param initialCapacity -
     * [KO] 초기 최대 인스턴스 수용량 (기본값: `65536`)
     * [EN] Initial maximum instance capacity (default: `65536`)
     * @param maxTypes -
     * [KO] 지원할 최대 식생 타입 수 (기본값: `64`)
     * [EN] Maximum number of supported foliage types (default: `64`)
     * @throws
     * [KO] `foliageCullWGSL`에서 `FoliageCullingUniforms` 구조체 크기를 리플렉션하지 못한 경우 Error 발생
     * [EN] Throws Error if reflecting the `FoliageCullingUniforms` struct size from `foliageCullWGSL` fails
     */
    constructor(redGPUContext: RedGPUContext, initialCapacity?: number, maxTypes?: number);
    /**
     * [KO] 그림자 캐스케이드용 컬링 결과 인스턴스 GPU 버퍼를 반환합니다.
     * [EN] Returns the culled instance GPU buffer for shadow cascades.
     *
     * @returns
     * [KO] 그림자 컬링 인스턴스 `GPUBuffer` 또는 `null`
     * [EN] Shadow culled instance `GPUBuffer` or `null`
     */
    get shadowCulledGPUBuffer(): GPUBuffer | null;
    /**
     * [KO] 그림자 캐스케이드용 간접 드로우(Indirect Draw) GPU 버퍼를 반환합니다.
     * [EN] Returns the indirect draw GPU buffer for shadow cascades.
     *
     * @returns
     * [KO] 그림자 간접 드로우 `GPUBuffer` 또는 `null`
     * [EN] Shadow indirect draw `GPUBuffer` or `null`
     */
    get shadowIndirectGPUBuffer(): GPUBuffer | null;
    /**
     * [KO] 모든 내부 GPU 버퍼가 정상적으로 생성되어 사용 가능한 상태인지 반환합니다.
     * [EN] Returns whether all internal GPU buffers are properly created and ready for use.
     *
     * @returns
     * [KO] 메가 버퍼 준비 완료 여부
     * [EN] Whether the mega buffer is ready
     */
    get isReady(): boolean;
    /**
     * [KO] 새로운 식생 타입을 위한 인스턴스 세그먼트 및 간접 드로우 슬롯을 할당합니다.
     * [EN] Allocates an instance segment and indirect draw slots for a new foliage type.
     *
     * @param name -
     * [KO] 식생 타입 고유 이름
     * [EN] Unique name of the foliage type
     * @param maxInstances -
     * [KO] 할당할 최대 인스턴스 수
     * [EN] Maximum number of instances to allocate
     * @param renderUnits -
     * [KO] 메인 패스용 렌더 유닛 목록
     * [EN] List of render units for the main pass
     * @param shadowMergedRenderUnits -
     * [KO] 그림자 패스 전용 병합 렌더 유닛 목록 (선택)
     * [EN] List of merged render units for the shadow pass (optional)
     * @param lodInfoList -
     * [KO] LOD 단계별 메타데이터 목록 (선택)
     * [EN] List of metadata per LOD level (optional)
     * @returns
     * [KO] 할당된 식생 타입 세그먼트 정보(`FoliageTypeAllocation`)
     * [EN] Allocated foliage type segment information (`FoliageTypeAllocation`)
     * @throws
     * [KO] 최대 지원 식생 타입 수(`maxTypes`)를 초과할 경우 Error 발생
     * [EN] Throws Error if the maximum supported foliage types (`maxTypes`) is exceeded
     */
    allocateType(name: string, maxInstances: number, renderUnits: FoliageRenderUnit[], shadowMergedRenderUnits?: FoliageRenderUnit[], lodInfoList?: FoliageLODInfo[]): FoliageTypeAllocation;
    /**
     * [KO] 카메라 위치, 절두체 평면, 그림자 캐스케이드 정보 및 타입별 인스턴스 수를 통합 글로벌 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates the unified global uniform buffer with camera position, frustum planes, shadow cascade data, and per-type instance counts.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 렌더 뷰 상태 데이터
     * [EN] Render view state data for the current frame
     * @param fovFactor -
     * [KO] 카메라 시야각 탄젠트 계수(`tan(fov * 0.5)`)
     * [EN] Camera field-of-view tangent factor (`tan(fov * 0.5)`)
     * @param viewProjectionMatrix -
     * [KO] 뷰-프로젝션 결합 행렬(`mat4` 또는 `null`)
     * [EN] Combined view-projection matrix (`mat4` or `null`)
     * @param depthBias -
     * [KO] HZB 오클루전 테스트 깊이 바이어스 (기본값: `0.002`)
     * [EN] HZB occlusion test depth bias (default: `0.002`)
     */
    updateUnifiedGlobalUniforms(renderViewStateData: RenderViewStateData, fovFactor: number, viewProjectionMatrix?: mat4 | null, depthBias?: number): void;
    /**
     * [KO] 특정 식생 타입의 컬링 거리, 페이드 구간, 바운딩 치수 및 LOD 전환 거리 정보를 타입 파라미터 버퍼에 기록합니다.
     * [EN] Writes culling distance, fade range, bounding dimensions, and LOD transition distances for a specific foliage type into the type parameters buffer.
     *
     * @param allocation -
     * [KO] 대상 식생 타입 세그먼트 할당 정보
     * [EN] Target foliage type segment allocation info
     * @param cullingDistance -
     * [KO] 최대 컬링 거리(월드 단위)
     * [EN] Maximum culling distance in world units
     * @param fadeStartDistance -
     * [KO] 디더링 페이드 아웃 시작 거리(월드 단위)
     * [EN] Dither fade-out start distance in world units
     * @param boundingRadius -
     * [KO] 바운딩 스피어 반경(월드 단위)
     * [EN] Bounding sphere radius in world units
     * @param bottomOffset -
     * [KO] 하단 수직 오프셋(월드 단위)
     * [EN] Bottom vertical offset in world units
     * @param lodInfoList -
     * [KO] LOD 단계별 메타데이터 배열
     * [EN] Array of metadata per LOD level
     * @param shadowCullDistance -
     * [KO] 그림자 최대 컬링 거리 (기본값: `300.0`)
     * [EN] Maximum shadow culling distance (default: `300.0`)
     * @param height -
     * [KO] 식생 기준 높이 (기본값: `2.0`)
     * [EN] Reference foliage height (default: `2.0`)
     */
    updateTypeParams(allocation: FoliageTypeAllocation, cullingDistance: number, fadeStartDistance: number, boundingRadius: number, bottomOffset: number, lodInfoList: FoliageLODInfo[], shadowCullDistance?: number, height?: number): void;
    /**
     * [KO] 통합 식생 컬링 컴퓨트 패스를 위한 `GPUBindGroup`을 조회하거나 생성하여 반환합니다.
     * [EN] Retrieves or creates the `GPUBindGroup` for the unified foliage culling compute pass.
     *
     * @param layout -
     * [KO] 컬링 파이프라인의 `GPUBindGroupLayout`
     * [EN] `GPUBindGroupLayout` of the culling pipeline
     * @param hzbTextureView -
     * [KO] 계층적 Z-버퍼(HZB) 텍스처 뷰 (선택)
     * [EN] Hierarchical Z-buffer (HZB) texture view (optional)
     * @param hzbSampler -
     * [KO] HZB 샘플러 (선택)
     * [EN] HZB sampler (optional)
     * @returns
     * [KO] 생성 또는 캐시된 `GPUBindGroup` 인스턴스 (버퍼 미준비 시 `null`)
     * [EN] Created or cached `GPUBindGroup` instance (`null` if buffers are not ready)
     */
    getOrCreateUnifiedCullingBindGroup(layout: GPUBindGroupLayout, hzbTextureView?: GPUTextureView | null, hzbSampler?: GPUSampler | null): GPUBindGroup | null;
    /**
     * [KO] 캐싱된 통합 컬링 바인드 그룹을 무효화합니다.
     * [EN] Invalidates the cached unified culling bind group.
     */
    invalidateUnifiedCullingBindGroup(): void;
    /**
     * [KO] 메가 버퍼 수용량이 확장될 때 메인 및 그림자 컬링 출력 GPU 버퍼를 재할당합니다.
     * [EN] Reallocates main and shadow culled output GPU buffers when mega buffer capacity expands.
     *
     * @param newCapacity -
     * [KO] 확장된 새 인스턴스 수용량
     * [EN] New expanded instance capacity
     */
    onResizeBuffers(newCapacity: number): void;
    /**
     * [KO] 메가 버퍼가 파괴될 때 그림자 및 글로벌 유니폼 관련 GPU 리소스를 정리합니다.
     * [EN] Cleans up shadow and global uniform GPU resources when the mega buffer is destroyed.
     */
    onDestroy(): void;
    /**
     * [KO] 그림자 간접 드로우 버퍼를 리셋 템플릿 버퍼로부터 복사하여 초기화합니다.
     * [EN] Resets the shadow indirect draw buffer by copying from the reset template buffer.
     *
     * @param commandEncoder -
     * [KO] 복사에 사용할 `GPUCommandEncoder` 인스턴스 (`null`인 경우 큐 직접 쓰기 수행)
     * [EN] `GPUCommandEncoder` instance to use for copying (performs direct queue write if `null`)
     */
    onResetMultiIndirectCommands(commandEncoder: GPUCommandEncoder | null): void;
}
export default FoliageMegaBuffer;
