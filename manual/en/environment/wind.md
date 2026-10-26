---
title: WindManager
order: 4
---

<script setup>
const windGraph = `
    Scene["Scene"] -->|scene.windManager| Wind["WindManager (Global Wind Control)"]
    Wind -->|Direction, Speed & Strength| Foliage["FoliageManager (Trees & Foliage)"]
    Wind -->|Direction, Speed & Strength| Lake["Lake (Water Surface)"]

    %% Grayscale styles applied
    style Scene fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Wind fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Foliage fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Lake fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# WindManager

`WindManager` is a global environment manager that controls wind direction, speed, and strength across the entire scene.
It is automatically created with each `Scene` and accessed via `scene.windManager`.

<ClientOnly>
  <MermaidResponsive :definition="windGraph" />
</ClientOnly>

## 1. Integrated Systems

Modifying properties on `scene.windManager` immediately affects the following natural environment systems in the scene:

- **Large-Scale Foliage (`FoliageManager`)**: Direction and frequency of tree trunk bending and leaf flutter
- **Physically Based Water (`Lake`)**: Flow direction and speed of water surface ripples

## 2. Key Property Control

Adjust properties directly on `scene.windManager` without creating a separate instance.

| Property             | Default | Description                                                                  |
|:---------------------|:--------|:-----------------------------------------------------------------------------|
| **`directionAngle`** | `0`     | Horizontal wind direction angle (`0 ~ 360` degrees)                          |
| **`speed`**          | `1.0`   | Wind animation speed multiplier                                              |
| **`strength`**       | `1.0`   | Wind force multiplier applied to foliage and water                           |
| **`enabled`**        | `true`  | Enables or disables global wind effects (`false` pauses all wind animations) |

```javascript
const windManager = scene.windManager;

// 1. Set wind direction angle (0 ~ 360 degrees)
windManager.directionAngle = 45;

// 2. Adjust wind speed and strength
windManager.speed = 1.2;
windManager.strength = 1.5;

// 3. Optionally pause wind effects
// windManager.enabled = false;
```

---

## Related Examples

- [Foliage & Wind Integration](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
- [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)

---

## Next Steps

Now that you have configured the natural environment, move on to the Extended Objects category to learn how to load
external 3D models and use specialized display objects.

- **[Extended Objects](../extended-objects/index.md)**
