[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / ToneMappingManager

# Class: ToneMappingManager

Defined in: [src/toneMapping/ToneMappingManager.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L31)

톤 매핑, 대비, 밝기 설정을 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D를 통해 접근합니다.
const toneMappingManager = view.toneMappingManager;
toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new ToneMappingManager**(`redGPUContext`): `ToneMappingManager`

Defined in: [src/toneMapping/ToneMappingManager.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L46)

ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`ToneMappingManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### brightness

#### Get Signature

> **get** **brightness**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L106)

밝기(Brightness)를 반환하거나 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0)

##### Returns

`number`

밝기 값

#### Set Signature

> **set** **brightness**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L110)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### contrast

#### Get Signature

> **get** **contrast**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L89)

명암 대비(Contrast)를 반환하거나 설정합니다. (0.0 ~ 2.0, 기본값: 1.0)

##### Returns

`number`

명암 대비 값

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mode

#### Get Signature

> **get** **mode**(): [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L71)

현재 적용된 톤 매핑 모드를 반환하거나 설정합니다.

##### Returns

[`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

현재 톤 매핑 모드

#### Set Signature

> **set** **mode**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md) |

##### Returns

`void`

***

***

### toneMapping

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **toneMapping**(): `AToneMappingEffect`

Defined in: [src/toneMapping/ToneMappingManager.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L58)

현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다.

##### Returns

`AToneMappingEffect`

활성화된 톤 매핑 이펙트 인스턴스

***

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L119)

현재 톤 매핑 이펙트 리소스를 해제합니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L155)

ToneMappingManager 인스턴스를 파기하고 관련 리소스를 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`view`, `width`, `height`, `currentTextureView`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/toneMapping/ToneMappingManager.ts#L146)

톤 매핑을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스 |
| `width` | `number` | 렌더링 너비 |
| `height` | `number` | 렌더링 높이 |
| `currentTextureView` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 현재 텍스처 뷰 결과 정보 |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

톤 매핑이 적용된 렌더링 결과

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

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

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
