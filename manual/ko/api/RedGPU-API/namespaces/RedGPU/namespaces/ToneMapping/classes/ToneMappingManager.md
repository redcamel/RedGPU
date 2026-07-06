[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / ToneMappingManager

# Class: ToneMappingManager

Defined in: [src/toneMapping/ToneMappingManager.ts:29](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L29)

톤 매핑, 대비, 밝기 설정을 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

* ### Example
```typescript
// View3D를 통해 접근합니다.
// Access through View3D.
const toneMappingManager = view.toneMappingManager;
toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

## Constructors

### Constructor

> **new ToneMappingManager**(`redGPUContext`): `ToneMappingManager`

Defined in: [src/toneMapping/ToneMappingManager.ts:42](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L42)

ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`ToneMappingManager`

## Accessors

### brightness

#### Get Signature

> **get** **brightness**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:81](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L81)

밝기(Brightness)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **brightness**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:86](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L86)

밝기(Brightness)를 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### contrast

#### Get Signature

> **get** **contrast**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L70)

명암 대비(Contrast)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:75](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L75)

명암 대비(Contrast)를 설정합니다. (0.0 ~ 2.0, 기본값: 1.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mode

#### Get Signature

> **get** **mode**(): [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L58)

현재 적용된 톤 매핑 모드를 반환합니다.

##### Returns

[`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

#### Set Signature

> **set** **mode**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:63](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L63)

톤 매핑 모드를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md) |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:47](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L47)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

***

### toneMapping

#### Get Signature

> **get** **toneMapping**(): `AToneMappingEffect`

Defined in: [src/toneMapping/ToneMappingManager.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L52)

현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다.

##### Returns

`AToneMappingEffect`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:95](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L95)

톤 매핑 리소스를 해제합니다.

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `currentTextureView`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:111](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/toneMapping/ToneMappingManager.ts#L111)

톤 매핑을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스
| `width` | `number` | 너비
| `height` | `number` | 높이
| `currentTextureView` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 현재 텍스처 뷰 정보

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

렌더링 결과
