[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / PARTICLE\_EASE

# Variable: PARTICLE\_EASE

> `const` **PARTICLE\_EASE**: `object`

Defined in: [src/display/particle/PARTICLE\_EASE.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L16)

Easing function constant definitions applied to particle animations.

Provides various mathematical interpolation methods to control the change flow of each attribute such as position, rotation, scale, and alpha of particles.

### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.easeX = RedGPU.Display.PARTICLE_EASE.CubicOut;
emitter.easeAlpha = RedGPU.Display.PARTICLE_EASE.Linear;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-backin"></a> `BackIn` | `4` | `4` | Back ease-in | [src/display/particle/PARTICLE\_EASE.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L41) |
| <a id="property-backinout"></a> `BackInOut` | `6` | `6` | Back ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L51) |
| <a id="property-backout"></a> `BackOut` | `5` | `5` | Back ease-out | [src/display/particle/PARTICLE\_EASE.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L46) |
| <a id="property-circin"></a> `CircIn` | `7` | `7` | Circular ease-in | [src/display/particle/PARTICLE\_EASE.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L56) |
| <a id="property-circinout"></a> `CircInOut` | `9` | `9` | Circular ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L66) |
| <a id="property-circout"></a> `CircOut` | `8` | `8` | Circular ease-out | [src/display/particle/PARTICLE\_EASE.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L61) |
| <a id="property-cubicin"></a> `CubicIn` | `10` | `10` | Cubic ease-in | [src/display/particle/PARTICLE\_EASE.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L71) |
| <a id="property-cubicinout"></a> `CubicInOut` | `12` | `12` | Cubic ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L81) |
| <a id="property-cubicout"></a> `CubicOut` | `11` | `11` | Cubic ease-out | [src/display/particle/PARTICLE\_EASE.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L76) |
| <a id="property-elasticin"></a> `ElasticIn` | `25` | `25` | Elastic ease-in | [src/display/particle/PARTICLE\_EASE.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L146) |
| <a id="property-elasticinout"></a> `ElasticInOut` | `27` | `27` | Elastic ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L156) |
| <a id="property-elasticout"></a> `ElasticOut` | `26` | `26` | Elastic ease-out | [src/display/particle/PARTICLE\_EASE.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L151) |
| <a id="property-expoin"></a> `ExpoIn` | `13` | `13` | Exponential ease-in | [src/display/particle/PARTICLE\_EASE.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L86) |
| <a id="property-expoinout"></a> `ExpoInOut` | `15` | `15` | Exponential ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L96) |
| <a id="property-expoout"></a> `ExpoOut` | `14` | `14` | Exponential ease-out | [src/display/particle/PARTICLE\_EASE.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L91) |
| <a id="property-linear"></a> `Linear` | `0` | `0` | Linear interpolation | [src/display/particle/PARTICLE\_EASE.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L21) |
| <a id="property-quadin"></a> `QuadIn` | `16` | `16` | Quadratic ease-in | [src/display/particle/PARTICLE\_EASE.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L101) |
| <a id="property-quadinout"></a> `QuadInOut` | `18` | `18` | Quadratic ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L111) |
| <a id="property-quadout"></a> `QuadOut` | `17` | `17` | Quadratic ease-out | [src/display/particle/PARTICLE\_EASE.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L106) |
| <a id="property-quartin"></a> `QuartIn` | `19` | `19` | Quartic ease-in | [src/display/particle/PARTICLE\_EASE.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L116) |
| <a id="property-quartinout"></a> `QuartInOut` | `21` | `21` | Quartic ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L126) |
| <a id="property-quartout"></a> `QuartOut` | `20` | `20` | Quartic ease-out | [src/display/particle/PARTICLE\_EASE.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L121) |
| <a id="property-quintin"></a> `QuintIn` | `1` | `1` | Quintic ease-in | [src/display/particle/PARTICLE\_EASE.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L26) |
| <a id="property-quintinout"></a> `QuintInOut` | `3` | `3` | Quintic ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L36) |
| <a id="property-quintout"></a> `QuintOut` | `2` | `2` | Quintic ease-out | [src/display/particle/PARTICLE\_EASE.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L31) |
| <a id="property-sinein"></a> `SineIn` | `22` | `22` | Sine ease-in | [src/display/particle/PARTICLE\_EASE.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L131) |
| <a id="property-sineinout"></a> `SineInOut` | `24` | `24` | Sine ease-in-out | [src/display/particle/PARTICLE\_EASE.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L141) |
| <a id="property-sineout"></a> `SineOut` | `23` | `23` | Sine ease-out | [src/display/particle/PARTICLE\_EASE.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L136) |
