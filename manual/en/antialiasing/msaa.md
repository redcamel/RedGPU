---
title: MSAA
order: 2
---

# MSAA (Multisample AA)

**MSAA** (Multisample Antialiasing) is a standard hardware-level (GPU) antialiasing technique that multi-samples polygon
edges to produce smooth outlines.

## 1. Pros & Cons

- **Pros**:
    - Cleanly smooths actual geometry (polygon) outlines without the slight blur of post-processing filters (FXAA) or
      temporal ghosting (TAA).
- **Cons**:
    - **Does Not Resolve Internal Aliasing**: Does not smooth high-contrast texture patterns inside polygons or PBR
      specular highlight shimmering.
    - **Does Not Resolve Alpha Cutoff (`MASK` / Cutoff) Edges**: Boundaries created by alpha testing (such as foliage,
      fences, or `Cutoff` panels) are not actual polygon edges, so jagged edges remain.
    - **Higher Memory Usage**: Requires additional multi-sampled buffers (4x MSAA), increasing memory and bandwidth
      consumption.

## 2. Usage

Enabled via `antialiasingManager.useMSAA`. Enabling this automatically disables FXAA or TAA.

```javascript
// Enable MSAA (Other AAs are disabled)
redGPUContext.antialiasingManager.useMSAA = true;
```

## 3. Quality Comparison

| State               | Result Image                    |
|:--------------------|:--------------------------------|
| **Disabled (NONE)** | ![None](/antialiasing/none.jpg) |
| **MSAA Enabled**    | ![MSAA](/antialiasing/msaa.jpg) |

---

[Next Step: Learn FXAA](./fxaa.md)
