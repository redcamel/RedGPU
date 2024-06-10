import TypeSize from "../TypeSize";

class InterleaveUnit {
	static #VERTEX_POSITION = 'vertexPosition'
	static #VERTEX_NORMAL = 'vertexNormal'
	static #VERTEX_COLOR = 'vertexColor'
	static #TEXCOORD = 'texcoord'
	#attributeHint: string
	#format: GPUVertexFormat | GPUIndexFormat
	#stride: GPUSize64

	constructor(attributeHint: string, format: GPUVertexFormat | GPUIndexFormat) {
		this.#attributeHint = attributeHint;
		this.#format = format;
		this.#stride = TypeSize[format];
	}

	static get VERTEX_POSITION(): string {
		return this.#VERTEX_POSITION;
	}

	static get VERTEX_NORMAL(): string {
		return this.#VERTEX_NORMAL;
	}

	static get VERTEX_COLOR(): string {
		return this.#VERTEX_COLOR;
	}

	static get TEXCOORD(): string {
		return this.#TEXCOORD;
	}

	get attributeHint(): string {
		return this.#attributeHint;
	}

	get format(): GPUVertexFormat | GPUIndexFormat {
		return this.#format;
	}

	get stride(): GPUSize64 {
		return this.#stride;
	}
}

export default InterleaveUnit
