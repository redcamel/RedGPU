/**
 * [KO] 식생 개별 렌더 단위(Render Unit) 및 머티리얼 바인딩/유니폼/그림자 병합 통합 관리 모듈입니다.
 * [EN] Unified foliage render unit module managing individual/shadow-merged parts, material bindings, and UBO slots.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import ScatterRenderUnit, {type ScatterRenderUnitInitOptions} from "../../core/scatter/ScatterRenderUnit";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "./pipeline/FoliagePipelineRegistry";
import {FoliageSlotPooler} from "./buffer/FoliageSlotPooler";
import {PBR_STRIDE_BYTES, POSITION_ONLY_STRIDE_BYTES} from "../../core/scatter/ScatterVertexFormats";

/**
 * [KO] Foliage 렌더 패스 유형 ('depthPrepass' 또는 'main')
 * [EN] Foliage render pass type ('depthPrepass' or 'main')
 */
export type FoliageRenderPassType = 'depthPrepass' | 'main';

/**
 * [KO] FoliageRenderUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageRenderUnit.
 */
export interface FoliageRenderUnitInitOptions extends ScatterRenderUnitInitOptions {
    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)
     * [EN] 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023)
     */
    slotIndex?: number;
    /**
     * [KO] 슬롯 풀러 인스턴스
     * [EN] Slot pooler instance
     */
    slotPooler?: FoliageSlotPooler | null;
    /**
     * [KO] 소속 LOD 레벨 인덱스 (기본값: 0)
     * [EN] Associated LOD level index (default: 0)
     */
    lodIndex?: number;
    /**
     * [KO] 상대 모델 변환 행렬
     * [EN] Relative model transform matrix
     */
    relativeModelMatrix?: mat4 | null;
    /**
     * [KO] 뎁스 프리패스 렌더링 대상 여부
     * [EN] Whether rendering in depth prepass
     */
    isDepthPrepass?: boolean;
    /**
     * [KO] 메인 불투명/마스크 패스 렌더링 대상 여부
     * [EN] Whether rendering in main opaque/masked pass
     */
    isMainOpaqueOrMasked?: boolean;
    /**
     * [KO] 메인 뎁스 패스 모드
     * [EN] Main depth pass mode
     */
    mainDepthMode?: FoliageDepthPassMode;
    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부
     * [EN] Whether this is an octahedral impostor mesh
     */
    isImpostor?: boolean;
    /**
     * [KO] 그림자 패스 전용 통합(Position-only) 렌더 단위 여부 (기본값: false)
     * [EN] Whether this is a merged (position-only) render unit dedicated to the shadow pass (default: false)
     */
    isShadowMerged?: boolean;
}

/**
 * [KO] ScatterRenderUnit을 직접 상속받아 일반 식생 렌더링과 그림자 병합 렌더링을 단일 클래스로 일원화(SSOT)한 식생 렌더 단위 클래스입니다.
 * [EN] Unified foliage render unit class directly extending ScatterRenderUnit (SSOT), managing both regular and shadow-merged rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageRenderUnit extends ScatterRenderUnit {
    #slotIndex: number = -1;
    #slotPooler: FoliageSlotPooler | null = null;
    #isShadowMerged: boolean = false;

    #relativeModelMatrix: mat4 | null = null;

    #isDepthPrepass: boolean = false;
    #isMainOpaqueOrMasked: boolean = true;
    #mainDepthMode: FoliageDepthPassMode = 'normal';
    #isImpostor: boolean = false;

    constructor(init: FoliageRenderUnitInitOptions) {
        const {
            isShadowMerged = false,
            strideBytes = isShadowMerged ? POSITION_ONLY_STRIDE_BYTES : PBR_STRIDE_BYTES,
            isMasked = !isShadowMerged,
            indexFormat = 'uint32',
            instanceBufferOffset = 0,
            indirectOffsetBytes = 0,
            slotIndex = -1,
            slotPooler = null,
            relativeModelMatrix = null,
            isDepthPrepass = false,
            isMainOpaqueOrMasked = !isShadowMerged,
            mainDepthMode = 'normal',
            isImpostor = false,
        } = init;

        super({
            ...init,
            strideBytes,
            isMasked,
            indexFormat,
            instanceBufferOffset,
            indirectOffsetBytes,
        });

        this.#isShadowMerged = isShadowMerged;
        this.#slotIndex = slotIndex;
        this.#slotPooler = slotPooler;

        this.#relativeModelMatrix = relativeModelMatrix;

        this.#isDepthPrepass = isDepthPrepass;
        this.#isMainOpaqueOrMasked = isMainOpaqueOrMasked;
        this.#mainDepthMode = mainDepthMode;
        this.#isImpostor = isImpostor;
    }

    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)를 반환합니다.
     * [EN] Returns the 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023).
     */
    get slotIndex(): number {
        return this.#slotIndex;
    }

    /**
     * [KO] 슬롯 풀러 인스턴스를 반환합니다.
     * [EN] Returns the slot pooler instance.
     */
    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    /**
     * [KO] 그림자 패스 전용 통합(Position-only) 렌더 단위 여부를 반환합니다.
     * [EN] Returns whether this unit is dedicated to shadow pass merged geometry.
     */
    get isShadowMerged(): boolean {
        return this.#isShadowMerged;
    }

    /**
     * [KO] 상대 모델 변환 행렬을 반환합니다.
     * [EN] Returns the relative model transform matrix.
     */
    get relativeModelMatrix(): mat4 | null {
        return this.#relativeModelMatrix;
    }

    /**
     * [KO] 메인 뎁스 패스 모드를 반환합니다.
     * [EN] Returns the main depth pass mode.
     */
    get mainDepthMode(): FoliageDepthPassMode {
        return this.#mainDepthMode;
    }

    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부를 반환합니다.
     * [EN] Returns whether this is an octahedral impostor mesh.
     */
    get isImpostor(): boolean {
        return this.#isImpostor;
    }

    /**
     * [KO] 인스턴스별 바람 강도 배수, 잔잎 떨림 배수 및 수목 높이를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes per-instance wind multiplier, flutter multiplier, and tree height to uniform buffer. (Zero-GC)
     * @param windMultiplier - 인스턴스별 바람 강도 배수
     * @param windFlutterMultiplier - 인스턴스별 잔잎 흔들림 배수
     * @param treeHeight - 식생 전체 높이
     */
    updateWindMultipliers(
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateWindParams(
                this.#slotIndex,
                windMultiplier,
                windFlutterMultiplier,
                treeHeight
            );
        }
    }

    /**
     * [KO] 지면 높이 기반 블렌딩 파라미터를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes ground blend parameters to the uniform buffer. (Zero-GC)
     * @param groundBlendStrength - 지면 블렌드 강도
     * @param groundBlendRange - 지면 블렌드 높이 범위
     */
    updateGroundBlendParams(
        groundBlendStrength: number,
        groundBlendRange: number
    ): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateGroundBlendParams(
                this.#slotIndex,
                groundBlendStrength,
                groundBlendRange
            );
        }
    }

    /**
     * [KO] 그림자 수신 여부를 유니폼 버퍼에 기록합니다. (Zero-GC)
     * [EN] Writes shadow receiving flag to the uniform buffer. (Zero-GC)
     * @param receiveShadow - 그림자 수신 여부
     */
    updateReceiveShadow(receiveShadow: boolean): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.updateReceiveShadow(this.#slotIndex, receiveShadow);
        }
    }

    /**
     * [KO] 이 렌더 단위의 UBO 슬롯 파라미터를 GPU로 단일 플러시합니다 (프레임 지연 배칭 전용).
     * [EN] Flushes UBO slot parameters of this render unit to GPU (for deferred frame batching).
     */
    flushSlotUBO(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.flushSlotBytes(this.#slotIndex);
        }
    }

    /**
     * [KO] 렌더 단위 리소스 및 할당된 UBO 슬롯을 해제합니다.
     * [EN] Releases render unit resources and allocated UBO slot.
     */
    override destroy(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.freeSlot(this.#slotIndex);
            this.#slotIndex = -1;
        }
        this.#slotPooler = null;
        super.destroy();
    }

    /**
     * [KO] 특정 렌더 패스(depthPrepass 또는 main)에서 이 렌더 단위를 렌더링할 수 있는지 여부를 판별합니다.
     * [EN] Determines whether this render unit can be rendered in a specific render pass (depthPrepass or main).
     * @param passType -
     * [KO] 렌더 패스 유형 ('depthPrepass' | 'main')
     * [EN] Render pass type ('depthPrepass' | 'main')
     * @returns
     * [KO] 해당 패스에서 렌더 가능 여부
     * [EN] Whether rendering is allowed in the pass
     */
    canRenderInPass(passType: FoliageRenderPassType): boolean {
        if (this.#isShadowMerged) return false;
        switch (passType) {
            case 'depthPrepass':
                return this.#isDepthPrepass;
            case 'main':
                return this.#isMainOpaqueOrMasked;
            default:
                return false;
        }
    }

    /**
     * [KO] MSAA 설정 및 뎁스 패스 모드에 대응하는 WebGPU 렌더 파이프라인을 조회하거나 생성하여 캐싱합니다.
     * [EN] Retrieves or creates and caches the WebGPU render pipeline matching MSAA configuration and depth pass mode.
     * @param registry -
     * [KO] 식생 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 식별자 키
     * [EN] MSAA identifier key
     * @param depthPassMode -
     * [KO] 뎁스 패스 모드
     * [EN] Depth pass mode
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 단위 바인드 그룹 레이아웃
     * [EN] Render unit bind group layout
     * @returns
     * [KO] 캐시되거나 생성된 렌더 파이프라인 (실패 시 null)
     * [EN] Cached or created render pipeline (null on failure)
     */
    getPipeline(
        registry: FoliagePipelineRegistry,
        sampleCount: number,
        msaaID: string,
        depthPassMode: FoliageDepthPassMode,
        renderUnitBindGroupLayout: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        const material = this.material;
        if (!material) return null;

        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState?.();
            material.dirtyPipeline = false;
        }

        const cullMode: GPUCullMode = (!this.isMasked)
            ? 'back'
            : (material.doubleSided ? 'none' : (material.cullMode ?? 'back'));

        return registry.getOrCreatePipeline(
            material,
            sampleCount,
            msaaID,
            this.strideBytes,
            cullMode,
            depthPassMode,
            renderUnitBindGroupLayout,
            this.isMasked
        ) || null;
    }
}

Object.freeze(FoliageRenderUnit);
export default FoliageRenderUnit;
