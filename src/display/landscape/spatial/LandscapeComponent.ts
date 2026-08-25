export class LandscapeComponent {
    readonly #worldX: number = 0;
    readonly #worldZ: number = 0;
    readonly #componentX: number = 0;
    readonly #componentZ: number = 0;
    readonly #key: string = '';

    constructor(
        worldX: number = 0,
        worldZ: number = 0,
        componentX: number = 0,
        componentZ: number = 0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#componentX = componentX;
        this.#componentZ = componentZ;
        this.#key = `${componentZ}_${componentX}`;
    }

    get key(): string {
        return this.#key;
    }

    get worldX(): number {
        return this.#worldX;
    }

    get worldZ(): number {
        return this.#worldZ;
    }

    get componentX(): number {
        return this.#componentX;
    }

    get componentZ(): number {
        return this.#componentZ;
    }
}

export default LandscapeComponent;
