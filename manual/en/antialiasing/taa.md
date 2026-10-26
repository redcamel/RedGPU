---
title: TAA
order: 1
---

# TAA (Temporal AA)

**`TAA`** (Temporal Antialiasing) is a time-based antialiasing technique that blends previous frames with the current
frame to eliminate jagged edges.

## 1. Pros & Cons

- **Pros**:
    - Delivers the highest antialiasing quality, resolving not only geometry outlines but also internal high-contrast
      texture patterns, alpha cutoff (`MASK`) edges, and PBR specular shimmering.
- **Cons**:
    - Because it accumulates multiple frames over time, slight ghosting artifacts may appear on fast-moving objects or
      during rapid camera movement.

## 2. Usage

Enabled via `antialiasingManager.useTAA`. Enabling this automatically disables MSAA or FXAA.

```javascript
// Enable TAA (Other AAs are disabled)
redGPUContext.antialiasingManager.useTAA = true;
```

## 3. Quality Comparison

| State               | Result Image                    |
|:--------------------|:--------------------------------|
| **Disabled (NONE)** | ![None](/antialiasing/none.jpg) |
| **TAA Enabled**     | ![TAA](/antialiasing/taa.jpg)   |

---

[Next Step: Learn MSAA](./msaa.md)
