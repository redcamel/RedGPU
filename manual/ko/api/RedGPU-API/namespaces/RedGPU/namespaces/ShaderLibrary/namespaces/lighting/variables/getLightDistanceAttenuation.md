[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [lighting](../README.md) / getLightDistanceAttenuation

# Variable: getLightDistanceAttenuation

> `const` **getLightDistanceAttenuation**: `string` = `getLightDistanceAttenuation_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1453](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L1453)

물리적인 역제곱 법칙(Inverse Square Law)에 따른 광원 감쇄 계수를 계산합니다.

이 함수는 순수 물리적 역제곱 법칙(1/d^2)을 따르며, Frostbite 방식의 윈도잉 함수를 사용하여 광원의 radius 지점에서 부드럽게 0으로 수렴하도록 합니다.
주의: 4*PI 분산 계수는 에너지 보존을 위해 외부(Lumen 단위 변환 시)에서 적용되어야 합니다.

//

## Param

광원으로부터의 거리
//

## Param

광원의 최대 도달 반경 (윈도잉 기준)
//

## Returns

계산된 물리적 감쇄 계수

```wgsl
#redgpu_include math.EPSILON

fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
    let d2 = distance * distance;

    // 현대적인 표준 윈도잉 함수 (Frostbite / Unreal 방식)
    let factor = distance / radius;
    let factor2 = factor * factor;
    let factor4 = factor2 * factor2;
    let windowing = clamp(1.0 - factor4, 0.0, 1.0);

    // 순수 역제곱 법칙 적용 (1 / d^2) + 윈도잉
    return (windowing * windowing) / max(d2, 0.0001);
}
```
