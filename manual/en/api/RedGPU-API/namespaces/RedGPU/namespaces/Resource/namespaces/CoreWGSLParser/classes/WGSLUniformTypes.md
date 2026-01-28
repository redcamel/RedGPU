[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / WGSLUniformTypes

# Class: WGSLUniformTypes

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:31](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L31)


Class that defines WGSL uniform types and provides related information.


Includes element count, alignment, size, and corresponding TypedArray constructor (View) for each type.

## Constructors

### Constructor

> **new WGSLUniformTypes**(): `WGSLUniformTypes`

#### Returns

`WGSLUniformTypes`

## Accessors

### f16

#### Get Signature

> **get** `static` **f16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:48](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L48)

f16 type

##### Returns

`TypeUniform`

***

### f32

#### Get Signature

> **get** `static` **f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:43](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L43)

f32 type

##### Returns

`TypeUniform`

***

### i32

#### Get Signature

> **get** `static` **i32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:33](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L33)

i32 type

##### Returns

`TypeUniform`

***

### mat2x2f32

#### Get Signature

> **get** `static` **mat2x2f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:113](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L113)

`mat2x2<f32>` type

##### Returns

`TypeUniform`

***

### mat2x2u16

#### Get Signature

> **get** `static` **mat2x2u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:118](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L118)

`mat2x2<u16>` type

##### Returns

`TypeUniform`

***

### mat2x3f32

#### Get Signature

> **get** `static` **mat2x3f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:148](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L148)

`mat2x3<f32>` type

##### Returns

`TypeUniform`

***

### mat2x3u16

#### Get Signature

> **get** `static` **mat2x3u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:153](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L153)

`mat2x3<u16>` type

##### Returns

`TypeUniform`

***

### mat3x2f32

#### Get Signature

> **get** `static` **mat3x2f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:123](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L123)

`mat3x2<f32>` type

##### Returns

`TypeUniform`

***

### mat3x2u16

#### Get Signature

> **get** `static` **mat3x2u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:128](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L128)

`mat3x2<u16>` type

##### Returns

`TypeUniform`

***

### mat3x3f32

#### Get Signature

> **get** `static` **mat3x3f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:133](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L133)

`mat3x3<f32>` type

##### Returns

`TypeUniform`

***

### mat4x2f32

#### Get Signature

> **get** `static` **mat4x2f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:138](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L138)

`mat4x2<f32>` type

##### Returns

`TypeUniform`

***

### mat4x2u16

#### Get Signature

> **get** `static` **mat4x2u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:143](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L143)

`mat4x2<u16>` type

##### Returns

`TypeUniform`

***

### mat4x4f32

#### Get Signature

> **get** `static` **mat4x4f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:158](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L158)

`mat4x4<f32>` type

##### Returns

`TypeUniform`

***

### mat4x4u16

#### Get Signature

> **get** `static` **mat4x4u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:163](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L163)

`mat4x4<u16>` type

##### Returns

`TypeUniform`

***

### u32

#### Get Signature

> **get** `static` **u32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:38](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L38)

u32 type

##### Returns

`TypeUniform`

***

### vec2f32

#### Get Signature

> **get** `static` **vec2f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:53](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L53)

`vec2<f32>` type

##### Returns

`TypeUniform`

***

### vec2i32

#### Get Signature

> **get** `static` **vec2i32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:58](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L58)

`vec2<i32>` type

##### Returns

`TypeUniform`

***

### vec2u16

#### Get Signature

> **get** `static` **vec2u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:68](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L68)

`vec2<u16>` type

##### Returns

`TypeUniform`

***

### vec2u32

#### Get Signature

> **get** `static` **vec2u32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:63](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L63)

`vec2<u32>` type

##### Returns

`TypeUniform`

***

### vec3f32

#### Get Signature

> **get** `static` **vec3f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:83](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L83)

`vec3<f32>` type

##### Returns

`TypeUniform`

***

### vec3i32

#### Get Signature

> **get** `static` **vec3i32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:73](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L73)

`vec3<i32>` type

##### Returns

`TypeUniform`

***

### vec3u16

#### Get Signature

> **get** `static` **vec3u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:88](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L88)

`vec3<u16>` type

##### Returns

`TypeUniform`

***

### vec3u32

#### Get Signature

> **get** `static` **vec3u32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:78](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L78)

`vec3<u32>` type

##### Returns

`TypeUniform`

***

### vec4f32

#### Get Signature

> **get** `static` **vec4f32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:103](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L103)

`vec4<f32>` type

##### Returns

`TypeUniform`

***

### vec4i32

#### Get Signature

> **get** `static` **vec4i32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:93](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L93)

`vec4<i32>` type

##### Returns

`TypeUniform`

***

### vec4u16

#### Get Signature

> **get** `static` **vec4u16**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:108](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L108)

`vec4<u16>` type

##### Returns

`TypeUniform`

***

### vec4u32

#### Get Signature

> **get** `static` **vec4u32**(): `TypeUniform`

Defined in: [src/resources/wgslParser/core/WGSLUniformTypes.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/resources/wgslParser/core/WGSLUniformTypes.ts#L98)

`vec4<u32>` type

##### Returns

`TypeUniform`
