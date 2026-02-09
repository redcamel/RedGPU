---
title: Built-in Effects
order: 4
---

# Built-in Effects

Built-in effects are high-performance post-processing effects managed automatically within the system for performance optimization and depth buffer utilization.

## 1. Features & Usage

Unlike general effects, you do not need to create an instance yourself or add it via `addEffect()`. You can control them instantly by simply changing the property values of the `PostEffectManager`.

- **Access Path**: `view.postEffectManager`
- **Activation Method**: Use Boolean properties such as `useSSAO` and `useSSR`.

## 2. SSAO (Screen Space Ambient Occlusion)

SSAO creates subtle shadows in corners or where objects overlap, maximizing three-dimensionality.

### Activation & Configuration
```javascript
// 1. Enable SSAO
view.postEffectManager.useSSAO = true;

// 2. Detailed settings (optional)
const ssao = view.postEffectManager.ssao;
ssao.radius = 0.5;      // Shadow radius
ssao.intensity = 1.0;   // Shadow intensity
ssao.useBlur = true;    // Whether to use blur to remove shadow noise
```

## 3. SSR (Screen Space Reflection)

SSR implements real-time reflections using information on the screen. It is effective for creating effects where the surrounding environment is reflected on floors or walls.

::: warning [Experimental Feature]
Currently, SSR is an experimental feature. Noise or visual artifacts may occur depending on the environment, so please apply it carefully after reviewing the results.
:::

### Activation & Configuration
```javascript
// 1. Enable SSR
view.postEffectManager.useSSR = true;

// 2. Detailed settings (optional)
const ssr = view.postEffectManager.ssr;
ssr.reflectionIntensity = 1.0; // Reflection intensity
ssr.maxDistance = 15.0;        // Maximum reflection tracking distance
ssr.maxSteps = 64;             // Reflection calculation precision (number of steps)
```

## Key Summary

- Built-in effects are fixed-stage effects activated by **property settings** alone.
- They are more performant than manual implementation because they share depth information within the system.
- They can be controlled individually via the `useSSAO` and `useSSR` properties.

## Next Learning Recommendation
- **[Text Field](../assets/text-field/index.md)**