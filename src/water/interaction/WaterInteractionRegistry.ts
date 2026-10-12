import type Mesh from "../../display/mesh/Mesh";

class WaterInteractionRegistry {
    static #meshes: Set<Mesh> = new Set();
    static #firstMesh: Mesh | null = null;

    static get meshes(): ReadonlySet<Mesh> {
        return this.#meshes;
    }

    static get firstMesh(): Mesh | null {
        return this.#firstMesh;
    }

    static register(mesh: Mesh): void {
        this.#meshes.add(mesh);
        if (!this.#firstMesh) {
            this.#firstMesh = mesh;
        }
    }

    static unregister(mesh: Mesh): void {
        this.#meshes.delete(mesh);
        if (this.#firstMesh === mesh) {
            this.#firstMesh = this.#meshes.size > 0 ? this.#meshes.values().next().value : null;
        }
    }

    static clear(): void {
        this.#meshes.clear();
        this.#firstMesh = null;
    }
}

Object.freeze(WaterInteractionRegistry);
export default WaterInteractionRegistry;
