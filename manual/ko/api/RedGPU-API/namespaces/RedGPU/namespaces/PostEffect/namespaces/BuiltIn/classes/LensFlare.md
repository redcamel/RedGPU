[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / LensFlare

# Class: LensFlare

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L33)

화면 공간 HDR 하이라이트(다중 코팅 고스트·프레넬 할로·방사형 색수차)와 태양/주광원 9-Tap 깊이 차폐 기반 해석적 광학 요소(정다각형 중공형 코팅 보케·Fraunhofer 회절 스타버스트·아나모픽 스트릭·렌즈 먼지 산란)를 결합한 차세대 하이브리드 렌즈 플레어(Lens Flare) 후처리 이펙트입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
view.builtInEffectManager.useLensFlare = true;
const lensFlare = view.builtInEffectManager.lensFlare;
lensFlare.setCinematic();
lensFlare.intensity = 1.2;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/" />

## See

- [LensFlare (SkyAtmosphere) example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
 - [LensFlare (SkyBox) example](https://redcamel.github.io/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyBox/)

## Extends

- [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md)

## Constructors



***

### Constructor

> **new LensFlare**(`redGPUContext`): `LensFlare`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:46](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L46)

`LensFlare` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`LensFlare`

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`constructor`](../../Core/classes/AMultiPassPostEffect.md#constructor)

## Properties



## Accessors



***

### anamorphicIntensity

#### Get Signature

> **get** **anamorphicIntensity**(): `number` = `0.0`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:270](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L270)

시네마틱 수평 아나모픽 스트릭(Anamorphic Streak) 강도(0.0 ~ 5.0)를 반환하거나 설정합니다.

##### Returns

`number`

아나모픽 스트릭 강도

#### Set Signature

> **set** **anamorphicIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:274](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L274)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### bladeCount

#### Get Signature

> **get** **bladeCount**(): `number` = `8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L236)

조리개 날(Aperture Blades) 개수(4 ~ 12)를 반환하거나 설정합니다. (`6`=정육각형, `8`=정팔각형)

##### Returns

`number`

조리개 날 개수

#### Set Signature

> **set** **bladeCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:240](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L240)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### blurSize

#### Get Signature

> **get** **blurSize**(): `number` = `14`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:304](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L304)

화면 공간 플레어 소프트닝 가우시안 블러 반경(1 ~ 64)을 반환하거나 설정합니다.

##### Returns

`number`

블러 반경

#### Set Signature

> **set** **blurSize**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L308)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### chromaticAberration

#### Get Signature

> **get** **chromaticAberration**(): `number` = `0.015`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:218](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L218)

고스트 및 할로 가장자리의 방사형 색수차(Chromatic Dispersion) 분리 강도(0.0 ~ 0.1)를 반환하거나 설정합니다.

##### Returns

`number`

색수차 분리 강도

#### Set Signature

> **set** **chromaticAberration**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:222](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L222)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostCount

#### Get Signature

> **get** **ghostCount**(): `number` = `8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:110](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L110)

렌즈 경통 내부 다중 반사로 생성되는 고스트(Ghost) 개수(0 ~ 12)를 반환하거나 설정합니다.

##### Returns

`number`

고스트 개수

#### Set Signature

> **set** **ghostCount**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:114](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L114)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostIntensity

#### Get Signature

> **get** **ghostIntensity**(): `number` = `1.15`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:147](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L147)

다중 반사 고스트의 밝기 강도(0.0 ~ 5.0)를 반환하거나 설정합니다.

##### Returns

`number`

고스트 밝기 강도

#### Set Signature

> **set** **ghostIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:151](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L151)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### ghostSpacing

#### Get Signature

> **get** **ghostSpacing**(): `number` = `0.34`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:129](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L129)

화면 중심 광학 축을 따라 배치되는 고스트 간격 배율(0.05 ~ 1.0)을 반환하거나 설정합니다.

##### Returns

`number`

고스트 간격 배율

#### Set Signature

> **set** **ghostSpacing**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:133](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloIntensity

#### Get Signature

> **get** **haloIntensity**(): `number` = `0.65`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:200](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L200)

프레넬 할로 링의 밝기 강도(0.0 ~ 5.0)를 반환하거나 설정합니다.

##### Returns

`number`

할로 링 밝기 강도

#### Set Signature

> **set** **haloIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:204](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloRadius

#### Get Signature

> **get** **haloRadius**(): `number` = `0.46`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:165](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L165)

프레넬 할로 링(Fresnel Halo Ring)의 반경(0.1 ~ 0.9)을 반환하거나 설정합니다.

##### Returns

`number`

할로 링 반경

#### Set Signature

> **set** **haloRadius**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:169](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### haloThickness

#### Get Signature

> **get** **haloThickness**(): `number` = `0.16`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:183](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L183)

프레넬 할로 링의 두께(0.02 ~ 0.5)를 반환하거나 설정합니다.

##### Returns

`number`

할로 링 두께

#### Set Signature

> **set** **haloThickness**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:187](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L187)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### intensity

#### Get Signature

> **get** **intensity**(): `number` = `1.1`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:76](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L76)

전체 렌즈 플레어 최종 합성 강도(0.0 ~ 10.0)를 반환하거나 설정합니다.

##### Returns

`number`

렌즈 플레어 합성 강도

#### Set Signature

> **set** **intensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L80)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### lensDirtIntensity

#### Get Signature

> **get** **lensDirtIntensity**(): `number` = `0.25`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L287)

카메라 렌즈 표면 미세 먼지 산란 마스크 강도(0.0 ~ 2.0)를 반환하거나 설정합니다.

##### Returns

`number`

렌즈 먼지 산란 강도

#### Set Signature

> **set** **lensDirtIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:291](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L291)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### starburstIntensity

#### Get Signature

> **get** **starburstIntensity**(): `number` = `1.0`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:253](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L253)

태양/주광원의 조리개 회절 빛갈라짐(Starburst) 강도(0.0 ~ 5.0)를 반환하거나 설정합니다.

##### Returns

`number`

스타버스트 강도

#### Set Signature

> **set** **starburstIntensity**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:257](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L257)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### threshold

#### Get Signature

> **get** **threshold**(): `number` = `1.8`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L93)

화면 공간 HDR 하이라이트 추출이 시작되는 선형 휘도 임계값(0.1 ~ 20.0)을 반환하거나 설정합니다.

##### Returns

`number`

선형 HDR 휘도 임계값

#### Set Signature

> **set** **threshold**(`value`): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:97](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:438](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L438)

`1/2` 해상도 화면 공간 플레어 생성, HDR 가우시안 블러 소프트닝, 및 풀해상도 정밀 광학 플레어·렌즈 먼지 합성 패스를 순차 실행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |
| `width` | `number` | 렌더링 너비 (단위: 픽셀) |
| `height` | `number` | 렌더링 높이 (단위: 픽셀) |
| `sourceTextureInfo` | [`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md) | 입력 원본 HDR 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../../Core/interfaces/IPostEffectResult.md)

렌즈 플레어가 합성된 최종 HDR 텍스처 정보 (`IPostEffectResult`)

#### Overrides

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`render`](../../Core/classes/AMultiPassPostEffect.md#render)

***

***

### setAnamorphic()

> **setAnamorphic**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:359](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L359)

SF 및 액션 영화 스타일의 가로로 길게 뻗는 시네마틱 아나모픽 수평 스트릭 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setCinematic()

> **setCinematic**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:338](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L338)

8날 대구경 시네마 프라임 렌즈 기반의 풍부한 다각형 보케 고스트와 할로를 제공하는 시네마틱 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setNatural()

> **setNatural**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:317](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L317)

8-Element 물리 렌즈 플레어 기본 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setSolarMax()

> **setSolarMax**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L380)

강렬한 태양 역광 및 사막/우주 씬을 위한 고강도 스타버스트·다중 스펙트럼 고스트 프리셋을 적용합니다.

#### Returns

`void`

***

***

### setSubtle()

> **setSubtle**(): `void`

Defined in: [src/postEffect/builtIn/lensFlare/LensFlare.ts:401](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/lensFlare/LensFlare.ts#L401)

건축 시각화 및 제품 쇼케이스를 위해 시야를 방해하지 않는 절제된 글레어/할로 프리셋을 적용합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### isInstanceofPostEffect

> **isInstanceofPostEffect**: `boolean` = `true`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:14](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L14)

후처리 이펙트 인스턴스 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isInstanceofPostEffect`](../../Core/classes/AMultiPassPostEffect.md#isinstanceofposteffect)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`antialiasingManager`](../../Core/classes/AMultiPassPostEffect.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`commandEncoderManager`](../../Core/classes/AMultiPassPostEffect.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`gpuDevice`](../../Core/classes/AMultiPassPostEffect.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`instanceId`](../../Core/classes/AMultiPassPostEffect.md#instanceid)

***

***

### isLdr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isLdr**(): `boolean` = `false`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L68)

톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.

##### Returns

`boolean`

LDR 공간 동작 여부

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`isLdr`](../../Core/classes/AMultiPassPostEffect.md#isldr)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`name`](../../Core/classes/AMultiPassPostEffect.md#name)

***

***

### passList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **passList**(): ([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:93](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L93)

등록된 내부 단일 패스 이펙트 배열을 반환합니다.

##### Returns

([`ASingleComputePassPostEffect`](../../Core/classes/ASingleComputePassPostEffect.md) \| [`ASingleRenderPassPostEffect`](../../Core/classes/ASingleRenderPassPostEffect.md) \| [`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md))[]

내부 단일 패스 이펙트 배열 (`(ASingleComputePassPostEffect | ASingleRenderPassPostEffect | AMultiPassPostEffect)[]`)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`passList`](../../Core/classes/AMultiPassPostEffect.md#passlist)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`redGPUContext`](../../Core/classes/AMultiPassPostEffect.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`resourceManager`](../../Core/classes/AMultiPassPostEffect.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`uuid`](../../Core/classes/AMultiPassPostEffect.md#uuid)

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L80)

모든 내부 패스의 비디오 메모리 사용량 합계(바이트)를 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`videoMemorySize`](../../Core/classes/AMultiPassPostEffect.md#videomemorysize)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L115)

등록된 모든 내부 패스의 캐시 리소스를 비웁니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`clear`](../../Core/classes/AMultiPassPostEffect.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/core/AMultiPassPostEffect.ts:101](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/AMultiPassPostEffect.ts#L101)

모든 내부 패스 이펙트와 할당된 리소스를 파기합니다.

#### Returns

`void`

#### Inherited from

[`AMultiPassPostEffect`](../../Core/classes/AMultiPassPostEffect.md).[`destroy`](../../Core/classes/AMultiPassPostEffect.md#destroy)

***

</details>
