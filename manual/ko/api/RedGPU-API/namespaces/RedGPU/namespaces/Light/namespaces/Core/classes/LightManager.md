[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/core/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L30)

씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

> **get** **ambientLight**(): [`AmbientLight`](../../../classes/AmbientLight.md)

Defined in: [src/light/core/LightManager.ts:176](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L176)

현재 설정된 환경광(AmbientLight)을 반환합니다.

##### Returns

[`AmbientLight`](../../../classes/AmbientLight.md)

AmbientLight 인스턴스 또는 null

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:191](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L191)

환경광(AmbientLight)을 설정합니다.

##### Throws

AmbientLight 인스턴스가 아닌 값을 전달하면 오류를 던집니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`AmbientLight`](../../../classes/AmbientLight.md) | 설정할 AmbientLight 인스턴스

##### Returns

`void`

***

### directionalLightCount

#### Get Signature

> **get** **directionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:152](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L152)

등록된 방향성 조명의 개수를 반환합니다.

##### Returns

`number`

방향성 조명 개수

***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Defined in: [src/light/core/LightManager.ts:164](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L164)

등록된 방향성 조명 배열을 반환합니다.

##### Returns

[`DirectionalLight`](../../../classes/DirectionalLight.md)[]

등록된 DirectionalLight 배열

***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:104](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L104)

클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.

##### Returns

`number`

클러스터 조명 최대 개수

***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:140](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L140)

방향성 조명의 최대 허용 개수를 반환합니다.

##### Returns

`number`

방향성 조명 최대 개수

***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:128](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L128)

등록된 포인트 조명의 개수를 반환합니다.

##### Returns

`number`

포인트 조명 개수

***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](../../../classes/PointLight.md)[]

Defined in: [src/light/core/LightManager.ts:116](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L116)

등록된 포인트 조명 배열을 반환합니다.

##### Returns

[`PointLight`](../../../classes/PointLight.md)[]

등록된 PointLight 배열

***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:92](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L92)

등록된 스포트 조명의 개수를 반환합니다.

##### Returns

`number`

스포트 조명 개수

***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](../../../classes/SpotLight.md)[]

Defined in: [src/light/core/LightManager.ts:80](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L80)

등록된 스포트 조명 배열을 반환합니다.

##### Returns

[`SpotLight`](../../../classes/SpotLight.md)[]

등록된 SpotLight 배열

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:262](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L262)

DirectionalLight를 추가합니다.

* ### Example
```typescript
scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](../../../classes/DirectionalLight.md) | 추가할 DirectionalLight 인스턴스

#### Returns

`void`

#### Throws

최대 방향성 조명 개수를 초과하면 오류를 던집니다.

***

### addPointLight()

> **addPointLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:237](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L237)

PointLight를 추가합니다.

* ### Example
```typescript
scene.lightManager.addPointLight(new RedGPU.Light.PointLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](../../../classes/PointLight.md) | 추가할 PointLight 인스턴스

#### Returns

`void`

#### Throws

SpotLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.

***

### addSpotLight()

> **addSpotLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:212](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L212)

SpotLight를 추가합니다.

* ### Example
```typescript
scene.lightManager.addSpotLight(new RedGPU.Light.SpotLight());
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | 추가할 SpotLight 인스턴스

#### Returns

`void`

#### Throws

PointLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.

***

### getDirectionalLightProjectionMatrix()

> **getDirectionalLightProjectionMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:374](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L374)

방향성 조명의 투영(orthographic) 행렬을 계산하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 투영 행렬

***

### getDirectionalLightProjectionViewMatrix()

> **getDirectionalLightProjectionViewMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:359](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L359)

방향성 조명의 투영-뷰 행렬을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 투영-뷰 행렬

***

### getDirectionalLightViewMatrix()

> **getDirectionalLightViewMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:389](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L389)

메인 방향성 조명의 뷰(lookAt) 행렬을 계산하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

mat4 뷰 행렬

***

### removeAllDirectionalLight()

> **removeAllDirectionalLight**(): `void`

Defined in: [src/light/core/LightManager.ts:330](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L330)

모든 DirectionalLight를 제거합니다.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/core/LightManager.ts:341](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L341)

장면의 모든 조명을 제거합니다.

포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/core/LightManager.ts:322](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L322)

모든 PointLight를 제거합니다.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/core/LightManager.ts:314](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L314)

모든 SpotLight를 제거합니다.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:305](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L305)

특정 DirectionalLight를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`DirectionalLight`](../../../classes/DirectionalLight.md) | 제거할 DirectionalLight 인스턴스

#### Returns

`void`

***

### removePointLight()

> **removePointLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:292](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L292)

특정 PointLight를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`PointLight`](../../../classes/PointLight.md) | 제거할 PointLight 인스턴스

#### Returns

`void`

***

### removeSpotLight()

> **removeSpotLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:279](https://github.com/redcamel/RedGPU/blob/d8e9f05bb1256579c84cecea5c335fe1722c97f6/src/light/core/LightManager.ts#L279)

특정 SpotLight를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | 제거할 SpotLight 인스턴스

#### Returns

`void`
