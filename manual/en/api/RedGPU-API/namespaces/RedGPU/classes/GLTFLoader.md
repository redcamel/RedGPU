[**RedGPU API v4.1.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:115](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L115)

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

## Extends

- [`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new GLTFLoader**(`redGPUContext`, `url`, `onLoad`, `onProgress`, `onError`): `GLTFLoader`

Defined in: [src/loader/gltf/GLTFLoader.ts:168](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L168)

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

#### Overrides

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`constructor`](../namespaces/BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:134](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L134)

List of currently playing animation information

***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:129](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L129)

**`Internal`**

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:120](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L120)

GLTF parsing result data

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:125](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L125)

Root mesh container containing the parsed result

## Accessors

### fileName

#### Get Signature

> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:237](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L237)

Returns the file name.

##### Returns

`string`

***

### filePath

#### Get Signature

> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:212](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L212)

Returns the file path.

##### Returns

`string`

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:220](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L220)

Returns the raw GLTF data.

##### Returns

`GLTF`

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L229)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:203](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L203)

Returns the current loading progress information.

##### Returns

`GLTFLoadingProgressInfo`

Loading progress info object

***

### url

#### Get Signature

> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:245](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L245)

Returns the file URL.

##### Returns

`string`

***

### playAnimation()

> **playAnimation**(`parsedSingleClip`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:284](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L284)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:266](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/loader/gltf/GLTFLoader.ts#L266)

Stops all active animations.

* ### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../namespaces/BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../namespaces/BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../namespaces/BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`name`](../namespaces/BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../namespaces/BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`resourceManager`](../namespaces/BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
