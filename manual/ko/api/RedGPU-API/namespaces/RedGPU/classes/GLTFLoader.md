[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:115](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L115)

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

## Constructors

### Constructor

> **new GLTFLoader**(`redGPUContext`, `url`, `onLoad`, `onProgress`, `onError`): `GLTFLoader`

Defined in: [src/loader/gltf/GLTFLoader.ts:169](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L169)

GLTFLoader 인스턴스를 생성하고 파일 로딩을 시작합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md) | RedGPUContext 인스턴스
| `url` | `string` | 로드할 GLTF/GLB 파일 경로
| `onLoad` | `any` | 로딩 완료 시 호출될 콜백 함수
| `onProgress` | `any` | 로딩 진행 중 호출될 콜백 함수 (선택)
| `onError` | `any` | 에러 발생 시 호출될 콜백 함수 (선택)

#### Returns

`GLTFLoader`

## Properties

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:134](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L134)

현재 재생 중인 애니메이션 정보 목록


***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:129](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L129)

**`Internal`**

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:120](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L120)

GLTF 파싱 결과 데이터


***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:125](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L125)

파싱된 결과가 포함된 루트 메쉬 컨테이너


## Accessors

### fileName

#### Get Signature

> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:246](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L246)

파일 이름을 반환합니다.


##### Returns

`string`

***

### filePath

#### Get Signature

> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:221](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L221)

파일 경로를 반환합니다.


##### Returns

`string`

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L229)

원본 GLTF 데이터를 반환합니다.


##### Returns

`GLTF`

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:238](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L238)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:205](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L205)

현재 로딩 진행 정보를 반환합니다.


##### Returns

`GLTFLoadingProgressInfo`

로딩 진행 정보 객체


***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:213](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L213)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../namespaces/RedGPUContext/classes/RedGPUContext.md)

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:254](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L254)

파일 URL을 반환합니다.


##### Returns

`string`

## Methods

### playAnimation()

> **playAnimation**(`parsedSingleClip`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:293](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L293)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:275](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/loader/gltf/GLTFLoader.ts#L275)

모든 활성화된 애니메이션을 중지합니다.


* ### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`
