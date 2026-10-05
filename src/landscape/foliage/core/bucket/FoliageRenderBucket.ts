/**
 * [KO] 식생 서브메시들을 렌더 패스별(LOD0, 뎁스 Fast-Z, Masked Cutout, 메인 포워드, 섀도우 머지)로 분류하고 캐싱하는 전용 버킷 컨테이너 모듈입니다.
 * [EN] Dedicated bucket container module that categorizes and caches foliage sub-meshes by render pass (LOD0, depth Fast-Z, Masked Cutout, main forward, shadow merged).
 * @packageDocumentation
 */
import FoliageSubMesh from "../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";

/**
 * [KO] 식생 인스턴스의 렌더 패스별 서브메시 버킷팅 및 캐싱을 전담 관리하는 컨테이너 클래스입니다.
 * [EN] Container class dedicated to managing render-pass sub-mesh bucketing and caching for foliage instances.
 */
class FoliageRenderBucket {
    #subMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lod0SubMeshes: FoliageSubMesh[] = [];
    #depthPrepassOpaqueSubMeshes: FoliageSubMesh[] = [];
    #depthPrepassMaskedSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #hasMaskedLOD0: boolean = false;

    /**
     * [KO] 모든 LOD 단계를 포함하는 전체 서브메시 목록을 반환합니다.
     * [EN] Returns the list of all sub-meshes across all LOD levels.
     */
    get subMeshes(): FoliageSubMesh[] {
        return this.#subMeshes;
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스용으로 병합 최적화된 서브메시 목록을 반환합니다.
     * [EN] Returns the list of merged sub-meshes optimized for cascaded shadow map (CSM) passes.
     */
    get shadowMergedSubMeshes(): FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }

    /**
     * [KO] 최상위 디테일 단계(LOD 0)에 속하는 서브메시 목록을 반환합니다.
     * [EN] Returns the list of sub-meshes belonging to the highest detail level (LOD 0).
     */
    get lod0SubMeshes(): FoliageSubMesh[] {
        return this.#lod0SubMeshes;
    }

    /**
     * [KO] 뎁스 프리패스에서 Fast-Z로 렌더링되는 불투명(Opaque) 서브메시 목록을 반환합니다.
     * [EN] Returns the list of opaque sub-meshes rendered with Fast-Z in depth prepass.
     */
    get depthPrepassOpaqueSubMeshes(): FoliageSubMesh[] {
        return this.#depthPrepassOpaqueSubMeshes;
    }

    /**
     * [KO] 뎁스 프리패스에서 알파 테스트로 렌더링되는 마스크(Masked) 서브메시 목록을 반환합니다.
     * [EN] Returns the list of masked sub-meshes rendered with alpha testing in depth prepass.
     */
    get depthPrepassMaskedSubMeshes(): FoliageSubMesh[] {
        return this.#depthPrepassMaskedSubMeshes;
    }

    /**
     * [KO] 메인 포워드 렌더 패스에서 렌더링되는 서브메시 목록을 반환합니다.
     * [EN] Returns the list of sub-meshes rendered in the main forward render pass.
     */
    get mainSubMeshes(): FoliageSubMesh[] {
        return this.#mainSubMeshes;
    }

    /**
     * [KO] LOD 0 단계에 알파 마스킹(Cutout) 서브메시가 존재하는지 여부를 반환합니다.
     * [EN] Returns whether alpha masked (cutout) sub-meshes exist in LOD 0.
     */
    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }

    /**
     * [KO] 등록된 총 서브메시 개수를 반환합니다.
     * [EN] Returns the total number of registered sub-meshes.
     */
    get subMeshCount(): number {
        return this.#subMeshes.length;
    }

    /**
     * [KO] 조립된 서브메시와 섀도우 서브메시를 등록하고 초기 버킷팅을 수행합니다.
     * [EN] Registers assembled sub-meshes and shadow sub-meshes and performs initial bucketing.
     * @param subMeshes -
     * [KO] 조립된 기본 서브메시 배열
     * [EN] Assembled base sub-mesh array
     * @param shadowMergedSubMeshes -
     * [KO] 그림자 병합 서브메시 배열
     * [EN] Shadow merged sub-mesh array
     * @param useImpostor -
     * [KO] 임포스터 사용 여부
     * [EN] Whether impostor is enabled
     * @param useDepthPrepass -
     * [KO] 뎁스 프리패스 사용 여부
     * [EN] Whether depth prepass is enabled
     */
    init(
        subMeshes: FoliageSubMesh[],
        shadowMergedSubMeshes: FoliageShadowMergedSubMesh[],
        useImpostor: boolean,
        useDepthPrepass: boolean
    ): void {
        this.#subMeshes = subMeshes;
        this.#shadowMergedSubMeshes = shadowMergedSubMeshes;

        this.#lod0SubMeshes = this.#subMeshes.filter(sub => sub.lodIndex === 0);
        let hasMaskedLOD0 = false;
        const lod0Count = this.#lod0SubMeshes.length;
        for (let i = 0; i < lod0Count; i++) {
            if (this.#lod0SubMeshes[i].isMasked) {
                hasMaskedLOD0 = true;
                break;
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;

        this.updatePassBuckets(useImpostor, useDepthPrepass);
    }

    /**
     * [KO] 임포스터 및 뎁스 프리패스 설정에 따라 렌더 패스별 서브메시 버킷을 재구성합니다.
     * [EN] Reconstructs render pass sub-mesh buckets according to impostor and depth prepass settings.
     * @param useImpostor -
     * [KO] 임포스터 사용 여부
     * [EN] Whether impostor is enabled
     * @param useDepthPrepass -
     * [KO] 뎁스 프리패스 사용 여부
     * [EN] Whether depth prepass is enabled
     */
    updatePassBuckets(useImpostor: boolean, useDepthPrepass: boolean): void {
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassOpaqueList = this.#depthPrepassOpaqueSubMeshes;
        const prepassMaskedList = this.#depthPrepassMaskedSubMeshes;
        const mainList = this.#mainSubMeshes;

        prepassOpaqueList.length = 0;
        prepassMaskedList.length = 0;
        mainList.length = 0;

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImpostor && sub.isImpostor) continue;
            if (useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
                if (!sub.isMasked) {
                    prepassOpaqueList.push(sub);
                } else {
                    prepassMaskedList.push(sub);
                }
            }
            if (sub.canRenderInPass('main')) {
                mainList.push(sub);
            }
        }
    }

    /**
     * [KO] 메인 렌더 패스에서 소비되는 총 간접 드로우콜 수를 계산하여 반환합니다.
     * [EN] Computes and returns the total number of indirect draw calls consumed in the main render pass.
     * @param useDepthPrepass -
     * [KO] 뎁스 프리패스 사용 여부
     * [EN] Whether depth prepass is enabled
     */
    calcDrawCallCount(useDepthPrepass: boolean): number {
        let count = this.#mainSubMeshes.length;
        if (useDepthPrepass) {
            count += this.#depthPrepassOpaqueSubMeshes.length + this.#depthPrepassMaskedSubMeshes.length;
        }
        return count;
    }

    /**
     * [KO] 보관 중인 모든 서브메시 자원을 안전하게 해제합니다.
     * [EN] Safely releases all held sub-mesh resources.
     */
    destroy(): void {
        const subCount = this.#subMeshes.length;
        for (let i = 0; i < subCount; i++) {
            this.#subMeshes[i].destroy();
        }
        this.#subMeshes.length = 0;
        this.#lod0SubMeshes.length = 0;
        this.#depthPrepassOpaqueSubMeshes.length = 0;
        this.#depthPrepassMaskedSubMeshes.length = 0;
        this.#mainSubMeshes.length = 0;

        const shadowCount = this.#shadowMergedSubMeshes.length;
        for (let i = 0; i < shadowCount; i++) {
            this.#shadowMergedSubMeshes[i].destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;
    }
}

Object.freeze(FoliageRenderBucket);
export default FoliageRenderBucket;
