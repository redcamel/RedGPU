---
title: Post-Effect
order: 9
---

# Post-Effect

**Post-Effect** is a post-processing system that applies visual effects to the final 2D image after 3D scene rendering
is complete. It consists of `ToneMappingManager` for color transformation and `PostEffectManager` for pipeline execution
and effect control.

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

        AA["3. LDR Phase (FXAA / TAA & TAACASPass)"]:::pipelineNode

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

## 1. System Structure

Users configure post-processing through two managers depending on their purpose, while actual operations execute
sequentially within a single pipeline supervised by `PostEffectManager`.

- **`ToneMappingManager`**: Controls color transformation settings such as base hue,
  exposure, and contrast via `view.toneMappingManager`.
- **`PostEffectManager`**: Manages automatic exposure (`autoExposure`), built-in effects (`ssao`, `ssr`), general effect
  registration, and overall pipeline execution via `view.postEffectManager`.

<ClientOnly>
  <MermaidResponsive :definition="postEffectGraph" />
</ClientOnly>

---

## 2. Rendering Pipeline Flow

Post-processing effects are processed in a fixed sequence for graphics optimization and visual consistency.

1. **HDR Phase**: Assembles scene components requiring depth information and HDR color gamut, such as `SkyAtmosphere`,
   `SSAO`, and `SSR`.
2. **Transition Phase**:
   - When `camera.useAutoExposure` is enabled, the `AutoExposure` compute pass calculates optimal exposure.
   - Executes the loop for general effects registered via `addEffect()`.
   - Performs tone mapping immediately upon encountering the first LDR (Low Dynamic Range) effect in the loop, or at the
     end of the loop if no LDR effect is present.
3. **LDR Phase**: Executes `FXAA` or `TAA` (including `TAACASPass` sharpening) based on activation state to refine the
   final image.

### Automatic Exposure Control

When `camera.useAutoExposure = true` (default), `View3D` computes scene luminance histograms in a GPU compute shader
every frame and adapts exposure smoothly via `view.postEffectManager.autoExposure`.

| Property / Method                 | Default        | Description                                                                                              |
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
Check out all effects in real-time on
the [RedGPU Official Examples Page](https://redcamel.github.io/RedGPU/examples/index.html?tab=PostEffect).
:::

---

## Related Examples

- [SSAO (Screen Space Ambient Occlusion)](/RedGPU/examples/postEffect/ssao/)
- [SSR (Screen Space Reflection)](/RedGPU/examples/postEffect/ssr/)
- [Depth of Field (DoF)](/RedGPU/examples/postEffect/lens/dof/)
- [Bloom](/RedGPU/examples/postEffect/oldBloom/)

---

## Next Steps

- **[General Effects](./general-effects.md)**: Building post-effect chains such as bloom, blur, and grayscale
- **[Tone Mapping](./tone-mapping.md)**: Configuring base scene color and contrast
- **[Built-in Effects](./builtin-effects.md)**: Activating and tuning `SSAO` and `SSR`
- **[Antialiasing](../antialiasing/index.md)**: Smoothing jagged screen edges
