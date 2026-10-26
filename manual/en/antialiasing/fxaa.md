---
title: FXAA
order: 3
---

# FXAA (Fast Approximate AA)

**`FXAA`** is a **post-processing** antialiasing technique that analyzes the final rendered image to smooth jagged
edges.

## 1. Pros & Cons

- **Pros**:
    - Extremely low computational cost and requires no extra multi-sample buffers, making it ideal for mobile and
      low-end devices.
- **Cons**:
    - Because it smooths pixel contrast in screen space, textures and fine details across the image may appear slightly
      soft (blurred).

## 2. Usage

Enabled via `antialiasingManager.useFXAA`. Enabling this automatically disables MSAA or TAA.

```javascript
// Enable FXAA (Other AAs are disabled)
redGPUContext.antialiasingManager.useFXAA = true;
```

## 3. Quality Comparison

| State               | Result Image                    |
|:--------------------|:--------------------------------|
| **Disabled (NONE)** | ![None](/antialiasing/none.jpg) |
| **FXAA Enabled**    | ![FXAA](/antialiasing/fxaa.jpg) |

---

[Next Step: Learn Plugin System](../plugins/index.md)
