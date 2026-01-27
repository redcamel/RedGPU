[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewRenderTextureManager

# Class: ViewRenderTextureManager

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:19](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L19)


Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/2D.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ViewRenderTextureManager**(`view`): `ViewRenderTextureManager`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:93](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L93)

생성자

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 이 매니저가 관리할 View3D 인스턴스 |

#### Returns

`ViewRenderTextureManager`

## Accessors

### depthTexture

#### Get Signature

> **get** **depthTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:122](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L122)

깊이 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.

##### Returns

`GPUTexture`

***

### depthTextureView

#### Get Signature

> **get** **depthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:130](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L130)

깊이 텍스처 뷰를 반환합니다. 필요 시 내부에서 생성합니다.

##### Returns

`GPUTextureView`

***

### gBufferColorResolveTexture

#### Get Signature

> **get** **gBufferColorResolveTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:173](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L173)

G-Buffer color resolve 텍스처 반환 (MSAA 사용 시 resolve 대상)

##### Returns

`GPUTexture`

***

### gBufferColorResolveTextureView

#### Get Signature

> **get** **gBufferColorResolveTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:190](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L190)

G-Buffer color resolve 텍스처 뷰 반환.

##### Returns

`GPUTextureView`

***

### gBufferColorTexture

#### Get Signature

> **get** **gBufferColorTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:165](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L165)

G-Buffer color 텍스처 반환 (미리 생성되지 않았으면 undefined)

##### Returns

`GPUTexture`

***

### gBufferColorTextureView

#### Get Signature

> **get** **gBufferColorTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:181](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L181)

G-Buffer color 텍스처 뷰 반환. 내부에서 생성 보장.

##### Returns

`GPUTextureView`

***

### gBufferMotionVectorResolveTexture

#### Get Signature

> **get** **gBufferMotionVectorResolveTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:239](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L239)

G-Buffer 모션 벡터 resolve 텍스처 반환

##### Returns

`GPUTexture`

***

### gBufferMotionVectorResolveTextureView

#### Get Signature

> **get** **gBufferMotionVectorResolveTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:256](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L256)

G-Buffer 모션 벡터 resolve 텍스처 뷰 반환.

##### Returns

`GPUTextureView`

***

### gBufferMotionVectorTexture

#### Get Signature

> **get** **gBufferMotionVectorTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:231](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L231)

G-Buffer 모션 벡터 텍스처 반환

##### Returns

`GPUTexture`

***

### gBufferMotionVectorTextureView

#### Get Signature

> **get** **gBufferMotionVectorTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:247](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L247)

G-Buffer 모션 벡터 텍스처 뷰 반환. 내부에서 생성 보장.

##### Returns

`GPUTextureView`

***

### gBufferNormalResolveTexture

#### Get Signature

> **get** **gBufferNormalResolveTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:206](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L206)

G-Buffer normal resolve 텍스처 반환

##### Returns

`GPUTexture`

***

### gBufferNormalResolveTextureView

#### Get Signature

> **get** **gBufferNormalResolveTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:223](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L223)

G-Buffer normal resolve 텍스처 뷰 반환.

##### Returns

`GPUTextureView`

***

### gBufferNormalTexture

#### Get Signature

> **get** **gBufferNormalTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:198](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L198)

G-Buffer normal 텍스처 반환

##### Returns

`GPUTexture`

***

### gBufferNormalTextureView

#### Get Signature

> **get** **gBufferNormalTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:214](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L214)

G-Buffer normal 텍스처 뷰 반환. 내부에서 생성 보장.

##### Returns

`GPUTextureView`

***

### prevDepthTextureView

#### Get Signature

> **get** **prevDepthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:135](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L135)

##### Returns

`GPUTextureView`

***

### renderPath1ResultTexture

#### Get Signature

> **get** **renderPath1ResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:152](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L152)

렌더 패스1 결과 텍스처를 반환합니다. 필요 시 내부에서 생성합니다.

##### Returns

`GPUTexture`

***

### renderPath1ResultTextureDescriptor

#### Get Signature

> **get** **renderPath1ResultTextureDescriptor**(): `GPUTextureDescriptor`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:114](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L114)

렌더 패스1 결과 텍스처 생성에 사용된 디스크립터를 반환합니다.

##### Returns

`GPUTextureDescriptor`

***

### renderPath1ResultTextureView

#### Get Signature

> **get** **renderPath1ResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:144](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L144)

렌더 패스1 결과 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/display/view/core/ViewRenderTextureManager.ts:106](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/display/view/core/ViewRenderTextureManager.ts#L106)

현재 계산된 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`
