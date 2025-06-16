export type TypedArrayConstructor =
	| Int8ArrayConstructor
	| Uint8ArrayConstructor
	| Int16ArrayConstructor
	| Uint16ArrayConstructor
	| Int32ArrayConstructor
	| Uint32ArrayConstructor
	| Float32ArrayConstructor
	| Float64ArrayConstructor;
export type TypeUniform = {
	numElements: number;
	align: number;
	size: number;
	type: string;
	View: TypedArrayConstructor;
	pad?: number[];
	wgslType: string
};

class UniformType {
	static get i32(): TypeUniform {
		return {numElements: 1, align: 4, size: 4, type: 'i32', wgslType: 'i32', View: Int32Array}
	}

	static get u32(): TypeUniform {
		return {numElements: 1, align: 4, size: 4, type: 'u32', wgslType: 'u32', View: Uint32Array}
	}

	static get f32(): TypeUniform {
		return {numElements: 1, align: 4, size: 4, type: 'f32', wgslType: 'f32', View: Float32Array}
	}

	static get f16(): TypeUniform {
		return {numElements: 1, align: 2, size: 2, type: 'f16', wgslType: 'f16', View: Uint16Array}
	}

	//
	static get vec2f32(): TypeUniform {
		return {numElements: 2, align: 8, size: 8, type: 'f32', wgslType: 'vec2<f32>', View: Float32Array}
	}

	static get vec2i32(): TypeUniform {
		return {numElements: 2, align: 8, size: 8, type: 'i32', wgslType: 'vec2<i32>', View: Int32Array}
	}

	static get vec2u32(): TypeUniform {
		return {numElements: 2, align: 8, size: 8, type: 'u32', wgslType: 'vec2<u32>', View: Uint32Array}
	}

	static get vec2u16(): TypeUniform {
		return {numElements: 2, align: 4, size: 4, type: 'u16', wgslType: 'vec2<u16>', View: Uint16Array}
	}

	//
	static get vec3i32(): TypeUniform {
		return {numElements: 3, align: 16, size: 12, type: 'i32', wgslType: 'vec3<i32>', View: Int32Array}
	}

	static get vec3u32(): TypeUniform {
		return {numElements: 3, align: 16, size: 12, type: 'u32', wgslType: 'vec3<u32>', View: Uint32Array}
	}

	static get vec3f32(): TypeUniform {
		return {numElements: 3, align: 16, size: 12, type: 'f32', wgslType: 'vec3<f32>', View: Float32Array}
	}

	static get vec3u16(): TypeUniform {
		return {numElements: 3, align: 8, size: 6, type: 'u16', wgslType: 'vec3<u16>', View: Uint16Array}
	}

	//
	static get vec4i32(): TypeUniform {
		return {numElements: 4, align: 16, size: 16, type: 'i32', wgslType: 'vec4<i32>', View: Int32Array}
	}

	static get vec4u32(): TypeUniform {
		return {numElements: 4, align: 16, size: 16, type: 'u32', wgslType: 'vec4<u32>', View: Uint32Array}
	}

	static get vec4f32(): TypeUniform {
		return {numElements: 4, align: 16, size: 16, type: 'f32', wgslType: 'vec4<f32>', View: Float32Array}
	}

	static get vec4u16(): TypeUniform {
		return {numElements: 4, align: 8, size: 8, type: 'u16', wgslType: 'vec4<u16>', View: Uint16Array}
	}

	//
	static get mat2x2f32(): TypeUniform {
		return {numElements: 4, align: 8, size: 16, type: 'f32', wgslType: 'mat2x2<f32>', View: Float32Array}
	}

	static get mat2x2u16(): TypeUniform {
		return {numElements: 4, align: 4, size: 8, type: 'u16', wgslType: 'mat2x2<u16>', View: Uint16Array}
	}

	static get mat3x2f32(): TypeUniform {
		return {numElements: 6, align: 8, size: 24, type: 'f32', wgslType: 'mat3x2<f32>', View: Float32Array}
	}

	static get mat3x2u16(): TypeUniform {
		return {numElements: 6, align: 4, size: 12, type: 'u16', wgslType: 'mat3x2<u16>', View: Uint16Array}
	}

	static get mat3x3f32(): TypeUniform {
		return {numElements: 16, align: 16, size: 64, type: 'f32', wgslType: 'mat3x3<f32>', View: Float32Array}
	}

	static get mat4x2f32(): TypeUniform {
		return {numElements: 8, align: 8, size: 32, type: 'f32', wgslType: 'mat4x2<f32>', View: Float32Array}
	}

	static get mat4x2u16(): TypeUniform {
		return {numElements: 8, align: 4, size: 16, type: 'u16', wgslType: 'mat4x2<u16>', View: Uint16Array}
	}

	//
	static get mat2x3f32(): TypeUniform {
		return {numElements: 8, align: 16, size: 32, type: 'f32', wgslType: 'mat2x3<f32>', View: Float32Array}
	}

	static get mat2x3u16(): TypeUniform {
		return {numElements: 8, align: 8, size: 16, type: 'u16', wgslType: 'mat2x3<u16>', View: Uint16Array}
	}

	static get mat4x4f32(): TypeUniform {
		return {numElements: 16, align: 16, size: 64, type: 'f32', wgslType: 'mat4x4<f32>', View: Float32Array}
	}

	static get mat4x4u16(): TypeUniform {
		return {numElements: 16, align: 8, size: 32, type: 'u16', wgslType: 'mat4x4<u16>', View: Uint16Array}
	}
}

Object.freeze(UniformType)
export default UniformType
