/**
 * [KO] 식생 개별 서브메시 및 머티리얼 바인딩/유니폼 관리 모듈입니다.
 * [EN] Foliage individual sub-mesh and material binding/uniform management module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import Mesh from "../../../../display/mesh/Mesh";
import Geometry from "../../../../geometry/Geometry";
import ScatterSubMesh, {type ScatterSubMeshInitOptions} from "../../../core/scatter/ScatterSubMesh";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import {FoliageSubMeshSlotPooler} from "./FoliageSubMeshSlotPooler";

/**
 * [KO] Foliage 렌더 패스 유형 ('depthPrepass' 또는 'main')
 * [EN] Foliage render pass type ('depthPrepass' or 'main')
 */
export type FoliageRenderPassType = 'depthPrepass' | 'main';

/**
 * [KO] FoliageSubMesh 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageSubMesh.
 */
export interface FoliageSubMeshInitOptions extends ScatterSubMeshInitOptions {
    /**
     * [KO] 소스 메쉬 인스턴스
     * [EN] Source mesh instance
     */
    mesh: Mesh;
    /**
     * [KO] 서브메시 지오메트리
     * [EN] Sub-mesh geometry
     */
    geometry: Geometry;
    /**
     * [KO] 서브메시 머티리얼
     * [EN] Sub-mesh material
     */
    material: any;
    /**
     * [KO] 인덱스 개수
     * [EN] Index count
     */
    indexCount: number;
    /**
     * [KO] 정점 개수
     * [EN] Vertex count
     */
    vertexCount: number;
    /**
     * [KO] 인덱스 버퍼 사용 여부
     * [EN] Whether indexed buffer is used
     */
    isIndexed: boolean;
    /**
     * [KO] 인덱스 포맷 (기본값: 'uint32')
     * [EN] Index format (default: 'uint32')
     */
    indexFormat?: GPUIndexFormat;
    /**
     * [KO] 정점 스트라이드 바이트 수
     * [EN] Vertex stride in bytes
     */
    strideBytes: number;
    /**
     * [KO] 밑둥 피벗 보정 바닥 오프셋
     * [EN] Bottom offset relative to pivot
     */
    bottomOffset?: number;
    /**
     * [KO] 상대 모델 변환 행렬
     * [EN] Relative model transform matrix
     */
    relativeModelMatrix: mat4;
    /**
     * [KO] 상대 법선 변환 행렬
     * [EN] Relative normal transform matrix
     */
    relativeNormalMatrix: mat4;
    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)
     * [EN] 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023)
     */
    slotIndex?: number;
    /**
     * [KO] 슬롯 풀러 인스턴스
     * [EN] Slot pooler instance
     */
    slotPooler?: FoliageSubMeshSlotPooler | null;
    /**
     * [KO] 단일 고정 메가 UBO 버퍼
     * [EN] Single fixed mega UBO buffer
     */
    megaUBO?: GPUBuffer | null;
    /**
     * [KO] 소속 LOD 레벨 인덱스
     * [EN] Associated LOD level index
     */
    lodIndex: number;

    /**
     * [KO] 뎁스 프리패스 렌더링 대상 여부
     * [EN] Whether rendering in depth prepass
     */
    isDepthPrepass: boolean;
    /**
     * [KO] 메인 불투명/마스크 패스 렌더링 대상 여부
     * [EN] Whether rendering in main opaque/masked pass
     */
    isMainOpaqueOrMasked: boolean;
    /**
     * [KO] 알파 마스킹(Cutout) 사용 여부
     * [EN] Whether alpha masking (cutout) is used
     */
    isMasked?: boolean;
    /**
     * [KO] 메인 뎁스 패스 모드
     * [EN] Main depth pass mode
     */
    mainDepthMode: FoliageDepthPassMode;
    /**
     * [KO] 옥타헤드럴 임포스터 메쉬 여부
     * [EN] Whether this is an octahedral impostor mesh
     */
    isImpostor?: boolean;
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether this sub-mesh receives shadows
     */
    receiveShadow?: boolean;
}

/**
 * [KO] ScatterSubMesh를 상속받아 Foliage 고유의 머티리얼, 유니폼 바인딩(바람, 지면 블렌드), 파이프라인 캐시 및 LOD 상태를 관리하는 식생 서브메쉬 클래스입니다.
 * [EN] Foliage sub-mesh class inheriting ScatterSubMesh to manage Foliage-specific materials, uniform bindings (wind, ground blend), pipeline caches, and LOD states.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageSubMesh extends ScatterSubMesh {
    #relativeModelMatrix: mat4;
    #relativeNormalMatrix: mat4;
    #slotIndex: number = -1;
    #slotPooler: FoliageSubMeshSlotPooler | null = null;
    #megaUBO: GPUBuffer | null = null;

    #isDepthPrepass: boolean;
    #isMainOpaqueOrMasked: boolean;
    #mainDepthMode: FoliageDepthPassMode;
    #isImpostor: boolean;
    #receiveShadow: boolean;

    #pipelineCacheByMode: Record<string, Record<string, GPURenderPipeline>> = {};

    constructor(init: FoliageSubMeshInitOptions) {
        super({
            ...init,
            isMasked: init.isMasked ?? true
        });

        this.#relativeModelMatrix = init.relativeModelMatrix;
        this.#relativeNormalMatrix = init.relativeNormalMatrix;
        this.#slotIndex = init.slotIndex !== undefined ? init.slotIndex : -1;
        this.#slotPooler = init.slotPooler || null;
        this.#megaUBO = init.megaUBO || null;

        this.#isDepthPrepass = init.isDepthPrepass;
        this.#isMainOpaqueOrMasked = init.isMainOpaqueOrMasked;
        this.#mainDepthMode = init.mainDepthMode;
        this.#isImpostor = init.isImpostor ?? false;
        this.#receiveShadow = init.receiveShadow !== false;
    }

    /**
     * [KO] 256바이트 정렬 Dynamic Offset UBO 슬롯 인덱스 (0 ~ 1023)를 반환합니다.
     * [EN] Returns the 256-byte aligned Dynamic Offset UBO slot index (0 ~ 1023).
     */
    get slotIndex(): number {
        return this.#slotIndex;
    }

    /**
     * [KO] 원본 메쉬 인스턴스를 반환합니다.
     * [EN] Returns the original mesh instance.
     */
    override get mesh(): Mesh {
        return super.mesh as Mesh;
    }

    /**
     * [KO] 상대 모델 변환 행렬을 반환합니다.
     * [EN] Returns the relative model transform matrix.
     */
    get relativeModelMatrix(): mat4 {
        return this.#relativeModelMatrix;
    }

    /**
     * [KO] 상대 법선 변환 행렬을 반환합니다.
     * [EN] Returns the relative normal transform matrix.
     */
    get relativeNormalMatrix(): mat4 {
        return this.#relativeNormalMatrix;
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
     * [KO] 그림자 수신 여부를 반환합니다.
     * [EN] Returns whether this sub-mesh receives shadows.
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }


    /**
     * [KO] 인스턴스별 바람 강도 배수, 잔잎 떨림 배수 및 수목 높이를 유니폼 버퍼에 기록합니다. (16 bytes, Zero-GC)
     * [EN] Writes per-instance wind multiplier, flutter multiplier, and tree height to uniform buffer. (16 bytes, Zero-GC)
     * @param gpuDevice - WebGPU 디바이스 인스턴스
     * @param windMultiplier - 인스턴스별 바람 강도 배수
     * @param windFlutterMultiplier - 인스턴스별 잔잎 흔들림 배수
     * @param treeHeight - 식생 전체 높이
     */
    updateWindMultipliers(
        gpuDevice: GPUDevice,
        windMultiplier: number,
        windFlutterMultiplier: number,
        treeHeight: number
    ): void {
        if (this.#slotPooler && this.#megaUBO && this.#slotIndex >= 0) {
            this.#slotPooler.updateWindParams(
                gpuDevice,
                this.#megaUBO,
                this.#slotIndex,
                windMultiplier,
                windFlutterMultiplier,
                treeHeight
            );
        }
    }

    /**
     * [KO] 지면 높이 기반 블렌딩 파라미터를 유니폼 버퍼에 기록합니다.
     * [EN] Writes ground blend parameters to the uniform buffer.
     * @param gpuDevice -
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     * @param groundBlendStrength -
     * [KO] 지면 블렌드 강도
     * [EN] Ground blend strength
     * @param groundBlendRange -
     * [KO] 지면 블렌드 높이 범위
     * [EN] Ground blend height range
     */
    updateGroundBlendParams(
        gpuDevice: GPUDevice,
        groundBlendStrength: number,
        groundBlendRange: number
    ): void {
        if (this.#slotPooler && this.#megaUBO && this.#slotIndex >= 0) {
            this.#slotPooler.updateGroundBlendParams(
                gpuDevice,
                this.#megaUBO,
                this.#slotIndex,
                groundBlendStrength,
                groundBlendRange
            );
        }
    }

    /**
     * [KO] 특정 렌더 패스(depthPrepass 또는 main)에서 이 서브메쉬를 렌더링할 수 있는지 여부를 판별합니다.
     * [EN] Determines whether this sub-mesh can be rendered in a specific render pass (depthPrepass or main).
     * @param passType -
     * [KO] 렌더 패스 유형 ('depthPrepass' | 'main')
     * [EN] Render pass type ('depthPrepass' | 'main')
     * @returns
     * [KO] 해당 패스에서 렌더 가능 여부
     * [EN] Whether rendering is allowed in the pass
     */
    canRenderInPass(passType: FoliageRenderPassType): boolean {
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
     * @param subMeshBindGroupLayout -
     * [KO] 서브메시 바인드 그룹 레이아웃
     * [EN] Sub-mesh bind group layout
     * @returns
     * [KO] 캐시되거나 생성된 렌더 파이프라인 (실패 시 null)
     * [EN] Cached or created render pipeline (null on failure)
     */
    getPipeline(
        registry: FoliagePipelineRegistry,
        sampleCount: number,
        msaaID: string,
        depthPassMode: FoliageDepthPassMode,
        subMeshBindGroupLayout: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        const material = this.material;
        if (material?.dirtyPipeline || !material?.gpuRenderInfo?.fragmentUniformBindGroup) {
            material?._updateFragmentState?.();
            if (material) material.dirtyPipeline = false;
        }

        let modeMap = this.#pipelineCacheByMode[msaaID];
        if (!modeMap) {
            modeMap = {};
            this.#pipelineCacheByMode[msaaID] = modeMap;
        }

        let pipeline = modeMap[depthPassMode];
        if (!pipeline) {
            const cullMode: GPUCullMode = (!this.isMasked)
                ? 'back'
                : (material?.doubleSided ? 'none' : (material?.cullMode ?? 'back'));

            pipeline = registry.getOrCreatePipeline(
                material,
                sampleCount,
                msaaID,
                this.strideBytes,
                cullMode,
                depthPassMode,
                subMeshBindGroupLayout,
                this.isMasked
            ) || undefined;

            if (pipeline) {
                modeMap[depthPassMode] = pipeline;
            }
        }
        return pipeline || null;
    }

    override destroy(): void {
        if (this.#slotPooler && this.#slotIndex >= 0) {
            this.#slotPooler.freeSlot(this.#slotIndex);
            this.#slotIndex = -1;
        }
        this.#slotPooler = null;
        this.#megaUBO = null;
        this.#pipelineCacheByMode = {};
        super.destroy();
    }
}

Object.freeze(FoliageSubMesh);
export default FoliageSubMesh;
