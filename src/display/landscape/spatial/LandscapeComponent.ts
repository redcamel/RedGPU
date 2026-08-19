export class LandscapeComponent {
    #worldX: number = 0;
    #worldZ: number = 0;
    #prevWorldX: number = 0;
    #prevWorldZ: number = 0;
    #componentX: number = 0;
    #componentZ: number = 0;
    #lodLevel: number = 0;
    #key: string = '';

    constructor(
        worldX: number = 0,
        worldZ: number = 0,
        componentX: number = 0,
        componentZ: number = 0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#prevWorldX = worldX;
        this.#prevWorldZ = worldZ;
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

    set worldX(val: number) {
        this.#prevWorldX = this.#worldX;
        this.#worldX = val;
    }

    get worldZ(): number {
        return this.#worldZ;
    }

    set worldZ(val: number) {
        this.#prevWorldZ = this.#worldZ;
        this.#worldZ = val;
    }

    get prevWorldX(): number {
        return this.#prevWorldX;
    }

    get prevWorldZ(): number {
        return this.#prevWorldZ;
    }

    get componentX(): number {
        return this.#componentX;
    }

    set componentX(val: number) {
        this.#componentX = val;
        this.#key = `${this.#componentZ}_${val}`;
    }

    get componentZ(): number {
        return this.#componentZ;
    }

    set componentZ(val: number) {
        this.#componentZ = val;
        this.#key = `${val}_${this.#componentX}`;
    }

    updatePrevPosition(): void {
        this.#prevWorldX = this.#worldX;
        this.#prevWorldZ = this.#worldZ;
    }

    get lodLevel(): number {
        return this.#lodLevel;
    }

    set lodLevel(val: number) {
        this.#lodLevel = val;
    }
}

export default LandscapeComponent;
