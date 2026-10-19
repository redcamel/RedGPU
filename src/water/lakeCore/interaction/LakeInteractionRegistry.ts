import type Mesh from "../../../display/mesh/Mesh";

/**
 * [KO] 호수 수면과 상호작용할 메시(`Mesh`)를 전역으로 등록 및 관리하는 정적 레지스트리 클래스입니다.
 * [EN] Static registry class that globally registers and manages meshes (`Mesh`) interacting with lake water surfaces.
 *
 * [KO] `mesh.waterInteraction = true` 설정 시 내부적으로 이 레지스트리에 자동 등록됩니다.
 * [EN] Meshes are automatically registered here when `mesh.waterInteraction = true` is set.
 *
 * ::: warning
 * [KO] 이 클래스는 정적 유틸리티 레지스트리이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a static utility registry, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 메시의 waterInteraction 속성을 통한 등록 권장
 * // [EN] Recommended registration via mesh.waterInteraction property
 * characterMesh.waterInteraction = true;
 *
 * // [KO] 레지스트리 직접 제어
 * // [EN] Direct registry control
 * RedGPU.Water.LakeCore.Interaction.LakeInteractionRegistry.register(characterMesh);
 * RedGPU.Water.LakeCore.Interaction.LakeInteractionRegistry.unregister(characterMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/interaction/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @category Water
 */
class LakeInteractionRegistry {
    static #meshes: Set<Mesh> = new Set();
    static #firstMesh: Mesh | null = null;

    /**
     * [KO] 현재 등록된 상호작용 대상 메시 집합(`ReadonlySet<Mesh>`)을 반환합니다.
     * [EN] Returns the set of currently registered interaction target meshes (`ReadonlySet<Mesh>`).
     *
     * @returns
     * [KO] 등록된 메시 집합 (`ReadonlySet<Mesh>`)
     * [EN] Set of registered meshes (`ReadonlySet<Mesh>`)
     */
    static get meshes(): ReadonlySet<Mesh> {
        return this.#meshes;
    }

    /**
     * [KO] 가장 먼저 등록된 상호작용 메시를 반환합니다. 등록된 메시가 없으면 `null`을 반환합니다.
     * [EN] Returns the first registered interaction mesh, or `null` if no mesh is registered.
     *
     * @returns
     * [KO] 첫 번째 등록 메시 또는 `null`
     * [EN] First registered mesh or `null`
     */
    static get firstMesh(): Mesh | null {
        return this.#firstMesh;
    }

    /**
     * [KO] 메시를 호수 수면 상호작용 대상으로 등록합니다. 최초로 등록된 메시는 `firstMesh`로 지정됩니다.
     * [EN] Registers a mesh as a lake surface interaction target. The first registered mesh is assigned as `firstMesh`.
     *
     * ### Example
     * ```typescript
     * RedGPU.Water.LakeCore.Interaction.LakeInteractionRegistry.register(mesh);
     * ```
     *
     * @param mesh -
     * [KO] 등록할 `Mesh` 인스턴스
     * [EN] `Mesh` instance to register
     */
    static register(mesh: Mesh): void {
        this.#meshes.add(mesh);
        if (!this.#firstMesh) {
            this.#firstMesh = mesh;
        }
    }

    /**
     * [KO] 등록된 메시의 상호작용 등록을 해제합니다. 해제된 메시가 `firstMesh`인 경우 남은 메시 중 첫 번째 항목으로 갱신됩니다.
     * [EN] Unregisters a mesh from interaction. If the unregistered mesh was `firstMesh`, it is updated to the first remaining mesh.
     *
     * ### Example
     * ```typescript
     * RedGPU.Water.LakeCore.Interaction.LakeInteractionRegistry.unregister(mesh);
     * ```
     *
     * @param mesh -
     * [KO] 등록 해제할 `Mesh` 인스턴스
     * [EN] `Mesh` instance to unregister
     */
    static unregister(mesh: Mesh): void {
        this.#meshes.delete(mesh);
        if (this.#firstMesh === mesh) {
            this.#firstMesh = this.#meshes.size > 0 ? this.#meshes.values().next().value : null;
        }
    }

    /**
     * [KO] 등록된 모든 상호작용 메시를 제거하고 `firstMesh`를 `null`로 초기화합니다.
     * [EN] Clears all registered interaction meshes and resets `firstMesh` to `null`.
     *
     * ### Example
     * ```typescript
     * RedGPU.Water.LakeCore.Interaction.LakeInteractionRegistry.clear();
     * ```
     */
    static clear(): void {
        this.#meshes.clear();
        this.#firstMesh = null;
    }
}

Object.freeze(LakeInteractionRegistry);
export default LakeInteractionRegistry;
