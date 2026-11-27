[**RedGPU API v4.6.0**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:123](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L123)

glTF 2.0(`.gltf`, `.glb`) 모델을 로드하여 메쉬, 재질, 텍스처, 애니메이션, 스킨을 RedGPU 객체로 파싱하는 로더 클래스입니다.

***

### Example
```typescript
// 콜백 방식 로드 및 애니메이션 재생
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'assets/gltf/models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loaded) => {
        scene.addChild(loaded.resultMesh);
        if (loaded.parsingResult.animations.length > 0) {
            loaded.playAnimation(loaded.parsingResult.animations[0]);
        }
    },
    (progress) => console.log(progress.model.percent),
    (error) => console.error(error)
);
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/gltf/formats/brainStemAllFormats/" />

## See

- [Skinned Geometry Compression (Draco · Meshopt)](https://redcamel.github.io/RedGPU/examples/gltf/formats/brainStemAllFormats/)
 - [PBR Texture Compression (KTX2 · WebP · JPG)](https://redcamel.github.io/RedGPU/examples/gltf/formats/carConceptAllFormats/)
 - [Static Mesh Quantization (Quantized · Embedded)](https://redcamel.github.io/RedGPU/examples/gltf/formats/duckAllFormats/)
 - [Motion Blending example](https://redcamel.github.io/RedGPU/examples/gltf/animation/motionBlending/)

## Extends

- [`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new GLTFLoader**(`redGPUContext`, `url`, `onLoad?`, `onProgress?`, `onError?`, `signal?`, `parsingOption?`): `GLTFLoader`

Defined in: [src/loader/gltf/GLTFLoader.ts:190](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L190)

`GLTFLoader` 인스턴스를 생성하고 파일 로딩을 시작합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `url` | `string` | 로드할 `.gltf` 또는 `.glb` 파일 URL |
| `onLoad?` | (`loader`) => `void` | 로딩 완료 콜백 (선택) |
| `onProgress?` | (`info`) => `void` | 로딩 진행 콜백 (선택) |
| `onError?` | (`error`) => `void` | 에러 발생 콜백 (선택) |
| `signal?` | `AbortSignal` | 로딩 취소용 `AbortSignal` (선택) |
| `parsingOption?` | `Record`\<`string`, (`mesh`) => `void`\> | 메쉬 이름별 커스텀 파싱 콜백 맵 (선택) |

#### Returns

`GLTFLoader`

#### Overrides

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`constructor`](../namespaces/BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### activeAnimations

> **activeAnimations**: `PlayAnimationInfo`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:143](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L143)

현재 재생 중인 애니메이션 정보 목록

***

***

### parsingOption?

> `optional` **parsingOption?**: `Record`\<`string`, (`mesh`) => `void`\>

Defined in: [src/loader/gltf/GLTFLoader.ts:138](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L138)

GLTF 파싱 옵션

***

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:128](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L128)

GLTF 파싱 결과 데이터

***

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:133](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L133)

파싱된 결과가 포함된 루트 메쉬 컨테이너

## Accessors



***

### activeMaterialVariant

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeMaterialVariant**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:353](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L353)

현재 적용 중인 `KHR_materials_variants` 바리에이션 이름을 반환합니다. 기본 재질 상태이면 `null`입니다.

##### Returns

`string`

활성 바리에이션 이름 또는 `null`

***

***

### fileName

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:317](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L317)

파일 이름을 반환합니다.

##### Returns

`string`

파일 이름 문자열

***

***

### filePath

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:293](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L293)

파일 경로를 반환합니다.

##### Returns

`string`

파일 디렉터리 경로 문자열

***

***

### gltfData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:305](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L305)

원본 GLTF 데이터를 반환합니다.

##### Returns

`GLTF`

원본 GLTF 데이터 객체

***

***

### isDestroyed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isDestroyed**(): `boolean`

Defined in: [src/loader/gltf/GLTFLoader.ts:434](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L434)

`GLTFLoader` 인스턴스가 해제(`destroy()`)되었는지 여부를 반환합니다.

##### Returns

`boolean`

해제 여부 (`true`이면 이미 해제됨)

***

***

### loadingProgressInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **loadingProgressInfo**(): `GLTFLoadingProgressInfo`

Defined in: [src/loader/gltf/GLTFLoader.ts:281](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L281)

현재 로딩 진행 정보를 반환합니다.

##### Returns

`GLTFLoadingProgressInfo`

로딩 진행 정보 객체

***

***

### materialVariants

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **materialVariants**(): `string`[]

Defined in: [src/loader/gltf/GLTFLoader.ts:341](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L341)

모델에 정의된 `KHR_materials_variants` 바리에이션 이름 목록을 반환합니다.

##### Returns

`string`[]

바리에이션 이름 문자열 배열

***

***

### url

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:329](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L329)

파일 URL을 반환합니다.

##### Returns

`string`

파일 URL 문자열

***

## Methods



***

### abort()

> **abort**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:420](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L420)

진행 중인 GLTF/GLB 로딩 및 파싱을 즉시 중단합니다.

#### Returns

`void`

***

***

### applyMaterialVariant()

> **applyMaterialVariant**(`variant`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:365](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L365)

지정된 `KHR_materials_variants` 바리에이션을 모델 전체 메쉬에 적용합니다. `null`을 전달하면 기본 재질로 복원합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variant` | `string` \| `number` | 바리에이션 이름(`string`), 인덱스(`number`), 또는 기본 복원용 `null` |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:442](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L442)

GLTFLoader 인스턴스와 파싱된 애니메이션 트랙, 씬 부착 루트 메쉬 및 내부 참조 리소스를 안전하게 해제합니다.

#### Returns

`void`

***

***

### playAnimation()

> **playAnimation**(`clipState`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:409](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L409)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:391](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L391)

모든 활성화된 애니메이션을 중지합니다.

#### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`

***

***

### loadAsync()

> `static` **loadAsync**(`redGPUContext`, `url`, `options?`): `Promise`\<`GLTFLoader`\>

Defined in: [src/loader/gltf/GLTFLoader.ts:255](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L255)

GLTF/GLB 파일을 비동기 `Promise`로 로드합니다. `AbortSignal`을 통한 로딩 취소를 지원합니다.

#### Example
```typescript
const controller = new AbortController();
const result = await RedGPU.GLTFLoader.loadAsync(redGPUContext, url, {
    onProgress: (info) => console.log(info.model.percent),
    signal: controller.signal
});
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `url` | `string` | 로드할 GLTF/GLB 파일 경로 |
| `options?` | `GLTFLoadAsyncOptions` | 진행 콜백, `AbortSignal`, `parsingOption` 등 추가 옵션 (선택) |

#### Returns

`Promise`\<`GLTFLoader`\>

로딩 완료된 `GLTFLoader` 인스턴스를 반환하는 `Promise`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

</details>
