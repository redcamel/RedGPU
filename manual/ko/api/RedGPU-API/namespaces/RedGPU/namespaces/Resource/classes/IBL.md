[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L25)

환경맵 소스로부터 Environment, Irradiance, Prefilter 큐브맵을 생성하여 IBL(Image-Based Lighting)을 제공하는 클래스입니다.

HDR 소스는 내부에서 큐브맵으로 변환되며, 소스가 변경되면 모든 맵이 비동기로 재생성됩니다.

***

### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');
view.ibl = ibl;
```

## See

- [SkyBox IBL example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 - [IBL test example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/iblTest/)
 - [IBL texture size example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/iblTextureSize/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `luminance?`, `environmentSize?`, `prefilterSize?`, `irradianceSize?`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:75](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L75)

IBL 인스턴스를 생성하고 환경맵 소스 로딩을 시작합니다.

#### Example
```typescript
// HDR 파일 사용
const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');

// 6면 이미지 사용 (px, nx, py, ny, pz, nz)
const iblCube = new RedGPU.Resource.IBL(redGPUContext, [
    'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
]);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | 환경맵 소스 (HDR URL 문자열 또는 6개 이미지 URL 배열) |
| `luminance?` | `number` | `25000` | 물리적 휘도 (단위: cd/m², 기본값: 25000) |
| `environmentSize?` | `number` | `1024` | Environment 큐브맵 한 면의 크기 (픽셀, 기본값: 1024) |
| `prefilterSize?` | `number` | `512` | Prefilter 큐브맵 한 면의 크기 (픽셀, 기본값: 512) |
| `irradianceSize?` | `number` | `64` | Irradiance 큐브맵 한 면의 크기 (픽셀, 기본값: 64) |

#### Returns

`IBL`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### environmentSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **environmentSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L114)

Environment 큐브맵 한 면의 크기(픽셀)를 반환합니다.

##### Returns

`number`

Environment 맵 크기

***

***

### environmentTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **environmentTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L162)

원본 환경맵에서 변환된 Environment 큐브 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Environment 큐브 텍스처

***

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L186)

아티스트 제어용 IBL 강도 배율을 반환하거나 설정합니다. (기본값: 1.0)

##### Returns

`number`

강도 배율

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:190](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L190)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### irradianceSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L138)

Irradiance 큐브맵 한 면의 크기(픽셀)를 반환합니다.

##### Returns

`number`

Irradiance 맵 크기

***

***

### irradianceTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L150)

확산광(Diffuse) 조명에 사용되는 Irradiance 큐브 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Irradiance 큐브 텍스처

***

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L202)

환경광의 물리적 휘도를 반환하거나 설정합니다. (단위: cd/m²)

##### Returns

`number`

물리적 휘도

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:206](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L206)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### prefilterSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L126)

Prefilter 큐브맵 한 면의 크기(픽셀)를 반환합니다.

##### Returns

`number`

Prefilter 맵 크기

***

***

### prefilterTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/ibl/IBL.ts#L174)

반사광(Specular) 조명에 사용되는 거칠기별 Prefilter 큐브 텍스처를 반환합니다.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Prefilter 큐브 텍스처

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
