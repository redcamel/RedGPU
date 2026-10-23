---
title: Antialiasing
order: 11
---

# Antialiasing

**Antialiasing** is a technique that smooths jagged pixel edges (aliasing) produced during 3D rendering. RedGPU supports
temporal accumulation (`TAA`), hardware multisampling (`MSAA`), and post-processing filtering (`FXAA`), centrally
controlled via `redGPUContext.antialiasingManager`.

## 1. Exclusive Operation and Auto-Selection

Antialiasing techniques operate exclusively: only one technique can be active at a time, and enabling one automatically
disables the others. Upon initialization, the default technique is selected automatically based on the display's
`devicePixelRatio`.

- **High-DPI Display** (`devicePixelRatio > 1.0`): **TAA** enabled by default
- **Standard Display** (`devicePixelRatio <= 1.0`): **MSAA** enabled by default

```javascript
const manager = redGPUContext.antialiasingManager;
console.log(`TAA: ${manager.useTAA}, MSAA: ${manager.useMSAA}, FXAA: ${manager.useFXAA}`);
```

---

## 2. Technique Comparison

Select the appropriate technique according to your quality and performance targets.

| Technique             | Method                 | Quality & Characteristics                                                                                                                              | Cost      | Recommended Environment                            |
|:----------------------|:-----------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|:----------|:---------------------------------------------------|
| **[TAA](./taa.md)**   | Temporal Accumulation  | **Best** — Uses motion vectors to suppress ghosting and resolves both geometry edges and shader/texture aliasing (optimal on `devicePixelRatio > 1.0`) | Medium    | High-quality desktop and high-DPI web environments |
| **[MSAA](./msaa.md)** | Hardware Sampling      | **Excellent** — Multi-samples the G-Buffer for crisp geometry outlines (does not resolve interior shader aliasing)                                     | Very High | Simple scenes where geometric edges are critical   |
| **[FXAA](./fxaa.md)** | Post-Processing Filter | **Moderate** — Smooths full-screen edges quickly without extra buffers (may slightly soften fine texture details)                                      | Very Low  | Mobile and low-end devices                         |

---

## Related Examples

- [Hello World 3D (Default Antialiasing)](/RedGPU/examples/3d/helloWorld/)
- [DamagedHelmet PBR](/RedGPU/examples/gltf/models/helmets/)

---

## Next Steps

- **[TAA](./taa.md)**: Temporal antialiasing and sharpening configuration
- **[MSAA](./msaa.md)**: Hardware multisample antialiasing configuration
- **[FXAA](./fxaa.md)**: Fast approximate post-processing antialiasing configuration
- **[Plugin System](../plugins/index.md)**: Using external extension modules
