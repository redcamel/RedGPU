[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:20](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L20)


Class that manages Image-Based Lighting (IBL).


Enables realistic PBR lighting by generating diffuse and specular environments based on HDR or cubemap images.

### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr');
view.ibl = ibl;
```

## Constructors

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `environmentSize?`, `prefilterSize?`, `irradianceSize?`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L57)


Creates an IBL instance.

### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, 'path/to/environment.hdr', 1024, 512, 64);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | Environment map source information (HDR URL or array of 6 image URLs) |
| `environmentSize` | `number` | `1024` | Environment map cube size (default: 1024) |
| `prefilterSize` | `number` | `512` | Prefilter cube size (default: 512) |
| `irradianceSize` | `number` | `64` | Irradiance cube size (default: 64) |

#### Returns

`IBL`

## Accessors

### environmentSize

#### Get Signature

> **get** **environmentSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L114)

Environment map cube size

##### Returns

`number`

***

### environmentTexture

#### Get Signature

> **get** **environmentTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:122](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L122)

Returns the environment texture.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

***

### irradianceSize

#### Get Signature

> **get** **irradianceSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:118](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L118)

Irradiance cube size

##### Returns

`number`

***

### irradianceTexture

#### Get Signature

> **get** **irradianceTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:120](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L120)

Returns the irradiance texture.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

***

### prefilterSize

#### Get Signature

> **get** **prefilterSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:116](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L116)

Prefilter cube size

##### Returns

`number`

***

### prefilterTexture

#### Get Signature

> **get** **prefilterTexture**(): [`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:124](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/texture/ibl/IBL.ts#L124)

Returns the IBL (Specular Prefilter) texture.

##### Returns

[`IBLCubeTexture`](../namespaces/CoreIBL/classes/IBLCubeTexture.md)
