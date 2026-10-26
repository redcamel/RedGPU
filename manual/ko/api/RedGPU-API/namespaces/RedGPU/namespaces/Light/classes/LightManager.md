[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/LightManager.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L38)

씬(`Scene`) 내의 모든 조명을 통합 관리하는 매니저 클래스입니다.

방향광(`DirectionalLight`), 포인트 조명(`PointLight`), 스포트 조명(`SpotLight`), 환경광(`AmbientLight`)의 추가, 제거 및 최대 개수 제한을 관리하며, `Scene` 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// Scene 인스턴스를 통해 LightManager에 접근
const lightManager = scene.lightManager;

// 방향광 및 환경광 설정
const directionalLight = new RedGPU.Light.DirectionalLight();
lightManager.addDirectionalLight(directionalLight);
lightManager.ambientLight = new RedGPU.Light.AmbientLight();
```

## See

 - [DirectionalLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/directionalLight/)
 - [PointLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/pointLight/)
 - [SpotLight Basic Example](https://redcamel.github.io/RedGPU/examples/3d/light/spotLight/)

## Constructors

### Constructor

> **new LightManager**(): `LightManager`

#### Returns

`LightManager`

## Accessors

### ambientLight

#### Get Signature

> **get** **ambientLight**(): [`AmbientLight`](AmbientLight.md)

Defined in: [src/light/LightManager.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L157)

씬의 환경광(`AmbientLight`)을 가져오거나 설정합니다.

#### Example
```typescript
// 환경광 설정
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ADD8E6', 50);
```

##### Returns

[`AmbientLight`](AmbientLight.md)

`AmbientLight` 인스턴스

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L161)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`AmbientLight`](AmbientLight.md) |

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L126)

현재 등록된 방향광의 개수를 반환합니다.

##### Returns

`number`

방향광 개수

***

### directionalLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionalLights**(): [`DirectionalLight`](DirectionalLight.md)[]

Defined in: [src/light/LightManager.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L138)

등록된 방향광(`DirectionalLight`) 목록을 반환합니다.

##### Returns

[`DirectionalLight`](DirectionalLight.md)[]

`DirectionalLight` 배열

***

### limitClusterLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/LightManager.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L78)

씬에서 사용 가능한 최대 클러스터 조명(포인트 + 스포트) 개수를 반환합니다.

##### Returns

`number`

최대 클러스터 조명 개수

***

### limitDirectionalLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L114)

씬에서 사용 가능한 최대 방향광(`DirectionalLight`) 개수를 반환합니다.

##### Returns

`number`

최대 방향광 개수

***

### pointLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pointLightCount**(): `number`

Defined in: [src/light/LightManager.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L102)

현재 등록된 포인트 조명의 개수를 반환합니다.

##### Returns

`number`

포인트 조명 개수

***

### pointLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pointLights**(): [`PointLight`](PointLight.md)[]

Defined in: [src/light/LightManager.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L90)

등록된 포인트 조명(`PointLight`) 목록을 반환합니다.

##### Returns

[`PointLight`](PointLight.md)[]

`PointLight` 배열

***

### spotLightCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **spotLightCount**(): `number`

Defined in: [src/light/LightManager.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L66)

현재 등록된 스포트 조명의 개수를 반환합니다.

##### Returns

`number`

스포트 조명 개수

***

### spotLights

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **spotLights**(): [`SpotLight`](SpotLight.md)[]

Defined in: [src/light/LightManager.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L54)

등록된 스포트 조명(`SpotLight`) 목록을 반환합니다.

##### Returns

[`SpotLight`](SpotLight.md)[]

`SpotLight` 배열

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L232)

방향광(`DirectionalLight`)을 씬에 추가합니다.

#### Example
```typescript
// 방향광 생성 및 추가
const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
scene.lightManager.addDirectionalLight(directionalLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | 추가할 `DirectionalLight` 인스턴스 |

#### Returns

`void`

***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L207)

포인트 조명(`PointLight`)을 씬에 추가합니다.

#### Example
```typescript
// 포인트 조명 생성 및 추가
const pointLight = new RedGPU.Light.PointLight('#ffffff', 1000);
scene.lightManager.addPointLight(pointLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | 추가할 `PointLight` 인스턴스 |

#### Returns

`void`

***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L182)

스포트 조명(`SpotLight`)을 씬에 추가합니다.

#### Example
```typescript
// 스포트 조명 생성 및 추가
const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
scene.lightManager.addSpotLight(spotLight);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | 추가할 `SpotLight` 인스턴스 |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/light/LightManager.ts:319](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L319)

LightManager 인스턴스를 파기하고 등록된 모든 조명 및 디버거 리소스를 정리합니다.

#### Returns

`void`

***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/LightManager.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L300)

등록된 모든 방향광을 제거합니다.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/LightManager.ts:308](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L308)

환경광을 포함한 씬 내의 모든 조명을 제거합니다.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/LightManager.ts:292](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L292)

등록된 모든 포인트 조명을 제거합니다.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/LightManager.ts:284](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L284)

등록된 모든 스포트 조명을 제거합니다.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:275](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L275)

특정 방향광(`DirectionalLight`)을 씬에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | 제거할 `DirectionalLight` 인스턴스 |

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:262](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L262)

특정 포인트 조명(`PointLight`)을 씬에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | 제거할 `PointLight` 인스턴스 |

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/LightManager.ts#L249)

특정 스포트 조명(`SpotLight`)을 씬에서 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | 제거할 `SpotLight` 인스턴스 |

#### Returns

`void`
