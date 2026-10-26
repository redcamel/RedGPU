[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Light](../../../../../README.md) / [Core](../../../README.md) / [ClusterLight](../README.md) / PassClustersLight

# Class: PassClustersLight

Defined in: [src/light/core/clusterLight/pass/light/PassClustersLight.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/pass/light/PassClustersLight.ts#L23)

클러스터 타일 AABB와 씬 내 광원(`PointLight`, `SpotLight`)의 교차 판정을 수행하여 타일별 유효 조명 목록을 구축하는 컴퓨트 패스 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PassClustersLight**(`redGPUContext`, `view`, `passClusterLightBound`): `PassClustersLight`

Defined in: [src/light/core/clusterLight/pass/light/PassClustersLight.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/pass/light/PassClustersLight.ts#L45)

새로운 PassClustersLight 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | 클러스터 라이트 컬링을 수행할 대상 `View3D` 인스턴스 |
| `passClusterLightBound` | [`PassClusterLightBound`](PassClusterLightBound.md) | 클러스터 AABB 바운드 정보를 제공하는 `PassClusterLightBound` 인스턴스 |

#### Returns

`PassClustersLight`

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### clusterLightsBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **clusterLightsBuffer**(): `GPUBuffer`

Defined in: [src/light/core/clusterLight/pass/light/PassClustersLight.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/pass/light/PassClustersLight.ts#L60)

클러스터 셀별 광원 인덱스 및 개수가 저장된 GPU 스토리지 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

클러스터 라이트 그리드 `GPUBuffer` 인스턴스

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/light/core/clusterLight/pass/light/PassClustersLight.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/pass/light/PassClustersLight.ts#L87)

할당된 GPU 버퍼 및 파이프라인 리소스를 해제합니다.

#### Returns

`void`

***

***

### render()

> **render**(): `void`

Defined in: [src/light/core/clusterLight/pass/light/PassClustersLight.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/light/core/clusterLight/pass/light/PassClustersLight.ts#L68)

클러스터별 광원 교차 판정(Culling) 컴퓨트 패스를 디스패치합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
