[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewRenderTextureManager

# Class: ViewRenderTextureManager

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L101)

View3D/View2D의 렌더 타깃(컬러, 깊이, G-Buffer 등)을 생성 및 관리하는 매니저 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D 인스턴스를 통해 접근
const viewRenderTextureManager = view.viewRenderTextureManager;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new ViewRenderTextureManager**(`view`): `ViewRenderTextureManager`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L130)

ViewRenderTextureManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | 이 매니저가 관리할 View3D 인스턴스 |

#### Returns

`ViewRenderTextureManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### depthTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L179)

현재 프레임의 깊이(Depth) 텍스처를 반환합니다.

##### Returns

`GPUTexture`

현재 깊이 텍스처

***

***

### depthTexture0View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture0View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L218)

첫 번째 깊이 텍스처(`depthTexture0`)의 뷰를 반환합니다.

##### Returns

`GPUTextureView`

첫 번째 깊이 텍스처 뷰

***

***

### depthTexture1View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture1View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:231](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L231)

두 번째 깊이 텍스처(`depthTexture1`)의 뷰를 반환합니다.

##### Returns

`GPUTextureView`

두 번째 깊이 텍스처 뷰

***

***

### depthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:192](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L192)

현재 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

현재 깊이 텍스처 뷰

***

***

### gBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gBuffers**(): `Map`\<`string`, `GBufferInfo`\>

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L143)

G-Buffer 맵(`Map<string, GBufferInfo>`)을 반환합니다.

##### Returns

`Map`\<`string`, `GBufferInfo`\>

G-Buffer 정보 맵

***

***

### prevDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevDepthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L205)

이전 프레임의 깊이(Depth) 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

이전 프레임 깊이 텍스처 뷰

***

***

### renderPath1DepthResultTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1DepthResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:280](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L280)

1차 렌더 패스 깊이 결과 텍스처를 반환합니다.

##### Returns

`GPUTexture`

1차 렌더 패스 깊이 결과 텍스처

***

***

### renderPath1DepthResultTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1DepthResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:268](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L268)

1차 렌더 패스 깊이 결과 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

1차 렌더 패스 깊이 결과 텍스처 뷰

***

***

### renderPath1ResultTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:256](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L256)

1차 렌더 패스 컬러 결과 텍스처를 반환합니다.

##### Returns

`GPUTexture`

1차 렌더 패스 결과 텍스처

***

***

### renderPath1ResultTextureDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTextureDescriptor**(): `GPUTextureDescriptor`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L167)

1차 렌더 패스 결과 텍스처의 디스크립터를 반환합니다.

##### Returns

`GPUTextureDescriptor`

1차 렌더 패스 결과 텍스처 디스크립터

***

***

### renderPath1ResultTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L244)

1차 렌더 패스 컬러 결과 텍스처 뷰를 반환합니다.

##### Returns

`GPUTextureView`

1차 렌더 패스 결과 텍스처 뷰

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:155](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L155)

현재 관리 중인 렌더 텍스처들의 총 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (바이트)

## Methods



***

### copyDepthToRenderPath1()

> **copyDepthToRenderPath1**(`encoder`): `void`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:292](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L292)

1차 렌더 패스의 깊이 버퍼를 2차 패스 참조용 `renderPath1DepthResultTexture`에 복사 또는 MSAA 리졸브합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | GPUCommandEncoder 인스턴스 |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:377](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L377)

관리 중인 모든 G-Buffer 및 깊이 텍스처 리소스를 해제하고 매니저를 파기합니다.

#### Returns

`void`

***

***

### getGBufferResolveTexture()

> **getGBufferResolveTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:336](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L336)

지정된 타입의 MSAA Resolve G-Buffer 텍스처를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수 |

#### Returns

`GPUTexture`

Resolve 대상 GPU 텍스처

***

***

### getGBufferResolveTextureView()

> **getGBufferResolveTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:368](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L368)

지정된 타입의 MSAA Resolve G-Buffer 텍스처 뷰를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수 |

#### Returns

`GPUTextureView`

Resolve 대상 GPU 텍스처 뷰

***

***

### getGBufferTexture()

> **getGBufferTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:320](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L320)

지정된 타입의 G-Buffer 텍스처를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수 |

#### Returns

`GPUTexture`

G-Buffer GPU 텍스처

***

***

### getGBufferTextureView()

> **getGBufferTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:352](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L352)

지정된 타입의 G-Buffer 텍스처 뷰를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer 타입 상수 |

#### Returns

`GPUTextureView`

G-Buffer GPU 텍스처 뷰

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
