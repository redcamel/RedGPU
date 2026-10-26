[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / VertexBuffer

# Class: VertexBuffer

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L19)

정점 버퍼(`GPUBuffer`)를 관리하는 클래스입니다.

***

### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct);
```

## Extends

- [`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md)

## Constructors



***

### Constructor

> **new VertexBuffer**(`redGPUContext`, `data`, `interleavedStruct`, `usage?`, `cacheKey?`): `VertexBuffer`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L55)

VertexBuffer 인스턴스를 생성합니다.

#### Example
```typescript
const vertexBuffer = new RedGPU.Resource.VertexBuffer(redGPUContext, data, interleavedStruct, GPUBufferUsage.VERTEX);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | 정점 데이터 (`Array<number>` 또는 `Float32Array`) |
| `interleavedStruct` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | `undefined` | 정점 데이터 구조 정의 |
| `usage?` | `number` | `...` | GPUBufferUsageFlags (기본값: `GPUBufferUsage.VERTEX \| GPUBufferUsage.COPY_DST \| GPUBufferUsage.STORAGE`) |
| `cacheKey?` | `string` | `''` | 버퍼 캐시 키 (선택) |

#### Returns

`VertexBuffer`

#### Overrides

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`constructor`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#constructor)

## Properties



***

### \[GPU\_BUFFER\_DATA\_SYMBOL\]

> **\[GPU\_BUFFER\_DATA\_SYMBOL\]**: `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L24)

정점 데이터가 저장되는 내부 버퍼입니다.

***

## Accessors



***

### data

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **data**(): `Float32Array`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L89)

정점 데이터를 반환합니다.

##### Returns

`Float32Array`

`Float32Array` 형식의 정점 데이터

***

***

### interleavedStruct

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **interleavedStruct**(): [`VertexInterleavedStruct`](VertexInterleavedStruct.md)

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:113](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L113)

정점 인터리브 구조 객체를 반환합니다.

##### Returns

[`VertexInterleavedStruct`](VertexInterleavedStruct.md)

정점 인터리브 구조 객체

***

***

### stride

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **stride**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L101)

정점당 요소 개수(stride)를 반환합니다.

##### Returns

`number`

정점당 요소 개수

***

***

### triangleCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **triangleCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:137](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L137)

삼각형 개수를 반환합니다.

##### Returns

`number`

삼각형 개수

***

***

### vertexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexCount**(): `number`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L125)

정점 개수를 반환합니다.

##### Returns

`number`

정점 개수

***

## Methods



***

### changeData()

> **changeData**(`data`, `interleavedStruct?`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L157)

정점 버퍼의 데이터를 변경합니다.

#### Example
```typescript
vertexBuffer.changeData(newData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 새로운 정점 데이터 (`Array<number>` 또는 `Float32Array`) |
| `interleavedStruct?` | [`VertexInterleavedStruct`](VertexInterleavedStruct.md) | 정점 데이터 구조 정의 (선택) |

#### Returns

`void`

***

***

### updateAllData()

> **updateAllData**(`data`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L220)

정점 버퍼의 전체 데이터를 GPU에 다시 업로드합니다.

#### Example
```typescript
vertexBuffer.updateAllData(fullData);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | 새로운 정점 데이터 (`Array<number>` 또는 `Float32Array`) |

#### Returns

`void`

***

***

### updateData()

> **updateData**(`data`, `offset?`): `void`

Defined in: [src/resources/buffer/vertexBuffer/VertexBuffer.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/vertexBuffer/VertexBuffer.ts#L201)

정점 버퍼의 일부 데이터를 지정한 오프셋부터 업데이트합니다.

#### Example
```typescript
vertexBuffer.updateData(partialData, 1024);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `data` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | `undefined` | 업데이트할 정점 데이터 (`Array<number>` 또는 `Float32Array`) |
| `offset?` | `number` | `0` | 바이트 단위 시작 오프셋 (기본값: 0) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \[GPU\_BUFFER\_CACHE\_KEY\]

> **\[GPU\_BUFFER\_CACHE\_KEY\]**: `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L23)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_CACHE_KEY]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_cache_key)

***

***

### \[GPU\_BUFFER\_SYMBOL\]

> **\[GPU\_BUFFER\_SYMBOL\]**: `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L22)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`[GPU_BUFFER_SYMBOL]`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpu_buffer_symbol)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`antialiasingManager`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cacheKey**(): `string`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L57)

버퍼 캐시 키를 반환합니다. 지정되지 않은 경우 uuid를 반환합니다.

##### Returns

`string`

캐시 키

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`cacheKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#cachekey)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`commandEncoderManager`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#commandencodermanager)

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L69)

내부 GPUBuffer 객체를 반환합니다.

##### Returns

`GPUBuffer`

GPUBuffer 객체

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpubuffer)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`gpuDevice`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#gpudevice)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`instanceId`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#instanceid)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`name`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#name)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`redGPUContext`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#redgpucontext)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManager`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`resourceManagerKey`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`revision`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#revision)

***

***

### size

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **size**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L93)

버퍼 데이터 크기(byte)를 반환합니다.

##### Returns

`number`

바이트 크기 (데이터가 없으면 0)

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`size`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#size)

***

***

### targetResourceManagedState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetResourceManagedState**(): [`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

Defined in: [src/resources/core/ManagementResourceBase.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ManagementResourceBase.ts#L50)

리소스의 관리 상태 정보를 반환합니다.

##### Returns

[`ResourceStatusInfo`](../namespaces/Core/classes/ResourceStatusInfo.md)

리소스 관리 상태 정보 객체

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`targetResourceManagedState`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#targetresourcemanagedstate)

***

***

### usage

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **usage**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:81](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L81)

GPU 버퍼 사용 플래그를 반환합니다.

##### Returns

`number`

GPUBufferUsageFlags 값

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`usage`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#usage)

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

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`uuid`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L105)

비디오 메모리 사용량(byte)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`videoMemorySize`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__addDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`__removeDirtyPipelineListener`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#__removedirtypipelinelistener)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/core/ABaseBuffer.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/core/ABaseBuffer.ts#L116)

GPU 버퍼를 해제하고 리소스 매니저에서 등록을 해제합니다.

GPUBuffer 파괴는 CommandEncoderManager를 통해 지연 처리됩니다.

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`destroy`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#destroy)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ABaseBuffer`](../namespaces/CoreBuffer/classes/ABaseBuffer.md).[`notifyUpdate`](../namespaces/CoreBuffer/classes/ABaseBuffer.md#notifyupdate)

***

</details>
