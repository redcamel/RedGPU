[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Grass](../README.md) / GrassManager

# Class: GrassManager

Defined in: [src/landscape/grass/GrassManager.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L37)

지형(`Landscape`) 상의 대규모 잔디 스캐터링, 카메라 중심 GPU 인스턴스 베이킹, GPU 프러스텀 컬링 및 렌더링을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 지형 잔디 매니저를 통해 새로운 잔디 타입 등록
const grass = landscape.grassManager.addType({
    name: 'MeadowGrass',
    mesh: grassMesh,
    densityPerHectare: 50000,
    cullingDistance: 80
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md)\<[`Grass`](Grass.md), [`GrassOptions`](../interfaces/GrassOptions.md)\>

## Constructors



***

### Constructor

> **new GrassManager**(`landscape`): `GrassManager`

Defined in: [src/landscape/grass/GrassManager.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L65)

`GrassManager` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../classes/Landscape.md) | 이 매니저가 속한 대상 `Landscape` 인스턴스 |

#### Returns

`GrassManager`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterManager.md#constructor)

## Accessors



***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceCapacity**(): `number`

Defined in: [src/landscape/grass/GrassManager.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L110)

메가 버퍼(`GrassMegaBuffer`)가 수용할 수 있는 최대 잔디 인스턴스 용량을 반환합니다.

##### Returns

`number`

최대 잔디 인스턴스 수용량

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`instanceCapacity`](../../Core/namespaces/Scatter/classes/AScatterManager.md#instancecapacity)

***

***

### totalInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalInstanceCount**(): `number`

Defined in: [src/landscape/grass/GrassManager.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L90)

등록된 모든 잔디 타입에 대해 현재 베이킹된 총 인스턴스 수를 반환합니다.

##### Returns

`number`

베이킹된 총 인스턴스 수

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`totalInstanceCount`](../../Core/namespaces/Scatter/classes/AScatterManager.md#totalinstancecount)

***

## Methods



***

### addType()

> **addType**(`options`): [`Grass`](Grass.md)

Defined in: [src/landscape/grass/GrassManager.ts:240](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L240)

새로운 잔디(`Grass`) 타입을 생성하여 매니저에 등록하고 메가 버퍼 및 슬롯 풀을 할당합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GrassOptions`](../interfaces/GrassOptions.md) | 잔디 타입 초기화 옵션 |

#### Returns

[`Grass`](Grass.md)

생성 및 등록된 `Grass` 인스턴스

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`addType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#addtype)

***

***

### clearTypes()

> **clearTypes**(): `void`

Defined in: [src/landscape/grass/GrassManager.ts:392](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L392)

등록된 모든 잔디 타입을 제거하고 메가 버퍼 및 슬롯 풀을 초기 상태로 리셋합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`clearTypes`](../../Core/namespaces/Scatter/classes/AScatterManager.md#cleartypes)

***

***

### computeTypeDrawCalls()

> **computeTypeDrawCalls**(`grass`): `number`

Defined in: [src/landscape/grass/GrassManager.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L125)

특정 잔디 타입이 메인 렌더 패스에서 발생시키는 인다이렉트 드로우 콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grass` | [`Grass`](Grass.md) | 계산할 대상 `Grass` 인스턴스 |

#### Returns

`number`

메인 패스 드로우 콜 수 (Near 슬롯 + Far 슬롯)

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypedrawcalls)

***

***

### computeTypeShadowDrawCalls()

> **computeTypeShadowDrawCalls**(`grass`): `number`

Defined in: [src/landscape/grass/GrassManager.ts:307](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L307)

특정 잔디 타입이 그림자 렌더 패스에서 발생시키는 인다이렉트 드로우 콜 수를 계산합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `grass` | [`Grass`](Grass.md) | 계산할 대상 `Grass` 인스턴스 |

#### Returns

`number`

그림자 패스 드로우 콜 수 (Near 슬롯 수)

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`computeTypeShadowDrawCalls`](../../Core/namespaces/Scatter/classes/AScatterManager.md#computetypeshadowdrawcalls)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/grass/GrassManager.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L419)

매니저가 보유한 모든 GPU 버퍼, 파이프라인, 렌더러 및 등록된 잔디 타입 리소스를 파기합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterManager.md#destroy)

***

***

### dispatchCullingPass()

> **dispatchCullingPass**(`computePass`, `renderViewStateData?`): `void`

Defined in: [src/landscape/grass/GrassManager.ts:343](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L343)

컴퓨트 패스 인코더에 잔디 GPU 프러스텀 컬링 디스패치를 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | 컬링 디스패치를 기록할 `GPUComputePassEncoder` |
| `renderViewStateData?` | [`RenderViewStateData`](../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 렌더 뷰 상태 데이터 (생략 시 마지막 `update` 시점의 상태 사용) |

#### Returns

`void`

***

***

### rebakeAll()

> **rebakeAll**(): `void`

Defined in: [src/landscape/grass/GrassManager.ts:485](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L485)

다음 프레임 업데이트 시 모든 잔디 타입의 인스턴스를 강제로 다시 베이킹하도록 플래그를 설정합니다.

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`rebakeAll`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rebakeall)

***

***

### recordResetCommands()

> **recordResetCommands**(`encoder`): `void`

Defined in: [src/landscape/grass/GrassManager.ts:328](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L328)

컬링 패스 실행 전 인다이렉트 드로우 버퍼의 인스턴스 카운트를 초기화하는 커맨드를 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | 명령을 기록할 `GPUCommandEncoder` |

#### Returns

`void`

***

***

### removeType()

> **removeType**(`target`): `boolean`

Defined in: [src/landscape/grass/GrassManager.ts:364](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L364)

지정된 잔디 타입(또는 이름)을 매니저에서 제거하고 할당된 GPU 버퍼 및 슬롯을 해제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Grass`](Grass.md) | 제거할 `Grass` 인스턴스 또는 타입 이름 문자열 |

#### Returns

`boolean`

제거 성공 여부

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`removeType`](../../Core/namespaces/Scatter/classes/AScatterManager.md#removetype)

***

***

### render()

> **render**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/grass/GrassManager.ts:458](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L458)

메인 렌더 패스에 활성화된 모든 잔디 타입을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 렌더링할 대상 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 메인 렌더 패스 인코더 |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`render`](../../Core/namespaces/Scatter/classes/AScatterManager.md#render)

***

***

### renderShadow()

> **renderShadow**(`view`, `passEncoder`): `void`

Defined in: [src/landscape/grass/GrassManager.ts:475](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L475)

방향성 조명 그림자(Directional Shadow) 패스에 잔디 인스턴스를 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 렌더링할 대상 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 그림자 렌더 패스 인코더 |

#### Returns

`void`

#### Overrides

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`renderShadow`](../../Core/namespaces/Scatter/classes/AScatterManager.md#rendershadow)

***

***

### update()

> **update**(`renderViewStateData`, `standalone?`): `void`

Defined in: [src/landscape/grass/GrassManager.ts:148](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/GrassManager.ts#L148)

매 프레임 카메라 이동에 따른 잔디 인스턴스 재베이킹 및 UBO 슬롯 동기화를 수행합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | `undefined` | 현재 프레임의 렌더 뷰 상태 데이터 |
| `standalone?` | `boolean` | `false` | 단독 실행 여부 (`true`일 경우 자체적으로 컴퓨트 패스를 등록) |

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

> **getTypeByName**(`name`): [`Grass`](Grass.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L187)

고유 이름으로 등록된 스캐터 타입 인스턴스를 조회합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 조회할 스캐터 타입 이름 |

#### Returns

[`Grass`](Grass.md)

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
| `type` | [`Grass`](Grass.md) | 등록할 스캐터 타입 인스턴스 |

#### Returns

`void`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`registerTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#registertypeinternal)

***

***

### unregisterTypeInternal()

> **unregisterTypeInternal**(`target`): [`Grass`](Grass.md)

Defined in: [src/landscape/core/scatter/AScatterManager.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterManager.ts#L302)

내부 배열 및 이름 맵(`Map<string, TType>`)에서 대상 스캐터 타입의 등록을 해제하고 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `string` \| [`Grass`](Grass.md) | 등록 해제할 스캐터 타입 인스턴스 또는 타입 이름 문자열 |

#### Returns

[`Grass`](Grass.md)

등록 해제된 스캐터 타입 인스턴스 또는 찾지 못한 경우 `null`

#### Inherited from

[`AScatterManager`](../../Core/namespaces/Scatter/classes/AScatterManager.md).[`unregisterTypeInternal`](../../Core/namespaces/Scatter/classes/AScatterManager.md#unregistertypeinternal)

***

</details>
