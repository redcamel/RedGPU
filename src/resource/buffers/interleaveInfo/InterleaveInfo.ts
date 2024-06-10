import InterleaveUnit from "./InterleaveUnit";

class InterleaveInfo {
	#stride = 0;
	#arrayStride = 0;
	#attributes = [];

	constructor(dataList: InterleaveUnit[]) {
		dataList.forEach((v, index) => {
			this.#stride += v.stride / Float32Array.BYTES_PER_ELEMENT;
			//
			this.#attributes.push(
				{
					attributeHint: v['attributeHint'],
					shaderLocation: index,
					offset: this.#arrayStride,
					format: v['format']
				}
			);
			this.#arrayStride += v['stride'];
		})
	}

	get stride() {
		return this.#stride;
	}

	get arrayStride(): number {
		return this.#arrayStride;
	}

	get attributes(): any[] {
		return this.#attributes;
	}
}

export default InterleaveInfo
