[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [DrawDebugger](../README.md) / ADrawDebuggerLight

# Abstract Class: ADrawDebuggerLight\<T\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L29)

광원(Light) 디버거들의 조명 시각 가이드와 레이블 아이콘을 렌더링하기 위한 추상 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`DrawDebuggerDirectionalLight`](DrawDebuggerDirectionalLight.md)
- [`DrawDebuggerPointLight`](DrawDebuggerPointLight.md)
- [`DrawDebuggerSpotLight`](DrawDebuggerSpotLight.md)

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| <a id="type-parameter-t"></a> `T` *extends* [`ABaseLight`](../../../../Light/namespaces/Core/classes/ABaseLight.md) | 디버깅 대상 조명 클래스 타입 (`ABaseLight` 상속) |

## Constructors



***

### Constructor

> **new ADrawDebuggerLight**\<`T`\>(`redGPUContext`, `target`, `labelIcon`, `color`, `maxLines?`): `ADrawDebuggerLight`\<`T`\>

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L55)

`ADrawDebuggerLight` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `target` | `T` | `undefined` | 시각화할 대상 조명 객체 |
| `labelIcon` | `string` | `undefined` | 조명 위치에 표시할 3D 텍스트 아이콘 문자열 |
| `color` | \[`number`, `number`, `number`\] | `undefined` | 디버그 라인의 RGB 색상 배열 (`[r, g, b]`, 0~255) |
| `maxLines?` | `number` | `32` | 버텍스 버퍼에 할당할 최대 라인 수 (기본값: 32) |

#### Returns

`ADrawDebuggerLight`\<`T`\>

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): [`TextField3D`](../../../classes/TextField3D.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L92)

조명 위치를 표시하는 3D 텍스트 레이블 객체를 반환합니다.

##### Returns

[`TextField3D`](../../../classes/TextField3D.md)

3D 텍스트 레이블 객체

***

***

### lightDebugMesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lightDebugMesh**(): [`Mesh`](../../../classes/Mesh.md)

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L104)

조명 가이드를 그리는 디버그 메시 객체를 반환합니다.

##### Returns

[`Mesh`](../../../classes/Mesh.md)

조명 디버그 메시 객체

***

***

### target

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **target**(): `T`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L80)

디버깅 대상 조명 객체를 반환합니다.

##### Returns

`T`

대상 조명 객체

***

## Methods



***

### render()

> `abstract` **render**(`renderViewStateData`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L161)

조명 디버그 가이드를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

***

***

### updateVertexBuffer()

> **updateVertexBuffer**(`lines`, `vertexBuffer`): `void`

Defined in: [src/display/drawDebugger/light/ADrawDebuggerLight.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/drawDebugger/light/ADrawDebuggerLight.ts#L119)

선분 좌표 목록을 기반으로 디버그 메시의 정점 버퍼 데이터를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lines` | `number`[][][] | 시작점과 끝점 좌표 쌍의 배열 (`[[x1, y1, z1], [x2, y2, z2]][]`) |
| `vertexBuffer` | [`VertexBuffer`](../../../../Resource/classes/VertexBuffer.md) | 데이터를 갱신할 대상 정점 버퍼 |

#### Returns

`void`

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

</details>
