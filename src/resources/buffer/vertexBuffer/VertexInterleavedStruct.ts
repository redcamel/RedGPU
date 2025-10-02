import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import {TypeInterleave} from "./VertexInterleaveType";
import VertexInterleavedStructElement from "./core/VertexInterleavedStructElement";

/**
 * Represents a structure for interleaving vertex attributes.
 * @category Buffer
 */
export default class VertexInterleavedStruct {
	#define: Record<string, VertexInterleavedStructElement>;
	readonly #name: string = ''
	#attributes = []
	#arrayStride: number = 0

	constructor(attributes: Record<string, TypeInterleave>, name: string = '') {
		this.#name = name;
		this.#initializeDefine(attributes);
		this.#initializeAttributes();
	}

	get label(): string {
		return this.#name;
	}

	get attributes() {
		return this.#attributes;
	}

	get arrayStride(): number {
		return this.#arrayStride;
	}

	get define(): Record<string, VertexInterleavedStructElement> {
		return {...this.#define};
	}

	/**
	 * Initializes the #define property with the given attributes.
	 *
	 * @param {Record<string, TypeInterleave>} attributes - The attributes to initialize #define with.

	 */
	#initializeDefine(attributes: Record<string, TypeInterleave>) {
		let temp = {};
		for (const attributeName in attributes) {
			const gpuVertexFormat = attributes[attributeName];
			// if (!validFormats.includes(gpuVertexFormat)) {
			//TODO
			// 	consoleAndThrowError(`Invalid vertex format: ${gpuVertexFormat}`);
			// }
			const attributeStride = gpuVertexFormat.stride;
			temp[attributeName] = new VertexInterleavedStructElement(attributeName, attributeStride, gpuVertexFormat)
			if (attributeStride % 4 !== 0) {
				consoleAndThrowError(`Invalid attribute stride: ${attributeStride}`);
			}
		}
		this.#define = temp;
	}

	/**
	 * Initializes the attributes of the object.
	 *

	 */
	#initializeAttributes() {
		this.#arrayStride = 0;
		this.#attributes = [];
		for (const [attributeName, {attributeStride, interleaveType}] of Object.entries(this.#define)) {
			this.#attributes.push({
				attributeName,
				shaderLocation: this.#attributes.length,
				offset: this.#arrayStride,
				format: interleaveType.gpuVertexFormat
			});
			this.#arrayStride += attributeStride;
		}
	}
}

