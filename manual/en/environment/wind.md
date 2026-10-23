---
title: WindManager
order: 4
---

# Global Wind System

`WindManager` is a global environment manager that controls wind direction, speed, and
strength across the entire scene through a unified interface.

## 1. Integrated Systems

Modifying properties on `scene.windManager` (owned by default by every `Scene` instance) immediately affects the
following systems:

- **`FoliageManager`**: Direction and frequency of trunk bending (`trunkBendScale`) and leaf flutter
  (`leafFlutterScale`) for large-scale foliage
- **`GrassManager`**: Travel direction and sway amplitude of wind gusts sweeping across procedural grass meadows
- **`Lake`**: Flow direction and speed (`flowRateScale`) of physically based lake surface normal maps

---

## 2. Key Properties and Usage

Control the manager directly via `scene.windManager` without creating a separate instance.

| Property             | Type      | Default   | Description                                                                          |
|:---------------------|:----------|:----------|:-------------------------------------------------------------------------------------|
| **`enabled`**        | `boolean` | `true`    | Enables or disables global wind effects (`false` pauses all wind animations)         |
| **`directionAngle`** | `number`  | `45`      | Horizontal wind direction angle in degrees (`0 ~ 360`)                               |
| **`speed`**          | `number`  | `1.0`     | Time-axis progression speed multiplier for wind waves (`0` or higher)                |
| **`strength`**       | `number`  | `1.0`     | Wind force intensity multiplier applied to foliage, grass, and water (`0` or higher) |
| **`directionX`**     | `number`  | Read-only | Normalized X-axis direction component computed from `directionAngle` (`cos`)         |
| **`directionZ`**     | `number`  | Read-only | Normalized Z-axis direction component computed from `directionAngle` (`sin`)         |

```javascript
const windManager = scene.windManager;

// 1. Set wind direction angle (0 ~ 360 degrees)
windManager.directionAngle = 120;

// 2. Adjust wind speed and strength
windManager.speed = 1.2;
windManager.strength = 1.5;

// 3. Optionally pause wind effects
// windManager.enabled = false;
```

---

## Next Steps

- **[Extended Objects](../extended-objects/index.md)**: Loading external 3D models and utilizing specialized display
  objects
