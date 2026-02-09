---
title: General Effects
order: 2
---

# General Effects

RedGPU provides various standard effects, such as radial blur and grayscale, managed through the `PostEffectManager`.

::: tip [Learning Guide]
Technically, tone mapping is executed at the very first stage of the overall post-processing, but in this chapter, we first cover **General Effects** where visual changes can be experienced most intuitively.
:::

## 1. Usage (addEffect)

After creating an effect object, register it through `view.postEffectManager.addEffect()`. A pipeline chain is formed in the order of registration.

```javascript
const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
view.postEffectManager.addEffect(radialBlur);
```

## 2. Key Effect Examples

### 2.1 Radial Blur
Creates a sense of speed or concentration effects that radiate outward from a center point.

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
Converts the image to black and white to create a classic atmosphere.

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

## 3. Full Support List

Here is the complete list of all general effects provided by RedGPU. All effects are located under the `RedGPU.PostEffect` namespace.

| Category | Class Name | Description |
| :--- | :--- | :--- |
| **Blur** | `Blur`, `GaussianBlur` | Gaussian blur (the most common blur effect) |
| | `BlurX`, `BlurY` | Unidirectional (horizontal or vertical) blur |
| | `DirectionalBlur` | Blur effect in a specified angle direction |
| | `RadialBlur` | Blur effect spreading outward from the center in a circle |
| | `ZoomBlur` | Blur effect expanding outward from the center |
| **Adjustments** | `BrightnessContrast` | Brightness and contrast adjustment |
| | `HueSaturation` | Hue and saturation adjustment |
| | `ColorBalance` | Color balance adjustment (midtones, shadows, highlights) |
| | `ColorTemperatureTint` | Color temperature and tint adjustment |
| | `Vibrance` | Vibrance adjustment (affects mainly unsaturated parts) |
| | `Grayscale` | Converts the image to black and white |
| | `Invert` | Color inversion |
| | `Threshold` | Binarization based on a threshold |
| **Lens** | `OldBloom` | Classic light bleeding effect |
| | `DOF` | Depth of Field (blurs areas out of focus) |
| | `Vignetting` | Darkens the outer edges of the screen |
| | `ChromaticAberration` | Recreates lens chromatic aberration |
| | `LensDistortion` | Lens distortion effect |
| **Atmospheric** | `Fog` | Distance-based fog effect |
| | `HeightFog` | Height-based fog effect |
| **Visual / Utility** | `FilmGrain` | Film noise (grain) effect |
| | `Sharpen` | Sharpening |
| | `Convolution` | Kernel-based filter (supports Sharpen, Edge, Emboss, etc.) |

::: info [Check Live]
All the effects listed above can be checked in real-time demos in the **PostEffect** category of the [RedGPU Official Examples Page](https://redcamel.github.io/RedGPU/examples/#postEffect).
:::

## Key Summary
- You can layer effects in any order using `addEffect()`.
- All effect objects require a `redGPUContext` upon creation.
- Actual rendering is performed immediately after the tone mapping stage.

## Next Learning Recommendations
- **[Tone Mapping](./tone-mapping.md)**
- **[Built-in Effects](./builtin-effects.md)**