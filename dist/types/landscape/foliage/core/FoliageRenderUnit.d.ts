import ScatterRenderUnit, { type ScatterRenderUnitInitOptions } from "../../core/scatter/ScatterRenderUnit";
import FoliagePipelineRegistry, { type FoliageDepthPassMode } from "./pipeline/FoliagePipelineRegistry";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
/**
 * [KO] 식생 렌더 유닛이 참여하는 렌더 패스 유형입니다.
 * [EN] Render pass type in which a foliage render unit participates.
 * @category Landscape
 */
export type FoliageRenderPassType = 'depthPrepass' | 'main';
/**
 * [KO] `FoliageRenderUnit` 생성을 위한 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for creating a `FoliageRenderUnit`.
 * @category Landscape
 */
export interface FoliageRenderUnitInitOptions extends ScatterRenderUnitInitOptions {
    /**
     * [KO] 동적 유니폼 메가 버퍼 내 할당된 슬롯 인덱스
     * [EN] Allocated slot index within the dynamic uniform mega buffer
     */
    slotIndex?: number;
    /**
     * [KO] 슬롯 할당 및 유니폼 갱신을 담당하는 `FoliageSlotPooler` 인스턴스
     * [EN] `FoliageSlotPooler` instance responsible for slot allocation and uniform updates
     */
    slotPooler?: FoliageSlotPooler | null;
    /**
     * [KO] 깊이 프리패스(Depth Prepass) 렌더링 참여 여부
     * [EN] Whether this unit participates in depth prepass rendering
     */
    isDepthPrepass?: boolean;
    /**
     * [KO] 메인 패스에서의 깊이 테스트 모드
     * [EN] Depth test mode during the main pass
     */
    mainDepthMode?: FoliageDepthPassMode;
    /**
     * [KO] 팔면체 임포스터(Octahedral Impostor) 렌더 유닛 여부
     * [EN] Whether this render unit is an octahedral impostor
     */
    isImpostor?: boolean;
    /**
     * [KO] 그림자 전용 병합 지오메트리 렌더 유닛 여부
     * [EN] Whether this render unit uses merged shadow-only geometry
     */
    isShadowMerged?: boolean;
}
/**
 * [KO] 식생(Foliage)의 개별 서브메시 또는 임포스터 드로우 단위를 나타내는 렌더 유닛 클래스입니다.
 * [EN] Render unit class representing an individual submesh or impostor draw unit of foliage.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliageRenderUnit extends ScatterRenderUnit {
    #private;
    /**
     * [KO] `FoliageRenderUnit` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageRenderUnit` instance.
     *
     * @param init -
     * [KO] 렌더 유닛 초기화 옵션
     * [EN] Render unit initialization options
     */
    constructor(init: FoliageRenderUnitInitOptions);
    /**
     * [KO] 할당된 동적 유니폼 슬롯 인덱스를 반환합니다.
     * [EN] Returns the allocated dynamic uniform slot index.
     *
     * @returns
     * [KO] 슬롯 인덱스 (미할당 시 `-1`)
     * [EN] Slot index (`-1` if unallocated)
     */
    get slotIndex(): number;
    /**
     * [KO] 메인 패스에서의 깊이 테스트 모드를 반환합니다.
     * [EN] Returns the depth test mode used in the main pass.
     *
     * @returns
     * [KO] 깊이 패스 모드(`FoliageDepthPassMode`)
     * [EN] Depth pass mode (`FoliageDepthPassMode`)
     */
    get mainDepthMode(): FoliageDepthPassMode;
    /**
     * [KO] 팔면체 임포스터 렌더 유닛인지 여부를 반환합니다.
     * [EN] Returns whether this render unit is an octahedral impostor unit.
     *
     * @returns
     * [KO] 임포스터 렌더 유닛 여부
     * [EN] Whether this is an impostor render unit
     */
    get isImpostor(): boolean;
    /**
     * [KO] 바람에 의한 줄기 굽힘 및 잎사귀 흔들림 스케일 파라미터를 슬롯 버퍼에 갱신합니다.
     * [EN] Updates wind trunk bend and leaf flutter scale parameters in the slot buffer.
     *
     * @param trunkBendScale -
     * [KO] 줄기 굽힘 강도 배율
     * [EN] Trunk bend strength scale
     * @param leafFlutterScale -
     * [KO] 잎사귀 흔들림 강도 배율
     * [EN] Leaf flutter strength scale
     * @param foliageHeight -
     * [KO] 식생 기준 높이
     * [EN] Reference foliage height
     */
    updateWindScales(trunkBendScale: number, leafFlutterScale: number, foliageHeight: number): void;
    /**
     * [KO] 지형 표면과의 하단 색상 블렌딩 강도 및 범위를 슬롯 버퍼에 갱신합니다.
     * [EN] Updates ground surface color blend strength and range in the slot buffer.
     *
     * @param groundBlendStrength -
     * [KO] 지형 블렌딩 강도 (`0.0` ~ `1.0`)
     * [EN] Ground blend strength (`0.0` to `1.0`)
     * @param groundBlendRange -
     * [KO] 지형 블렌딩 적용 높이 범위(미터 단위)
     * [EN] Ground blend height range in meters
     */
    updateGroundBlendParams(groundBlendStrength: number, groundBlendRange: number): void;
    /**
     * [KO] 그림자 수신 여부를 슬롯 버퍼에 갱신합니다.
     * [EN] Updates the shadow receiving flag in the slot buffer.
     *
     * @param receiveShadow -
     * [KO] 그림자 수신 여부
     * [EN] Whether to receive shadows
     */
    updateReceiveShadow(receiveShadow: boolean): void;
    /**
     * [KO] CPU 슬롯 버퍼의 변경 사항을 GPU 유니폼 버퍼에 업로드합니다.
     * [EN] Uploads changes from the CPU slot buffer to the GPU uniform buffer.
     */
    flushSlotUBO(): void;
    /**
     * [KO] 할당된 유니폼 슬롯을 반환하고 렌더 유닛 리소스를 해제합니다.
     * [EN] Frees the allocated uniform slot and releases render unit resources.
     */
    destroy(): void;
    /**
     * [KO] 지정된 렌더 패스 유형에서 이 렌더 유닛이 렌더링 가능한지 확인합니다.
     * [EN] Checks whether this render unit can be rendered in the specified render pass type.
     *
     * @param passType -
     * [KO] 확인할 렌더 패스 유형(`'depthPrepass'` 또는 `'main'`)
     * [EN] Render pass type to check (`'depthPrepass'` or `'main'`)
     * @returns
     * [KO] 해당 패스에서의 렌더링 가능 여부
     * [EN] Whether rendering is allowed in the specified pass
     */
    canRenderInPass(passType: FoliageRenderPassType): boolean;
    /**
     * [KO] 현재 머티리얼과 렌더 상태에 부합하는 `GPURenderPipeline`을 조회하거나 생성하여 반환합니다.
     * [EN] Retrieves or creates a `GPURenderPipeline` matching the current material and render state.
     *
     * @param registry -
     * [KO] 파이프라인 캐시 레지스트리(`FoliagePipelineRegistry`)
     * [EN] Pipeline cache registry (`FoliagePipelineRegistry`)
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 설정 식별자 문자열
     * [EN] MSAA configuration identifier string
     * @param depthPassMode -
     * [KO] 깊이 패스 동작 모드
     * [EN] Depth pass operation mode
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃
     * [EN] Render unit dynamic uniform bind group layout
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (머티리얼 부재 시 `null`)
     * [EN] Created or cached `GPURenderPipeline` instance (`null` if material is absent)
     */
    getPipeline(registry: FoliagePipelineRegistry, sampleCount: number, msaaID: string, depthPassMode: FoliageDepthPassMode, renderUnitBindGroupLayout: GPUBindGroupLayout | null): GPURenderPipeline | null;
}
export default FoliageRenderUnit;
