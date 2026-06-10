[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / ToneMappingManager

# Class: ToneMappingManager

Defined in: [src/toneMapping/ToneMappingManager.ts:29](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L29)

Class that integrates and manages tone mapping, contrast, and brightness settings.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// View3D를 통해 접근합니다.
// Access through View3D.
const toneMappingManager = view.toneMappingManager;
toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

## Constructors

### Constructor

> **new ToneMappingManager**(`redGPUContext`): `ToneMappingManager`

Defined in: [src/toneMapping/ToneMappingManager.ts:42](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L42)

Creates a ToneMappingManager instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ToneMappingManager`

## Accessors

### brightness

#### Get Signature

> **get** **brightness**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:81](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L81)

Returns the brightness.

##### Returns

`number`

#### Set Signature

> **set** **brightness**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:86](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L86)

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

Defined in: [src/toneMapping/ToneMappingManager.ts:70](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L70)

Returns the contrast.

##### Returns

`number`

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:75](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L75)

Sets the contrast. (0.0 to 2.0, Default: 1.0)

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

Defined in: [src/toneMapping/ToneMappingManager.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L58)

Returns the currently applied tone mapping mode.

##### Returns

[`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

#### Set Signature

> **set** **mode**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:63](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L63)

Sets the tone mapping mode.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md) |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:47](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L47)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

***

### toneMapping

#### Get Signature

> **get** **toneMapping**(): `AToneMappingEffect`

Defined in: [src/toneMapping/ToneMappingManager.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L52)

Returns the currently active tone mapping effect instance.

##### Returns

`AToneMappingEffect`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:95](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L95)

Clears tone mapping resources.

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `currentTextureView`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:111](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/toneMapping/ToneMappingManager.ts#L111)

Renders tone mapping.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D instance |
| `width` | `number` | Width |
| `height` | `number` | Height |
| `currentTextureView` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | Current texture view information |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Rendering result
