---
title: General Effects
order: 2
---

# General Effects

**General Effects** are standard post-processing filters—such as blur, color adjustments, and lens effects—that can be
combined and chained in any order.

## 1. Usage

Instantiate an effect from the `RedGPU.PostEffect` namespace and register it via `view.postEffectManager.addEffect()`.
Effects are executed sequentially in the order they are added.

```javascript
const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
view.postEffectManager.addEffect(radialBlur);
```

---

## 2. Key Effect Examples

### 2.1 Radial Blur

Creates a sense of speed or focus radiating outward from a center point.

<ClientOnly>
<CodePen title="RedGPU PostEffect - RadialBlur" slugHash="posteffect-radialblur">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => { scene.addChild(result.resultMesh); }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
    radialBlur.blur = 0.1;
    view.postEffectManager.addEffect(radialBlur);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

### 2.2 Grayscale

Converts the rendered image to black and white.

<ClientOnly>
<CodePen title="RedGPU PostEffect - Grayscale" slugHash="posteffect-grayscale">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext, 
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
        (result) => { scene.addChild(result.resultMesh); }
    );

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    
    redGPUContext.addView(view);

    // Add grayscale effect
    const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
    view.postEffectManager.addEffect(grayscale);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
</CodePen>
</ClientOnly>

---

## 3. Supported Effects List

All general effects are located under the `RedGPU.PostEffect` namespace.

| Category             | Class Name             | Description                                                   |
|:---------------------|:-----------------------|:--------------------------------------------------------------|
| **Blur**             | `Blur`, `GaussianBlur` | Gaussian blur                                                 |
|                      | `BlurX`, `BlurY`       | Unidirectional (horizontal or vertical) blur                  |
|                      | `DirectionalBlur`      | Blur along a specified angle                                  |
|                      | `RadialBlur`           | Circular blur spreading outward from the center               |
|                      | `ZoomBlur`             | Zoom blur expanding outward from the center                   |
| **Adjustments**      | `BrightnessContrast`   | Brightness and contrast adjustment                            |
|                      | `HueSaturation`        | Hue and saturation adjustment                                 |
|                      | `ColorBalance`         | Color balance adjustment (midtones, shadows, highlights)      |
|                      | `ColorTemperatureTint` | Color temperature and tint adjustment                         |
|                      | `Vibrance`             | Vibrance adjustment targeting muted colors                    |
|                      | `Grayscale`            | Black-and-white conversion                                    |
|                      | `Invert`               | Color inversion                                               |
|                      | `Threshold`            | Threshold-based binarization                                  |
| **Lens**             | `OldBloom`             | Classic bloom / light bleeding effect                         |
|                      | `DOF`                  | Depth of Field (blurs out-of-focus regions)                   |
|                      | `Vignetting`           | Darkens the outer edges of the screen                         |
|                      | `ChromaticAberration`  | Simulates lens chromatic aberration                           |
|                      | `LensDistortion`       | Barrel/pincushion lens distortion                             |
| **Atmospheric**      | `Fog`                  | Distance-based fog effect                                     |
|                      | `HeightFog`            | Height-based fog effect                                       |
| **Visual / Utility** | `FilmGrain`            | Film grain noise effect                                       |
|                      | `Sharpen`              | Edge sharpening                                               |
|                      | `Convolution`          | Kernel-based convolution filter (Sharpen, Edge, Emboss, etc.) |

::: info [Live Demo]
All effects can be tested in real-time under the **PostEffect** tab on
the [RedGPU Official Examples Page](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect).
:::

---

## Next Steps

- **[Tone Mapping](./tone-mapping.md)**: HDR-to-LDR color conversion and exposure control
- **[Built-in Effects](./builtin-effects.md)**: Configuring `SSAO` and `SSR`
