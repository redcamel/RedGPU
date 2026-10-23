---
title: Tone Mapping
order: 3
---

# Tone Mapping

Tone mapping is an essential post-processing technique that naturally maps the wide brightness range of High Dynamic
Range (HDR) images into the limited representation range of standard display devices (LDR). It determines the ultimate
visual quality of your rendering by coordinating the scene's exposure, contrast, and overall color palette.

## 1. ToneMappingManager Settings

All tone mapping parameters can be dynamically adjusted using `view.toneMappingManager`. This manager is built-in when a
`View3D` instance is created, so there is no need to instantiate it manually.

| Property Name    | Default Value         | Range           | Description                                                               |
|:-----------------|:----------------------|:----------------|:--------------------------------------------------------------------------|
| **`mode`**       | `KHRONOS_PBR_NEUTRAL` | -               | The tone mapping algorithm type (`RedGPU.ToneMapping.TONE_MAPPING_MODE`). |
| **`contrast`**   | `1.0`                 | `0.0` to `2.0`  | Contrast intensity.                                                       |
| **`brightness`** | `0.0`                 | `-1.0` to `1.0` | Additional brightness correction for shadow/highlight areas.              |

```javascript
// Fine-tune contrast and brightness to emphasize visual impact
const tm = view.toneMappingManager;
tm.contrast = 1.05;
tm.brightness = 0.02;
```

---

## 2. Supported Algorithms (TONE_MAPPING_MODE)

You can change the tone mapping mode in real time depending on your target visual style. Constants are defined in
`RedGPU.ToneMapping.TONE_MAPPING_MODE`.

```javascript
// Apply ACES Filmic algorithm for a cinematic atmosphere
view.toneMappingManager.mode = RedGPU.ToneMapping.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
```

| Mode Constant               | Description                                                                                                                 | Comparison Image                        |
|:----------------------------|:----------------------------------------------------------------------------------------------------------------------------|:----------------------------------------|
| **`LINEAR`**                | Outputs straight to the device range without any correction. Highlights and shadow details may suffer significant clipping. | ![Linear](/toneMapping/linear.jpg)      |
| **`KHRONOS_PBR_NEUTRAL`**   | Standard algorithm designed to preserve color fidelity for physically-based rendering (PBR) (Default)                       | ![Khronos](/toneMapping/khronos.jpg)    |
| **`ACES_FILMIC_HILL`**      | Hill-approximation version of the ACES algorithm, a cinematic movie industry standard creating high contrast.               | ![ACES Hill](/toneMapping/acesHill.jpg) |
| **`ACES_FILMIC_NARKOWICZ`** | Narkowicz-approximation version of the ACES algorithm creating dramatic contrast.                                           | ![ACES Nark](/toneMapping/acesNark.jpg) |

> [!TIP]
> **Live Testing in Examples**: You can switch and compare all 4 tone mapping modes in real time on any running scene
using the **`TONE MAPPING`** dropdown menu located in the UI of every RedGPU example.
>
> ![Tone Mapping Control](/toneMapping/toneMappingControl.png)

---

## Next Steps

- **[Built-in Effects](./builtin-effects.md)**: Activating SSAO and real-time SSR for physical depth.
- **[General Effects](./general-effects.md)**: Adding bloom, blur, and grayscale before or after tone mapping.
