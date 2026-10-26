[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / DepthStencilState

# Class: DepthStencilState

Defined in: [src/renderState/DepthStencilState.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L26)

객체의 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
const depthStencilState = mesh.depthStencilState;
depthStencilState.depthWriteEnabled = true;
depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL;
```

## Constructors

### Constructor

> **new DepthStencilState**(`targetObject3D`): `DepthStencilState`

Defined in: [src/renderState/DepthStencilState.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L48)

DepthStencilState 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | 상태가 적용될 대상 3D 객체 |

#### Returns

`DepthStencilState`

## Accessors

### depthBias

#### Get Signature

> **get** **depthBias**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L183)

깊이 바이어스(Depth Bias) 값을 반환하거나 설정합니다.

##### Returns

`number`

현재 설정된 `GPUDepthBias` 값

#### Set Signature

> **set** **depthBias**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L187)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthBiasClamp

#### Get Signature

> **get** **depthBiasClamp**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L217)

깊이 바이어스 클램프(Clamp) 값을 반환하거나 설정합니다.

##### Returns

`number`

깊이 바이어스 클램프 값

#### Set Signature

> **set** **depthBiasClamp**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthBiasSlopeScale

#### Get Signature

> **get** **depthBiasSlopeScale**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:200](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L200)

깊이 바이어스 기울기 스케일(Slope Scale) 값을 반환하거나 설정합니다.

##### Returns

`number`

깊이 바이어스 기울기 스케일 값

#### Set Signature

> **set** **depthBiasSlopeScale**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthCompare

#### Get Signature

> **get** **depthCompare**(): `GPUCompareFunction`

Defined in: [src/renderState/DepthStencilState.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L96)

깊이 비교 함수를 반환하거나 설정합니다.

##### Returns

`GPUCompareFunction`

현재 설정된 `GPUCompareFunction` 값

#### Set Signature

> **set** **depthCompare**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUCompareFunction` |

##### Returns

`void`

***

### depthWriteEnabled

#### Get Signature

> **get** **depthWriteEnabled**(): `boolean`

Defined in: [src/renderState/DepthStencilState.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L79)

깊이 버퍼 쓰기 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

깊이 버퍼 쓰기 활성화 여부

#### Set Signature

> **set** **depthWriteEnabled**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### format

#### Get Signature

> **get** **format**(): `GPUTextureFormat`

Defined in: [src/renderState/DepthStencilState.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L60)

깊이/스텐실 텍스처 포맷을 반환하거나 설정합니다.

##### Returns

`GPUTextureFormat`

현재 설정된 `GPUTextureFormat` 값

#### Set Signature

> **set** **format**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L64)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTextureFormat` |

##### Returns

`void`

***

### state

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **state**(): `object`

Defined in: [src/renderState/DepthStencilState.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L234)

현재 설정된 값들을 기반으로 `GPUDepthStencilState` 형식의 상태 객체를 반환합니다.

##### Returns

`object`

생성된 깊이/스텐실 상태 객체

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `depthBias` | `number` | [src/renderState/DepthStencilState.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L249) |
| `depthBiasClamp` | `number` | [src/renderState/DepthStencilState.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L251) |
| `depthBiasSlopeScale` | `number` | [src/renderState/DepthStencilState.ts:250](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L250) |
| `depthCompare` | `GPUCompareFunction` | [src/renderState/DepthStencilState.ts:244](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L244) |
| `depthWriteEnabled` | `boolean` | [src/renderState/DepthStencilState.ts:243](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L243) |
| `format` | `GPUTextureFormat` | [src/renderState/DepthStencilState.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L242) |
| `stencilBack` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L246) |
| `stencilFront` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L245) |
| `stencilReadMask` | `number` | [src/renderState/DepthStencilState.ts:247](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L247) |
| `stencilWriteMask` | `number` | [src/renderState/DepthStencilState.ts:248](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L248) |

***

### stencilBack

#### Get Signature

> **get** **stencilBack**(): `GPUStencilFaceState`

Defined in: [src/renderState/DepthStencilState.ts:132](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L132)

후면(Back) 스텐실 상태를 반환하거나 설정합니다.

##### Returns

`GPUStencilFaceState`

후면 `GPUStencilFaceState` 객체

#### Set Signature

> **set** **stencilBack**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUStencilFaceState` |

##### Returns

`void`

***

### stencilFront

#### Get Signature

> **get** **stencilFront**(): `GPUStencilFaceState`

Defined in: [src/renderState/DepthStencilState.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L115)

전면(Front) 스텐실 상태를 반환하거나 설정합니다.

##### Returns

`GPUStencilFaceState`

전면 `GPUStencilFaceState` 객체

#### Set Signature

> **set** **stencilFront**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUStencilFaceState` |

##### Returns

`void`

***

### stencilReadMask

#### Get Signature

> **get** **stencilReadMask**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L149)

스텐실 읽기 마스크를 반환하거나 설정합니다.

##### Returns

`number`

스텐실 읽기 마스크 값

#### Set Signature

> **set** **stencilReadMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L153)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### stencilWriteMask

#### Get Signature

> **get** **stencilWriteMask**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L166)

스텐실 쓰기 마스크를 반환하거나 설정합니다.

##### Returns

`number`

스텐실 쓰기 마스크 값

#### Set Signature

> **set** **stencilWriteMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/DepthStencilState.ts#L170)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
