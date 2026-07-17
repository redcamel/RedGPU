[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Light](../../../README.md) / [Core](../README.md) / LightManager

# Class: LightManager

Defined in: [src/light/core/LightManager.ts:30](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L30)

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

Defined in: [src/light/core/LightManager.ts:175](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L175)

현재 설정된 환경광(AmbientLight)을 반환합니다.

##### Returns

[`AmbientLight`](../../../classes/AmbientLight.md)

AmbientLight 인스턴스 또는 null

#### Set Signature

> **set** **ambientLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:190](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L190)

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

Defined in: [src/light/core/LightManager.ts:151](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L151)

등록된 방향성 조명의 개수를 반환합니다.

##### Returns

`number`

방향성 조명 개수

***

### directionalLights

#### Get Signature

> **get** **directionalLights**(): [`DirectionalLight`](../../../classes/DirectionalLight.md)[]

Defined in: [src/light/core/LightManager.ts:163](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L163)

등록된 방향성 조명 배열을 반환합니다.

##### Returns

[`DirectionalLight`](../../../classes/DirectionalLight.md)[]

등록된 DirectionalLight 배열

***

### limitClusterLightCount

#### Get Signature

> **get** **limitClusterLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:103](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L103)

클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.

##### Returns

`number`

클러스터 조명 최대 개수

***

### limitDirectionalLightCount

#### Get Signature

> **get** **limitDirectionalLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:139](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L139)

방향성 조명의 최대 허용 개수를 반환합니다.

##### Returns

`number`

방향성 조명 최대 개수

***

### pointLightCount

#### Get Signature

> **get** **pointLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:127](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L127)

등록된 포인트 조명의 개수를 반환합니다.

##### Returns

`number`

포인트 조명 개수

***

### pointLights

#### Get Signature

> **get** **pointLights**(): [`PointLight`](../../../classes/PointLight.md)[]

Defined in: [src/light/core/LightManager.ts:115](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L115)

등록된 포인트 조명 배열을 반환합니다.

##### Returns

[`PointLight`](../../../classes/PointLight.md)[]

등록된 PointLight 배열

***

### spotLightCount

#### Get Signature

> **get** **spotLightCount**(): `number`

Defined in: [src/light/core/LightManager.ts:91](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L91)

등록된 스포트 조명의 개수를 반환합니다.

##### Returns

`number`

스포트 조명 개수

***

### spotLights

#### Get Signature

> **get** **spotLights**(): [`SpotLight`](../../../classes/SpotLight.md)[]

Defined in: [src/light/core/LightManager.ts:79](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L79)

등록된 스포트 조명 배열을 반환합니다.

##### Returns

[`SpotLight`](../../../classes/SpotLight.md)[]

등록된 SpotLight 배열

## Methods

### addDirectionalLight()

> **addDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:261](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L261)

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

Defined in: [src/light/core/LightManager.ts:236](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L236)

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

Defined in: [src/light/core/LightManager.ts:211](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L211)

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

### destroy()

> **destroy**(): `void`

Defined in: [src/light/core/LightManager.ts:396](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L396)

LightManager 인스턴스를 파기하고 모든 조명 및 디버거 참조를 정리합니다.

#### Returns

`void`

***

### getDirectionalLightProjectionMatrix()

> **getDirectionalLightProjectionMatrix**(`view`): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/light/core/LightManager.ts:373](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L373)

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

Defined in: [src/light/core/LightManager.ts:358](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L358)

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

Defined in: [src/light/core/LightManager.ts:388](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L388)

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

Defined in: [src/light/core/LightManager.ts:329](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L329)

모든 DirectionalLight를 제거합니다.

#### Returns

`void`

***

### removeAllLight()

> **removeAllLight**(): `void`

Defined in: [src/light/core/LightManager.ts:340](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L340)

장면의 모든 조명을 제거합니다.

포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.

#### Returns

`void`

***

### removeAllPointLight()

> **removeAllPointLight**(): `void`

Defined in: [src/light/core/LightManager.ts:321](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L321)

모든 PointLight를 제거합니다.

#### Returns

`void`

***

### removeAllSpotLight()

> **removeAllSpotLight**(): `void`

Defined in: [src/light/core/LightManager.ts:313](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L313)

모든 SpotLight를 제거합니다.

#### Returns

`void`

***

### removeDirectionalLight()

> **removeDirectionalLight**(`value`): `void`

Defined in: [src/light/core/LightManager.ts:304](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L304)

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

Defined in: [src/light/core/LightManager.ts:291](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L291)

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

Defined in: [src/light/core/LightManager.ts:278](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/light/core/LightManager.ts#L278)

특정 SpotLight를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SpotLight`](../../../classes/SpotLight.md) | 제거할 SpotLight 인스턴스

#### Returns

`void`
