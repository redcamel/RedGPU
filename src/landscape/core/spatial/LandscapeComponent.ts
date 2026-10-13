class LandscapeComponent {
    #worldX: number = 0;
    #worldZ: number = 0;
    #componentX: number = 0;
    #componentZ: number = 0;
    #minHeightNorm: number = 0.0;
    #maxHeightNorm: number = 1.0;
    #key: string = '';

    constructor(
        worldX: number = 0,
        worldZ: number = 0,
        componentX: number = 0,
        componentZ: number = 0,
        minHeightNorm: number = 0.0,
        maxHeightNorm: number = 1.0
    ) {
        this.#worldX = worldX;
        this.#worldZ = worldZ;
        this.#componentX = componentX;
        this.#componentZ = componentZ;
        this.#minHeightNorm = minHeightNorm;
        this.#maxHeightNorm = maxHeightNorm;
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

    get minHeightNorm(): number {
        return this.#minHeightNorm;
    }

    get maxHeightNorm(): number {
        return this.#maxHeightNorm;
    }

    setHeightBounds(minHeightNorm: number, maxHeightNorm: number): void {
        this.#minHeightNorm = minHeightNorm;
        this.#maxHeightNorm = maxHeightNorm;
    }
}

Object.freeze(LandscapeComponent);
export default LandscapeComponent;

