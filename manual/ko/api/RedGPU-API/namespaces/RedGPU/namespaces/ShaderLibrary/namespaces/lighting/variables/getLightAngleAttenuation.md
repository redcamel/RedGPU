[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [lighting](../README.md) / getLightAngleAttenuation

# Variable: getLightAngleAttenuation

> `const` **getLightAngleAttenuation**: `string` = `getLightAngleAttenuation_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1490](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/systemCodeManager/ShaderLibrary.ts#L1490)

스폿라이트의 각도(원뿔)에 따른 감쇄 계수를 계산합니다.

내부 원뿔(Inner Cone)과 외부 원뿔(Outer Cone) 사이의 영역에서 부드러운 페이드 효과를 생성합니다.

//

## Param

광원에서 픽셀(버텍스)을 향하는 정규화된 방향 벡터
//

## Param

스폿라이트가 비추는 정규화된 중심 방향 벡터
//

## Param

내부 원뿔 컷오프 각도 (Degree)
//

## Param

외부 원뿔 컷오프 각도 (Degree)
//

## Returns

계산된 각도 감쇄 계수 (0.0 ~ 1.0)

```wgsl
#redgpu_include math.EPSILON

fn getLightAngleAttenuation(
    lightToVertexDirection: vec3<f32>,
    lightDirection: vec3<f32>,
    innerCutoff: f32,
    outerCutoff: f32
) -> f32 {
    let cosTheta = dot(lightToVertexDirection, lightDirection);
    let cosOuter = cos(radians(outerCutoff));
    let cosInner = cos(radians(innerCutoff));

    // 스폿라이트 감쇄 수식 (glTF 2.0 표준)

    let epsilon = max(EPSILON, cosInner - cosOuter);
    let factor = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);
    return factor * factor;
}
```
