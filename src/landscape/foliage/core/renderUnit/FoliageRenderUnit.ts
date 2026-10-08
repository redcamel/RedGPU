/**
 * [KO] 식생 개별 렌더 단위(Render Unit) 및 머티리얼 바인딩/유니폼 관리 모듈입니다.
 * [EN] Foliage individual render unit and material binding/uniform management module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import Mesh from "../../../../display/mesh/Mesh";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import AFoliageRenderUnitBase, {type AFoliageRenderUnitBaseInitOptions} from "./AFoliageRenderUnitBase";

/**
 * [KO] Foliage 렌더 패스 유형 ('depthPrepass' 또는 'main')
 * [EN] Foliage render pass type ('depthPrepass' or 'main')
 */
export type FoliageRenderPassType = 'depthPrepass' | 'main';

/**
 * [KO] FoliageRenderUnit 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageRenderUnit.
 */
export interface FoliageRenderUnitInitOptions extends AFoliageRenderUnitBaseInitOptions {
    /**
     * [KO] 소스 메쉬 인스턴스 (필수)
     * [EN] Source mesh instance (required)
     */
    mesh: Mesh;
    /**
     * [KO] 소속 LOD 레벨 인덱스 (필수)
     * [EN] Associated LOD level index (required)
     */
    lodIndex: number;
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
     * [EN] Whether this render unit receives shadows
     */
    receiveShadow?: boolean;
}

/**
 * [KO] AFoliageRenderUnitBase를 상속받아 Foliage 고유의 머티리얼, 유니폼 바인딩, 파이프라인 캐시 및 LOD 상태를 관리하는 식생 렌더 단위 클래스입니다.
 * [EN] Foliage render unit class inheriting AFoliageRenderUnitBase to manage Foliage-specific materials, uniform bindings, pipeline caches, and LOD states.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageRenderUnit extends AFoliageRenderUnitBase {
    #relativeModelMatrix: mat4;
    #relativeNormalMatrix: mat4;

    #isDepthPrepass: boolean;
    #isMainOpaqueOrMasked: boolean;
    #mainDepthMode: FoliageDepthPassMode;
    #isImpostor: boolean;
    #receiveShadow: boolean;

    constructor(init: FoliageRenderUnitInitOptions) {
        super({
            ...init,
            isMasked: init.isMasked ?? true
        });

        this.#relativeModelMatrix = init.relativeModelMatrix;
        this.#relativeNormalMatrix = init.relativeNormalMatrix;

        this.#isDepthPrepass = init.isDepthPrepass;
        this.#isMainOpaqueOrMasked = init.isMainOpaqueOrMasked;
        this.#mainDepthMode = init.mainDepthMode;
        this.#isImpostor = init.isImpostor ?? false;
        this.#receiveShadow = init.receiveShadow !== false;
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
     * [EN] Returns whether this render unit receives shadows.
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
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
        if (material?.dirtyPipeline || !material?.gpuRenderInfo?.fragmentUniformBindGroup) {
            material?._updateFragmentState?.();
            if (material) material.dirtyPipeline = false;
        }

        const cullMode: GPUCullMode = (!this.isMasked)
            ? 'back'
            : (material?.doubleSided ? 'none' : (material?.cullMode ?? 'back'));

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
