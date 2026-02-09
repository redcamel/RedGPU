---
title: Antialiasing
order: 10
---

# Antialiasing

**Antialiasing** is a technique used to smooth out jagged edges (Aliasing) that occur during 3D rendering. RedGPU provides various techniques ranging from hardware-based **MSAA** to post-processing based **FXAA** and **TAA**.

All settings are centrally controlled through the `antialiasingManager` built into `RedGPUContext`.

## 1. Default Behavior & Activation Rules

RedGPU's antialiasing system operates **exclusively**. This means only one technique can be active at a time, and enabling a new technique automatically disables the existing one.

### Auto-Selection at Initialization
Upon initialization, the optimal technique is automatically selected based on the `devicePixelRatio` of the execution environment.

- **High-DPI Display** (`devicePixelRatio > 1.0`): **TAA** is enabled by default.
- **Standard Display**: **MSAA** is enabled by default.

```javascript
// Check current settings
const manager = redGPUContext.antialiasingManager;
console.log(`TAA: ${manager.useTAA}, MSAA: ${manager.useMSAA}, FXAA: ${manager.useFXAA}`);
```

## 2. Features & Recommendations

Choose the appropriate technique based on your rendering quality and performance goals.

| Technique | Method | Quality Traits | Cost | Recommended For |
| :--- | :--- | :--- | :--- | :--- |
| **[TAA](./taa.md)** | Temporal Accumulation | **Best** (Full Image) | **Medium** | Most high-quality Desktop/Web projects |
| **[MSAA](./msaa.md)** | Hardware Sampling | **Excellent** (Edges Only) | **Very High** | Simple scenes where edge geometry is critical |
| **[FXAA](./fxaa.md)** | Post-processing | **Good** (Full Image) | **Very Low** | Mobile, low-end devices, performance priority |

### Detailed Comparison

- **TAA**: The modern standard. Uses motion vectors to minimize ghosting on moving objects and resolves shader aliasing. **Especially effective on high-DPI displays** (`devicePixelRatio > 1.0`), where the slight softening of the image is virtually imperceptible.
- **MSAA**: Consumes significant memory bandwidth due to G-Buffer multi-sampling. Provides the sharpest edge quality.
- **FXAA**: Smoothes the entire image cost-effectively but may slightly blur texture details.

## Learning Guide

We recommend learning in order of quality.

1. **[TAA (Temporal AA)](./taa.md)**: Choice for best quality
2. **[MSAA (Multisample AA)](./msaa.md)**: Choice for stability and standard quality
3. **[FXAA (Fast Approximate AA)](./fxaa.md)**: Choice for best performance

---

[Next Step: Learn Plugin System](../plugins/index.md)
