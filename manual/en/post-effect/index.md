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
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (useSSAO)"]:::pipelineNode
            SSR["SSR (useSSR)"]:::pipelineNode
            TAA["TAA (Temporal Accumulation)"]:::pipelineNode
            AE["AutoExposure"]:::pipelineNode
            SA --> SSAO --> SSR --> TAA --> AE
        end

        subgraph Transition ["2. User Effects & Tone Mapping Phase"]
            direction TB
            HDR_EFF["HDR User Effects (OldBloom, etc.)"]:::pipelineNode
            TM["ToneMappingManager (HDR → LDR)"]:::pipelineNode
            LDR_EFF["LDR User Effects (Blur, DoF, etc.)"]:::pipelineNode
            HDR_EFF --> TM --> LDR_EFF
        end

        subgraph Final ["3. LDR Finalization Phase"]
            direction TB
            AA["FXAA / TAA CAS Sharpen"]:::pipelineNode
        end

        HDR --> Transition --> Final

    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Final fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
`
</script>

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 1. Control Interface

`View3D` provides two manager properties depending on the post-processing purpose, while actual pipeline execution and
texture pooling (`PostEffectTexturePool`) are centrally managed by `PostEffectManager`.

- **`view.postEffectManager` (`PostEffectManager`)**: Manages built-in effects (`useSSAO`, `useSSR`) and user effect
  chains (`addEffect`, `removeEffect`), and executes the entire post-processing pipeline.
- **`view.toneMappingManager` (`ToneMappingManager`)**: Controls the tone mapping algorithm (`mode`), `contrast`, and
  `brightness` that map HDR data into the display output range (LDR).

---

## 2. Rendering Pipeline Execution Order

`PostEffectManager` executes post-processing in the following 3 phases to preserve physical accuracy and image quality:

1. **HDR Built-in & Temporal Phase**
    - Sequentially composites `SkyAtmosphere`, `SSAO`, and `SSR` using the scene's HDR color and G-Buffer (depth,
      normal, motion vector).
    - When `TAA` is enabled, it performs motion-vector-based temporal accumulation in HDR space prior to tone mapping,
      followed by camera `AutoExposure` luminance calculation.
2. **User Effects & Smart Tone Mapping Transition Phase**
    - Iterates through the effect list registered via `view.postEffectManager.addEffect()`.
    - HDR-based effects (`isLdr: false`, such as `OldBloom`) run first in HDR space. **As soon as the first LDR effect (
      `isLdr: true`) is encountered, `ToneMappingManager` is executed immediately** to transition into LDR color space
      (if no LDR effects are present, tone mapping runs right after the loop).
3. **LDR Finalization Phase**
    - Composites the reference grid (`view.grid`) using the depth buffer when enabled.
    - Completes the final image through `FXAA` or `TAA`'s Contrast Adaptive Sharpening (`CAS Sharpen`) pass depending on
      the anti-aliasing configuration.

---

## 3. Core Components

1. **[General Effects](./general-effects.md)**: Build filter chains such as bloom, depth of field (DoF), blur, fog, and
   color adjustments via `addEffect()`.
2. **[Tone Mapping](./tone-mapping.md)**: Map HDR scene colors and exposure into the LDR display range via
   `ToneMappingManager`.
3. **[Built-in Effects](./builtin-effects.md)**: Activate G-Buffer-integrated `SSAO` and `SSR` effects.

---

## Related Examples

- [SSAO (Screen Space Ambient Occlusion)](/RedGPU/examples/postEffect/ssao/)
- [SSR (Screen Space Reflection)](/RedGPU/examples/postEffect/ssr/)
- [Depth of Field (DoF)](/RedGPU/examples/postEffect/lens/dof/)
- [Bloom (OldBloom)](/RedGPU/examples/postEffect/oldBloom/)

---

[Next Step: Learn General Effects](./general-effects.md)
