[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:115](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L115)

GLTF 2.0 포맷의 3D 모델 파일을 로드하고 파싱하는 로더입니다.

.gltf (JSON) 및 .glb (Binary) 형식을 모두 지원하며, 메쉬, 재질, 텍스처, 애니메이션, 스킨 등을 자동으로 파싱하여 RedGPU 객체로 변환합니다.

* ### Example
```typescript
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'assets/gltf/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (loader) => {
        console.log('Load Complete:', loader);
        scene.addChild(loader.resultMesh);

        // 애니메이션 재생 (Play animation)
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

### Constructor

> **new GLTFLoader**(`redGPUContext`, `url`, `onLoad`, `onProgress`, `onError`): `GLTFLoader`

Defined in: [src/loader/gltf/GLTFLoader.ts:168](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L168)

GLTFLoader 인스턴스를 생성하고 파일 로딩을 시작합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `url` | `string` | 로드할 GLTF/GLB 파일 경로
| `onLoad` | `any` | 로딩 완료 시 호출될 콜백 함수
| `onProgress` | `any` | 로딩 진행 중 호출될 콜백 함수 (선택)
| `onError` | `any` | 에러 발생 시 호출될 콜백 함수 (선택)

#### Returns

`GLTFLoader`

#### Overrides

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`constructor`](../namespaces/BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:134](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L134)

현재 재생 중인 애니메이션 정보 목록

***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:129](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L129)

**`Internal`**

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:120](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L120)

GLTF 파싱 결과 데이터

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:125](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L125)

파싱된 결과가 포함된 루트 메쉬 컨테이너

## Accessors

### fileName

#### Get Signature

> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:237](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L237)

파일 이름을 반환합니다.

##### Returns

`string`

***

### filePath

#### Get Signature

> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:212](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L212)

파일 경로를 반환합니다.

##### Returns

`string`

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:220](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L220)

원본 GLTF 데이터를 반환합니다.

##### Returns

`GLTF`

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L229)

**`Internal`**

원본 GLTF 데이터를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GLTF` |

##### Returns

`void`

***

### loadingProgressInfo

#### Get Signature

> **get** **loadingProgressInfo**(): `GLTFLoadingProgressInfo`

Defined in: [src/loader/gltf/GLTFLoader.ts:203](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L203)

현재 로딩 진행 정보를 반환합니다.

##### Returns

`GLTFLoadingProgressInfo`

로딩 진행 정보 객체

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:245](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L245)

파일 URL을 반환합니다.

##### Returns

`string`

***

### playAnimation()

> **playAnimation**(`parsedSingleClip`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:284](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L284)

특정 애니메이션 클립을 재생합니다.

* ### Example
```typescript
const clip = loader.parsingResult.animations[0];
loader.playAnimation(clip);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parsedSingleClip` | `GLTFParsedSingleClip` | 재생할 애니메이션 클립

#### Returns

`void`

***

### stopAnimation()

> **stopAnimation**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:266](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/loader/gltf/GLTFLoader.ts#L266)

모든 활성화된 애니메이션을 중지합니다.

* ### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../namespaces/BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../namespaces/BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../namespaces/BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`name`](../namespaces/BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../namespaces/BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`resourceManager`](../namespaces/BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
