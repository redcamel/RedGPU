---
title: Tone Mapping
order: 3
---

# Tone Mapping

Tone mapping is the process of converting the wide range of brightness in HDR images to a range that can be expressed on standard monitors. It acts as the **Entry Point** of the post-processing pipeline and determines the overall atmosphere of the scene.

## 1. ToneMappingManager

All settings are made through `view.toneMappingManager`. It is automatically included when a `View3D` is created, so no separate instance creation is necessary.

### Default Settings
RedGPU adopts **Khronos PBR Neutral**, optimized for physically based rendering, as its default algorithm.

| Property | Default Value | Description |
| :--- | :--- | :--- |
| `mode` | `KHRONOS_PBR_NEUTRAL` | Tone mapping algorithm (`RedGPU.ToneMapping.TONE_MAPPING_MODE`) |
| `exposure` | `1.0` | Exposure value (brightness intensity) |
| `contrast` | `1.0` | Brightness contrast (0.0 ~ 2.0) |
| `brightness` | `0.0` | Brightness correction (-1.0 ~ 1.0) |

## 2. Changing Settings

### 2.1 Tone Mapping Mode (mode)
Select the algorithm according to the desired visual style. All constant values are defined in the `RedGPU.ToneMapping.TONE_MAPPING_MODE` object.

```javascript
// Apply strong contrast and cinematic color like a movie
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

**Available Mode Constants and Visual Differences:**

| Mode (Constant) | Description | Comparison Image |
| :--- | :--- | :--- |
| **LINEAR** | Linear transformation without correction | ![Linear](/toneMapping/linear.jpg) |
| **KHRONOS_PBR_NEUTRAL** | Physically based standard (Default) | ![Khronos](/toneMapping/khronos.jpg) |
| **ACES_FILMIC_HILL** | Cinematic contrast (Hill version) | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **ACES_FILMIC_NARKOWICZ** | Cinematic contrast (Narkowicz version) | ![ACES Nark](/toneMapping/acesNark.jpg) |

### 2.2 Adjusting Detailed Properties

```javascript
const tm = view.toneMappingManager;
tm.exposure = 1.2;    // Increase overall exposure
tm.contrast = 1.05;   // Fine-tune brightness contrast
tm.brightness = 0.02; // Correct shadow brightness
```

## Key Summary
- Tone mapping is managed with separate configuration (`ToneMappingManager`) and execution (`PostEffectManager`).
- It is executed at the **very first stage** of the post-processing pipeline.
- It is a core window for controlling exposure and contrast, determining the first impression of the scene.

## Next Learning Recommendations
- **[Built-in Effects](./builtin-effects)**
- **[General Effects](./general-effects)**