[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:115](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L115)


Loader that loads and parses 3D model files in GLTF 2.0 format.


Supports both .gltf (JSON) and .glb (Binary) formats, and automatically parses meshes, materials, textures, animations, skins, etc., converting them into RedGPU objects.

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

Defined in: [src/loader/gltf/GLTFLoader.ts:169](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L169)


Creates a GLTFLoader instance and starts file loading.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `url` | `string` | Path to the GLTF/GLB file to load |
| `onLoad` | `any` | Callback function called when loading is complete |
| `onProgress` | `any` | Callback function called during loading progress (optional) |
| `onError` | `any` | Callback function called when an error occurs (optional) |

#### Returns

`GLTFLoader`

## Properties

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:134](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L134)


List of currently playing animation information

***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:129](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L129)

**`Internal`**

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:120](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L120)


GLTF parsing result data

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L125)


Root mesh container containing the parsed result

## Accessors

### fileName

#### Get Signature

> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:246](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L246)


Returns the file name.

##### Returns

`string`

***

### filePath

#### Get Signature

> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:221](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L221)


Returns the file path.

##### Returns

`string`

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L229)


Returns the raw GLTF data.

##### Returns

`GLTF`

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L238)

**`Internal`**


Sets the raw GLTF data.

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

Defined in: [src/loader/gltf/GLTFLoader.ts:205](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L205)


Returns the current loading progress information.

##### Returns

`GLTFLoadingProgressInfo`


Loading progress info object

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:213](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L213)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:254](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L254)


Returns the file URL.

##### Returns

`string`

## Methods

### playAnimation()

> **playAnimation**(`parsedSingleClip`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:293](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L293)


Plays a specific animation clip.

* ### Example
```typescript
const clip = loader.parsingResult.animations[0];
loader.playAnimation(clip);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `parsedSingleClip` | `GLTFParsedSingleClip` | Animation clip to play |

#### Returns

`void`

***

### stopAnimation()

> **stopAnimation**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:275](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/loader/gltf/GLTFLoader.ts#L275)


Stops all active animations.

* ### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`
