[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / WGSLUniformTypes

# Class: WGSLUniformTypes

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L37)

Static class providing type metadata (size, alignment, TypedArray mapping, etc.) for WGSL shader variables and uniform structs.

## Constructors

### Constructor

> **new WGSLUniformTypes**(): `WGSLUniformTypes`

#### Returns

`WGSLUniformTypes`

## Accessors

### f16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **f16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L66)

`f16` scalar type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L58)

`f32` scalar type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### i32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L42)

`i32` scalar type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x2f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat2x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L170)

`mat2x2<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x2u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat2x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L178)

`mat2x2<u16>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x3f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat2x3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:226](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L226)

`mat2x3<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x3u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat2x3u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L234)

`mat2x3<u16>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x2f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat3x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L186)

`mat3x2<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x2u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat3x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:194](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L194)

`mat3x2<u16>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x3f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat3x3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L202)

`mat3x3<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x2f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat4x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:210](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L210)

`mat4x2<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x2u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat4x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L218)

`mat4x2<u16>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x4f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat4x4f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L242)

`mat4x4<f32>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x4u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **mat4x4u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:250](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L250)

`mat4x4<u16>` matrix type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### u32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L50)

`u32` scalar type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L74)

`vec2<f32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2i32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec2i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L82)

`vec2<i32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L98)

`vec2<u16>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2u32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec2u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L90)

`vec2<u32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L122)

`vec3<f32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3i32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec3i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L106)

`vec3<i32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec3u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L130)

`vec3<u16>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3u32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec3u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L114)

`vec3<u32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4f32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec4f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L154)

`vec4<f32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4i32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec4i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L138)

`vec4<i32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4u16

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec4u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L162)

`vec4<u16>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4u32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **vec4u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/wgslParser/core/WGSLUniformTypes.ts#L146)

`vec4<u32>` vector type metadata

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)
