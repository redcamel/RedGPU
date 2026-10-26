[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / ParticleEmitter

# Class: ParticleEmitter

Defined in: [src/display/particle/ParticleEmitter.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L16)

Class that creates and manages a high-performance particle system based on GPU computation (Compute Shader).

Simulates and renders thousands to hundreds of thousands of particles in parallel on the GPU. Allows real-time control over life, size, starting/ending transforms (position, rotation, scale), alpha values, and various easing functions for interpolation.

***

### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.particleNum = 5000;

// Example of applying texture to particles (sets the diffuseTexture property of the default BitmapMaterial)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'path/to/particle.png');
emitter.material.diffuseTexture = texture;

scene.addChild(emitter);
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/particle/basic/" style="width:100%; height:500px;"></iframe>

Below is a list of additional sample examples to help understand the structure and operation of ParticleEmitter.

## See

[ParticleEmitter Performance](https://redcamel.github.io/RedGPU/examples/3d/particle/performance/)

## Roadmap

- *Support for various particle emitter types**

## Extends

- [`Mesh`](Mesh.md)

## Constructors



***

### Constructor

> **new ParticleEmitter**(`redGPUContext`): `ParticleEmitter`

Defined in: [src/display/particle/ParticleEmitter.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L127)

Creates an instance of ParticleEmitter. Internally initializes Plane as the default geometry and BitmapMaterial as the default material.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU context object |

#### Returns

`ParticleEmitter`

#### Inherited from

[`Mesh`](Mesh.md).[`constructor`](Mesh.md#constructor)

## Properties



***

### isInstanceofParticle

> **isInstanceofParticle**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L26)

Identifier to determine if it is a ParticleEmitter instance

***

***

### useBillboard

> **useBillboard**: `boolean`

Defined in: [src/display/particle/ParticleEmitter.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L21)

Whether to make particles always face the camera

***

## Accessors



***

### easeAlpha

#### Get Signature

> **get** **easeAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:786](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L786)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the alpha (opacity) change.

##### Returns

`number`

Alpha easing constant value

#### Set Signature

> **set** **easeAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:790](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L790)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationX

#### Get Signature

> **get** **easeRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:818](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L818)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis rotation change.

##### Returns

`number`

X-axis rotation easing constant value

#### Set Signature

> **set** **easeRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:822](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L822)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationY

#### Get Signature

> **get** **easeRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:834](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L834)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis rotation change.

##### Returns

`number`

Y-axis rotation easing constant value

#### Set Signature

> **set** **easeRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:838](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L838)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeRotationZ

#### Get Signature

> **get** **easeRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:850](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L850)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis rotation change.

##### Returns

`number`

Z-axis rotation easing constant value

#### Set Signature

> **set** **easeRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:854](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L854)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeScale

#### Get Signature

> **get** **easeScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:802](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L802)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the scale change.

##### Returns

`number`

Scale easing constant value

#### Set Signature

> **set** **easeScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:806](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L806)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeX

#### Get Signature

> **get** **easeX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:738](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L738)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the X-axis coordinate change.

##### Returns

`number`

X-axis easing constant value

#### Set Signature

> **set** **easeX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:742](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L742)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeY

#### Get Signature

> **get** **easeY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:754](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L754)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Y-axis coordinate change.

##### Returns

`number`

Y-axis easing constant value

#### Set Signature

> **set** **easeY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:758](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L758)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### easeZ

#### Get Signature

> **get** **easeZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:770](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L770)

Gets or sets the easing function (PARTICLE_EASE constant value) applied to the Z-axis coordinate change.

##### Returns

`number`

Z-axis easing constant value

#### Set Signature

> **set** **easeZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:774](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L774)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndAlpha

#### Get Signature

> **get** **maxEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:466](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L466)

Gets or sets the maximum ending opacity of particles.

##### Returns

`number`

Maximum ending opacity

#### Set Signature

> **set** **maxEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:470](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L470)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationX

#### Get Signature

> **get** **maxEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:690](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L690)

Gets or sets the maximum ending X-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum ending X-axis rotation angle (degrees)

#### Set Signature

> **set** **maxEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:694](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationY

#### Get Signature

> **get** **maxEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:706](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L706)

Gets or sets the maximum ending Y-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum ending Y-axis rotation angle (degrees)

#### Set Signature

> **set** **maxEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:710](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L710)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndRotationZ

#### Get Signature

> **get** **maxEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:722](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L722)

Gets or sets the maximum ending Z-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum ending Z-axis rotation angle (degrees)

#### Set Signature

> **set** **maxEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:726](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L726)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndScale

#### Get Signature

> **get** **maxEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:530](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L530)

Gets or sets the maximum ending scale of particles.

##### Returns

`number`

Maximum ending scale

#### Set Signature

> **set** **maxEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:534](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndX

#### Get Signature

> **get** **maxEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:370](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L370)

Gets or sets the maximum end X coordinate position particles can reach before dying.

##### Returns

`number`

Maximum end X coordinate

#### Set Signature

> **set** **maxEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:374](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L374)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndY

#### Get Signature

> **get** **maxEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:386](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L386)

Gets or sets the maximum end Y coordinate position particles can reach before dying.

##### Returns

`number`

Maximum end Y coordinate

#### Set Signature

> **set** **maxEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:390](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L390)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxEndZ

#### Get Signature

> **get** **maxEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:402](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L402)

Gets or sets the maximum end Z coordinate position particles can reach before dying.

##### Returns

`number`

Maximum end Z coordinate

#### Set Signature

> **set** **maxEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:406](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L406)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxLife

#### Get Signature

> **get** **maxLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L210)

Gets or sets the maximum life value (in ms) of particles.

##### Returns

`number`

Maximum particle life (ms)

#### Set Signature

> **set** **maxLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:214](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L214)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartAlpha

#### Get Signature

> **get** **maxStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:434](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L434)

Gets or sets the maximum starting opacity of particles.

##### Returns

`number`

Maximum starting opacity

#### Set Signature

> **set** **maxStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationX

#### Get Signature

> **get** **maxStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:594](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L594)

Gets or sets the maximum starting X-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum starting X-axis rotation angle (degrees)

#### Set Signature

> **set** **maxStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L598)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationY

#### Get Signature

> **get** **maxStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:610](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L610)

Gets or sets the maximum starting Y-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum starting Y-axis rotation angle (degrees)

#### Set Signature

> **set** **maxStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:614](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartRotationZ

#### Get Signature

> **get** **maxStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:626](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L626)

Gets or sets the maximum starting Z-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Maximum starting Z-axis rotation angle (degrees)

#### Set Signature

> **set** **maxStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:630](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L630)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartScale

#### Get Signature

> **get** **maxStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:498](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L498)

Gets or sets the maximum starting scale of particles.

##### Returns

`number`

Maximum starting scale

#### Set Signature

> **set** **maxStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:502](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L502)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartX

#### Get Signature

> **get** **maxStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:274](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L274)

Gets or sets the maximum start X coordinate position particles can have upon generation.

##### Returns

`number`

Maximum start X coordinate

#### Set Signature

> **set** **maxStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:278](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L278)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartY

#### Get Signature

> **get** **maxStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L290)

Gets or sets the maximum start Y coordinate position particles can have upon generation.

##### Returns

`number`

Maximum start Y coordinate

#### Set Signature

> **set** **maxStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:294](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L294)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxStartZ

#### Get Signature

> **get** **maxStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L306)

Gets or sets the maximum start Z coordinate position particles can have upon generation.

##### Returns

`number`

Maximum start Z coordinate

#### Set Signature

> **set** **maxStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:310](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L310)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndAlpha

#### Get Signature

> **get** **minEndAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:450](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L450)

Gets or sets the minimum ending opacity of particles.

##### Returns

`number`

Minimum ending opacity

#### Set Signature

> **set** **minEndAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:454](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L454)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationX

#### Get Signature

> **get** **minEndRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:642](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L642)

Gets or sets the minimum ending X-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum ending X-axis rotation angle (degrees)

#### Set Signature

> **set** **minEndRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:646](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L646)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationY

#### Get Signature

> **get** **minEndRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:658](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L658)

Gets or sets the minimum ending Y-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum ending Y-axis rotation angle (degrees)

#### Set Signature

> **set** **minEndRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:662](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L662)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndRotationZ

#### Get Signature

> **get** **minEndRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:674](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L674)

Gets or sets the minimum ending Z-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum ending Z-axis rotation angle (degrees)

#### Set Signature

> **set** **minEndRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:678](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L678)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndScale

#### Get Signature

> **get** **minEndScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:514](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L514)

Gets or sets the minimum ending scale of particles.

##### Returns

`number`

Minimum ending scale

#### Set Signature

> **set** **minEndScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:518](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L518)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndX

#### Get Signature

> **get** **minEndX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:322](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L322)

Gets or sets the minimum end X coordinate position particles can reach before dying.

##### Returns

`number`

Minimum end X coordinate

#### Set Signature

> **set** **minEndX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:326](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndY

#### Get Signature

> **get** **minEndY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L338)

Gets or sets the minimum end Y coordinate position particles can reach before dying.

##### Returns

`number`

Minimum end Y coordinate

#### Set Signature

> **set** **minEndY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:342](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L342)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minEndZ

#### Get Signature

> **get** **minEndZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L354)

Gets or sets the minimum end Z coordinate position particles can reach before dying.

##### Returns

`number`

Minimum end Z coordinate

#### Set Signature

> **set** **minEndZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:358](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minLife

#### Get Signature

> **get** **minLife**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:194](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L194)

Gets or sets the minimum life value (in ms) of particles.

##### Returns

`number`

Minimum particle life (ms)

#### Set Signature

> **set** **minLife**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:198](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L198)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartAlpha

#### Get Signature

> **get** **minStartAlpha**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:418](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L418)

Gets or sets the minimum starting opacity of particles.

##### Returns

`number`

Minimum starting opacity

#### Set Signature

> **set** **minStartAlpha**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:422](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L422)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationX

#### Get Signature

> **get** **minStartRotationX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:546](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L546)

Gets or sets the minimum starting X-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum starting X-axis rotation angle (degrees)

#### Set Signature

> **set** **minStartRotationX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:550](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L550)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationY

#### Get Signature

> **get** **minStartRotationY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:562](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L562)

Gets or sets the minimum starting Y-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum starting Y-axis rotation angle (degrees)

#### Set Signature

> **set** **minStartRotationY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:566](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L566)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartRotationZ

#### Get Signature

> **get** **minStartRotationZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:578](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L578)

Gets or sets the minimum starting Z-axis rotation angle (in degrees) of particles.

##### Returns

`number`

Minimum starting Z-axis rotation angle (degrees)

#### Set Signature

> **set** **minStartRotationZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:582](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L582)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartScale

#### Get Signature

> **get** **minStartScale**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:482](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L482)

Gets or sets the minimum starting scale of particles.

##### Returns

`number`

Minimum starting scale

#### Set Signature

> **set** **minStartScale**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:486](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L486)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartX

#### Get Signature

> **get** **minStartX**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L226)

Gets or sets the minimum start X coordinate position particles can have upon generation.

##### Returns

`number`

Minimum start X coordinate

#### Set Signature

> **set** **minStartX**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:230](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L230)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartY

#### Get Signature

> **get** **minStartY**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L242)

Gets or sets the minimum start Y coordinate position particles can have upon generation.

##### Returns

`number`

Minimum start Y coordinate

#### Set Signature

> **set** **minStartY**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L246)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minStartZ

#### Get Signature

> **get** **minStartZ**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L258)

Gets or sets the minimum start Z coordinate position particles can have upon generation.

##### Returns

`number`

Minimum start Z coordinate

#### Set Signature

> **set** **minStartZ**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### particleBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **particleBuffers**(): `GPUBuffer`[]

Defined in: [src/display/particle/ParticleEmitter.ts:866](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L866)

Gets the array of GPUBuffers storing particle data and attributes.

##### Returns

`GPUBuffer`[]

Array of particle GPUBuffers

***

***

### particleNum

#### Get Signature

> **get** **particleNum**(): `number`

Defined in: [src/display/particle/ParticleEmitter.ts:176](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L176)

Gets or sets the total number of particles to simulate. The value ranges from 1 to a maximum of 500,000, and modifying this will rebuild the GPU simulation buffers.

##### Returns

`number`

Total number of simulated particles

#### Set Signature

> **set** **particleNum**(`value`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:180](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L180)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### createCustomMeshVertexShaderModule()

> **createCustomMeshVertexShaderModule**(): `GPUShaderModule`

Defined in: [src/display/particle/ParticleEmitter.ts:892](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L892)

Compiles and returns a custom vertex shader module for particles.

#### Returns

`GPUShaderModule`

Compiled GPUShaderModule

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_geometry

> **\_geometry**: [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L301)

#### Inherited from

[`Mesh`](Mesh.md).[`_geometry`](Mesh.md#_geometry)

***

***

### \_material

> **\_material**: `any`

Defined in: [src/display/mesh/Mesh.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L279)

#### Inherited from

[`Mesh`](Mesh.md).[`_material`](Mesh.md#_material)

***

***

### animationInfo

> **animationInfo**: `object`

Defined in: [src/display/mesh/core/MeshBase.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L42)

GLTF morph, skin, and clip animation information.

#### animationsList

> **animationsList**: [`ClipAnimState`](../../../classes/ClipAnimState.md)[]

#### jointBuffer

> **jointBuffer**: [`IndexBuffer`](../../Resource/classes/IndexBuffer.md)

#### morphInfo

> **morphInfo**: `MorphInfo_GLTF`

#### skinInfo

> **skinInfo**: `ParsedSkinInfo_GLTF`

#### weightBuffer

> **weightBuffer**: [`VertexBuffer`](../../Resource/classes/VertexBuffer.md)

#### Inherited from

[`Mesh`](Mesh.md).[`animationInfo`](Mesh.md#animationinfo)

***

***

### castShadow

> **castShadow**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L99)

Whether to cast shadows

#### Inherited from

[`Mesh`](Mesh.md).[`castShadow`](Mesh.md#castshadow)

***

***

### dirtyLOD

> **dirtyLOD**: `boolean` = `false`

Defined in: [src/display/mesh/Mesh.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L104)

Whether LOD info needs update

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyLOD`](Mesh.md#dirtylod)

***

***

### dirtyOpacity

> **dirtyOpacity**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L74)

Whether the opacity needs to be updated.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyOpacity`](Mesh.md#dirtyopacity)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L64)

Whether the render pipeline needs to be updated.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyPipeline`](Mesh.md#dirtypipeline)

***

***

### dirtyTransform

> **dirtyTransform**: `boolean` = `true`

Defined in: [src/display/mesh/core/MeshBase.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L69)

Whether the transform matrix needs to be updated.

#### Inherited from

[`Mesh`](Mesh.md).[`dirtyTransform`](Mesh.md#dirtytransform)

***

***

### disableJitter

> **disableJitter**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L50)

Whether to disable TAA jitter

#### Inherited from

[`Mesh`](Mesh.md).[`disableJitter`](Mesh.md#disablejitter)

***

***

### gltfLoaderInfo

> **gltfLoaderInfo**: [`GLTFLoader`](../../../classes/GLTFLoader.md)

Defined in: [src/display/mesh/core/MeshBase.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L59)

GLTFLoader instance information that loaded this object.

#### Inherited from

[`Mesh`](Mesh.md).[`gltfLoaderInfo`](Mesh.md#gltfloaderinfo)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`VertexGPURenderInfo`](../namespaces/CoreMesh/classes/VertexGPURenderInfo.md)

Defined in: [src/display/mesh/core/MeshBase.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L37)

GPU vertex render information object.

#### Inherited from

[`Mesh`](Mesh.md).[`gpuRenderInfo`](Mesh.md#gpurenderinfo)

***

***

### isInstanceofMesh

> **isInstanceofMesh**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L60)

Identifier to determine if it is a Mesh instance

#### Inherited from

[`Mesh`](Mesh.md).[`isInstanceofMesh`](Mesh.md#isinstanceofmesh)

***

***

### localMatrix

> **localMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L84)

Local transformation matrix relative to the parent.

#### Inherited from

[`Mesh`](Mesh.md).[`localMatrix`](Mesh.md#localmatrix)

***

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L79)

Model matrix with world transformation applied.

#### Inherited from

[`Mesh`](Mesh.md).[`modelMatrix`](Mesh.md#modelmatrix)

***

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/mesh/core/MeshBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L89)

Normal model matrix used for normal vector transformation.

#### Inherited from

[`Mesh`](Mesh.md).[`normalModelMatrix`](Mesh.md#normalmodelmatrix)

***

***

### passFrustumCulling

> **passFrustumCulling**: `boolean` = `true`

Defined in: [src/display/mesh/Mesh.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L109)

Whether it passed frustum culling

#### Inherited from

[`Mesh`](Mesh.md).[`passFrustumCulling`](Mesh.md#passfrustumculling)

***

***

### receiveShadow

> **receiveShadow**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L45)

Whether to receive shadows

#### Inherited from

[`Mesh`](Mesh.md).[`receiveShadow`](Mesh.md#receiveshadow)

***

***

### useDisplacementTexture

> **useDisplacementTexture**: `boolean`

Defined in: [src/display/mesh/Mesh.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L55)

Whether to use displacement texture

#### Inherited from

[`Mesh`](Mesh.md).[`useDisplacementTexture`](Mesh.md#usedisplacementtexture)

***

### boundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:751](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L751)

Returns the AABB (Axis-Aligned Bounding Box) information. (Zero-GC in-place reuse)

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Calculated AABB instance

#### Inherited from

[`Mesh`](Mesh.md).[`boundingAABB`](Mesh.md#boundingaabb)

***

***

### boundingOBB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingOBB**(): [`OBB`](../../Bound/classes/OBB.md)

Defined in: [src/display/mesh/Mesh.ts:736](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L736)

Returns the OBB (Oriented Bounding Box) information.

##### Returns

[`OBB`](../../Bound/classes/OBB.md)

Calculated OBB instance

#### Inherited from

[`Mesh`](Mesh.md).[`boundingOBB`](Mesh.md#boundingobb)

***

***

### children

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **children**(): [`Mesh`](Mesh.md)[]

Defined in: [src/display/mesh/core/Object3DContainer.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L46)

Returns the array of child objects.

##### Returns

[`Mesh`](Mesh.md)[]

Array of child Meshes (`Mesh[]`)

#### Inherited from

[`Mesh`](Mesh.md).[`children`](Mesh.md#children)

***

***

### combinedBoundingAABB

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **combinedBoundingAABB**(): [`AABB`](../../Bound/classes/AABB.md)

Defined in: [src/display/mesh/Mesh.ts:771](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L771)

Returns the combined AABB information including child objects.

##### Returns

[`AABB`](../../Bound/classes/AABB.md)

Combined AABB instance

#### Inherited from

[`Mesh`](Mesh.md).[`combinedBoundingAABB`](Mesh.md#combinedboundingaabb)

***

***

### currentShaderModuleName

#### Get Signature

> **get** **currentShaderModuleName**(): `string`

Defined in: [src/display/mesh/core/MeshBase.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L121)

Gets or sets the name of the currently applied vertex shader module.

##### Returns

`string`

Current vertex shader module name

#### Set Signature

> **set** **currentShaderModuleName**(`value`): `void`

Defined in: [src/display/mesh/core/MeshBase.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`currentShaderModuleName`](Mesh.md#currentshadermodulename)

***

***

### depthStencilState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthStencilState**(): [`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L149)

Returns the depth/stencil rendering state (`DepthStencilState`) of the object.

##### Returns

[`DepthStencilState`](../../RenderState/classes/DepthStencilState.md)

DepthStencilState instance

#### Inherited from

[`Mesh`](Mesh.md).[`depthStencilState`](Mesh.md#depthstencilstate)

***

***

### drawBufferManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawBufferManager**(): `DrawBufferManager`

Defined in: [src/display/mesh/Mesh.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L234)

Returns the draw buffer manager.

##### Returns

`DrawBufferManager`

DrawBufferManager instance or `null`

#### Inherited from

[`Mesh`](Mesh.md).[`drawBufferManager`](Mesh.md#drawbuffermanager)

***

***

### drawCommandSlot

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawCommandSlot**(): `DrawCommandSlot`

Defined in: [src/display/mesh/Mesh.ts:222](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L222)

Returns the draw command slot.

##### Returns

`DrawCommandSlot`

DrawCommandSlot instance or `null`

#### Inherited from

[`Mesh`](Mesh.md).[`drawCommandSlot`](Mesh.md#drawcommandslot)

***

***

### drawDebugger

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **drawDebugger**(): [`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

Defined in: [src/display/mesh/Mesh.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L275)

Returns the debug mesh object.

##### Returns

[`DrawDebuggerMesh`](../namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)

DrawDebuggerMesh instance

#### Inherited from

[`Mesh`](Mesh.md).[`drawDebugger`](Mesh.md#drawdebugger)

***

***

### enableDebugger

#### Get Signature

> **get** **enableDebugger**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L258)

Gets or sets whether the debugger is enabled.

##### Returns

`boolean`

Whether the debugger is enabled

#### Set Signature

> **set** **enableDebugger**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:262](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L262)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableDebugger`](Mesh.md#enabledebugger)

***

***

### enableWaterInteraction

#### Get Signature

> **get** **enableWaterInteraction**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:447](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L447)

Gets or sets whether real-time wave interaction with water (Lake) is enabled.

##### Returns

`boolean`

Whether water wave interaction is enabled

#### Set Signature

> **set** **enableWaterInteraction**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L451)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`enableWaterInteraction`](Mesh.md#enablewaterinteraction)

***

***

### events

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **events**(): `any`

Defined in: [src/display/mesh/Mesh.ts:407](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L407)

Returns the registered event map object.

##### Returns

`any`

Registered events object

#### Inherited from

[`Mesh`](Mesh.md).[`events`](Mesh.md#events)

***

***

### geometry

#### Get Signature

> **get** **geometry**(): [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/display/mesh/Mesh.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L311)

Gets or sets the geometry.

##### Returns

[`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)

Geometry or Primitive instance

#### Set Signature

> **set** **geometry**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:315](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L315)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Geometry`](../../../classes/Geometry.md) \| [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md) |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`geometry`](Mesh.md#geometry)

***

***

### globalVertexSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalVertexSlotIndex**(): `number`

Defined in: [src/display/mesh/Mesh.ts:210](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L210)

Returns the global buffer slot index.

##### Returns

`number`

Global vertex slot index

#### Inherited from

[`Mesh`](Mesh.md).[`globalVertexSlotIndex`](Mesh.md#globalvertexslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/display/mesh/core/MeshBase.ts:161](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L161)

Returns the WebGPU device associated with the current instance.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`Mesh`](Mesh.md).[`gpuDevice`](Mesh.md#gpudevice)

***

***

### ignoreFrustumCulling

#### Get Signature

> **get** **ignoreFrustumCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:347](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L347)

Gets or sets whether to ignore frustum culling.

##### Returns

`boolean`

Whether frustum culling is ignored

#### Set Signature

> **set** **ignoreFrustumCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L351)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`ignoreFrustumCulling`](Mesh.md#ignorefrustumculling)

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

[`Mesh`](Mesh.md).[`instanceId`](Mesh.md#instanceid)

***

***

### LODManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **LODManager**(): [`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

Defined in: [src/display/mesh/Mesh.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L246)

Returns the LOD (Level of Detail) manager.

##### Returns

[`LODManager`](../namespaces/CoreMesh/classes/LODManager.md)

LODManager instance

#### Inherited from

[`Mesh`](Mesh.md).[`LODManager`](Mesh.md#lodmanager)

***

***

### material

#### Get Signature

> **get** **material**(): `any`

Defined in: [src/display/mesh/Mesh.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L289)

Gets or sets the material.

##### Returns

`any`

Configured material instance

#### Set Signature

> **set** **material**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `any` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`material`](Mesh.md#material)

***

***

### minScreenSpaceSize

#### Get Signature

> **get** **minScreenSpaceSize**(): `number`

Defined in: [src/display/mesh/Mesh.ts:379](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L379)

Gets or sets the minimum size ratio threshold for screen space size culling.

##### Returns

`number`

Screen space size ratio threshold

#### Set Signature

> **set** **minScreenSpaceSize**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:383](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L383)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`minScreenSpaceSize`](Mesh.md#minscreenspacesize)

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

[`Mesh`](Mesh.md).[`name`](Mesh.md#name)

***

***

### numChildren

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **numChildren**(): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L58)

Returns the number of registered child objects.

##### Returns

`number`

Number of child objects

#### Inherited from

[`Mesh`](Mesh.md).[`numChildren`](Mesh.md#numchildren)

***

***

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:329](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L329)

Gets or sets the opacity of the mesh (0~1).

##### Returns

`number`

Opacity value (0~1)

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:333](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L333)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`opacity`](Mesh.md#opacity)

***

***

### parent

#### Get Signature

> **get** **parent**(): [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Defined in: [src/display/mesh/Mesh.ts:431](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L431)

Gets or sets the parent container object.

##### Returns

[`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md)

Parent Object3DContainer instance

#### Set Signature

> **set** **parent**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:435](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L435)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Object3DContainer`](../namespaces/CoreMesh/classes/Object3DContainer.md) |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`parent`](Mesh.md#parent)

***

***

### pickingId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingId**(): `number`

Defined in: [src/display/mesh/Mesh.ts:395](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L395)

Returns the picking ID.

##### Returns

`number`

Picking identifier value

#### Inherited from

[`Mesh`](Mesh.md).[`pickingId`](Mesh.md#pickingid)

***

***

### pivotX

#### Get Signature

> **get** **pivotX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:496](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L496)

Gets or sets the pivot X coordinate.

##### Returns

`number`

Pivot X coordinate

#### Set Signature

> **set** **pivotX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:500](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L500)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotX`](Mesh.md#pivotx)

***

***

### pivotY

#### Get Signature

> **get** **pivotY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:513](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L513)

Gets or sets the pivot Y coordinate.

##### Returns

`number`

Pivot Y coordinate

#### Set Signature

> **set** **pivotY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:517](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L517)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotY`](Mesh.md#pivoty)

***

***

### pivotZ

#### Get Signature

> **get** **pivotZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:530](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L530)

Gets or sets the pivot Z coordinate.

##### Returns

`number`

Pivot Z coordinate

#### Set Signature

> **set** **pivotZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:534](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L534)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`pivotZ`](Mesh.md#pivotz)

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L598)

Returns the current position. [x, y, z]

##### Returns

`Float32Array`

Position array

#### Inherited from

[`Mesh`](Mesh.md).[`position`](Mesh.md#position)

***

***

### primitiveState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **primitiveState**(): [`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

Defined in: [src/display/mesh/core/MeshBase.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L137)

Returns the primitive rendering state (`PrimitiveState`) of the object.

##### Returns

[`PrimitiveState`](../../RenderState/classes/PrimitiveState.md)

PrimitiveState instance

#### Inherited from

[`Mesh`](Mesh.md).[`primitiveState`](Mesh.md#primitivestate)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/display/mesh/core/MeshBase.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L173)

Returns the RedGPUContext associated with the current instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`Mesh`](Mesh.md).[`redGPUContext`](Mesh.md#redgpucontext)

***

***

### rotation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rotation**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:724](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L724)

Returns the current rotation values. [x, y, z] (degrees)

##### Returns

`Float32Array`

Rotation values array (degrees)

#### Inherited from

[`Mesh`](Mesh.md).[`rotation`](Mesh.md#rotation)

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:673](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L673)

Gets or sets the X-axis rotation value (degrees).

##### Returns

`number`

X-axis rotation value (degrees)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:677](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L677)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationX`](Mesh.md#rotationx)

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:690](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L690)

Gets or sets the Y-axis rotation value (degrees).

##### Returns

`number`

Y-axis rotation value (degrees)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:694](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L694)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationY`](Mesh.md#rotationy)

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:707](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L707)

Gets or sets the Z-axis rotation value (degrees).

##### Returns

`number`

Z-axis rotation value (degrees)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:711](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L711)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`rotationZ`](Mesh.md#rotationz)

***

***

### scale

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **scale**(): `Float32Array`

Defined in: [src/display/mesh/Mesh.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L661)

Returns the current scale. [x, y, z]

##### Returns

`Float32Array`

Scale array

#### Inherited from

[`Mesh`](Mesh.md).[`scale`](Mesh.md#scale)

***

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/mesh/Mesh.ts:610](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L610)

Gets or sets the X-axis scale.

##### Returns

`number`

X-axis scale value

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:614](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L614)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleX`](Mesh.md#scalex)

***

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/mesh/Mesh.ts:627](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L627)

Gets or sets the Y-axis scale.

##### Returns

`number`

Y-axis scale value

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:631](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L631)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleY`](Mesh.md#scaley)

***

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/mesh/Mesh.ts:644](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L644)

Gets or sets the Z-axis scale.

##### Returns

`number`

Z-axis scale value

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:648](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L648)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`scaleZ`](Mesh.md#scalez)

***

***

### useScreenSpaceSizeCulling

#### Get Signature

> **get** **useScreenSpaceSizeCulling**(): `boolean`

Defined in: [src/display/mesh/Mesh.ts:363](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L363)

Gets or sets whether to use screen space size culling.

##### Returns

`boolean`

Whether screen space size culling is used

#### Set Signature

> **set** **useScreenSpaceSizeCulling**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:367](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L367)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`useScreenSpaceSizeCulling`](Mesh.md#usescreenspacesizeculling)

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

[`Mesh`](Mesh.md).[`uuid`](Mesh.md#uuid)

***

***

### vertexStateBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexStateBuffers**(): `GPUVertexBufferLayout`[]

Defined in: [src/display/particle/ParticleEmitter.ts:142](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L142)

Gets the instance-based GPU vertex buffer layout details used for rendering individual particles.

##### Returns

`GPUVertexBufferLayout`[]

Array of GPU vertex buffer layouts

#### Inherited from

[`Mesh`](Mesh.md).[`vertexStateBuffers`](Mesh.md#vertexstatebuffers)

***

***

### waterWaveStrength

#### Get Signature

> **get** **waterWaveStrength**(): `number`

Defined in: [src/display/mesh/Mesh.ts:472](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L472)

Gets or sets the wave generation strength multiplier (default: 1.0).

##### Returns

`number`

Water wave generation strength multiplier

#### Set Signature

> **set** **waterWaveStrength**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:476](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L476)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`waterWaveStrength`](Mesh.md#waterwavestrength)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/mesh/Mesh.ts:547](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L547)

Gets or sets the X position coordinate.

##### Returns

`number`

X position coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:551](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L551)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`x`](Mesh.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/mesh/Mesh.ts:564](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L564)

Gets or sets the Y position coordinate.

##### Returns

`number`

Y position coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:568](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L568)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`y`](Mesh.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/mesh/Mesh.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L581)

Gets or sets the Z position coordinate.

##### Returns

`number`

Z position coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/mesh/Mesh.ts:585](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L585)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`z`](Mesh.md#z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### addChild()

> **addChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L89)

Appends a child object to the end of the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |

#### Returns

[`Mesh`](Mesh.md)

Added child object (`null` on failure)

#### Inherited from

[`Mesh`](Mesh.md).[`addChild`](Mesh.md#addchild)

***

***

### addChildAt()

> **addChildAt**(`child`, `index`): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L115)

Inserts a child object at the specified index position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to add |
| `index` | `number` | Index position to insert at |

#### Returns

`ParticleEmitter`

Current container instance

#### Inherited from

[`Mesh`](Mesh.md).[`addChildAt`](Mesh.md#addchildat)

***

***

### addListener()

> **addListener**(`eventName`, `callback`): `void`

Defined in: [src/display/mesh/Mesh.ts:888](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L888)

Adds an event listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `eventName` | `string` | Event name |
| `callback` | `Function` | Callback function |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`addListener`](Mesh.md#addlistener)

***

***

### clone()

> **clone**(): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/Mesh.ts:1002](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1002)

**`Experimental`**

Clones the mesh.

#### Returns

[`Mesh`](Mesh.md)

Cloned Mesh instance

#### Inherited from

[`Mesh`](Mesh.md).[`clone`](Mesh.md#clone)

***

***

### contains()

> **contains**(`child`): `boolean`

Defined in: [src/display/mesh/core/Object3DContainer.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L73)

Checks whether the specified object is a child of this container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to check |

#### Returns

`boolean`

Whether the child is contained

#### Inherited from

[`Mesh`](Mesh.md).[`contains`](Mesh.md#contains)

***

***

### createMeshVertexShaderModuleBASIC()

> **createMeshVertexShaderModuleBASIC**(`VERTEX_SHADER_MODULE_NAME`, `SHADER_INFO`, `UNIFORM_STRUCT_BASIC`, `vertexModuleSource`): `GPUShaderModule`

Defined in: [src/display/mesh/Mesh.ts:1721](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1721)

Creates and returns the basic mesh vertex shader module and uniform bind group.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `VERTEX_SHADER_MODULE_NAME` | `any` | Vertex shader module name |
| `SHADER_INFO` | `any` | Parsed WGSL shader info |
| `UNIFORM_STRUCT_BASIC` | `any` | Vertex uniform struct info |
| `vertexModuleSource` | `any` | Vertex shader WGSL source code |

#### Returns

`GPUShaderModule`

Created GPUShaderModule instance

#### Inherited from

[`Mesh`](Mesh.md).[`createMeshVertexShaderModuleBASIC`](Mesh.md#createmeshvertexshadermodulebasic)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:916](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L916)

Releases and destroys the particle emitter and its associated GPU buffers and pipeline resources.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`destroy`](Mesh.md#destroy)

***

***

### getChildAt()

> **getChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L143)

Returns the child object at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index position to retrieve |

#### Returns

[`Mesh`](Mesh.md)

Child object at the index (`undefined` if out of bounds)

#### Inherited from

[`Mesh`](Mesh.md).[`getChildAt`](Mesh.md#getchildat)

***

***

### getChildIndex()

> **getChildIndex**(`child`): `number`

Defined in: [src/display/mesh/core/Object3DContainer.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L163)

Returns the index of the specified child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to find the index of |

#### Returns

`number`

Index of the child object (`-1` if not found)

#### Inherited from

[`Mesh`](Mesh.md).[`getChildIndex`](Mesh.md#getchildindex)

***

***

### getCombinedOpacity()

> **getCombinedOpacity**(): `number`

Defined in: [src/display/mesh/Mesh.ts:869](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L869)

Calculates and returns the combined opacity considering the parent hierarchy.

#### Returns

`number`

Combined opacity value

#### Inherited from

[`Mesh`](Mesh.md).[`getCombinedOpacity`](Mesh.md#getcombinedopacity)

***

***

### getScreenPoint()

> **getScreenPoint**(`view`): \[`number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L245)

Returns the 2D screen coordinates of this object based on the specified view.

#### Example
```typescript
const screenPos = mesh.getScreenPoint(view3D);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](View3D.md) | Reference View3D instance |

#### Returns

\[`number`, `number`\]

Screen coordinates `[x, y]`

#### Inherited from

[`Mesh`](Mesh.md).[`getScreenPoint`](Mesh.md#getscreenpoint)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/display/mesh/Mesh.ts:1687](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L1687)

Initializes the mesh's GPU render info (VertexGPURenderInfo) and updates the pipeline.

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`initGPURenderInfos`](Mesh.md#initgpurenderinfos)

***

***

### localToWorld()

> **localToWorld**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L225)

Converts this object's local space coordinates to world space coordinates.

#### Example
```typescript
const worldPos = mesh.localToWorld(0, 1, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Local X coordinate |
| `y` | `number` | Local Y coordinate |
| `z` | `number` | Local Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted world coordinates `[x, y, z]`

#### Inherited from

[`Mesh`](Mesh.md).[`localToWorld`](Mesh.md#localtoworld)

***

***

### lookAt()

> **lookAt**(`targetX`, `targetY?`, `targetZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:907](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L907)

Rotates the mesh to look at a specific coordinate.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetX` | `number` \| \[`number`, `number`, `number`\] | Target X coordinate or [x, y, z] array |
| `targetY?` | `number` | Target Y coordinate (ignored if targetX is an array) |
| `targetZ?` | `number` | Target Z coordinate (ignored if targetX is an array) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`lookAt`](Mesh.md#lookat)

***

***

### removeAllChildren()

> **removeAllChildren**(): `ParticleEmitter`

Defined in: [src/display/mesh/core/Object3DContainer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L309)

Removes all child objects from the container.

#### Returns

`ParticleEmitter`

Current container instance

#### Inherited from

[`Mesh`](Mesh.md).[`removeAllChildren`](Mesh.md#removeallchildren)

***

***

### removeChild()

> **removeChild**(`child`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L265)

Removes the specified child object from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Inherited from

[`Mesh`](Mesh.md).[`removeChild`](Mesh.md#removechild)

***

***

### removeChildAt()

> **removeChildAt**(`index`): [`Mesh`](Mesh.md)

Defined in: [src/display/mesh/core/Object3DContainer.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L290)

Removes the child object at the specified index from the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Index of the child object to remove |

#### Returns

[`Mesh`](Mesh.md)

Removed child object

#### Throws

Throws Error if no child exists at the provided index

#### Inherited from

[`Mesh`](Mesh.md).[`removeChildAt`](Mesh.md#removechildat)

***

***

### render()

> **render**(`renderViewStateData`): `void`

Defined in: [src/display/particle/ParticleEmitter.ts:878](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/ParticleEmitter.ts#L878)

Updates and simulates the particle emitter on a per-frame basis. Triggers the GPU Compute Pass each frame to recalculate position and transform states.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md) | Render view state data object |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`render`](Mesh.md#render)

***

***

### setCastShadowRecursively()

> **setCastShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:802](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L802)

Sets shadow casting for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to cast (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setCastShadowRecursively`](Mesh.md#setcastshadowrecursively)

***

***

### setChildIndex()

> **setChildIndex**(`child`, `index`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L184)

Changes the index position of a child object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child` | [`Mesh`](Mesh.md) | Child object to reposition |
| `index` | `number` | New index to assign |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setChildIndex`](Mesh.md#setchildindex)

***

***

### setEnableDebuggerRecursively()

> **setEnableDebuggerRecursively**(`enableDebugger?`): `void`

Defined in: [src/display/mesh/Mesh.ts:783](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L783)

Sets the debugger visibility for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `enableDebugger?` | `boolean` | `false` | Whether to enable (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setEnableDebuggerRecursively`](Mesh.md#setenabledebuggerrecursively)

***

***

### setIgnoreFrustumCullingRecursively()

> **setIgnoreFrustumCullingRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:840](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L840)

Sets whether to ignore frustum culling for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to ignore (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setIgnoreFrustumCullingRecursively`](Mesh.md#setignorefrustumcullingrecursively)

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:959](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L959)

Sets the position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate |
| `y?` | `number` | Y coordinate (if omitted, same as x) |
| `z?` | `number` | Z coordinate (if omitted, same as x) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setPosition`](Mesh.md#setposition)

***

***

### setReceiveShadowRecursively()

> **setReceiveShadowRecursively**(`value?`): `void`

Defined in: [src/display/mesh/Mesh.ts:821](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L821)

Sets shadow receiving for all objects in the hierarchy.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value?` | `boolean` | `false` | Whether to receive (default: false) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setReceiveShadowRecursively`](Mesh.md#setreceiveshadowrecursively)

***

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/mesh/Mesh.ts:983](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L983)

Sets the rotation values. (degrees)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X-axis rotation |
| `rotationY?` | `number` | Y-axis rotation (if omitted, same as rotationX) |
| `rotationZ?` | `number` | Z-axis rotation (if omitted, same as rotationX) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setRotation`](Mesh.md#setrotation)

***

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/mesh/Mesh.ts:935](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/Mesh.ts#L935)

Sets the scale.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis scale |
| `y?` | `number` | Y-axis scale (if omitted, same as x) |
| `z?` | `number` | Z-axis scale (if omitted, same as x) |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`setScale`](Mesh.md#setscale)

***

***

### swapChildren()

> **swapChildren**(`child1`, `child2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L213)

Swaps the order (indices) of two child objects within the container.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `child1` | [`Mesh`](Mesh.md) | First child object |
| `child2` | [`Mesh`](Mesh.md) | Second child object |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildren`](Mesh.md#swapchildren)

***

***

### swapChildrenAt()

> **swapChildrenAt**(`index1`, `index2`): `void`

Defined in: [src/display/mesh/core/Object3DContainer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/Object3DContainer.ts#L239)

Swaps the child objects at the two specified indices.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index1` | `number` | First index |
| `index2` | `number` | Second index |

#### Returns

`void`

#### Inherited from

[`Mesh`](Mesh.md).[`swapChildrenAt`](Mesh.md#swapchildrenat)

***

***

### worldToLocal()

> **worldToLocal**(`x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/display/mesh/core/MeshBase.ts:199](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/mesh/core/MeshBase.ts#L199)

Converts world space coordinates to this object's local space coordinates.

#### Example
```typescript
const localPos = mesh.worldToLocal(10, 5, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | World X coordinate |
| `y` | `number` | World Y coordinate |
| `z` | `number` | World Z coordinate |

#### Returns

\[`number`, `number`, `number`\]

Converted local coordinates `[x, y, z]`

#### Inherited from

[`Mesh`](Mesh.md).[`worldToLocal`](Mesh.md#worldtolocal)

</details>
