import type Mesh from "../../mesh/Mesh";

/**
 * [KO] 실시간 물(WaterLake) 상호작용 대상 메쉬들의 전용 중앙 레지스트리
 * [EN] Dedicated central registry for real-time water (WaterLake) interactive meshes
 */
export class WaterInteractionRegistry {
    static readonly #meshes: Set<Mesh> = new Set();

    /**
     * [KO] 현재 등록된 모든 물 상호작용 메쉬 목록을 반환합니다.
     * [EN] Returns all currently registered water interactive meshes.
     */
    static get meshes(): ReadonlySet<Mesh> {
        return this.#meshes;
    }

    /**
     * [KO] 물 상호작용 대상 메쉬를 등록합니다.
     * [EN] Registers a mesh for water interaction.
     */
    static register(mesh: Mesh): void {
        this.#meshes.add(mesh);
    }

    /**
     * [KO] 물 상호작용 대상 메쉬 등록을 해제합니다.
     * [EN] Unregisters a mesh from water interaction.
     */
    static unregister(mesh: Mesh): void {
        this.#meshes.delete(mesh);
    }

    /**
     * [KO] 등록된 모든 메쉬를 비웁니다.
     * [EN] Clears all registered meshes.
     */
    static clear(): void {
        this.#meshes.clear();
    }
}
