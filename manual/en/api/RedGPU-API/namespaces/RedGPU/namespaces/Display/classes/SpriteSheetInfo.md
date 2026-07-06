[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheetInfo

# Class: SpriteSheetInfo

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:25](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L25)

Class that contains information for sprite sheet animation.

Defines the structure and playback settings of animation frames arranged in a grid within a single texture. Manages animation metadata shared by sprite sheet instances.

* ### Example
```typescript
const info = new RedGPU.Display.SpriteSheetInfo(
   redGPUContext,
   'path/to/image.png',
   5, 3, // segmentW, segmentH
   15,   // totalFrame
   0     // startIndex
);
```

## Constructors

### Constructor

> **new SpriteSheetInfo**(`redGPUContext`, `src`, `segmentW`, `segmentH`, `totalFrame`, `startIndex`, `loop?`, `frameRate?`): `SpriteSheetInfo`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:95](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L95)

Creates a new SpriteSheetInfo instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU rendering context |
| `src` | `string` | `undefined` | Path or URL to the sprite sheet image file |
| `segmentW` | `number` | `undefined` | Number of horizontal segments (positive integer) |
| `segmentH` | `number` | `undefined` | Number of vertical segments (positive integer) |
| `totalFrame` | `number` | `undefined` | Total number of animation frames (positive integer) |
| `startIndex` | `number` | `undefined` | Starting frame index (integer of 0 or more) |
| `loop` | `boolean` | `true` | Whether to repeat playback (default: true) |
| `frameRate` | `number` | `60` | Animation frame rate (default: 60 FPS) |

#### Returns

`SpriteSheetInfo`

#### Throws

Throws error if redGPUContext is invalid or parameters are out of range

## Accessors

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:179](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L179)

Returns the animation frame rate (FPS).

##### Returns

`number`

Frames per second (FPS)

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:190](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L190)

Returns whether to repeat playback.

##### Returns

`boolean`

If true, playback loops; if false, it plays once

***

### segmentH

#### Get Signature

> **get** **segmentH**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:135](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L135)

Returns the number of vertical segments. (Texture division count vertically)

##### Returns

`number`

Number of vertical segments

***

### segmentW

#### Get Signature

> **get** **segmentW**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L124)

Returns the number of horizontal segments. (Texture division count horizontally)

##### Returns

`number`

Number of horizontal segments

***

### startIndex

#### Get Signature

> **get** **startIndex**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:157](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L157)

Returns the starting frame index. (0-based index)

##### Returns

`number`

Starting frame index

***

### texture

#### Get Signature

> **get** **texture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:168](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L168)

Returns the sprite sheet bitmap texture.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Bitmap texture used

***

### totalFrame

#### Get Signature

> **get** **totalFrame**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:146](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L146)

Returns the total number of animation frames.

##### Returns

`number`

Total frame count
