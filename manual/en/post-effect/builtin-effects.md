---
title: Built-in Effects
order: 2
---

# Built-in Effects

Built-in Effects are standard engine post-processing effects integrated into the 3D scene's G-Buffer (depth, normal,
motion vector) and physical rendering pipeline. Instead of manually instantiating effects and registering them via
`addEffect()`, you enable them directly through properties on `view.builtInEffectManager` and configure their built-in
instances.

---

## 1. Supported Effects Summary

| Category              | Stage | Toggle Property          | Instance              | Description                                            |
|:----------------------|:------|:-------------------------|:----------------------|:-------------------------------------------------------|
| **Screen Space**      | HDR   | `useSSAO`                | `ssao`                | GTAO-based screen-space ambient occlusion              |
|                       | HDR   | `useSSR`                 | `ssr`                 | Screen-space ray-marched reflections                   |
| **Atmospheric**       | HDR   | `useFog`                 | `fog`                 | 3D distance-based fog attenuation                      |
|                       | HDR   | `useHeightFog`           | `heightFog`           | Altitude-based atmospheric fog attenuation             |
| **Exposure & Optics** | HDR   | `camera.useAutoExposure` | `autoExposure`        | 256-bin histogram-based auto-exposure                  |
|                       | HDR   | `useDOF`                 | `dof`                 | 35mm physical lens Depth of Field                      |
|                       | HDR   | `useBloom`               | `bloom`               | 5-Mip Dual-Filter HDR bloom                            |
|                       | HDR   | `useLensFlare`           | `lensFlare`           | Screen highlights & analytic sun lens flare            |
| **Camera Lens**       | LDR   | `useChromaticAberration` | `chromaticAberration` | Edge chromatic aberration (`intensity`, `startOffset`) |
|                       | LDR   | `useLensDistortion`      | `lensDistortion`      | Barrel/pincushion distortion (`distortion`)            |
|                       | LDR   | `useVignetting`          | `vignetting`          | Peripheral darkening (`intensity`)                     |
|                       | LDR   | `useFilmGrain`           | `filmGrain`           | Resolution-independent film grain (`applyPreset`)      |

---

## 2. SSAO

`SSAO` generates natural contact and corner shadows based on depth and normal buffers, enhancing spatial depth where
surfaces meet or overlap.

```javascript
// 1. Enable SSAO
view.builtInEffectManager.useSSAO = true;

// 2. Fine-tune parameters
const ssao = view.builtInEffectManager.ssao;
ssao.radius = 0.5;      // Occlusion sampling radius (default: 0.5)
ssao.intensity = 1.0;   // Shadow intensity (default: 1.0)
ssao.contrast = 1.0;    // Shadow contrast (default: 1.0)
ssao.useBlur = true;    // Whether to apply bilateral denoiser for noise reduction (default: true)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/" style="width:100%; height:500px;"></iframe>

---

## 3. SSR

`SSR` performs ray marching across screen-space depth and normal buffers to render real-time reflections on floors,
metals, and glossy surfaces.

- **How to Apply**: Simply set `view.builtInEffectManager.useSSR = true`. Reflections are automatically driven by each
  material's `roughness` and `metallic` properties without any per-material SSR flag.

```javascript
// 1. Enable SSR post-processing on the view
view.builtInEffectManager.useSSR = true;

// 2. Fine-tune parameters
const ssr = view.builtInEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // Reflection intensity (default: 1.0)
ssr.maxDistance = 15.0;        // Maximum reflection tracking distance (default: 15.0)
ssr.maxSteps = 64;             // Ray marching step count (default: 64)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/" style="width:100%; height:500px;"></iframe>

---

## 4. Optics, Exposure, Fog & Lens Effects Usage

```javascript
const builtIn = view.builtInEffectManager;

// HDR optical effects and presets
builtIn.useDOF = true;
builtIn.dof.setCinematic();

builtIn.useBloom = true;
builtIn.bloom.setNatural();

builtIn.useLensFlare = true;
builtIn.lensFlare.setNatural();

// Auto-exposure compensation (active when camera.useAutoExposure is true)
builtIn.autoExposure.exposureCompensation = 0.5;

// LDR camera lens effects
builtIn.useChromaticAberration = true;
builtIn.chromaticAberration.intensity = 0.3;

builtIn.useVignetting = true;
builtIn.vignetting.intensity = 0.4;
```

---

## Related Examples

- [SSAO (Screen Space Ambient Occlusion)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
- [SSR (Screen Space Reflection)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/)
- [AutoExposure](/RedGPU/examples/postEffect/builtIn/lens/autoExposure/)
- [Depth of Field (DOF)](/RedGPU/examples/postEffect/builtIn/lens/dof/)
- [Bloom](/RedGPU/examples/postEffect/builtIn/lens/bloom/)
- [Lens Flare (SkyAtmosphere)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
- [Fog](/RedGPU/examples/postEffect/builtIn/fog/fog/)
- [Height Fog](/RedGPU/examples/postEffect/builtIn/fog/heightFog/)

---

## Next Steps

- **[Tone Mapping](./tone-mapping.md)**
