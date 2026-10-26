[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / PackedTexture

# Class: PackedTexture

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L43)

여러 소스 텍스처의 채널을 조합하여 하나의 `rgba8unorm` 텍스처로 패킹합니다.

동일한 소스/매핑 조합의 결과는 `PackedTextureManager`에 캐시되어 참조 카운트 방식으로 공유됩니다.

***

### Example
```typescript
const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
await packed.packing({
  r: texture1.gpuTexture,
  g: texture2.gpuTexture
}, 512, 512);
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PackedTexture**(`redGPUContext`): `PackedTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L63)

PackedTexture 인스턴스를 생성합니다.

#### Example
```typescript
const packed = new RedGPU.Resource.PackedTexture(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`PackedTexture`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### gpuTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuTexture**(): `GPUTexture`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L76)

패킹 결과 GPUTexture입니다.

##### Returns

`GPUTexture`

GPUTexture 인스턴스

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L148)

캐시 참조 카운트를 감소시키고, 더 이상 참조되지 않는 GPUTexture는 지연 파괴합니다.

#### Returns

`void`

***

***

### packing()

> **packing**(`textures`, `width`, `height`, `label?`, `componentMapping?`, `commandEncoder?`): `Promise`\<`void`\>

Defined in: [src/resources/texture/packedTexture/PackedTexture.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/packedTexture/PackedTexture.ts#L114)

소스 텍스처들의 채널을 조합해 패킹 텍스처를 생성합니다.

모든 소스가 비어 있으면 아무 작업도 하지 않으며, 동일한 조합이 이미 캐시되어 있으면 캐시를 재사용합니다.

#### Example
```typescript
await packed.packing(
  {r: aoTexture.gpuTexture, g: roughnessTexture.gpuTexture, b: metallicTexture.gpuTexture},
  1024, 1024, 'ORM_TEXTURE'
);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | \{ `a?`: `GPUTexture`; `b?`: `GPUTexture`; `g?`: `GPUTexture`; `r?`: `GPUTexture`; \} | 채널(r/g/b/a)별 소스 GPUTexture 맵 |
| `textures.a?` | `GPUTexture` | - |
| `textures.b?` | `GPUTexture` | - |
| `textures.g?` | `GPUTexture` | - |
| `textures.r?` | `GPUTexture` | - |
| `width` | `number` | 결과 텍스처 너비 |
| `height` | `number` | 결과 텍스처 높이 |
| `label?` | `string` | 결과 텍스처 레이블 (선택) |
| `componentMapping?` | [`ComponentMapping`](../type-aliases/ComponentMapping.md) | 채널 매핑 정보 (선택) |
| `commandEncoder?` | `GPUCommandEncoder` | 외부 커맨드 인코더 (선택, 생략 시 내부 인코더를 생성하여 즉시 제출) |

#### Returns

`Promise`\<`void`\>

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
