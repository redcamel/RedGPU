---
title: Tone Mapping
order: 3
---

# Tone Mapping

**Tone Mapping** is a post-processing technique that maps the wide brightness range of HDR (High Dynamic Range) images
into the displayable range of standard LDR devices while coordinating scene exposure, contrast, and color balance.

## 1. Smart Transition Timing

Instead of executing at a fixed pipeline position, `PostEffectManager` automatically triggers tone mapping at the
optimal point to preserve HDR calculations before transitioning to LDR post-processing.

- **HDR Retention**: Effects requiring depth information and wide color gamut (`SkyAtmosphere`, `SSAO`, `SSR`) are
  calculated on raw HDR source data prior to tone mapping.
- **Automatic Transition**: While iterating through the general effects loop registered via
  `view.postEffectManager.addEffect()`, tone mapping executes **immediately upon encountering the first LDR effect**.
- **Default Fallback**: If no LDR effects are registered in the chain, tone mapping is applied at the final step of the
  loop.

---

## 2. ToneMappingManager Settings

Configure parameters through `view.toneMappingManager`, which is built into every `View3D`
instance.

| Property         | Default               | Range        | Description                                                          |
|:-----------------|:----------------------|:-------------|:---------------------------------------------------------------------|
| **`mode`**       | `KHRONOS_PBR_NEUTRAL` | -            | Tone mapping algorithm type (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| **`contrast`**   | `1.0`                 | `0.0 ~ 2.0`  | Contrast intensity                                                   |
| **`brightness`** | `0.0`                 | `-1.0 ~ 1.0` | Additional brightness offset                                         |

```javascript
const tm = view.toneMappingManager;
tm.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
tm.contrast = 1.05;
tm.brightness = 0.02;
```

---

## 3. Supported Algorithms

Mode constants are defined under `RedGPU.ToneMapping.TONE_MAPPING_MODE`. Use `KHRONOS_PBR_NEUTRAL` (default) when
physical color accuracy is priority, and the `ACES_FILMIC_` variants for cinematic styling.

| Mode Constant               | Description                                                                                       | Comparison Image                        |
|:----------------------------|:--------------------------------------------------------------------------------------------------|:----------------------------------------|
| **`LINEAR`**                | Outputs directly to the device range without correction. Highlight and shadow clipping may occur. | ![Linear](/toneMapping/linear.jpg)      |
| **`KHRONOS_PBR_NEUTRAL`**   | Standard algorithm preserving color fidelity for physically-based rendering (PBR) (Default)       | ![Khronos](/toneMapping/khronos.jpg)    |
| **`ACES_FILMIC_HILL`**      | Hill-approximation of the film industry standard ACES algorithm, producing high contrast.         | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **`ACES_FILMIC_NARKOWICZ`** | Narkowicz-approximation of the ACES algorithm, producing dramatic contrast.                       | ![ACES Nark](/toneMapping/acesNark.jpg) |

---

## Related Examples

- [DamagedHelmet PBR & Tone Mapping](/RedGPU/examples/gltf/models/helmets/)
- [Sponza HDR Exposure & Tone Mapping](/RedGPU/examples/gltf/models/sponza/)

---

## Next Steps

- **[Built-in Effects](./builtin-effects.md)**: Activating `SSAO` and real-time `SSR` for physical depth
- **[General Effects](./general-effects.md)**: Adding bloom, blur, and grayscale before or after tone mapping
