[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SkyAtmosphere

# Class: SkyAtmosphere

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L54)

레일리 산란(Rayleigh), 미 산란(Mie), 오존 흡수(Ozone)를 다단계 LUT로 사전 계산하여 실시간 하늘 배경, 대기 원근(Aerial Perspective) 및 간접 조명(IBL)을 생성하는 물리 기반 대기 시뮬레이션 클래스입니다.

***

### Example
```typescript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
view.skyAtmosphere = skyAtmosphere;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/" style="width:100%; height:500px;"></iframe>

## See

- [SkyAtmosphere Basic Example](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/skyAtmosphere/)
 - [SkyAtmosphere Scattering Test](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/scatteringTest/)
 - [SkyAtmosphere GLTF Example](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/gltf/)
 - [SkyAtmosphere LUT Generator Test](https://redcamel.github.io/RedGPU/examples/3d/skyAtmosphere/generator/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SkyAtmosphere**(`redGPUContext`): `SkyAtmosphere`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L149)

SkyAtmosphere 인스턴스를 생성합니다.

#### Example
```typescript
const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`SkyAtmosphere`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### absorption

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **absorption**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:479](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L479)

오존층의 빛 흡수 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(88, 255, 12)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

오존 흡수 `ColorRGB` 인스턴스

***

***

### absorptionScale

#### Get Signature

> **get** **absorptionScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:491](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L491)

오존층의 빛 흡수 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.001881)

##### Returns

`number`

오존 흡수 계수 배율 (km⁻¹)

#### Set Signature

> **set** **absorptionScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:495](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L495)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### absorptionTentWidth

#### Get Signature

> **get** **absorptionTentWidth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:525](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L525)

오존층 분포의 두께(단위: km, 범위: 1 ~ 50)를 가져오거나 설정합니다. (기본값: 15.0)

##### Returns

`number`

오존 분포 두께 (km)

#### Set Signature

> **set** **absorptionTentWidth**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:529](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L529)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### absorptionTipAltitude

#### Get Signature

> **get** **absorptionTipAltitude**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:509](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L509)

오존 밀도가 최대가 되는 고도(단위: km, 범위: 0 ~ 100)를 가져오거나 설정합니다. (기본값: 25.0)

##### Returns

`number`

오존 최대 밀도 고도 (km)

#### Set Signature

> **set** **absorptionTipAltitude**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:513](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L513)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### aerialPerspectiveDistanceScale

#### Get Signature

> **get** **aerialPerspectiveDistanceScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L265)

대기 원근(Aerial Perspective) 효과의 거리 스케일(범위: 1 ~ 1000)을 가져오거나 설정합니다. (기본값: 100.0)

##### Returns

`number`

거리 스케일

#### Set Signature

> **set** **aerialPerspectiveDistanceScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L269)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### aerialPerspectiveLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aerialPerspectiveLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:637](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L637)

거리별 대기 산란을 저장한 대기 원근(Aerial Perspective) 볼륨 LUT 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Aerial Perspective LUT 텍스처

***

***

### aerialPerspectiveStartDepth

#### Get Signature

> **get** **aerialPerspectiveStartDepth**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L281)

대기 원근(Aerial Perspective) 효과가 시작되는 깊이(범위: 0 ~ 100)를 가져오거나 설정합니다. (기본값: 0.0)

##### Returns

`number`

시작 깊이

#### Set Signature

> **set** **aerialPerspectiveStartDepth**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L285)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### atmosphereHeight

#### Get Signature

> **get** **atmosphereHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L313)

대기권의 두께(단위: km)를 가져오거나 설정합니다. (기본값: 60.0)

##### Returns

`number`

대기권 높이 (km)

#### Set Signature

> **set** **atmosphereHeight**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:317](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L317)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### atmosphereSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **atmosphereSampler**(): [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:673](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L673)

대기 LUT 샘플링에 사용되는 선형 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../Resource/classes/Sampler.md)

Sampler 인스턴스

***

***

### cloudCoverage

#### Get Signature

> **get** **cloudCoverage**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L217)

하늘을 덮는 구름의 범위(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.4)

##### Returns

`number`

구름 커버리지 (0.0 ~ 1.0)

#### Set Signature

> **set** **cloudCoverage**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudDensity

#### Get Signature

> **get** **cloudDensity**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L233)

구름의 밀도(0.0 ~ 1.0)를 가져오거나 설정합니다. (기본값: 0.7)

##### Returns

`number`

구름 밀도 (0.0 ~ 1.0)

#### Set Signature

> **set** **cloudDensity**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudHeight

#### Get Signature

> **get** **cloudHeight**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L249)

구름이 형성되는 고도(단위: km, 범위: 0.1 ~ 20.0)를 가져오거나 설정합니다. (기본값: 5.0)

##### Returns

`number`

구름 고도 (km)

#### Set Signature

> **set** **cloudHeight**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L253)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### cloudTimeMultiplier

#### Get Signature

> **get** **cloudTimeMultiplier**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L201)

구름 애니메이션 시간 진행 배수를 가져오거나 설정합니다. (기본값: 0.0)

##### Returns

`number`

구름 시간 배수

#### Set Signature

> **set** **cloudTimeMultiplier**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L205)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### groundAlbedo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **groundAlbedo**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:467](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L467)

지표면의 반사율(Albedo) RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(102, 102, 102)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

지표면 반사율 `ColorRGB` 인스턴스

***

***

### groundRadius

#### Get Signature

> **get** **groundRadius**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L297)

행성의 반경(단위: km)을 가져오거나 설정합니다. (기본값: 6360.0)

##### Returns

`number`

행성 반경 (km)

#### Set Signature

> **set** **groundRadius**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L301)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### irradianceLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:649](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L649)

대기 산란 기반 간접 난반사(Irradiance) 큐브 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Irradiance 큐브 텍스처

***

***

### mieAbsorption

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mieAbsorption**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:359](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L359)

미 흡수(Mie Absorption)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

미 흡수 `ColorRGB` 인스턴스

***

***

### mieAbsorptionScale

#### Get Signature

> **get** **mieAbsorptionScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:371](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L371)

미 흡수(Mie Absorption) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.000444)

##### Returns

`number`

미 흡수 계수 배율 (km⁻¹)

#### Set Signature

> **set** **mieAbsorptionScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:375](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L375)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieAnisotropy

#### Get Signature

> **get** **mieAnisotropy**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L451)

미 산란의 비등방성 계수(범위: 0 ~ 0.999)를 가져오거나 설정합니다. (기본값: 0.8)

##### Returns

`number`

미 비등방성 계수

#### Set Signature

> **set** **mieAnisotropy**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:455](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L455)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieExponentialDistribution

#### Get Signature

> **get** **mieExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:435](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L435)

미 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 1.2)

##### Returns

`number`

미 분포 고도 (km)

#### Set Signature

> **set** **mieExponentialDistribution**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:439](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L439)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mieScattering

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mieScattering**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L329)

미 산란(Mie Scattering)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

미 산란 `ColorRGB` 인스턴스

***

***

### mieScatteringScale

#### Get Signature

> **get** **mieScatteringScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:341](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L341)

미 산란(Mie Scattering) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.003996)

##### Returns

`number`

미 산란 계수 배율 (km⁻¹)

#### Set Signature

> **set** **mieScatteringScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:345](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L345)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### multiScatteringFactor

#### Get Signature

> **get** **multiScatteringFactor**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:541](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L541)

다중 산란(Multi-Scattering) 기여도 배율(범위: 0 ~ 10)을 가져오거나 설정합니다. (기본값: 1.0)

##### Returns

`number`

다중 산란 배율

#### Set Signature

> **set** **multiScatteringFactor**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:545](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L545)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### multiScatteringLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **multiScatteringLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:613](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L613)

다중 산란(Multi-Scattering) 2D LUT 텍스처를 반환합니다.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Multi-Scattering LUT 텍스처

***

***

### params

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **params**(): `object`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L189)

대기 물리 시뮬레이션 파라미터 객체를 반환합니다.

::: warning
이 속성은 시스템 유니폼 업데이트를 위한 내부 전용입니다.<br/>반환된 객체의 내부 속성을 직접 수정하지 마십시오.
:::

##### Returns

`object`

시뮬레이션 파라미터 객체

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `absorptionCoefficient` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L76) |
| `absorptionTentWidth` | `number` | `15.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L79) |
| `absorptionTipAltitude` | `number` | `25.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L77) |
| `aerialPerspectiveDistanceScale` | `number` | `100.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:85](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L85) |
| `aerialPerspectiveStartDepth` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L86) |
| `atmosphereHeight` | `number` | `60.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L84) |
| `cameraHeight` | `number` | `0.001` | [src/display/skyAtmosphere/SkyAtmosphere.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L90) |
| `cloudCoverage` | `number` | `0.4` | [src/display/skyAtmosphere/SkyAtmosphere.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L93) |
| `cloudDensity` | `number` | `0.7` | [src/display/skyAtmosphere/SkyAtmosphere.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L94) |
| `cloudHeight` | `number` | `5.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L95) |
| `cloudTime` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L91) |
| `cloudTimeMultiplier` | `number` | `0.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L92) |
| `groundAlbedo` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L78) |
| `groundRadius` | `number` | `6360.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L83) |
| `mieAbsorption` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L74) |
| `mieAnisotropy` | `number` | `0.8` | [src/display/skyAtmosphere/SkyAtmosphere.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L73) |
| `mieExponentialDistribution` | `number` | `1.2` | [src/display/skyAtmosphere/SkyAtmosphere.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L75) |
| `mieScattering` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L72) |
| `multiScatteringFactor` | `number` | `1.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L81) |
| `rayleighExponentialDistribution` | `number` | `8.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L71) |
| `rayleighScattering` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L70) |
| `skyLuminanceFactor` | `number`[] | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L80) |
| `sunDirection` | `Float32Array`\<`ArrayBuffer`\> | - | [src/display/skyAtmosphere/SkyAtmosphere.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L82) |
| `sunIntensity` | `number` | `100000.0` | [src/display/skyAtmosphere/SkyAtmosphere.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L87) |
| `sunLimbDarkening` | `number` | `0.5` | [src/display/skyAtmosphere/SkyAtmosphere.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L89) |
| `sunSize` | `number` | `0.533` | [src/display/skyAtmosphere/SkyAtmosphere.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L88) |

***

***

### rayleighExponentialDistribution

#### Get Signature

> **get** **rayleighExponentialDistribution**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:419](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L419)

레일리 산란 입자의 지수 분포 고도(단위: km, 범위: 0.1 ~ 100)를 가져오거나 설정합니다. (기본값: 8.0)

##### Returns

`number`

레일리 분포 고도 (km)

#### Set Signature

> **set** **rayleighExponentialDistribution**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:423](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L423)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rayleighScattering

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rayleighScattering**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:389](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L389)

레일리 산란(Rayleigh Scattering)의 RGB 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(45, 104, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

레일리 산란 `ColorRGB` 인스턴스

***

***

### rayleighScatteringScale

#### Get Signature

> **get** **rayleighScatteringScale**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:401](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L401)

레일리 산란(Rayleigh Scattering) 계수 배율(단위: km⁻¹, 0 이상)을 가져오거나 설정합니다. (기본값: 0.0331)

##### Returns

`number`

레일리 산란 계수 배율 (km⁻¹)

#### Set Signature

> **set** **rayleighScatteringScale**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:405](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L405)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### reflectionLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **reflectionLUT**(): [`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L661)

대기 산란 기반 간접 정반사(Reflection) 큐브 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](../../Resource/classes/DirectCubeTexture.md)

Reflection 큐브 텍스처

***

***

### skyLuminanceFactor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **skyLuminanceFactor**(): [`ColorRGB`](../../Color/classes/ColorRGB.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:589](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L589)

하늘 전체의 RGB 휘도 배율 색상(`ColorRGB`) 객체를 반환합니다. (기본값: `ColorRGB(255, 255, 255)`)

##### Returns

[`ColorRGB`](../../Color/classes/ColorRGB.md)

하늘 휘도 배율 `ColorRGB` 인스턴스

***

***

### skyViewLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **skyViewLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:625](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L625)

스카이 뷰(Sky View) 2D LUT 텍스처를 반환합니다.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Sky View LUT 텍스처

***

***

### sunLimbDarkening

#### Get Signature

> **get** **sunLimbDarkening**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:573](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L573)

태양 가장자리 어두워짐(Limb Darkening) 강도(범위: 0 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.5)

##### Returns

`number`

태양 주변 감쇠 강도

#### Set Signature

> **set** **sunLimbDarkening**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:577](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L577)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### sunSize

#### Get Signature

> **get** **sunSize**(): `number`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:557](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L557)

태양 디스크의 시각적 각크기(범위: 0.01 ~ 10.0)를 가져오거나 설정합니다. (기본값: 0.533)

##### Returns

`number`

태양 시각적 크기

#### Set Signature

> **set** **sunSize**(`value`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:561](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L561)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### transmittanceLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **transmittanceLUT**(): [`DirectTexture`](../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:601](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L601)

대기 투과율(Transmittance) 2D LUT 텍스처를 반환합니다.

##### Returns

[`DirectTexture`](../../Resource/classes/DirectTexture.md)

Transmittance LUT 텍스처

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:749](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L749)

SkyAtmosphere 인스턴스와 내부 생성기, 버퍼 및 리소스를 모두 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(`view`, `width`, `height`, `sourceTextureInfo`): [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:715](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L715)

대기 상태 및 LUT를 갱신하고 씬 오브젝트 영역에 대기 원근(Aerial Perspective) 포스트 이펙트를 적용합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | 렌더링 대상 View3D 인스턴스 |
| `width` | `number` | 렌더 타겟 너비 |
| `height` | `number` | 렌더 타겟 높이 |
| `sourceTextureInfo` | [`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md) | 입력 소스 텍스처 정보 |

#### Returns

[`IPostEffectResult`](../../PostEffect/namespaces/Core/interfaces/IPostEffectResult.md)

대기 효과가 적용된 포스트 이펙트 결과

***

***

### renderBackground()

> **renderBackground**(`renderViewStateData`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:685](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L685)

무한 거리의 하늘 배경을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | 현재 뷰의 렌더링 상태 데이터 |

#### Returns

`void`

***

***

### update()

> **update**(`view`): `void`

Defined in: [src/display/skyAtmosphere/SkyAtmosphere.ts:728](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/SkyAtmosphere.ts#L728)

태양 광원 방향, 카메라 고도 및 뷰 행렬 변화를 감지하여 대기 유니폼 버퍼와 LUT들을 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | 기준 View3D 인스턴스 |

#### Returns

`void`

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
