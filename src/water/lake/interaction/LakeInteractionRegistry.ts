import type Mesh from "../../../display/mesh/Mesh";

/**
 * [KO] 수면과 상호작용(파동 생성)할 메시를 전역으로 등록·관리하는 정적 레지스트리입니다.
 * [EN] Static registry that globally registers and manages meshes that interact with water surfaces (generate waves).
 *
 * ### Example
 * ```typescript
 * RedGPU.Water.Interaction.LakeInteractionRegistry.register(characterMesh);
 * RedGPU.Water.Interaction.LakeInteractionRegistry.unregister(characterMesh);
 * ```
 *
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @category Water
 */
class LakeInteractionRegistry {
    static #meshes: Set<Mesh> = new Set();
    static #firstMesh: Mesh | null = null;

    /**
     * [KO] 등록된 상호작용 메시 집합(`ReadonlySet<Mesh>`)을 반환합니다.
     * [EN] Returns the set of registered interaction meshes (`ReadonlySet<Mesh>`).
     *
     * @returns
     * [KO] 등록된 메시 집합
     * [EN] Set of registered meshes
     */
    static get meshes(): ReadonlySet<Mesh> {
        return this.#meshes;
    }

    /**
     * [KO] 가장 먼저 등록된 메시를 반환합니다. 등록된 메시가 없으면 `null`입니다.
     * [EN] Returns the first registered mesh, or `null` if none are registered.
     *
     * @returns
     * [KO] 첫 번째 등록 메시 또는 `null`
     * [EN] First registered mesh or `null`
     */
    static get firstMesh(): Mesh | null {
        return this.#firstMesh;
    }

    /**
     * [KO] 메시를 상호작용 대상으로 등록합니다. 첫 등록 메시는 `firstMesh`로 지정됩니다.
     * [EN] Registers a mesh as an interaction target. The first registered mesh becomes `firstMesh`.
     *
     * ### Example
     * ```typescript
     * RedGPU.Water.Interaction.LakeInteractionRegistry.register(mesh);
     * ```
     *
     * @param mesh -
     * [KO] 등록할 메시
     * [EN] Mesh to register
     */
    static register(mesh: Mesh): void {
        this.#meshes.add(mesh);
        if (!this.#firstMesh) {
            this.#firstMesh = mesh;
        }
    }

    /**
     * [KO] 메시 등록을 해제합니다. 해제된 메시가 `firstMesh`였다면 남은 메시 중 첫 번째로 교체됩니다.
     * [EN] Unregisters a mesh. If it was `firstMesh`, it is replaced by the first remaining mesh.
     *
     * @param mesh -
     * [KO] 등록 해제할 메시
     * [EN] Mesh to unregister
     */
    static unregister(mesh: Mesh): void {
        this.#meshes.delete(mesh);
        if (this.#firstMesh === mesh) {
            this.#firstMesh = this.#meshes.size > 0 ? this.#meshes.values().next().value : null;
        }
    }

    /**
     * [KO] 등록된 모든 메시를 제거하고 `firstMesh`를 `null`로 초기화합니다.
     * [EN] Removes all registered meshes and resets `firstMesh` to `null`.
     */
    static clear(): void {
        this.#meshes.clear();
        this.#firstMesh = null;
    }
}

Object.freeze(LakeInteractionRegistry);
export default LakeInteractionRegistry;
