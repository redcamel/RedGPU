---
title: General Effects
order: 2
---

# General Effects

Manages standard post-processing effects provided under the `RedGPU.PostEffect` namespace, such as Gaussian blur, color
adjustments, depth of field (DoF), and fog.

## 1. Usage

Create an effect instance and register it via `view.postEffectManager.addEffect()`. When multiple effects are added, a
pipeline chain is formed in the order of registration.

```javascript
// 1. Create and add an effect
const gaussianBlur = new RedGPU.PostEffect.GaussianBlur(redGPUContext);
view.postEffectManager.addEffect(gaussianBlur);

// 2. Remove a specific effect or clear all effects
view.postEffectManager.removeEffect(gaussianBlur);
view.postEffectManager.removeAllEffect();
```

## 2. Key Effect Examples

### 2.1 Gaussian Blur (`GaussianBlur`)

The most common blur effect that smoothly softens the screen image.

<iframe src="/RedGPU/examples/postEffect/blur/gaussianBlur/" style="width:100%; height:500px;"></iframe>

### 2.2 Grayscale (`Grayscale`)

Removes color saturation from the screen to convert it into a black-and-white image.

<iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/" style="width:100%; height:500px;"></iframe>

## 3. Full Support List

All general effects are located under the `RedGPU.PostEffect` namespace.

| Category             | Class Name             | Description                                                |
|:---------------------|:-----------------------|:-----------------------------------------------------------|
| **Blur**             | `Blur`, `GaussianBlur` | Gaussian blur (the most common blur effect)                |
|                      | `BlurX`, `BlurY`       | Unidirectional (horizontal or vertical) blur               |
|                      | `DirectionalBlur`      | Blur effect in a specified angle direction                 |
|                      | `RadialBlur`           | Blur effect spreading outward from the center in a circle  |
|                      | `ZoomBlur`             | Blur effect expanding outward from the center              |
| **Adjustments**      | `BrightnessContrast`   | Brightness and contrast adjustment                         |
|                      | `HueSaturation`        | Hue and saturation adjustment                              |
|                      | `ColorBalance`         | Color balance adjustment (midtones, shadows, highlights)   |
|                      | `ColorTemperatureTint` | Color temperature and tint adjustment                      |
|                      | `Vibrance`             | Vibrance adjustment (affects mainly unsaturated parts)     |
|                      | `Grayscale`            | Converts the image to black and white                      |
|                      | `Invert`               | Color inversion                                            |
|                      | `Threshold`            | Binarization based on a threshold                          |
| **Lens**             | `Bloom`                | Physically-based HDR light bleeding effect (`useBloom`)    |
|                      | `DOF`                  | Depth of Field (blurs areas out of focus, `useDOF`)        |
|                      | `Vignetting`           | Darkens the outer edges of the screen                      |
|                      | `ChromaticAberration`  | Recreates lens chromatic aberration                        |
|                      | `LensDistortion`       | Lens distortion effect                                     |
| **Atmospheric**      | `Fog`                  | Distance-based fog effect                                  |
|                      | `HeightFog`            | Height-based fog effect                                    |
| **Visual / Utility** | `FilmGrain`            | Film noise (grain) effect                                  |
|                      | `Sharpen`              | Sharpening                                                 |
|                      | `Convolution`          | Kernel-based filter (supports Sharpen, Edge, Emboss, etc.) |

---

## Related Examples

- [Brightness & Contrast](/RedGPU/examples/postEffect/adjustments/brightnessContrast/)
- [Gaussian Blur](/RedGPU/examples/postEffect/blur/gaussianBlur/)
- [Depth of Field (DoF)](/RedGPU/examples/postEffect/lens/dof/)
- [Chromatic Aberration](/RedGPU/examples/postEffect/lens/chromaticAberration/)
- [Height Fog](/RedGPU/examples/postEffect/fog/heightFog/)

---

## Next Steps

- **[Tone Mapping](./tone-mapping.md)**
- **[Built-in Effects](./builtin-effects.md)**
