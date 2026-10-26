[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Context](../README.md) / RedGPUContext

# Class: RedGPUContext

Defined in: [src/context/RedGPUContext.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L38)

WebGPU 초기화 후 생성되는 최상위 컨텍스트 클래스로, GPU 디바이스/어댑터, 캔버스, `View3D` 컨테이너, 리소스·커맨드·안티앨리어싱 매니저를 통합 관리합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
RedGPU.init(canvas, (redGPUContext) => {
    redGPUContext.backgroundColor = new RedGPU.Color.ColorRGBA(0, 0, 0, 1);
});
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/helloWorld/" style="width:100%; height:500px;"></iframe>

## See

[Hello World example](https://redcamel.github.io/RedGPU/examples/3d/helloWorld/)

## Extends

- [`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md)

## Constructors



***

### Constructor

> **new RedGPUContext**(`htmlCanvas`, `gpuAdapter`, `gpuDevice`, `gpuContext`, `alphaMode`, `onDestroy?`): `RedGPUContext`

Defined in: [src/context/RedGPUContext.ts:111](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L111)

RedGPUContext 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `htmlCanvas` | `HTMLCanvasElement` | 렌더링 대상 `HTMLCanvasElement` |
| `gpuAdapter` | `GPUAdapter` | 초기화된 WebGPU `GPUAdapter` |
| `gpuDevice` | `GPUDevice` | 초기화된 WebGPU `GPUDevice` |
| `gpuContext` | `GPUCanvasContext` | 캔버스 WebGPU 컨텍스트 (`GPUCanvasContext`) |
| `alphaMode` | `GPUCanvasAlphaMode` | 캔버스 알파 합성 모드 (`GPUCanvasAlphaMode`) |
| `onDestroy?` | (`info`) => `void` | 디바이스 파괴 시 호출될 선택적 콜백 함수 |

#### Returns

`RedGPUContext`

#### Overrides

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`constructor`](../namespaces/Core/classes/RedGPUContextViewContainer.md#constructor)

## Properties



***

### currentRequestAnimationFrame

> **currentRequestAnimationFrame**: `number`

Defined in: [src/context/RedGPUContext.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L43)

현재 실행 중인 `requestAnimationFrame` 루프 ID

***

***

### currentTime

> **currentTime**: `number`

Defined in: [src/context/RedGPUContext.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L53)

현재 프레임의 타임스탬프 (ms)

***

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/context/RedGPUContext.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L48)

캔버스 크기 변경 시 호출되는 리사이즈 이벤트 콜백 (`RedResizeEvent<RedGPUContext>`)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<`RedGPUContext`\> |

#### Returns

`void`

***

***

### targetRenderer

> **targetRenderer**: [`Renderer`](../../../classes/Renderer.md)

Defined in: [src/context/RedGPUContext.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L58)

현재 컨텍스트를 렌더링 중인 대상 `Renderer` 인스턴스

## Accessors



***

### alphaMode

#### Get Signature

> **get** **alphaMode**(): `GPUCanvasAlphaMode`

Defined in: [src/context/RedGPUContext.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L300)

캔버스의 알파 합성 모드(`GPUCanvasAlphaMode`)를 반환하거나 설정합니다.

##### Returns

`GPUCanvasAlphaMode`

현재 설정된 `GPUCanvasAlphaMode`

#### Set Signature

> **set** **alphaMode**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:304](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L304)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUCanvasAlphaMode` |

##### Returns

`void`

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/context/RedGPUContext.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L196)

안티앨리어싱 매니저(`AntialiasingManager`)를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

***

***

### backgroundColor

#### Get Signature

> **get** **backgroundColor**(): [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/context/RedGPUContext.ts:247](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L247)

컨텍스트의 기본 배경색(`ColorRGBA`)을 반환하거나 설정합니다.

##### Throws

설정 시 `ColorRGBA` 인스턴스가 아닐 경우 에러 발생

##### Returns

[`ColorRGBA`](../../Color/classes/ColorRGBA.md)

배경색 `ColorRGBA` 인스턴스

#### Set Signature

> **set** **backgroundColor**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L251)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`ColorRGBA`](../../Color/classes/ColorRGBA.md) |

##### Returns

`void`

***

***

### boundingClientRect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingClientRect**(): `DOMRect`

Defined in: [src/context/RedGPUContext.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L184)

HTML 캔버스의 `DOMRect` 영역 정보를 반환합니다.

##### Returns

`DOMRect`

캔버스 `DOMRect` 객체

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/context/RedGPUContext.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L172)

커맨드 인코더 매니저(`CommandEncoderManager`)를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

***

***

### configurationDescription

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **configurationDescription**(): `GPUCanvasConfiguration`

Defined in: [src/context/RedGPUContext.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L276)

WebGPU 캔버스 구성 정보(`GPUCanvasConfiguration`)를 반환합니다.

##### Returns

`GPUCanvasConfiguration`

`GPUCanvasConfiguration` 객체

***

***

### destroyed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **destroyed**(): `boolean`

Defined in: [src/context/RedGPUContext.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L148)

컨텍스트가 파기(`destroy`)되었는지 여부를 반환합니다.

##### Returns

`boolean`

컨텍스트 파기 여부

***

***

### detector

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **detector**(): [`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

Defined in: [src/context/RedGPUContext.ts:264](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L264)

하드웨어 및 브라우저 환경 감지 매니저(`RedGPUContextDetector`)를 반환합니다.

##### Returns

[`RedGPUContextDetector`](../namespaces/Core/classes/RedGPUContextDetector.md)

`RedGPUContextDetector` 인스턴스

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/context/RedGPUContext.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L160)

드로우 버퍼 매니저(`DrawBufferManager`)를 반환합니다.

##### Returns

`DrawBufferManager`

`DrawBufferManager` 인스턴스

***

***

### globalFragmentSSBO\_BuiltIn

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSSBO\_BuiltIn**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L232)

빌트인 머티리얼용 글로벌 프래그먼트 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

빌트인용 글로벌 프래그먼트 `GlobalStorageBufferManager` 인스턴스

***

***

### globalFragmentSSBO\_PBR

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSSBO\_PBR**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L220)

PBR 머티리얼용 글로벌 프래그먼트 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

PBR용 글로벌 프래그먼트 `GlobalStorageBufferManager` 인스턴스

***

***

### globalVertexSSBO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSSBO**(): [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

Defined in: [src/context/RedGPUContext.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L208)

글로벌 버텍스 스토리지 버퍼 매니저(`GlobalStorageBufferManager`)를 반환합니다.

##### Returns

[`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)

글로벌 버텍스 `GlobalStorageBufferManager` 인스턴스

***

***

### gpuAdapter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuAdapter**(): `GPUAdapter`

Defined in: [src/context/RedGPUContext.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L288)

WebGPU 어댑터(`GPUAdapter`)를 반환합니다.

##### Returns

`GPUAdapter`

`GPUAdapter` 인스턴스

***

***

### gpuContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuContext**(): `GPUCanvasContext`

Defined in: [src/context/RedGPUContext.ts:317](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L317)

WebGPU 캔버스 컨텍스트(`GPUCanvasContext`)를 반환합니다.

##### Returns

`GPUCanvasContext`

`GPUCanvasContext` 인스턴스

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/context/RedGPUContext.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L329)

WebGPU 논리 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:409](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L409)

캔버스의 세로 크기(숫자 또는 `px`/`%` 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

설정된 세로 크기 값

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:413](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L413)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### htmlCanvas

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **htmlCanvas**(): `HTMLCanvasElement`

Defined in: [src/context/RedGPUContext.ts:341](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L341)

렌더링 대상 `HTMLCanvasElement`를 반환합니다.

##### Returns

`HTMLCanvasElement`

`HTMLCanvasElement` 인스턴스

***

***

### keyboardKeyBuffer

#### Get Signature

> **get** **keyboardKeyBuffer**(): `object`

Defined in: [src/context/RedGPUContext.ts:353](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L353)

키보드 키 입력 상태 버퍼를 반환하거나 설정합니다.

##### Returns

`object`

키별 눌림 상태 맵 (`{ [key: string]: boolean }`)

#### Set Signature

> **set** **keyboardKeyBuffer**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L357)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \{\[`p`: `string`\]: `boolean`; \} |

##### Returns

`void`

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:437](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L437)

물리 픽셀 단위의 렌더링 영역 정보를 반환합니다.

##### Returns

`IRedGPURectObject`

물리 픽셀 영역 객체 (`IRedGPURectObject`)

***

***

### renderScale

#### Get Signature

> **get** **renderScale**(): `number`

Defined in: [src/context/RedGPUContext.ts:449](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L449)

렌더링 해상도 배율을 반환하거나 설정합니다.

##### Returns

`number`

현재 렌더링 스케일 배율

#### Set Signature

> **set** **renderScale**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:453](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L453)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/context/RedGPUContext.ts:369](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L369)

GPU 리소스 매니저(`ResourceManager`)를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `IRedGPURectObject`

Defined in: [src/context/RedGPUContext.ts:425](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L425)

CSS 논리 픽셀 단위의 화면 영역 정보를 반환합니다.

##### Returns

`IRedGPURectObject`

CSS 픽셀 영역 객체 (`IRedGPURectObject`)

***

***

### sizeManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sizeManager**(): [`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

Defined in: [src/context/RedGPUContext.ts:381](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L381)

캔버스 크기 및 해상도 관리 매니저(`RedGPUContextSizeManager`)를 반환합니다.

##### Returns

[`RedGPUContextSizeManager`](../namespaces/Core/classes/RedGPUContextSizeManager.md)

`RedGPUContextSizeManager` 인스턴스

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/context/RedGPUContext.ts:393](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L393)

캔버스의 가로 크기(숫자 또는 `px`/`%` 문자열)를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

설정된 가로 크기 값

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/context/RedGPUContext.ts:397](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L397)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/context/RedGPUContext.ts:465](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L465)

RedGPUContext 인스턴스를 파기하고 등록된 모든 뷰, 매니저, 이벤트 리스너 및 WebGPU 디바이스 리소스를 해제합니다.

#### Returns

`void`

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/context/RedGPUContext.ts:555](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/RedGPUContext.ts#L555)

컨텍스트(캔버스)의 가로 및 세로 크기를 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | 가로 크기 (기본값: 현재 설정된 `width`) |
| `h?` | `string` \| `number` | 세로 크기 (기본값: 현재 설정된 `height`) |

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### numViews

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numViews**(): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L52)

등록된 `View3D`의 총 개수를 반환합니다.

##### Returns

`number`

등록된 뷰 개수

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`numViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#numviews)

***

***

### viewList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewList**(): [`View3D`](../../Display/classes/View3D.md)[]

Defined in: [src/context/core/RedGPUContextViewContainer.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L40)

등록된 `View3D` 목록을 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)[]

`View3D` 배열

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`viewList`](../namespaces/Core/classes/RedGPUContextViewContainer.md#viewlist)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### addView()

> **addView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L82)

뷰 리스트의 끝에 `View3D`를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

`view`가 `View3D` 인스턴스가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addview)

***

***

### addViewAt()

> **addViewAt**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L101)

뷰 리스트의 지정된 인덱스에 `View3D`를 배치합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 추가할 `View3D` 인스턴스 |
| `index` | `number` | 배치할 위치 인덱스 (양의 정수) |

#### Returns

`void`

#### Throws

`view`가 `View3D` 인스턴스가 아니거나 `index`가 유효한 uint 범위가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`addViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#addviewat)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L67)

지정된 `View3D`가 현재 컨테이너에 포함되어 있는지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`View3D`](../../Display/classes/View3D.md) | 포함 여부를 확인할 `View3D` 인스턴스 |

#### Returns

`boolean`

포함 여부

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`contains`](../namespaces/Core/classes/RedGPUContextViewContainer.md#contains)

***

***

### getViewAt()

> **getViewAt**(`index`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/context/core/RedGPUContextViewContainer.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L124)

지정된 인덱스에 위치한 `View3D`를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 조회할 뷰의 인덱스 |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

해당 인덱스의 `View3D` 인스턴스

#### Throws

`index`가 유효한 uint 범위가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewat)

***

***

### getViewIndex()

> **getViewIndex**(`view`): `number`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L143)

지정된 `View3D`의 인덱스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 검색할 `View3D` 인스턴스 |

#### Returns

`number`

뷰의 인덱스 (존재하지 않으면 `-1`)

#### Throws

`view`가 `View3D` 인스턴스가 아닐 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`getViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#getviewindex)

***

***

### removeAllViews()

> **removeAllViews**(): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L265)

뷰 리스트에 등록된 모든 `View3D`를 제거합니다.

#### Returns

`void`

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeAllViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeallviews)

***

***

### removeView()

> **removeView**(`view`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:233](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L233)

뷰 리스트에서 지정된 `View3D`를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 제거할 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

해당 뷰가 리스트에 존재하지 않을 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeView`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeview)

***

***

### removeViewAt()

> **removeViewAt**(`index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L251)

뷰 리스트에서 지정된 인덱스의 `View3D`를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 제거할 뷰의 인덱스 |

#### Returns

`void`

#### Throws

`index`가 리스트 범위를 벗어난 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`removeViewAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#removeviewat)

***

***

### setViewIndex()

> **setViewIndex**(`view`, `index`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L162)

등록된 `View3D`를 뷰 리스트의 지정된 인덱스로 이동합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 이동할 `View3D` 인스턴스 |
| `index` | `number` | 이동할 목표 인덱스 |

#### Returns

`void`

#### Throws

뷰가 등록되어 있지 않거나 `index`가 리스트 범위를 벗어난 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`setViewIndex`](../namespaces/Core/classes/RedGPUContextViewContainer.md#setviewindex)

***

***

### swapViews()

> **swapViews**(`view1`, `view2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L188)

뷰 리스트에 등록된 두 `View3D`의 순서를 서로 교환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view1` | [`View3D`](../../Display/classes/View3D.md) | 교환할 첫 번째 `View3D` 인스턴스 |
| `view2` | [`View3D`](../../Display/classes/View3D.md) | 교환할 두 번째 `View3D` 인스턴스 |

#### Returns

`void`

#### Throws

두 뷰 중 하나라도 현재 컨테이너에 등록되어 있지 않은 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViews`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviews)

***

***

### swapViewsAt()

> **swapViewsAt**(`index1`, `index2`): `void`

Defined in: [src/context/core/RedGPUContextViewContainer.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/context/core/RedGPUContextViewContainer.ts#L211)

지정된 두 인덱스에 위치한 `View3D`들의 순서를 서로 교환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | 첫 번째 뷰 인덱스 |
| `index2` | `number` | 두 번째 뷰 인덱스 |

#### Returns

`void`

#### Throws

두 인덱스가 동일하거나 리스트 범위를 벗어난 경우 에러 발생

#### Inherited from

[`RedGPUContextViewContainer`](../namespaces/Core/classes/RedGPUContextViewContainer.md).[`swapViewsAt`](../namespaces/Core/classes/RedGPUContextViewContainer.md#swapviewsat)

</details>
