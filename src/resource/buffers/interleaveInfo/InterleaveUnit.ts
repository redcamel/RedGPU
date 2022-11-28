import TypeSize from "../TypeSize";

class InterleaveUnit {
    static #VERTEX_POSITION = 'vertexPosition'
    static get VERTEX_POSITION(): string {
        return this.#VERTEX_POSITION;
    }

    static #VERTEX_NORMAL = 'vertexNormal'
    static get VERTEX_NORMAL(): string {
        return this.#VERTEX_NORMAL;
    }

    static #VERTEX_COLOR = 'vertexColor'
    static get VERTEX_COLOR(): string {
        return this.#VERTEX_COLOR;
    }

    static #TEXCOORD = 'texcoord'
    static get TEXCOORD(): string {
        return this.#TEXCOORD;
    }

    #attributeHint: string
    get attributeHint(): string {
        return this.#attributeHint;
    }

    #format: GPUVertexFormat | GPUIndexFormat

    get format(): GPUVertexFormat | GPUIndexFormat {
        return this.#format;
    }

    #stride: GPUSize64

    get stride(): GPUSize64 {
        return this.#stride;
    }

    constructor(attributeHint: string, format: GPUVertexFormat | GPUIndexFormat) {
        this.#attributeHint = attributeHint;
        this.#format = format;
        this.#stride = TypeSize[format];
    }
}

export default InterleaveUnit