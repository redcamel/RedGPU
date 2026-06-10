[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Antialiasing](../README.md) / AntialiasingManager

# Class: AntialiasingManager

Defined in: [src/antialiasing/AntialiasingManager.ts:21](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L21)

Class that manages anti-aliasing settings.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

* ### Example
```typescript
// Access via RedGPUContext, View, or RedGPUObject inherited objects.
const antialiasingManager = redGPUContext.antialiasingManager;
```

## Constructors

### Constructor

> **new AntialiasingManager**(): `AntialiasingManager`

Defined in: [src/antialiasing/AntialiasingManager.ts:38](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L38)

`window.devicePixelRatio` 값에 따라 초기 안티앨리어싱 모드가 결정됩니다:
- `devicePixelRatio > 1.0` (고해상도 화면): TAA가 활성화됩니다.
- `devicePixelRatio <= 1.0` (일반 해상도 화면): MSAA가 활성화됩니다.
AntialiasingManager constructor.
The initial anti-aliasing mode is determined based on the `window.devicePixelRatio` value:
- `devicePixelRatio > 1.0` (High-DPI screen): TAA is enabled.
- `devicePixelRatio <= 1.0` (Standard resolution screen): MSAA is enabled.

#### Returns

`AntialiasingManager`

## Accessors

### msaaID

#### Get Signature

> **get** **msaaID**(): `string`

Defined in: [src/antialiasing/AntialiasingManager.ts:165](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L165)

**`Internal`**

Returns the unique ID of the current MSAA.

##### Returns

`string`

Unique ID of MSAA

***

### useFXAA

#### Get Signature

> **get** **useFXAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:133](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L133)

Returns whether FXAA (Fast Approximate Anti-Aliasing) is used.

* ### Example
```typescript
const useFXAA = antialiasingManager.useFXAA;
```

##### Returns

`boolean`

Whether FXAA is used

#### Set Signature

> **set** **useFXAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:150](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L150)

Sets whether to use FXAA (Fast Approximate Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useFXAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use FXAA |

##### Returns

`void`

***

### useMSAA

#### Get Signature

> **get** **useMSAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:96](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L96)

Returns whether MSAA (Multi-Sample Anti-Aliasing) is used.

* ### Example
```typescript
const useMSAA = antialiasingManager.useMSAA;
```

##### Returns

`boolean`

Whether MSAA is used

#### Set Signature

> **set** **useMSAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:113](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L113)

Sets whether to use MSAA (Multi-Sample Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useMSAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use MSAA |

##### Returns

`void`

***

### useTAA

#### Get Signature

> **get** **useTAA**(): `boolean`

Defined in: [src/antialiasing/AntialiasingManager.ts:60](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L60)

Returns whether TAA (Temporal Anti-Aliasing) is used.

* ### Example
```typescript
const useTAA = antialiasingManager.useTAA;
```

##### Returns

`boolean`

Whether TAA is used

#### Set Signature

> **set** **useTAA**(`value`): `void`

Defined in: [src/antialiasing/AntialiasingManager.ts:77](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/antialiasing/AntialiasingManager.ts#L77)

Sets whether to use TAA (Temporal Anti-Aliasing).

* ### Example
```typescript
antialiasingManager.useTAA = true;
```

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use TAA |

##### Returns

`void`
