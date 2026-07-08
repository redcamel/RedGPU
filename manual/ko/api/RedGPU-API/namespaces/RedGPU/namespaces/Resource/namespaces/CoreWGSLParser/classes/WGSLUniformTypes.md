[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / WGSLUniformTypes

# Class: WGSLUniformTypes

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:31](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L31)

WGSL 유니폼 타입을 정의하고 관련 정보를 제공하는 클래스입니다.

각 타입별로 요소 개수, 정렬(align), 크기(size), 그리고 대응되는 TypedArray 생성자(View) 정보를 포함합니다.

## Constructors

### Constructor

> **new WGSLUniformTypes**(): `WGSLUniformTypes`

#### Returns

`WGSLUniformTypes`

## Accessors

### f16

#### Get Signature

> **get** `static` **f16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:48](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L48)

f16 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### f32

#### Get Signature

> **get** `static` **f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:43](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L43)

f32 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### i32

#### Get Signature

> **get** `static` **i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:33](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L33)

i32 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x2f32

#### Get Signature

> **get** `static` **mat2x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:113](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L113)

`mat2x2<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x2u16

#### Get Signature

> **get** `static` **mat2x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:118](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L118)

`mat2x2<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x3f32

#### Get Signature

> **get** `static` **mat2x3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:148](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L148)

`mat2x3<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat2x3u16

#### Get Signature

> **get** `static` **mat2x3u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:153](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L153)

`mat2x3<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x2f32

#### Get Signature

> **get** `static` **mat3x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:123](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L123)

`mat3x2<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x2u16

#### Get Signature

> **get** `static` **mat3x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:128](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L128)

`mat3x2<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat3x3f32

#### Get Signature

> **get** `static` **mat3x3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:133](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L133)

`mat3x3<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x2f32

#### Get Signature

> **get** `static` **mat4x2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:138](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L138)

`mat4x2<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x2u16

#### Get Signature

> **get** `static` **mat4x2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:143](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L143)

`mat4x2<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x4f32

#### Get Signature

> **get** `static` **mat4x4f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:158](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L158)

`mat4x4<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### mat4x4u16

#### Get Signature

> **get** `static` **mat4x4u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:163](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L163)

`mat4x4<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### u32

#### Get Signature

> **get** `static` **u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:38](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L38)

u32 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2f32

#### Get Signature

> **get** `static` **vec2f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:53](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L53)

`vec2<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2i32

#### Get Signature

> **get** `static` **vec2i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:58](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L58)

`vec2<i32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2u16

#### Get Signature

> **get** `static` **vec2u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:68](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L68)

`vec2<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec2u32

#### Get Signature

> **get** `static` **vec2u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:63](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L63)

`vec2<u32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3f32

#### Get Signature

> **get** `static` **vec3f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:83](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L83)

`vec3<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3i32

#### Get Signature

> **get** `static` **vec3i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:73](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L73)

`vec3<i32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3u16

#### Get Signature

> **get** `static` **vec3u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:88](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L88)

`vec3<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec3u32

#### Get Signature

> **get** `static` **vec3u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:78](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L78)

`vec3<u32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4f32

#### Get Signature

> **get** `static` **vec4f32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:103](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L103)

`vec4<f32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4i32

#### Get Signature

> **get** `static` **vec4i32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:93](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L93)

`vec4<i32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4u16

#### Get Signature

> **get** `static` **vec4u16**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:108](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L108)

`vec4<u16>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)

***

### vec4u32

#### Get Signature

> **get** `static` **vec4u32**(): [`TypeUniform`](../type-aliases/TypeUniform.md)

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:98](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/wgslParser/core/WGSLUniformTypes.ts#L98)

`vec4<u32>` 타입

##### Returns

[`TypeUniform`](../type-aliases/TypeUniform.md)
