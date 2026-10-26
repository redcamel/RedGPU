import type Mesh from "../../../display/mesh/Mesh";
/**
 * [KO] 호수 수면과 상호작용할 메시(`Mesh`)를 전역으로 등록 및 관리하는 클래스입니다.
 * [EN] Class that globally registers and manages meshes (`Mesh`) interacting with lake water surfaces.
 *
 * [KO] `mesh.enableWaterInteraction = true` 설정 시 내부적으로 자동 등록됩니다.
 * [EN] Automatically registered internally when `mesh.enableWaterInteraction = true` is set.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * mesh.enableWaterInteraction = true;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/interaction/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @category Water
 */
declare class LakeInteractionRegistry {
    #private;
    /**
     * [KO] 등록된 상호작용 대상 메시 집합(`ReadonlySet<Mesh>`)을 반환합니다.
     * [EN] Returns the set of registered interaction target meshes (`ReadonlySet<Mesh>`).
     *
     * @returns
     * [KO] 등록된 메시 집합 (`ReadonlySet<Mesh>`)
     * [EN] Set of registered meshes (`ReadonlySet<Mesh>`)
     */
    static get meshes(): ReadonlySet<Mesh>;
    /**
     * [KO] 메시를 수면 상호작용 대상으로 등록합니다.
     * [EN] Registers a mesh as a water surface interaction target.
     *
     * @param mesh -
     * [KO] 등록할 `Mesh` 인스턴스
     * [EN] `Mesh` instance to register
     */
    static register(mesh: Mesh): void;
    /**
     * [KO] 등록된 메시의 상호작용 등록을 해제합니다.
     * [EN] Unregisters a mesh from water surface interaction.
     *
     * @param mesh -
     * [KO] 등록 해제할 `Mesh` 인스턴스
     * [EN] `Mesh` instance to unregister
     */
    static unregister(mesh: Mesh): void;
    /**
     * [KO] 등록된 모든 상호작용 메시를 제거합니다.
     * [EN] Clears all registered interaction meshes.
     */
    static clear(): void;
}
export default LakeInteractionRegistry;
