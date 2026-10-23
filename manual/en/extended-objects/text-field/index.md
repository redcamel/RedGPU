---
title: Text Field
order: 4
---

# Text Field

RedGPU's text field system internally leverages HTML/SVG rendering to display CSS-styled text in both 3D world
coordinates (`TextField3D`) and 2D screen coordinates (`TextField2D`). Textures automatically update when text content
or styles change, and `TextField3D` includes built-in camera-facing **Billboard** support.

## 1. Key Style Properties

Core style properties shared by `TextField3D` and `TextField2D`:

| Property         | Default         | Description                                               |
|:-----------------|:----------------|:----------------------------------------------------------|
| **`text`**       | `""`            | String to display (supports line breaks via `<br/>` tags) |
| **`fontSize`**   | `24`            | Font size (`px`)                                          |
| **`fontFamily`** | `"Arial"`       | Font family                                               |
| **`color`**      | `"#fff"`        | Text color (Hex, RGB, etc.)                               |
| **`background`** | `"transparent"` | Background color and opacity                              |
| **`textAlign`**  | `"center"`      | Text alignment (`"left"`, `"center"`, `"right"`)          |
| **`padding`**    | `0`             | Inner padding (`px`)                                      |

---

## Learning Roadmap

1. **[TextField3D](./textfield3d.md)**: Placing text and controlling sizing modes in the 3D world
2. **[Particle & Line](../particle/index.md)**: Rendering GPU particle emitters and 3D splines
3. **[Interaction](../../interaction/index.md)**: Object interaction via mouse and touch input

---

[Next Step: Learn TextField3D](./textfield3d.md)
