---
title: Built-in Effects
order: 4
---

# Built-in Effects

**Built-in Effects** are fixed-stage post-processing effects automatically managed within the engine by directly
referencing the G-Buffer and Depth Buffer. Unlike general effects, they are enabled directly via boolean properties
(`useSSAO`, `useSSR`) on `view.postEffectManager` without manual instantiation or `addEffect()`.

## 1. SSAO

**SSAO** (Screen Space Ambient Occlusion) generates subtle contact shadows in corners and overlapping geometry areas to
enhance depth perception.

```javascript
// 1. Enable SSAO
view.postEffectManager.useSSAO = true;

// 2. Detailed configuration
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;      // Occlusion sampling radius
ssao.intensity = 1.0;   // Shadow intensity
ssao.useBlur = true;    // Enable blur for noise reduction
```

---

## 2. SSR

**SSR** (Screen Space Reflection) computes real-time reflections on surfaces such as floors and walls using screen-space
color, depth, and normal data.

::: warning [Experimental Feature]
SSR is currently an experimental feature. Depending on the scene, noise or missing reflections for off-screen objects
may occur, so please verify visual results when applying it.
:::

```javascript
// 1. Enable SSR
view.postEffectManager.useSSR = true;

// 2. Detailed configuration
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // Reflection intensity
ssr.maxDistance = 15.0;        // Maximum ray tracking distance
ssr.maxSteps = 64;             // Ray marching step precision
```

---

## Next Steps

- **[LOD](../lod/index.md)**: Optimizing mesh detail based on camera distance
