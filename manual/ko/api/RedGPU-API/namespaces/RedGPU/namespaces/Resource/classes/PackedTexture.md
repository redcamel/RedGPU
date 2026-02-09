[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / PackedTexture

# Class: PackedTexture

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:38](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L38)

여러 텍스처의 채널을 조합해 하나의 텍스처로 패킹하는 유틸리티 클래스입니다.


r, g, b, a 각 채널에 서로 다른 텍스처의 특정 채널을 할당하여 메모리 사용량을 줄이고 렌더링 효율을 높일 수 있습니다.


* ### Example
```typescript
const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
await packed.packing({
  r: texture1.gpuTexture,
  g: texture2.gpuTexture
}, 512, 512);
```

## Constructors

### Constructor

> **new PackedTexture**(`redGPUContext`): `PackedTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:61](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L61)

PackedTexture 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`PackedTexture`

## Accessors

### gpuTexture

#### Get Signature

> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:74](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L74)

패킹 결과 GPUTexture 객체

##### Returns

`GPUTexture`

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:69](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L69)

인스턴스 고유 식별자

##### Returns

`string`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:130](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L130)

인스턴스를 파괴하고 캐시를 관리합니다.

#### Returns

`void`

***

### packing()

> **packing**(`textures`, `width`, `height`, `label?`, `componentMapping?`): `Promise`\<`void`\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:102](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L102)

여러 텍스처의 채널을 조합해 패킹 텍스처를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | \{ `a?`: `GPUTexture`; `b?`: `GPUTexture`; `g?`: `GPUTexture`; `r?`: `GPUTexture`; \} | r/g/b/a 채널별 소스 GPUTexture 객체 맵
| `textures.a?` | `GPUTexture` | - |
| `textures.b?` | `GPUTexture` | - |
| `textures.g?` | `GPUTexture` | - |
| `textures.r?` | `GPUTexture` | - |
| `width?` | `number` | 결과 텍스처 너비
| `height?` | `number` | 결과 텍스처 높이
| `label?` | `string` | 텍스처 레이블 (선택)
| `componentMapping?` | `ComponentMapping` | 컴포넌트 매핑 정보 (선택)

#### Returns

`Promise`\<`void`\>

***

### getCacheMap()

> `static` **getCacheMap**(): `Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:79](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/resources/texture/packedTexture/PackedTexture.ts#L79)

패킹 텍스처 캐시 맵을 반환합니다.

#### Returns

`Map`\<`string`, \{ `gpuTexture`: `GPUTexture`; `mappingKey`: `string`; `useNum`: `number`; `uuid`: `string`; \}\>
