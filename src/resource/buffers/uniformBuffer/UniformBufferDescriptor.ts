import throwError from "../../../util/errorFunc/throwError";
import TypeSize from "../TypeSize";

/**
 * UniformBufferDescriptor
 */
class UniformBufferDescriptor {
	#redStruct: []
	#redStructOffsetMap
	#redGpuStructOffsetMap
	#typeArraySize: GPUSize64
	#gpuBufferSize: GPUSize64

	constructor(redStruct = [],) {
		if (!Array.isArray(redStruct)) throwError(`${this.constructor.name} - only allow Array Instance. / inputValue : ${redStruct} { type : ${typeof redStruct} }`);
		this.#redStruct = JSON.parse(JSON.stringify(redStruct));
		this.#redStructOffsetMap = {};
		this.#redGpuStructOffsetMap = {};
		let offset = 0;
		let FLOAT4_SIZE = TypeSize.float32x4;
		const parser = (redStruct) => {
			redStruct.map((v) => {
				if (v['struct']) {
					parseStruct(v)
				} else {
					if (!v.valueName) throwError(`${this.constructor.name} - need valueName / inputValue : ${v.valueName} { type : ${typeof v.valueName} }`);
					if (!v.hasOwnProperty('size')) throwError(`${this.constructor.name} - need size / inputValue : ${v.size} { type : ${typeof v.size} }`);
					if (v.size <= FLOAT4_SIZE) {
						let t0 = Math.floor(offset / FLOAT4_SIZE);
						let t1 = Math.floor((offset + v.size - 1) / FLOAT4_SIZE);
						if (t0 != t1) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
						v.offset = offset;
						// console.log(v.valueName, '결정된 오프셋', offset)
						offset += v.size;
					} else {
						if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
						v.offset = offset;
						offset += v.size;
					}
					this.#redStructOffsetMap[v['valueName']] = v.offset;
				}
				// v._UUID = v.valueName + '_' + UUID.getNextUUID();
			});
		}
		const parseStruct = (redStruct) => {
			let startOffset = offset
			let i = 0
			const len = redStruct['num']
			for (i; i < len; i++) {
				redStruct['struct'].map((v, index) => {
					if (!v.valueName) throwError(`${this.constructor.name} - need valueName / inputValue : ${v.valueName} { type : ${typeof v.valueName} }`);
					if (!v.hasOwnProperty('size')) throwError(`${this.constructor.name} - need size / inputValue : ${v.size} { type : ${typeof v.size} }`);
					if (v.size <= FLOAT4_SIZE) {
						let t0 = Math.floor(offset / FLOAT4_SIZE);
						let t1 = Math.floor((offset + v.size - 1) / FLOAT4_SIZE);
						if (t0 != t1) {
							offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
						}
						if (i === 0 && index === 0) startOffset = offset
						if (i === 0) v.offset = offset;
						offset += v.size;
					} else {
						if (offset % FLOAT4_SIZE) offset += FLOAT4_SIZE - offset % FLOAT4_SIZE;
						if (i === 0 && index === 0) startOffset = offset
						if (i === 0) v.offset = offset;
						offset += v.size;
					}
					if (i === 0) {
						// this.#redStructOffsetMap[v['valueName']] = v.offset;
					}
					if (i === 0 && index === 0) {
						this.#redStructOffsetMap[redStruct['valueName']] = startOffset;
						redStruct['offset'] = startOffset;
					}
				});
			}
		}
		parser(this.#redStruct)
		let t0 = offset % FLOAT4_SIZE;
		this.#gpuBufferSize = (this.#redStruct.length ? (offset + (t0 ? (FLOAT4_SIZE - t0) : 0)) : FLOAT4_SIZE)
		this.#typeArraySize = this.#gpuBufferSize / Float32Array.BYTES_PER_ELEMENT;
		Object.keys(this.#redStructOffsetMap).forEach(key => {
			this.#redGpuStructOffsetMap[key] = this.#redStructOffsetMap[key]
			this.#redStructOffsetMap[key] = this.#redStructOffsetMap[key] / Float32Array.BYTES_PER_ELEMENT
		})
		// console.log(this)
	}

	get redStruct(): [] {
		return this.#redStruct;
	}

	get redStructOffsetMap() {
		return this.#redStructOffsetMap;
	}

	get redGpuStructOffsetMap() {
		return this.#redGpuStructOffsetMap;
	}

	get typeArraySize(): GPUSize64 {
		return this.#typeArraySize;
	}

	get gpuBufferSize(): GPUSize64 {
		return this.#gpuBufferSize;
	}
}

export default UniformBufferDescriptor
