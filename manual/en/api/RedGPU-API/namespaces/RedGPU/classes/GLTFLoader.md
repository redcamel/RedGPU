[**RedGPU API v4.6.0**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GLTFLoader

# Class: GLTFLoader

Defined in: [src/loader/gltf/GLTFLoader.ts:123](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L123)

Loader class that loads glTF 2.0 (`.gltf`, `.glb`) models and parses meshes, materials, textures, animations, and skins into RedGPU objects.

***

### Example
```typescript
// Callback-based loading and animation playback
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

Creates a `GLTFLoader` instance and starts loading the file.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `url` | `string` | URL of the `.gltf` or `.glb` file to load |
| `onLoad?` | (`loader`) => `void` | Load completion callback (optional) |
| `onProgress?` | (`info`) => `void` | Loading progress callback (optional) |
| `onError?` | (`error`) => `void` | Error callback (optional) |
| `signal?` | `AbortSignal` | `AbortSignal` to cancel loading (optional) |
| `parsingOption?` | `Record`\<`string`, (`mesh`) => `void`\> | Custom parsing callback map keyed by mesh name (optional) |

#### Returns

`GLTFLoader`

#### Overrides

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`constructor`](../namespaces/BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### activeAnimations

> **activeAnimations**: `PlayAnimationInfo`[] = `[]`

Defined in: [src/loader/gltf/GLTFLoader.ts:143](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L143)

List of currently playing animation information

***

***

### parsingOption?

> `optional` **parsingOption?**: `Record`\<`string`, (`mesh`) => `void`\>

Defined in: [src/loader/gltf/GLTFLoader.ts:138](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L138)

GLTF parsing options

***

***

### parsingResult

> **parsingResult**: `GLTFParsingResult`

Defined in: [src/loader/gltf/GLTFLoader.ts:128](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L128)

GLTF parsing result data

***

***

### resultMesh

> **resultMesh**: [`Mesh`](../namespaces/Display/classes/Mesh.md)

Defined in: [src/loader/gltf/GLTFLoader.ts:133](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L133)

Root mesh container containing the parsed result

## Accessors



***

### activeMaterialVariant

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeMaterialVariant**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:353](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L353)

Returns the currently active `KHR_materials_variants` variant name, or `null` when default materials are active.

##### Returns

`string`

Active variant name or `null`

***

***

### fileName

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fileName**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:317](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L317)

Returns the file name.

##### Returns

`string`

File name string

***

***

### filePath

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filePath**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:293](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L293)

Returns the file path.

##### Returns

`string`

File directory path string

***

***

### gltfData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gltfData**(): `GLTF`

Defined in: [src/loader/gltf/GLTFLoader.ts:305](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L305)

Returns the parsed GLTF data object.

##### Returns

`GLTF`

Source GLTF data object

***

***

### isDestroyed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isDestroyed**(): `boolean`

Defined in: [src/loader/gltf/GLTFLoader.ts:434](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L434)

Returns whether this `GLTFLoader` instance has been destroyed.

##### Returns

`boolean`

Whether the loader has been destroyed

***

***

### loadingProgressInfo

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **loadingProgressInfo**(): `GLTFLoadingProgressInfo`

Defined in: [src/loader/gltf/GLTFLoader.ts:281](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L281)

Returns the current loading progress information.

##### Returns

`GLTFLoadingProgressInfo`

Loading progress info object

***

***

### materialVariants

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **materialVariants**(): `string`[]

Defined in: [src/loader/gltf/GLTFLoader.ts:341](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L341)

Returns the list of `KHR_materials_variants` variant names defined in the model.

##### Returns

`string`[]

Array of variant name strings

***

***

### url

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **url**(): `string`

Defined in: [src/loader/gltf/GLTFLoader.ts:329](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L329)

Returns the file URL.

##### Returns

`string`

File URL string

***

## Methods



***

### abort()

> **abort**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:420](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L420)

Immediately aborts any in-flight GLTF/GLB loading and parsing.

#### Returns

`void`

***

***

### applyMaterialVariant()

> **applyMaterialVariant**(`variant`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:365](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L365)

Applies the specified `KHR_materials_variants` variant across all meshes in the model. Pass `null` to restore default materials.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variant` | `string` \| `number` | Variant name (`string`), index (`number`), or `null` to restore defaults |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:442](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L442)

Safely releases the GLTFLoader instance, parsed animation tracks, attached root mesh, and internal referenced resources.

#### Returns

`void`

***

***

### playAnimation()

> **playAnimation**(`clipState`): `void`

Defined in: [src/loader/gltf/GLTFLoader.ts:409](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L409)

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

Defined in: [src/loader/gltf/GLTFLoader.ts:391](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/loader/gltf/GLTFLoader.ts#L391)

Stops all active animations.

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

Asynchronously loads a GLTF/GLB file returning a `Promise`. Supports cancellation via `AbortSignal`.

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
| `redGPUContext` | [`RedGPUContext`](../namespaces/Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `url` | `string` | Path to the GLTF/GLB file to load |
| `options?` | `GLTFLoadAsyncOptions` | Optional progress callback, `AbortSignal`, and `parsingOption` |

#### Returns

`Promise`\<`GLTFLoader`\>

`Promise` resolving to the loaded `GLTFLoader` instance

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../namespaces/Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../namespaces/BaseObject/classes/RedGPUObject.md).[`uuid`](../namespaces/BaseObject/classes/RedGPUObject.md#uuid)

</details>
