---
title: Post-Effect Overview
order: 9
---

# Post-Effect

Post-effect is a technique for adding visual effects to the final 2D image after 3D scene rendering is complete. RedGPU's post-processing system provides a dualized interface for **convenience of configuration** and **efficiency of execution**.

<script setup>
const postEffectGraph = `
    subgraph Control ["Control Interface (API)"]
        direction LR
        TMM["view.toneMappingManager"]
        PEM["view.postEffectManager"]
    end

    subgraph Pipeline ["Execution Pipeline (GPU)"]
        direction TB
        TM["1. Tone Mapping"]
        CE["2. General Effects (Chained)"]
        SE["3. Screen Space Effects (Built-in)"]
        AA["4. Antialiasing"]
        
        TM --> CE --> SE --> AA
    end

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Pipeline
`
</script>

## 1. System Structure: Control and Execution

Users control post-processing through two managers depending on their purpose, but actual operations are executed sequentially within a single pipeline supervised by `PostEffectManager`.

*   **ToneMappingManager** (`view.toneMappingManager`): A dedicated window responsible for **color transformation settings** such as basic hue, exposure, and contrast of the scene.
*   **PostEffectManager** (`view.postEffectManager`): Responsible for adding/deleting general effects and the **overall execution** of the pipeline.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 2. Rendering Pipeline Flow

All effects are processed in the following order. This order is fixed for graphics optimization and consistency of visual results.

1.  **Tone Mapping**: The first gateway for converting HDR data to display range.
2.  **General Effects**: Effects added via `addEffect()` are executed sequentially like a chain.
3.  **Screen Space Effects**: High-performance built-in effects that utilize scene depth information, such as SSAO and SSR, are applied.
4.  **Antialiasing**: The final correction stage for removing jagged edges.

::: tip [Live Demo]
Check out all effects in action in real-time on the [RedGPU Official Examples Page](https://redcamel.github.io/RedGPU/examples/#postEffect).
:::

## 3. Learning Guide

*   **[General Effects](./general-effects.md)**: Adding various effects such as bloom, blur, and grayscale
*   **[Tone Mapping](./tone-mapping.md)**: Configuring basic scene color and exposure
*   **[Built-in Effects](./builtin-effects.md)**: Activating high-performance effects like SSAO and SSR
*   **[Text Field](../assets/text-field/index.md)**: Adding text UI to 3D space
