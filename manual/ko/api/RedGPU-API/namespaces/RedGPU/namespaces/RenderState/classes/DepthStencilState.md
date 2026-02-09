[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / DepthStencilState

# Class: DepthStencilState

Defined in: [src/renderState/DepthStencilState.ts:23](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L23)

객체의 깊이(Depth) 및 스텐실(Stencil) 테스트 상태를 관리하는 클래스입니다.


Z-버퍼 기반의 깊이 테스트 활성 여부, 쓰기 설정, 비교 함수 및 스텐실 마스킹 등을 제어합니다.


* ### Example
```typescript
const dsState = mesh.depthStencilState;
dsState.depthWriteEnabled = true;
dsState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS;
```

## Constructors

### Constructor

> **new DepthStencilState**(`targetObject3D`): `DepthStencilState`

Defined in: [src/renderState/DepthStencilState.ts:45](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L45)

DepthStencilState 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | 상태가 적용될 대상 객체

#### Returns

`DepthStencilState`

## Accessors

### depthBias

#### Get Signature

> **get** **depthBias**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:156](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L156)

깊이 바이어스(Depth Bias) 값을 가져오거나 설정합니다.


##### Returns

`number`

#### Set Signature

> **set** **depthBias**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:160](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L160)

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

Defined in: [src/renderState/DepthStencilState.ts:182](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L182)

깊이 바이어스 클램프(Clamp) 값을 가져오거나 설정합니다.


##### Returns

`number`

#### Set Signature

> **set** **depthBiasClamp**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:186](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L186)

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

Defined in: [src/renderState/DepthStencilState.ts:169](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L169)

깊이 바이어스 슬로프 스케일(Slope Scale)을 가져오거나 설정합니다.


##### Returns

`number`

#### Set Signature

> **set** **depthBiasSlopeScale**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:173](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L173)

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

Defined in: [src/renderState/DepthStencilState.ts:89](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L89)

깊이 비교 함수를 가져오거나 설정합니다.


##### Returns

`GPUCompareFunction`

현재 설정된 GPUCompareFunction


#### Set Signature

> **set** **depthCompare**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:93](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L93)

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

Defined in: [src/renderState/DepthStencilState.ts:72](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L72)

깊이 버퍼에 기록할지 여부를 가져오거나 설정합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **depthWriteEnabled**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:76](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L76)

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

Defined in: [src/renderState/DepthStencilState.ts:57](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L57)

깊이/스텐실 텍스처 포맷을 가져오거나 설정합니다.


##### Returns

`GPUTextureFormat`

현재 설정된 GPUTextureFormat


#### Set Signature

> **set** **format**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:61](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L61)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTextureFormat` |

##### Returns

`void`

***

### state

#### Get Signature

> **get** **state**(): `object`

Defined in: [src/renderState/DepthStencilState.ts:195](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L195)

현재 설정된 값들을 기반으로 GPUDepthStencilState 형식의 객체를 반환합니다.


##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `depthBias` | `number` | [src/renderState/DepthStencilState.ts:210](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L210) |
| `depthBiasClamp` | `number` | [src/renderState/DepthStencilState.ts:212](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L212) |
| `depthBiasSlopeScale` | `number` | [src/renderState/DepthStencilState.ts:211](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L211) |
| `depthCompare` | `GPUCompareFunction` | [src/renderState/DepthStencilState.ts:205](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L205) |
| `depthWriteEnabled` | `boolean` | [src/renderState/DepthStencilState.ts:204](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L204) |
| `format` | `GPUTextureFormat` | [src/renderState/DepthStencilState.ts:203](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L203) |
| `stencilBack` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:207](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L207) |
| `stencilFront` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:206](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L206) |
| `stencilReadMask` | `number` | [src/renderState/DepthStencilState.ts:208](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L208) |
| `stencilWriteMask` | `number` | [src/renderState/DepthStencilState.ts:209](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L209) |

***

### stencilBack

#### Get Signature

> **get** **stencilBack**(): `GPUStencilFaceState`

Defined in: [src/renderState/DepthStencilState.ts:117](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L117)

후면(Back) 스텐실 상태를 가져오거나 설정합니다.


##### Returns

`GPUStencilFaceState`

#### Set Signature

> **set** **stencilBack**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:121](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L121)

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

Defined in: [src/renderState/DepthStencilState.ts:104](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L104)

전면(Front) 스텐실 상태를 가져오거나 설정합니다.


##### Returns

`GPUStencilFaceState`

#### Set Signature

> **set** **stencilFront**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:108](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L108)

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

Defined in: [src/renderState/DepthStencilState.ts:130](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L130)

스텐실 읽기 마스크를 가져오거나 설정합니다.


##### Returns

`number`

#### Set Signature

> **set** **stencilReadMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:134](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L134)

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

Defined in: [src/renderState/DepthStencilState.ts:143](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L143)

스텐실 쓰기 마스크를 가져오거나 설정합니다.


##### Returns

`number`

#### Set Signature

> **set** **stencilWriteMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:147](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/renderState/DepthStencilState.ts#L147)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
