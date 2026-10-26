[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageManager

# Class: FoliageManager

Defined in: [src/landscape/foliage/FoliageManager.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L41)

지형(`Landscape`) 상의 식생 타입 등록, 서브 셀 스트리밍, GPU 컬링 및 렌더링을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 지형 식생 매니저를 통해 새로운 식생 타입 등록
const foliage = landscape.foliageManager.addType({
    name: 'PineTree',
    lods: [{ mesh: pineMesh, lodDistance: 80 }],
    densityPerHectare: 120
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md)\<[`Foliage`](Foliage.md), [`FoliageOptions`](../interfaces/FoliageOptions.md)\>

## Constructors



***

### Constructor

> **new FoliageManager**(`landscape`): `FoliageManager`

Defined in: [src/landscape/foliage/FoliageManager.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L64)

`FoliageManager` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../classes/Landscape.md) | 식생이 배치될 대상 `Landscape` 인스턴스 |

#### Returns

`FoliageManager`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterManager.md#constructor)

## Accessors



***

### depthPrepassDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassDrawCalls**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L125)

깊이 프리패스(Depth Prepass)에서 발생하는 총 드로우 콜 수를 반환합니다.

##### Returns

`number`

깊이 프리패스 드로우 콜 수

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceCapacity**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L193)

메가 버퍼(`FoliageMegaBuffer`)의 최대 인스턴스 수용량을 반환합니다.

##### Returns

`number`

최대 인스턴스 수용량

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`instanceCapacity`](../../Core/namespaces/Scatter/classes/AScatterManager.md#instancecapacity)

***

***

### mainPassDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainPassDrawCalls**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:152](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L152)

메인 렌더 패스에서 발생하는 총 드로우 콜 수를 반환합니다.

##### Returns

`number`

메인 패스 드로우 콜 수

***

***

### subCellSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **subCellSize**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L205)

식생 스트리밍 서브 셀의 한 변 크기(미터 단위)를 반환합니다.

##### Returns

`number`

서브 셀 크기 (미터)

***

***

### totalInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalInstanceCount**(): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L174)

현재 활성화된 모든 식생 타입의 총 인스턴스 수를 반환합니다.

##### Returns

`number`

활성 인스턴스 총합

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`totalInstanceCount`](../../Core/namespaces/Scatter/classes/AScatterManager.md#totalinstancecount)

***

## Methods



***

### addType()

> **addType**(`options`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/foliage/FoliageManager.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L419)

새로운 식생(`Foliage`) 타입을 생성하여 매니저에 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`FoliageOptions`](../interfaces/FoliageOptions.md) | 식생 생성 옵션(`FoliageOptions`) |

#### Returns

[`Foliage`](Foliage.md)

생성 및 등록된 `Foliage` 인스턴스

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`addType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#addtype)

***

***

### clearTypes()

> **clearTypes**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:402](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L402)

등록된 모든 식생 타입을 제거하고 내부 더티 마스크를 초기화합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`clearTypes`](../../Core/namespaces/Scatter/classes/AScatterManager.md#cleartypes)

***

***

### computeTypeDrawCalls()

> **computeTypeDrawCalls**(`foliage`): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:328](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L328)

단일 식생 타입의 메인 및 깊이 프리패스 드로우 콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliage` | [`Foliage`](Foliage.md) | 계산할 대상 `Foliage` 인스턴스 |

#### Returns

`number`

드로우 콜 수

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypedrawcalls)

***

***

### computeTypeShadowDrawCalls()

> **computeTypeShadowDrawCalls**(`foliage`): `number`

Defined in: [src/landscape/foliage/FoliageManager.ts:488](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L488)

단일 식생 타입의 그림자 패스 드로우 콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliage` | [`Foliage`](Foliage.md) | 계산할 대상 `Foliage` 인스턴스 |

#### Returns

`number`

그림자 패스 드로우 콜 수

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeShadowDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypeshadowdrawcalls)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L237)

매니저가 보유한 모든 식생 타입과 GPU 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterManager.md#destroy)

***

***

### dispatchCullingPass()

> **dispatchCullingPass**(`computePass`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L229)

공유 컴퓨트 패스 인코더에 식생 GPU 컬링 디스패치 명령을 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | 대상 `GPUComputePassEncoder` 인스턴스 |

#### Returns

`void`

***

***

### rebakeAll()

> **rebakeAll**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:464](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L464)

등록된 모든 식생 타입의 마운트된 서브 셀을 즉시 재베이킹합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`rebakeAll`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rebakeall)

***

***

### recordResetCommands()

> **recordResetCommands**(`encoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L217)

간접 드로우 버퍼 카운터 초기화 명령을 커맨드 인코더에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | 대상 `GPUCommandEncoder` 인스턴스 |

#### Returns

`void`

***

***

### removeType()

> **removeType**(`target`): `boolean`

Defined in: [src/landscape/foliage/FoliageManager.ts:384](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L384)

지정한 식생 인스턴스 또는 이름과 일치하는 식생 타입을 매니저에서 제거하고 파기합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Foliage`](Foliage.md) | 제거할 `Foliage` 인스턴스 또는 식생 타입 이름 |

#### Returns

`boolean`

제거 성공 여부

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`removeType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#removetype)

***

***

### render()

> **render**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:350](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L350)

메인 렌더 패스에 등록된 모든 식생 타입을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 대상 `GPURenderPassEncoder` 인스턴스 |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`render`](../../Core/namespaces/Scatter/classes/AScatterManager.md#render)

***

***

### renderShadow()

> **renderShadow**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:367](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L367)

디렉셔널 그림자 패스에 등록된 모든 식생 타입의 그림자를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 그림자 패스의 `GPURenderPassEncoder` 인스턴스 |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`renderShadow`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rendershadow)

***

***

### repopulateAll()

> **repopulateAll**(): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:448](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L448)

등록된 모든 식생 타입의 서브 셀 캐시를 초기화하고 인스턴스 재배치를 예약합니다.

#### Returns

`void`

***

***

### update()

> **update**(`renderViewStateData`, `standalone?`): `void`

Defined in: [src/landscape/foliage/FoliageManager.ts:257](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/FoliageManager.ts#L257)

매 프레임 식생 서브 셀 스트리밍, 유니폼 갱신 및 컬링 상태를 업데이트합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | `undefined` | 현재 프레임의 렌더 뷰 상태 데이터 |
| `standalone?` | `boolean` | `false` | 단독 컴퓨트 패스로 즉시 컬링을 디스패치할지 여부 (기본값: `false`) |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`update`](../../Core/namespaces/Scatter/classes/AScatterManager.md#update)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`antialiasingManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`commandEncoderManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#commandencodermanager)

***

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L69)

스캐터 매니저의 활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

활성화 여부

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L73)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`enabled`](../../Core/namespaces/Scatter/classes/AScatterManager.md#enabled)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`gpuDevice`](../../Core/namespaces/Scatter/classes/AScatterManager.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`instanceId`](../../Core/namespaces/Scatter/classes/AScatterManager.md#instanceid)

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../classes/Landscape.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L57)

이 스캐터 매니저가 속한 `Landscape` 인스턴스를 반환합니다.

##### Returns

[`Landscape`](../../../classes/Landscape.md)

소유자 `Landscape` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`landscape`](../../Core/namespaces/Scatter/classes/AScatterManager.md#landscape)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`name`](../../Core/namespaces/Scatter/classes/AScatterManager.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`redGPUContext`](../../Core/namespaces/Scatter/classes/AScatterManager.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`resourceManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md#resourcemanager)

***

***

### shadowDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L136)

그림자 투사(`castShadow`)가 활성화된 모든 스캐터 타입의 총 그림자 패스 드로우콜 수를 반환합니다.

##### Returns

`number`

총 그림자 패스 드로우콜 수

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`shadowDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#shadowdrawcalls)

***

***

### totalDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L117)

활성 상태에서 등록된 모든 스캐터 타입의 총 메인 패스 드로우콜 수를 반환합니다.

##### Returns

`number`

총 메인 패스 드로우콜 수

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`totalDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#totaldrawcalls)

***

***

### types

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **types**(): `TType`[]

Defined in: [src/landscape/core/scatter/AScatterManager.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L85)

현재 등록된 모든 스캐터 타입(`TType[]`) 목록을 반환합니다.

##### Returns

`TType`[]

등록된 스캐터 타입 배열 (`TType[]`)

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`types`](../../Core/namespaces/Scatter/classes/AScatterManager.md#types)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`uuid`](../../Core/namespaces/Scatter/classes/AScatterManager.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### getTypeByName()

> **getTypeByName**(`name`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L187)

고유 이름으로 등록된 스캐터 타입 인스턴스를 조회합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 조회할 스캐터 타입 이름 |

#### Returns

[`Foliage`](Foliage.md)

일치하는 스캐터 타입 인스턴스 또는 존재하지 않을 경우 `undefined`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`getTypeByName`](../../Core/namespaces/Scatter/classes/AScatterManager.md#gettypebyname)

***

***

### registerTypeInternal()

> **registerTypeInternal**(`type`): `void`

Defined in: [src/landscape/core/scatter/AScatterManager.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L285)

스캐터 타입 인스턴스를 내부 배열 및 이름 맵(`Map<string, TType>`)에 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | [`Foliage`](Foliage.md) | 등록할 스캐터 타입 인스턴스 |

#### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`registerTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#registertypeinternal)

***

***

### unregisterTypeInternal()

> **unregisterTypeInternal**(`target`): [`Foliage`](Foliage.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L302)

내부 배열 및 이름 맵(`Map<string, TType>`)에서 대상 스캐터 타입의 등록을 해제하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Foliage`](Foliage.md) | 등록 해제할 스캐터 타입 인스턴스 또는 타입 이름 문자열 |

#### Returns

[`Foliage`](Foliage.md)

등록 해제된 스캐터 타입 인스턴스 또는 찾지 못한 경우 `null`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`unregisterTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#unregistertypeinternal)

***

</details>
