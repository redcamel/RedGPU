[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Light](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L30)

씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// 씬에서 라이트 매니저 접근 (Access light manager from scene)
const lightManager = scene.lightManager;

// 조명 추가 예시 (Example of adding a light)
lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

## Constructors

### Constructor

> **new LightManager**(): `LightManager`

#### Returns

`LightManager`

## Accessors

### ambientLight

#### Get Signature

> **get** **ambientLight**(): [`AmbientLight`](AmbientLight.md)

Defined in: [src/light/LightManager.ts:180](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L180)

현재 설정된 환경광(AmbientLight)을 반환합니다.


##### Returns

[`AmbientLight`](AmbientLight.md)

AmbientLight 인스턴스 또는 null


#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:195](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L195)

환경광(AmbientLight)을 설정합니다.


##### Throws

AmbientLight 인스턴스가 아닌 값을 전달하면 오류를 던집니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`AmbientLight`](AmbientLight.md) | 설정할 AmbientLight 인스턴스

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> **get** **directionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:156](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L156)

등록된 방향성 조명의 개수를 반환합니다.


##### Returns

`number`

방향성 조명 개수


***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](DirectionalLight.md)[]

Defined in: [src/light/LightManager.ts:168](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L168)

등록된 방향성 조명 배열을 반환합니다.


##### Returns

[`DirectionalLight`](DirectionalLight.md)[]

등록된 DirectionalLight 배열


***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/LightManager.ts:108](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L108)

클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.


##### Returns

`number`

클러스터 조명 최대 개수


***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/LightManager.ts:144](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L144)

방향성 조명의 최대 허용 개수를 반환합니다.


##### Returns

`number`

방향성 조명 최대 개수


***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/LightManager.ts:132](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L132)

등록된 포인트 조명의 개수를 반환합니다.


##### Returns

`number`

포인트 조명 개수


***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](PointLight.md)[]

Defined in: [src/light/LightManager.ts:120](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L120)

등록된 포인트 조명 배열을 반환합니다.


##### Returns

[`PointLight`](PointLight.md)[]

등록된 PointLight 배열


***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/LightManager.ts:96](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L96)

등록된 스포트 조명의 개수를 반환합니다.


##### Returns

`number`

스포트 조명 개수


***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](SpotLight.md)[]

Defined in: [src/light/LightManager.ts:84](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L84)

등록된 스포트 조명 배열을 반환합니다.


##### Returns

[`SpotLight`](SpotLight.md)[]

등록된 SpotLight 배열


## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:266](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L266)

DirectionalLight를 추가합니다.


* ### Example
```typescript
scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | 추가할 DirectionalLight 인스턴스

#### Returns

`void`

#### Throws

최대 방향성 조명 개수를 초과하면 오류를 던집니다.


***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:241](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L241)

PointLight를 추가합니다.


* ### Example
```typescript
scene.lightManager.addPointLight(new RedGPU.Light.PointLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | 추가할 PointLight 인스턴스

#### Returns

`void`

#### Throws

SpotLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.


***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:216](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L216)

SpotLight를 추가합니다.


* ### Example
```typescript
scene.lightManager.addSpotLight(new RedGPU.Light.SpotLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | 추가할 SpotLight 인스턴스

#### Returns

`void`

#### Throws

PointLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.


***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/LightManager.ts:334](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L334)

모든 DirectionalLight를 제거합니다.


#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/LightManager.ts:345](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L345)

장면의 모든 조명을 제거합니다.


포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.


#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/LightManager.ts:326](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L326)

모든 PointLight를 제거합니다.


#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/LightManager.ts:318](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L318)

모든 SpotLight를 제거합니다.


#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:309](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L309)

특정 DirectionalLight를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](DirectionalLight.md) | 제거할 DirectionalLight 인스턴스

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:296](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L296)

특정 PointLight를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](PointLight.md) | 제거할 PointLight 인스턴스

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/LightManager.ts:283](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/light/LightManager.ts#L283)

특정 SpotLight를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](SpotLight.md) | 제거할 SpotLight 인스턴스

#### Returns

`void`
