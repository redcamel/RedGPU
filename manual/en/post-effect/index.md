---
title: Post-Effect Overview
order: 9
---

# Post-Effect

The Post-Effect system applies screen-space lighting, color grading, lens effects, and anti-aliasing to the final output
image via a compute-shader pipeline after the 3D scene's G-Buffer rendering is complete.

<script setup>
const postEffectGraph = `
    graph TB
        subgraph HDR ["1. HDR Built-in & Temporal Phase"]
            direction TB
            SA["SkyAtmosphere / SSAO / SSR / Fog / HeightFog"]:::pipelineNode
            TAA["TAA / AutoExposure"]:::pipelineNode
            OPT["DOF / Bloom / LensFlare"]:::pipelineNode
            SA --> TAA --> OPT
        end

        subgraph LDR ["2. Tone Mapping & LDR Post-Processing Phase"]
            direction TB
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            BLDR["Built-in LDR (ChromaticAberration / LensDistortion / Vignetting / FilmGrain)"]:::pipelineNode
            ULDR["PostEffectManager (Custom LDR Chain)"]:::pipelineNode
            TM --> BLDR --> ULDR
        end

        subgraph Final ["3. Debugger Isolation & Final Output Phase"]
            direction TB
            DBG["DebuggerRenderer (Overlay Pass)"]:::pipelineNode
            AA["FinalRender (Fused FXAA / TAA CAS)"]:::pipelineNode
            DBG --> AA
        end

        HDR --> LDR --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style LDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`
</script>

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 1. Control Interface

`View3D` provides three manager properties depending on the post-processing purpose, while actual pipeline execution and
texture pooling (`PostEffectTexturePool`) are centrally managed by `PostEffectManager`.

- **`view.builtInEffectManager`**: Controls the 12 built-in system effects (`SSAO`, `SSR`, `Fog`, `HeightFog`,
  `AutoExposure`, `DOF`, `Bloom`, `LensFlare`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`) and
  their parameters.
- **`view.postEffectManager`**: Manages custom user LDR effect chains (`addEffect`, `removeEffect`) and executes the
  entire post-processing pipeline.
- **`view.toneMappingManager`**: Controls the tone mapping algorithm (`mode`), `contrast`, and `brightness` that map HDR
  data into the display output range (LDR).

---

## 2. Rendering Pipeline Execution Order

`PostEffectManager` executes post-processing in the following 3 phases to preserve physical accuracy and image quality:

1. **HDR Built-in & Temporal Phase**
    - Sequentially executes `SkyAtmosphere`, `SSAO`, `SSR`, `Fog`, and `HeightFog` using the scene's HDR color and
      G-Buffer (depth, normal, motion vector).
    - When `TAA` is enabled, temporal accumulation is performed in HDR space prior to tone mapping, followed by
      `AutoExposure`, `DOF`, `Bloom`, and `LensFlare`.
2. **Tone Mapping & LDR Post-Processing Phase**
    - `ToneMappingManager` converts the HDR result into `rgba8unorm` LDR color space.
    - Built-in LDR effects (`ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`) run first, followed by
      the custom LDR effect chain registered via `view.postEffectManager.addEffect()`.
3. **Debugger Isolation & Final Output Phase**
    - `DebuggerRenderer` renders grids and debug gizmos in an isolated overlay pass after all post-processing to avoid
      interfering with `AutoExposure` or `DOF`.
    - Completes the final swap-chain image through `FXAA` or `TAA CAS` sharpening integrated into `FinalRender`.

---

## 3. Core Components

1. **[Built-in Effects](./builtin-effects.md)**: Control the 12 standard built-in effects such as `SSAO`, `SSR`, `Fog`,
   `AutoExposure`, `DOF`, `Bloom`, and `LensFlare` via `BuiltInEffectManager`.
2. **[Tone Mapping](./tone-mapping.md)**: Map HDR scene colors and exposure into the LDR display range via
   `ToneMappingManager`.
3. **[General Effects](./general-effects.md)**: Build custom LDR filter chains such as blur, color adjustments, sharpen,
   and convolution via `addEffect()`.

---

## Related Examples

- [SSAO (Screen Space Ambient Occlusion)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
- [SSR (Screen Space Reflection)](/RedGPU/examples/postEffect/builtIn/screenSpace/ssr/)
- [Depth of Field (DoF)](/RedGPU/examples/postEffect/builtIn/lens/dof/)
- [Bloom](/RedGPU/examples/postEffect/builtIn/lens/bloom/)
- [Lens Flare (SkyAtmosphere)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyAtmosphere/)
- [Lens Flare (SkyBox)](/RedGPU/examples/postEffect/builtIn/lens/lensFlareSkyBox/)

---

[Next Step: Learn Built-in Effects](./builtin-effects.md)
