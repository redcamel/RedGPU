---
title: Built-in Effects
order: 4
---

# Built-in Effects

Built-in effects are high-performance post-processing effects automatically managed within the system for performance optimization and utilizing depth buffers.

## 1. Features & Usage

Unlike general effects, you do not create an instance yourself or add it via `addEffect()`. You can control them immediately just by changing the property values of `PostEffectManager`.

- **Access Path**: `view.postEffectManager`
- **Activation Method**: Use Boolean properties such as `useSSAO` and `useSSR`

## 2. SSAO (Screen Space Ambient Occlusion)

Creates fine shadows in corners or overlapping areas between objects to maximize three-dimensionality.

### Activation & Configuration
```javascript
// 1. Enable SSAO
view.postEffectManager.useSSAO = true;

// 2. Detailed settings (if needed)
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;      // Shadow radius
ssao.intensity = 1.0;   // Shadow intensity
ssao.useBlur = true;    // Whether to use blur to remove shadow noise
```

## 3. SSR (Screen Space Reflection)

Implements real-time reflection using information on the screen. Effective when creating effects where the surrounding environment is reflected on floors or walls.

::: warning [Experimental Feature]
Currently, SSR is an experimental stage feature. Noise or visual limitations may occur depending on the usage environment, so please apply it carefully after checking the results.
:::

### Activation & Configuration
```javascript
// 1. Enable SSR
view.postEffectManager.useSSR = true;

// 2. Detailed settings (if needed)
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // Reflection intensity
ssr.maxDistance = 15.0;        // Maximum reflection tracking distance
ssr.maxSteps = 64;             // Reflection calculation precision (number of steps)
```

## Key Summary

- Built-in effects are fixed-stage effects activated by **property settings** alone.
- They are more advantageous in terms of performance than manual implementation as they share depth information within the system.
- Can be controlled individually through the `useSSAO` and `useSSR` properties.

## Next Learning Recommendation
- **[Text Field](../assets/text-field/index.md)**
