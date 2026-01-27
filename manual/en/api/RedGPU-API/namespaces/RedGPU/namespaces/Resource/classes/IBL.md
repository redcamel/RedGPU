[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:27](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L27)


Class that manages Image-Based Lighting (IBL).


Enables more realistic rendering by generating ambient and specular environments based on HDR or cubemap images.

* ### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
view.ibl = ibl;
```

## Constructors

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `envCubeSize`, `iblCubeSize`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:55](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L55)


Creates an IBL instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | Environment map source information (HDR URL or array of 6 image URLs) |
| `envCubeSize` | `number` | `1024` | Environment map cube size (default: 1024) |
| `iblCubeSize` | `number` | `512` | IBL cube size (default: 512) |

#### Returns

`IBL`

## Accessors

### envCubeSize

#### Get Signature

> **get** **envCubeSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:90](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L90)

Environment map cube size

##### Returns

`number`

***

### environmentTexture

#### Get Signature

> **get** **environmentTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:105](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L105)

Returns the environment texture.

##### Returns

`IBLCubeTexture`

***

### iblCubeSize

#### Get Signature

> **get** **iblCubeSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:95](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L95)

IBL cube size

##### Returns

`number`

***

### iblTexture

#### Get Signature

> **get** **iblTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:110](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L110)

Returns the IBL texture.

##### Returns

`IBLCubeTexture`

***

### irradianceTexture

#### Get Signature

> **get** **irradianceTexture**(): `IBLCubeTexture`

Defined in: [src/resources/texture/ibl/IBL.ts:100](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/resources/texture/ibl/IBL.ts#L100)

Returns the irradiance texture.

##### Returns

`IBLCubeTexture`
