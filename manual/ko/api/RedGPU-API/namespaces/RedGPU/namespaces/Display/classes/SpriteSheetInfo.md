[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / SpriteSheetInfo

# Class: SpriteSheetInfo

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:25](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L25)

스프라이트 시트 애니메이션을 위한 정보를 담는 클래스입니다.

하나의 텍스처에 격자 형태로 배열된 애니메이션 프레임들의 구조와 재생 설정을 정의합니다. 스프라이트 시트 인스턴스들이 공유하는 애니메이션 메타데이터를 관리합니다.

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

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:95](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L95)

새로운 SpriteSheetInfo 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPU 렌더링 컨텍스트
| `src` | `string` | `undefined` | 스프라이트 시트 이미지 파일 경로 또는 URL
| `segmentW` | `number` | `undefined` | 가로 세그먼트 수 (양의 정수)
| `segmentH` | `number` | `undefined` | 세로 세그먼트 수 (양의 정수)
| `totalFrame` | `number` | `undefined` | 총 애니메이션 프레임 수 (양의 정수)
| `startIndex` | `number` | `undefined` | 시작 프레임 인덱스 (0 이상의 정수)
| `loop` | `boolean` | `true` | 반복 재생 여부 (기본값: true)
| `frameRate` | `number` | `60` | 애니메이션 프레임 레이트 (기본값: 60 FPS)

#### Returns

`SpriteSheetInfo`

#### Throws

redGPUContext가 유효하지 않거나 매개변수가 범위를 벗어나는 경우 에러 발생

## Accessors

### frameRate

#### Get Signature

> **get** **frameRate**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:179](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L179)

애니메이션 프레임 레이트 (FPS)를 반환합니다.

##### Returns

`number`

초당 프레임 수

***

### loop

#### Get Signature

> **get** **loop**(): `boolean`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:190](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L190)

반복 재생 여부를 반환합니다.

##### Returns

`boolean`

true일 경우 반복 재생, false인 경우 한 번만 재생

***

### segmentH

#### Get Signature

> **get** **segmentH**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:135](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L135)

세로 세그먼트 수를 반환합니다. (텍스처를 세로로 나누는 분할 수)

##### Returns

`number`

세로 세그먼트 수

***

### segmentW

#### Get Signature

> **get** **segmentW**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:124](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L124)

가로 세그먼트 수를 반환합니다. (텍스처를 가로로 나누는 분할 수)

##### Returns

`number`

가로 세그먼트 수

***

### startIndex

#### Get Signature

> **get** **startIndex**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:157](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L157)

시작 프레임 인덱스를 반환합니다. (0부터 시작)

##### Returns

`number`

시작 프레임 인덱스

***

### texture

#### Get Signature

> **get** **texture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:168](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L168)

스프라이트 시트 비트맵 텍스처를 반환합니다.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

사용되는 비트맵 텍스처

***

### totalFrame

#### Get Signature

> **get** **totalFrame**(): `number`

Defined in: [src/display/sprites/spriteSheets/SpriteSheetInfo.ts:146](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/sprites/spriteSheets/SpriteSheetInfo.ts#L146)

총 애니메이션 프레임 수를 반환합니다.

##### Returns

`number`

총 프레임 수
