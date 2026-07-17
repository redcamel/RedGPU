[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyAtmosphere

# Class: SkyAtmosphere

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:38](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L38)

SkyAtmosphere 클래스는 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 시스템입니다.

레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering), 오존 흡수(Ozone Absorption) 등을 시뮬레이션하여 사실적인 하늘과 노을, Aerial Perspective 효과를 생성합니다.

이 시스템은 전산량이 많은 물리 연산을 실시간으로 처리하기 위해 여러 단계의 LUT(Look Up Table) 생성 패스를 거칩니다.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new SkyAtmosphere**(`redGPUContext`): `SkyAtmosphere`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:128](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L128)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`SkyAtmosphere`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### absorptionCoefficient

#### Get Signature

> **get** **absorptionCoefficient**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:290](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L290)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **absorptionCoefficient**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:294](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L294)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### absorptionTentWidth

#### Get Signature

> **get** **absorptionTentWidth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:306](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L306)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTentWidth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:310](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L310)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### absorptionTipAltitude

#### Get Signature

> **get** **absorptionTipAltitude**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:298](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L298)

##### Returns

`number`

#### Set Signature

> **set** **absorptionTipAltitude**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:302](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L302)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### aerialPerspectiveDistanceScale

#### Get Signature

> **get** **aerialPerspectiveDistanceScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:194](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L194)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveDistanceScale**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:198](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L198)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### aerialPerspectiveLUT

#### Get Signature

> **get** **aerialPerspectiveLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:358](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L358)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### aerialPerspectiveStartDepth

#### Get Signature

> **get** **aerialPerspectiveStartDepth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:202](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L202)

##### Returns

`number`

#### Set Signature

> **set** **aerialPerspectiveStartDepth**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:206](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L206)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### atmosphereHeight

#### Get Signature

> **get** **atmosphereHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:226](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L226)

##### Returns

`number`

#### Set Signature

> **set** **atmosphereHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:230](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L230)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### atmosphereSampler

#### Get Signature

> **get** **atmosphereSampler**(): [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:374](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L374)

##### Returns

[`Sampler`](../../Resource/classes/Sampler.md)

***

### cloudCoverage

#### Get Signature

> **get** **cloudCoverage**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:170](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L170)

##### Returns

`number`

#### Set Signature

> **set** **cloudCoverage**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:174](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L174)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudDensity

#### Get Signature

> **get** **cloudDensity**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:178](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L178)

##### Returns

`number`

#### Set Signature

> **set** **cloudDensity**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:182](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L182)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudHeight

#### Get Signature

> **get** **cloudHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:186](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L186)

##### Returns

`number`

#### Set Signature

> **set** **cloudHeight**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:190](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L190)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### cloudTimeMultiplier

#### Get Signature

> **get** **cloudTimeMultiplier**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:162](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L162)

##### Returns

`number`

#### Set Signature

> **set** **cloudTimeMultiplier**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:166](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L166)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### groundAlbedo

#### Get Signature

> **get** **groundAlbedo**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:282](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L282)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **groundAlbedo**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:286](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L286)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### groundRadius

#### Get Signature

> **get** **groundRadius**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:218](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L218)

##### Returns

`number`

#### Set Signature

> **set** **groundRadius**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:222](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L222)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieAbsorption

#### Get Signature

> **get** **mieAbsorption**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:242](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L242)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieAbsorption**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:246](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L246)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### mieAnisotropy

#### Get Signature

> **get** **mieAnisotropy**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:274](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L274)

##### Returns

`number`

#### Set Signature

> **set** **mieAnisotropy**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:278](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L278)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieExponentialDistribution

#### Get Signature

> **get** **mieExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:266](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L266)

##### Returns

`number`

#### Set Signature

> **set** **mieExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:270](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L270)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### mieScattering

#### Get Signature

> **get** **mieScattering**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:234](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L234)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **mieScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:238](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L238)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### multiScatLUT

#### Get Signature

> **get** **multiScatLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:350](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L350)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### multiScatteringFactor

#### Get Signature

> **get** **multiScatteringFactor**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:314](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L314)

##### Returns

`number`

#### Set Signature

> **set** **multiScatteringFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:318](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L318)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### params

#### Get Signature

> **get** **params**(): `object`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:158](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L158)

##### Returns

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `absorptionCoefficient` | `number`[] | - | 오존 흡수 계수
| `absorptionTentWidth` | `number` | `15.0` | 오존 분포 두께
| `absorptionTipAltitude` | `number` | `25.0` | 오존 최대 밀도 고도 (km)
| `aerialPerspectiveDistanceScale` | `number` | `100.0` | Aerial Perspective 거리 스케일
| `aerialPerspectiveStartDepth` | `number` | `0.0` | Aerial Perspective 시작 깊이
| `atmosphereHeight` | `number` | `60.0` | 대기권 높이 (km)
| `cameraHeight` | `number` | `0.001` | 카메라 현재 고도 (km)
| `cloudCoverage` | `number` | `0.4` | 구름 커버리지 (0 ~ 1)
| `cloudDensity` | `number` | `0.7` | 구름 밀도 (0 ~ 1)
| `cloudHeight` | `number` | `5.0` | 구름 고도 (km)
| `cloudTime` | `number` | `0.0` | 구름 시간 축 정보
| `cloudTimeMultiplier` | `number` | `0.0` | 구름 속도 배수
| `groundAlbedo` | `number`[] | - | 지표면 반사율
| `groundRadius` | `number` | `6360.0` | 행성 반경 (km)
| `mieAbsorption` | `number`[] | - | 미 흡수 계수
| `mieAnisotropy` | `number` | `0.8` | 미 비등방성 계수
| `mieExponentialDistribution` | `number` | `1.2` | 미 분포 고도 (km)
| `mieScattering` | `number`[] | - | 미 산란 계수
| `multiScatteringFactor` | `number` | `1.0` | 다중 산란 보정 계수
| `rayleighExponentialDistribution` | `number` | `8.0` | 레일리 분포 고도 (km)
| `rayleighScattering` | `number`[] | - | 레일리 산란 계수
| `skyLuminanceFactor` | `number`[] | - | 하늘 전체 휘도 배수
| `sunDirection` | `Float32Array`\<`ArrayBuffer`\> | - | 태양 방향 벡터
| `sunIntensity` | `number` | `100000.0` | 태양 광도
| `sunLimbDarkening` | `number` | `0.5` | 태양 주변 감쇠 강도
| `sunSize` | `number` | `0.533` | 태양 시각적 크기
| `transmittanceMinLightElevationAngle` | `number` | `-90.0` | 투과율 계산 최소 고도각

***

### postEffect

#### Get Signature

> **get** **postEffect**(): [`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:154](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L154)

Post Effect 인스턴스 반환

##### Returns

[`SkyAtmospherePostEffect`](../namespaces/CoreSkyAtmosphere/classes/SkyAtmospherePostEffect.md)

***

### rayleighExponentialDistribution

#### Get Signature

> **get** **rayleighExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:258](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L258)

##### Returns

`number`

#### Set Signature

> **set** **rayleighExponentialDistribution**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:262](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### rayleighScattering

#### Get Signature

> **get** **rayleighScattering**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:250](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L250)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **rayleighScattering**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:254](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L254)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### skyAtmosphereIrradianceLUT

#### Get Signature

> **get** **skyAtmosphereIrradianceLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:362](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L362)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyAtmosphereReflectionLUT

#### Get Signature

> **get** **skyAtmosphereReflectionLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:366](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L366)

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

***

### skyLight

#### Get Signature

> **get** **skyLight**(): [`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:370](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L370)

##### Returns

[`SkyLight`](../namespaces/CoreSkyAtmosphere/classes/SkyLight.md)

***

### skyLuminanceFactor

#### Get Signature

> **get** **skyLuminanceFactor**(): \[`number`, `number`, `number`\]

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:338](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L338)

##### Returns

\[`number`, `number`, `number`\]

#### Set Signature

> **set** **skyLuminanceFactor**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:342](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L342)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

### skyViewLUT

#### Get Signature

> **get** **skyViewLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:354](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L354)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### sunLimbDarkening

#### Get Signature

> **get** **sunLimbDarkening**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:330](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L330)

##### Returns

`number`

#### Set Signature

> **set** **sunLimbDarkening**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:334](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L334)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### sunSize

#### Get Signature

> **get** **sunSize**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:322](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L322)

##### Returns

`number`

#### Set Signature

> **set** **sunSize**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:326](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### transmittanceLUT

#### Get Signature

> **get** **transmittanceLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:346](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L346)

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

***

### transmittanceMinLightElevationAngle

#### Get Signature

> **get** **transmittanceMinLightElevationAngle**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:210](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L210)

##### Returns

`number`

#### Set Signature

> **set** **transmittanceMinLightElevationAngle**(`v`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:214](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:414](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L414)

#### Returns

`void`

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:396](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L396)

포스트 이펙트 렌더링을 수행합니다. (오브젝트 영역 대기 투과 처리 전용)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |
| `width` | `number` |
| `height` | `number` |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

***

### renderBackground()

> **renderBackground**(`renderViewStateData`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:382](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L382)

배경 렌더링을 수행합니다. (무한 거리 배경 처리 전용)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) |

#### Returns

`void`

***

### update()

> **update**(`view`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:401](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/display/skyAtmosphere/SkyAtmosphere.ts#L401)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](View3D.md) |

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
