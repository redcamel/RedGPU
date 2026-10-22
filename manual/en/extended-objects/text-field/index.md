---
title: Text Field
order: 4
---

# Text Field

RedGPU provides a **TextField** system that allows you to conveniently render text in 3D space. It internally utilizes
HTML/SVG technology to output complex font styles and effects based on GPU acceleration.

## 1. Key Features

- **HTML/SVG Based**: You can use familiar CSS styles (font, color, alignment, etc.) directly.
- **Spatial & 2D Placement**: Supports **TextField3D**, placed at 3D world coordinates, as well as **TextField2D**
  (`RedGPU.Display.TextField2D`) for 2D UI views (`View2D`).
- **Automatic Sizing**: The object's size is automatically updated according to the text content and style.
- **Billboard Support**: Can be set so that text always faces the camera.

## 2. Key Style Properties

Text field objects provide the following style properties.

| Property     | Description                                | Default Value   |
|:-------------|:-------------------------------------------|:----------------|
| `text`       | String to display (supports `<br/>`)       | `""`            |
| `fontSize`   | Font size (px)                             | `24`            |
| `fontFamily` | Font family                                | `"Arial"`       |
| `color`      | Text color (Hex, RGB, etc.)                | `"#fff"`        |
| `background` | Background color and transparency          | `"transparent"` |
| `textAlign`  | Text alignment (`left`, `center`, `right`) | `"center"`      |
| `padding`    | Padding (px)                               | `0`             |

::: info [HTML Tag Support]
You can handle line breaks using the `<br/>` tag in the `text` property.
:::

## Next Learning Roadmap

1. **[TextField3D](./textfield3d.md)**: Placing and controlling text in the 3D world
2. **[Interaction](../../interaction/index.md)**: Learning interaction via mouse and touch

---

[Next Step: Learn TextField3D](./textfield3d.md)
