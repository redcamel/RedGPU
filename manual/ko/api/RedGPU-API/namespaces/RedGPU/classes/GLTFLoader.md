[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L116)

GLTF 2.0 포맷(`.gltf`, `.glb`)의 3D 모델 파일을 로드하고 메쉬, 재질, 텍스처, 애니메이션, 스킨을 RedGPU 객체로 파싱하는 로더 클래스입니다.

***

### Example
```typescript
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'assets/gltf/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (loader) => {
        scene.addChild(loader.resultMesh);

        // 애니메이션 재생
        if (loader.parsingResult.animations.length > 0) {
            loader.playAnimation(loader.parsingResult.animations[0]);
        }
    },
    (progress) => {
        console.log('Loading Progress:', progress);
    },
    (error) => {
        console.error('Load Error:', error);
    }
);
```

## Extends

- [`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new GLTFLoader**(`redGPUContext`, `url`, `onLoad`, `onProgress`, `onError`): `GLTFLoader`

Defined in: [src/loader/gltf/GLTFLoader.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L170)

GLTFLoader 인스턴스를 생성하고 파일 로딩을 시작합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `url` | `string` | 로드할 GLTF/GLB 파일 경로 |
| `onLoad` | `any` | 로딩 완료 시 호출될 콜백 함수 |
| `onProgress` | `any` | 로딩 진행 중 호출될 콜백 함수 (선택) |
| `onError` | `any` | 에러 발생 시 호출될 콜백 함수 (선택) |

#### Returns

`GLTFLoader`

#### Overrides

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`constructor`](../namespaces/BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L136)

현재 재생 중인 애니메이션 정보 목록

***

***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L131)

GLTF 파싱 옵션

***

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L121)

GLTF 파싱 결과 데이터

***

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L126)

파싱된 결과가 포함된 루트 메쉬 컨테이너

## Accessors



***

### fileName

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L245)

파일 이름을 반환합니다.

##### Returns

`string`

파일 이름 문자열

***

***

### filePath

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L217)

파일 경로를 반환합니다.

##### Returns

`string`

파일 디렉터리 경로 문자열

***

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L229)

원본 GLTF 데이터를 가져오거나 설정합니다.

##### Returns

`GLTF`

원본 GLTF 데이터 객체

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:233](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L233)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GLTF` |

##### Returns

`void`

***

***

### loadingProgressInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **loadingProgressInfo**(): `GLTFLoadingProgressInfo`

Defined in: [src/loader/gltf/GLTFLoader.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L205)

현재 로딩 진행 정보를 반환합니다.

##### Returns

`GLTFLoadingProgressInfo`

로딩 진행 정보 객체

***

***

### url

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:257](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L257)

파일 URL을 반환합니다.

##### Returns

`string`

파일 URL 문자열

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L313)

GLTFLoader 인스턴스와 파싱된 애니메이션 트랙 및 참조 리소스를 해제합니다.

#### Returns

`void`

***

***

### playAnimation()

> **playAnimation**(`clipState`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L288)

특정 애니메이션 클립을 재생합니다.

#### Example
```typescript
const clip = loader.parsingResult.animations[0];
loader.playAnimation(clip);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clipState` | [`ClipAnimState`](ClipAnimState.md) | 재생할 애니메이션 클립 상태 |

#### Returns

`void`

***

***

### stopAnimation()

> **stopAnimation**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:270](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/loader/gltf/GLTFLoader.ts#L270)

모든 활성화된 애니메이션을 중지합니다.

#### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../namespaces/BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../namespaces/BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../namespaces/BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`instanceId`](../namespaces/BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`name`](../namespaces/BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../namespaces/BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`resourceManager`](../namespaces/BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

</details>
