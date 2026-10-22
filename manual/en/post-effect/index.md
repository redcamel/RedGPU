---
title: Post-Effect
order: 9
---

# Post-Effect

Post-effect is a technique for adding visual effects to the final 2D image after the 3D scene rendering is complete. RedGPU's post-processing system provides a dualized interface for **configuration convenience** and **execution efficiency**.

<script setup>
const postEffectGraph = `
    graph TB
        subgraph Control ["Control Interface (API)"]
            direction TB
            TMM["view.toneMappingManager"]:::controlNode
            PEM["view.postEffectManager"]:::controlNode
        end

        subgraph HDR ["1. HDR Phase (Scene Components)"]
            direction TB
            SA["SkyAtmosphere"]:::pipelineNode
            SSAO["SSAO (Built-in)"]:::pipelineNode
            SSR["SSR (Built-in)"]:::pipelineNode
            SA --> SSAO --> SSR
        end

        subgraph Transition ["2. Transition Phase (Exposure & User Effects)"]
            direction TB
            AE["AutoExposure"]:::pipelineNode
            GE["User General Effects (Loop)"]:::pipelineNode
            TM["Tone Mapping"]:::pipelineNode
            AE --> GE --> TM
        end

        AA["3. LDR Phase (FXAA / TAA)"]:::pipelineNode

    TMM -.->|Inject Settings| TM
    PEM -.->|Manage & Execute| Transition
    Control --> HDR
    HDR --> Transition
    Transition --> AA

    classDef controlNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    classDef pipelineNode fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px;
    
    style Control fill:#f4f4f5,stroke:#e4e4e7,stroke-width:1px,color:#27272a;
    style HDR fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
    style Transition fill:#e4e4e7,stroke:#d4d4d8,stroke-width:1px,color:#18181b;
`
</script>

## 1. System Structure: Control and Execution

Users control post-processing through two managers depending on their purpose, but the actual operations are executed sequentially within a single pipeline supervised by the `PostEffectManager`.

*   **ToneMappingManager** (`view.toneMappingManager`): A dedicated window responsible for **color transformation settings** such as the basic hue, exposure, and contrast of the scene.
*   **PostEffectManager** (`view.postEffectManager`): Responsible for adding or deleting general effects and the **overall execution** of the pipeline.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

## 2. Rendering Pipeline Flow

All effects are processed in the following order. This sequence is fixed for graphics optimization and consistency of visual results.

1. **HDR Phase (Scene Components)**: The stage for assembling physical scene components, including `SkyAtmosphere`,
   `SSAO` (Screen Space Ambient Occlusion), and `SSR` (Screen Space Reflections).
2. **Exposure & Transition (Exposure and Tone Mapping Transition)**:
    * `AutoExposure` calculation is performed.
    * The loop for **User General Effects** registered via `addEffect()` is executed.
    * During this loop, **Tone Mapping** is performed immediately when the first LDR (Low Dynamic Range) effect is
      encountered. If not triggered during the loop, it is executed at the end of the loop.
3. **LDR Phase (Antialiasing)**: The final correction stage for the final image, where `FXAA` or `TAA` (along with
   `TAACASPass`) is executed based on activation states.

### Automatic Exposure Control (`AutoExposure`)

`View3D` computes scene luminance histograms in a GPU compute shader every frame and adapts exposure smoothly via
`view.postEffectManager.autoExposure` (`RedGPU.PostEffect.AutoExposure`). Automatic exposure is enabled when
`camera.useAutoExposure = true` (default).

| Property                          | Default        | Description                                                                                              |
|:----------------------------------|:---------------|:---------------------------------------------------------------------------------------------------------|
| **`minExposure` / `maxExposure`** | `0.15` / `4.0` | Minimum and maximum automatic exposure clamp limits                                                      |
| **`speedUp` / `speedDown`**       | `3.0` / `1.0`  | Eye adaptation speed when transitioning from dark to bright (`speedUp`) and bright to dark (`speedDown`) |
| **`exposureBias`**                | `0.0`          | Manual exposure compensation bias in EV stops (`-5.0 ~ +5.0`)                                            |
| **`reset()`**                     | Method         | Resets exposure adaptation history immediately after camera cuts or scene transitions                    |

```javascript
const autoExposure = view.postEffectManager.autoExposure;
autoExposure.minExposure = 0.25;
autoExposure.maxExposure = 3.5;
autoExposure.exposureBias = 0.2;
```

::: tip [Live Demo]
Check out all effects in action in real-time on
the [RedGPU Official Examples Page](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect).
:::

## 3. Learning Guide

*   **[General Effects](./general-effects.md)**: Adding various effects such as bloom, blur, and grayscale.
*   **[Tone Mapping](./tone-mapping.md)**: Configuring basic scene color and exposure.
*   **[Built-in Effects](./builtin-effects.md)**: Activating high-performance effects like SSAO and SSR.
* **[Antialiasing](../antialiasing/index.md)**: Smoothing jagged edges.