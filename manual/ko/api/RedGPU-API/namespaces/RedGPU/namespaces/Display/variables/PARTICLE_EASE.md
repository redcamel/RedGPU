[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / PARTICLE\_EASE

# Variable: PARTICLE\_EASE

> `const` **PARTICLE\_EASE**: `object`

Defined in: [src/display/particle/PARTICLE\_EASE.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L16)

파티클 애니메이션에 적용되는 이징(Easing) 함수 상수 정의입니다.

파티클의 위치, 회전, 스케일, 알파 등 각 속성의 변화 흐름을 제어하는 다양한 수학적 보간 방식을 제공합니다.

### Example
```typescript
const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
emitter.easeX = RedGPU.Display.PARTICLE_EASE.CubicOut;
emitter.easeAlpha = RedGPU.Display.PARTICLE_EASE.Linear;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-backin"></a> `BackIn` | `4` | `4` | 백 인 | [src/display/particle/PARTICLE\_EASE.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L41) |
| <a id="property-backinout"></a> `BackInOut` | `6` | `6` | 백 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L51) |
| <a id="property-backout"></a> `BackOut` | `5` | `5` | 백 아웃 | [src/display/particle/PARTICLE\_EASE.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L46) |
| <a id="property-circin"></a> `CircIn` | `7` | `7` | 원형 인 | [src/display/particle/PARTICLE\_EASE.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L56) |
| <a id="property-circinout"></a> `CircInOut` | `9` | `9` | 원형 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L66) |
| <a id="property-circout"></a> `CircOut` | `8` | `8` | 원형 아웃 | [src/display/particle/PARTICLE\_EASE.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L61) |
| <a id="property-cubicin"></a> `CubicIn` | `10` | `10` | 3차 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L71) |
| <a id="property-cubicinout"></a> `CubicInOut` | `12` | `12` | 3차 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L81) |
| <a id="property-cubicout"></a> `CubicOut` | `11` | `11` | 3차 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L76) |
| <a id="property-elasticin"></a> `ElasticIn` | `25` | `25` | 탄성 인 | [src/display/particle/PARTICLE\_EASE.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L146) |
| <a id="property-elasticinout"></a> `ElasticInOut` | `27` | `27` | 탄성 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:156](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L156) |
| <a id="property-elasticout"></a> `ElasticOut` | `26` | `26` | 탄성 아웃 | [src/display/particle/PARTICLE\_EASE.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L151) |
| <a id="property-expoin"></a> `ExpoIn` | `13` | `13` | 지수 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L86) |
| <a id="property-expoinout"></a> `ExpoInOut` | `15` | `15` | 지수 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L96) |
| <a id="property-expoout"></a> `ExpoOut` | `14` | `14` | 지수 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L91) |
| <a id="property-linear"></a> `Linear` | `0` | `0` | 선형 보간 | [src/display/particle/PARTICLE\_EASE.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L21) |
| <a id="property-quadin"></a> `QuadIn` | `16` | `16` | 2차 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L101) |
| <a id="property-quadinout"></a> `QuadInOut` | `18` | `18` | 2차 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:111](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L111) |
| <a id="property-quadout"></a> `QuadOut` | `17` | `17` | 2차 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L106) |
| <a id="property-quartin"></a> `QuartIn` | `19` | `19` | 4차 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L116) |
| <a id="property-quartinout"></a> `QuartInOut` | `21` | `21` | 4차 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L126) |
| <a id="property-quartout"></a> `QuartOut` | `20` | `20` | 4차 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L121) |
| <a id="property-quintin"></a> `QuintIn` | `1` | `1` | 5차 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L26) |
| <a id="property-quintinout"></a> `QuintInOut` | `3` | `3` | 5차 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L36) |
| <a id="property-quintout"></a> `QuintOut` | `2` | `2` | 5차 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L31) |
| <a id="property-sinein"></a> `SineIn` | `22` | `22` | 사인 곡선 인 | [src/display/particle/PARTICLE\_EASE.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L131) |
| <a id="property-sineinout"></a> `SineInOut` | `24` | `24` | 사인 곡선 인-아웃 | [src/display/particle/PARTICLE\_EASE.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L141) |
| <a id="property-sineout"></a> `SineOut` | `23` | `23` | 사인 곡선 아웃 | [src/display/particle/PARTICLE\_EASE.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/particle/PARTICLE_EASE.ts#L136) |
