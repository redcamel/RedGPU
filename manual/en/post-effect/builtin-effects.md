---
title: Built-in Effects
order: 4
---

# Built-in Effects

Built-in Effects are integrated screen-space lighting effects executed in the HDR stage prior to tone mapping, utilizing
the 3D scene's G-Buffer (depth and normal buffers). Instead of manually instantiating effects and registering them via
`addEffect()`, you can enable them directly using boolean properties (`useSSAO`, `useSSR`) on `view.postEffectManager`
and fine-tune parameters through the built-in instances (`ssao`, `ssr`).

---

## 1. SSAO (Screen Space Ambient Occlusion)

`SSAO` generates natural contact and corner shadows based on depth and normal buffers, enhancing spatial depth where
surfaces meet or overlap.

```javascript
// 1. Enable SSAO
view.postEffectManager.useSSAO = true;

// 2. Fine-tune parameters
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.25;     // Occlusion sampling radius (default: 0.25)
ssao.intensity = 1.0;   // Shadow intensity (default: 1.0)
ssao.contrast = 1.5;    // Shadow contrast (default: 1.5)
ssao.useBlur = true;    // Whether to apply Gaussian blur for noise reduction (default: true)
```

<iframe src="/RedGPU/examples/postEffect/ssao/" style="width:100%; height:500px;"></iframe>

---

## 2. SSR (Screen Space Reflection)

`SSR` performs ray marching across screen-space depth and normal buffers to render real-time reflections on floors,
metals, and glossy surfaces.

- **How to Apply**: Set `view.postEffectManager.useSSR = true`, and also set `material.useSSR = true` on the materials
  (`PhongMaterial`, `PBRMaterial`, etc.) of the objects that should receive reflections.

```javascript
// 1. Enable SSR post-processing on the view
view.postEffectManager.useSSR = true;

// 2. Enable useSSR on the target material
material.useSSR = true;

// 3. Fine-tune parameters
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // Reflection intensity (default: 1.0)
ssr.maxDistance = 15.0;        // Maximum reflection tracking distance (default: 15.0)
ssr.maxSteps = 64;             // Ray marching step count (default: 64)
```

<iframe src="/RedGPU/examples/postEffect/ssr/" style="width:100%; height:500px;"></iframe>

---

## Related Examples

- [SSAO (Screen Space Ambient Occlusion)](/RedGPU/examples/postEffect/ssao/)
- [SSR (Screen Space Reflection)](/RedGPU/examples/postEffect/ssr/)

---

## Next Steps

- **[Antialiasing](../antialiasing/index.md)**
