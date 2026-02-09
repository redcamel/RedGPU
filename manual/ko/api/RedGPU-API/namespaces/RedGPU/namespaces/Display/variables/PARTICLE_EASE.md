[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / PARTICLE\_EASE

# Variable: PARTICLE\_EASE

> `const` **PARTICLE\_EASE**: `object`

Defined in: [src/display/paticle/PARTICLE\_EASE.ts:16](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L16)

파티클 애니메이션에 적용되는 이징(Easing) 함수 타입 정의입니다.


파티클의 위치, 회전, 스케일, 알파 등 각 속성의 변화 흐름을 제어하는 다양한 수학적 보간 방식을 제공합니다.


* ### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.easeX = RedGPU.Display.PARTICLE_EASE.CubicOut;
emitter.easeAlpha = RedGPU.Display.PARTICLE_EASE.Linear;
```

## Type Declaration

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="backin"></a> `BackIn` | `4` | `4` | [src/display/paticle/PARTICLE\_EASE.ts:22](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L22) |
| <a id="backinout"></a> `BackInOut` | `6` | `6` | [src/display/paticle/PARTICLE\_EASE.ts:24](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L24) |
| <a id="backout"></a> `BackOut` | `5` | `5` | [src/display/paticle/PARTICLE\_EASE.ts:23](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L23) |
| <a id="circin"></a> `CircIn` | `7` | `7` | [src/display/paticle/PARTICLE\_EASE.ts:26](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L26) |
| <a id="circinout"></a> `CircInOut` | `9` | `9` | [src/display/paticle/PARTICLE\_EASE.ts:28](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L28) |
| <a id="circout"></a> `CircOut` | `8` | `8` | [src/display/paticle/PARTICLE\_EASE.ts:27](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L27) |
| <a id="cubicin"></a> `CubicIn` | `10` | `10` | [src/display/paticle/PARTICLE\_EASE.ts:30](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L30) |
| <a id="cubicinout"></a> `CubicInOut` | `12` | `12` | [src/display/paticle/PARTICLE\_EASE.ts:32](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L32) |
| <a id="cubicout"></a> `CubicOut` | `11` | `11` | [src/display/paticle/PARTICLE\_EASE.ts:31](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L31) |
| <a id="elasticin"></a> `ElasticIn` | `25` | `25` | [src/display/paticle/PARTICLE\_EASE.ts:49](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L49) |
| <a id="elasticinout"></a> `ElasticInOut` | `27` | `27` | [src/display/paticle/PARTICLE\_EASE.ts:51](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L51) |
| <a id="elasticout"></a> `ElasticOut` | `26` | `26` | [src/display/paticle/PARTICLE\_EASE.ts:50](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L50) |
| <a id="expoin"></a> `ExpoIn` | `13` | `13` | [src/display/paticle/PARTICLE\_EASE.ts:34](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L34) |
| <a id="expoinout"></a> `ExpoInOut` | `15` | `15` | [src/display/paticle/PARTICLE\_EASE.ts:36](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L36) |
| <a id="expoout"></a> `ExpoOut` | `14` | `14` | [src/display/paticle/PARTICLE\_EASE.ts:35](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L35) |
| <a id="linear"></a> `Linear` | `0` | `0` | [src/display/paticle/PARTICLE\_EASE.ts:17](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L17) |
| <a id="quadin"></a> `QuadIn` | `16` | `16` | [src/display/paticle/PARTICLE\_EASE.ts:38](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L38) |
| <a id="quadinout"></a> `QuadInOut` | `18` | `18` | [src/display/paticle/PARTICLE\_EASE.ts:40](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L40) |
| <a id="quadout"></a> `QuadOut` | `17` | `17` | [src/display/paticle/PARTICLE\_EASE.ts:39](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L39) |
| <a id="quartin"></a> `QuartIn` | `19` | `19` | [src/display/paticle/PARTICLE\_EASE.ts:42](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L42) |
| <a id="quartinout"></a> `QuartInOut` | `21` | `21` | [src/display/paticle/PARTICLE\_EASE.ts:44](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L44) |
| <a id="quartout"></a> `QuartOut` | `20` | `20` | [src/display/paticle/PARTICLE\_EASE.ts:43](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L43) |
| <a id="quintin"></a> `QuintIn` | `1` | `1` | [src/display/paticle/PARTICLE\_EASE.ts:18](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L18) |
| <a id="quintinout"></a> `QuintInOut` | `3` | `3` | [src/display/paticle/PARTICLE\_EASE.ts:20](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L20) |
| <a id="quintout"></a> `QuintOut` | `2` | `2` | [src/display/paticle/PARTICLE\_EASE.ts:19](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L19) |
| <a id="sinein"></a> `SineIn` | `22` | `22` | [src/display/paticle/PARTICLE\_EASE.ts:46](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L46) |
| <a id="sineinout"></a> `SineInOut` | `24` | `24` | [src/display/paticle/PARTICLE\_EASE.ts:48](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L48) |
| <a id="sineout"></a> `SineOut` | `23` | `23` | [src/display/paticle/PARTICLE\_EASE.ts:47](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/display/paticle/PARTICLE_EASE.ts#L47) |
