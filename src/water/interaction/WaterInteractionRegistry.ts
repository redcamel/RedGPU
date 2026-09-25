import type Mesh from "../../display/mesh/Mesh";

export class WaterInteractionRegistry {
    static readonly #meshes: Set<Mesh> = new Set();

    static get meshes(): ReadonlySet<Mesh> {
        return this.#meshes;
    }

    static register(mesh: Mesh): void {
        this.#meshes.add(mesh);
    }

    static unregister(mesh: Mesh): void {
        this.#meshes.delete(mesh);
    }

    static clear(): void {
        this.#meshes.clear();
    }
}
