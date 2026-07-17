[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [lighting](../README.md) / getLightAngleAttenuation

# Variable: getLightAngleAttenuation

> `const` **getLightAngleAttenuation**: `string` = `getLightAngleAttenuation_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1490](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/systemCodeManager/ShaderLibrary.ts#L1490)

Calculates the attenuation factor according to the angle (cone) of the spotlight.

Creates a smooth fade effect in the area between the inner cone and the outer cone.

//

## Param

Normalized direction vector from the light source to the pixel (vertex)
//

## Param

Normalized center direction vector that the spotlight shines in
//

## Param

Inner cone cutoff angle (Degree)
//

## Param

Outer cone cutoff angle (Degree)
//

## Returns

Calculated angle attenuation factor (0.0 to 1.0)

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

    // Spotlight attenuation formula (glTF 2.0 standard)

    let epsilon = max(EPSILON, cosInner - cosOuter);
    let factor = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);
    return factor * factor;
}
```
