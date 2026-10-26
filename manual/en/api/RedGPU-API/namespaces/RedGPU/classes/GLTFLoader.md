[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L116)

Loader class that loads 3D model files in GLTF 2.0 format (`.gltf`, `.glb`) and parses meshes, materials, textures, animations, and skins into RedGPU objects.

***

### Example
```typescript
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'assets/gltf/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (loader) => {
        scene.addChild(loader.resultMesh);

        // Play animation
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

Defined in: [src/loader/gltf/GLTFLoader.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L170)

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



***

### activeAnimations

> **activeAnimations**: `any`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L136)

List of currently playing animation information

***

***

### parsingOption

> **parsingOption**: `any`

Defined in: [src/loader/gltf/GLTFLoader.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L131)

GLTF parsing options

***

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L121)

GLTF parsing result data

***

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L126)

Root mesh container containing the parsed result

## Accessors



***

### fileName

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L245)

Returns the file name.

##### Returns

`string`

File name string

***

***

### filePath

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L217)

Returns the file path.

##### Returns

`string`

File directory path string

***

***

### gltfData

#### Get Signature

> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L229)

Gets or sets the raw GLTF data.

##### Returns

`GLTF`

Raw GLTF data object

#### Set Signature

> **set** **gltfData**(`value`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:233](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L233)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L205)

Returns the current loading progress information.

##### Returns

`GLTFLoadingProgressInfo`

Loading progress info object

***

***

### url

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:257](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L257)

Returns the file URL.

##### Returns

`string`

File URL string

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L313)

Releases and destroys the GLTFLoader instance, parsed animation tracks, and referenced resources.

#### Returns

`void`

***

***

### playAnimation()

> **playAnimation**(`clipState`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:288](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L288)

Plays a specific animation clip.

#### Example
```typescript
const clip = loader.parsingResult.animations[0];
loader.playAnimation(clip);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `clipState` | [`ClipAnimState`](ClipAnimState.md) | Animation clip state to play |

#### Returns

`void`

***

***

### stopAnimation()

> **stopAnimation**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:270](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/loader/gltf/GLTFLoader.ts#L270)

Stops all active animations.

#### Example
```typescript
loader.stopAnimation();
```

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../namespaces/BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../namespaces/CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../namespaces/BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../namespaces/BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`instanceId`](../namespaces/BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../namespaces/BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`resourceManager`](../namespaces/BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

</details>
