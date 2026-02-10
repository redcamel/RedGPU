[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / ToneMappingManager

# Class: ToneMappingManager

Defined in: [src/toneMapping/ToneMappingManager.ts:31](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L31)


Class that integrates and manages tone mapping, exposure, contrast, and brightness.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// View3D를 통해 접근합니다. (Access through View3D)
const toneMappingManager = view.toneMappingManager;
toneMappingManager.mode = RedGPU.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
toneMappingManager.exposure = 1.2;
```

## Constructors

### Constructor

> **new ToneMappingManager**(`view`): `ToneMappingManager`

Defined in: [src/toneMapping/ToneMappingManager.ts:46](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L46)


Creates a ToneMappingManager instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |

#### Returns

`ToneMappingManager`

## Accessors

### brightness

#### Get Signature

> **get** **brightness**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:97](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L97)

Returns the brightness.

##### Returns

`number`

#### Set Signature

> **set** **brightness**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:102](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L102)

Sets the brightness. (-1.0 to 1.0, Default: 0.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### contrast

#### Get Signature

> **get** **contrast**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:85](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L85)

Returns the contrast.

##### Returns

`number`

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:90](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L90)

Sets the contrast. (0.0 to 2.0, Default: 1.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### exposure

#### Get Signature

> **get** **exposure**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L73)

Returns the exposure value.

##### Returns

`number`

#### Set Signature

> **set** **exposure**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:78](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L78)

Sets the exposure value. (Default: 1.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mode

#### Get Signature

> **get** **mode**(): [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:58](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L58)

Returns the currently applied tone mapping mode.

##### Returns

[`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

#### Set Signature

> **set** **mode**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:63](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L63)

Sets the tone mapping mode.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md) |

##### Returns

`void`

***

### toneMapping

#### Get Signature

> **get** **toneMapping**(): `AToneMappingEffect`

Defined in: [src/toneMapping/ToneMappingManager.ts:52](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L52)

Returns the currently active tone mapping effect instance.

##### Returns

`AToneMappingEffect`

## Methods

### render()

> **render**(`width`, `height`, `currentTextureView`): `ASinglePassPostEffectResult`

Defined in: [src/toneMapping/ToneMappingManager.ts:116](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/toneMapping/ToneMappingManager.ts#L116)


Renders tone mapping.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `currentTextureView` | `ASinglePassPostEffectResult` | Current texture view information |

#### Returns

`ASinglePassPostEffectResult`

Rendering result
