[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [lighting](../README.md) / getLightDistanceAttenuation

# Variable: getLightDistanceAttenuation

> `const` **getLightDistanceAttenuation**: `string` = `getLightDistanceAttenuation_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2081](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L2081)

Calculates the light attenuation factor according to the physical Inverse Square Law.

This function follows the pure physical inverse square law (1/d^2) and uses a distance-based windowing function to smoothly converge to 0 at the light's radius.
Note: The 4*PI dispersion factor should be applied externally (during Lumen unit conversion) for energy conservation.

//

## Param

**distance**

Distance from the light source
//

## Param

**radius**

Maximum reach radius of the light source (windowing reference)
//

## Returns

Calculated physical attenuation factor

```wgsl
#redgpu_include math.EPSILON

fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
    let d2 = distance * distance;

    // Smooth distance-based attenuation windowing function
    let factor = distance / radius;
    let factor2 = factor * factor;
    let factor4 = factor2 * factor2;
    let windowing = clamp(1.0 - factor4, 0.0, 1.0);

    // Apply pure inverse square law (1 / d^2) + windowing
    return (windowing * windowing) / max(d2, 0.0001);
}
```
