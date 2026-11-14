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

## 4. AutoExposure

`AutoExposure` analyzes a 256-bin log-luminance histogram in real time via compute shaders to simulate human eye
adaptation when transitioning between bright outdoor and dark indoor environments.

- **Activation Condition**: Active when `camera.useAutoExposure = true` (default: `true`).
- **Key Properties**: `exposureCompensation` (EV bias), `minEV100` / `maxEV100` (exposure clamp bounds),
  `adaptationSpeedUp` / `adaptationSpeedDown` (bright/dark adaptation speeds), `meteringMode`
  (`METERING_MODE.CENTER_WEIGHTED` / `METERING_MODE.AVERAGE`).

```javascript
// 1. Ensure camera auto-exposure is enabled
view.camera.useAutoExposure = true;

// 2. Fine-tune exposure parameters
const autoExposure = view.builtInEffectManager.autoExposure;
autoExposure.exposureCompensation = 0.5; // Exposure compensation bias (default: 0.0)
autoExposure.minEV100 = -2.0;            // Minimum EV100 bound (default: -2.0)
autoExposure.maxEV100 = 16.0;            // Maximum EV100 bound (default: 16.0)
autoExposure.adaptationSpeedUp = 3.0;    // Adaptation speed when brightening (default: 3.0)
autoExposure.adaptationSpeedDown = 1.0;  // Adaptation speed when darkening (default: 1.0)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/autoExposure/" style="width:100%; height:500px;"></iframe>

---

## 5. DOF

`DOF` is a physical Depth of Field effect based on a 35mm full-frame sensor (`24mm`) geometric Thin-Lens formula. It
supports separated foreground/background Dual-Buffer gathering, 9-Point Zone continuous autofocus (`useAutoFocus`), and
7 built-in camera lens presets.

- **Built-in Presets**: `setCinematic()` (`85mm f/1.4`), `setGameDefault()` (`65mm f/2.0`), `setPortrait()`
  (`85mm f/1.4`), `setLandscape()` (`24mm f/8.0`), `setMacro()` (`105mm f/2.0`), `setSports()` (`135mm f/2.8`),
  `setNightMode()` (`75mm f/1.2`).

```javascript
// 1. Enable DOF and apply a lens preset
view.builtInEffectManager.useDOF = true;
const dof = view.builtInEffectManager.dof;
dof.setCinematic();

// 2. Configure manual/auto focus and optical parameters
dof.useAutoFocus = true;     // Enable GPU 9-Point Zone continuous autofocus
dof.focusDistance = 10.0;    // Manual focus distance (m, active when useAutoFocus is false)
dof.focalLength = 85.0;      // Lens focal length (mm)
dof.aperture = 1.4;          // Aperture F-Stop (smaller values produce shallower depth of field)
dof.bladeCount = 8;          // Aperture blade count (0: circular bokeh, 5~9: polygonal bokeh)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/dof/" style="width:100%; height:500px;"></iframe>

---

## 6. Bloom

`Bloom` implements physical light scattering around intense light sources and metallic specular highlights using a
5-stage mip-chain pyramid (13-Tap Dual-Grid downsample + 9-Tap Tent upsample) and a Soft-Knee HDR threshold curve.

- **Built-in Presets**: `setNatural()` (default), `setCinematic()`, `setNeonGlow()`, `setDreamy()`, `setSubtle()`.

```javascript
// 1. Enable Bloom and apply a preset
view.builtInEffectManager.useBloom = true;
const bloom = view.builtInEffectManager.bloom;
bloom.setNatural();

// 2. Fine-tune parameters
bloom.threshold = 1.0;       // Linear HDR luminance threshold (default: 1.0)
bloom.softKnee = 0.5;        // Threshold transition knee ratio (default: 0.5)
bloom.intensity = 0.675;     // Bloom composition intensity (default: 0.675)
bloom.radius = 0.65;         // Multi-mip scatter radius ratio (default: 0.65)
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/bloom/" style="width:100%; height:500px;"></iframe>

---

## 7. LensFlare

`LensFlare` is a hybrid optical effect combining screen-space HDR highlights (multi-coated ghosts, Fresnel halo, radial
chromatic aberration) with 9-Tap depth-occluded analytic sun flare driven by the primary light source
(`DirectionalLight` / `SkyAtmosphere`), including diffraction starbursts, anamorphic streaks, and lens dirt scattering.

- **Built-in Presets**: `setCinematic()` (default), `setNatural()`, `setAnamorphic()`, `setSolarMax()`, `setSubtle()`.

```javascript
// 1. Enable LensFlare and apply a preset
view.builtInEffectManager.useLensFlare = true;
const lensFlare = view.builtInEffectManager.lensFlare;
lensFlare.setCinematic();

// 2. Fine-tune optical elements
lensFlare.intensity = 1.1;           // Overall flare composition intensity
lensFlare.ghostCount = 8;            // Multi-reflection ghost count (0 ~ 12)
lensFlare.starburstIntensity = 1.0;  // Solar diffraction starburst intensity
lensFlare.anamorphicIntensity = 0.0; // Horizontal anamorphic streak intensity
```

<iframe src="/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/" style="width:100%; height:500px;"></iframe>

---

## 8. Atmospheric & Camera Lens Effects Usage

```javascript
const builtIn = view.builtInEffectManager;

// HDR atmospheric fog effect
builtIn.useFog = true;
builtIn.fog.nearDistance = 10;
builtIn.fog.farDistance = 100;

// LDR camera lens effects
builtIn.useChromaticAberration = true;
builtIn.chromaticAberration.intensity = 0.3;

builtIn.useVignetting = true;
builtIn.vignetting.intensity = 0.4;

builtIn.useFilmGrain = true;
builtIn.filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FILM_GRAIN_PRESET.CINEMA);
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
