---
order: 2
---

# Adding Custom Effects

Most post-processing effects are added by creating an effect object and using the `addEffect` method of the `PostEffectManager`.

## 1. How to Add Effects (addEffect)

Effects such as Bloom, Blur, and Adjustments are registered to the pipeline using `addEffect`. The post-processing chain is formed in the order they are registered.

```javascript
// 1. Create effect object
const bloom = new RedGPU.PostEffect.OldBloom(redGPUContext);

// 2. Add to manager
view.postEffectManager.addEffect(bloom);
```

## 2. Key Custom Effect Examples

### 2.1 Bloom (OldBloom)
Creates a light bleeding effect to produce a fantastic atmosphere.

```javascript
const bloom = new RedGPU.PostEffect.OldBloom(redGPUContext);
bloom.bloomStrength = 1.5; // Adjust strength
view.postEffectManager.addEffect(bloom);
```

### 2.2 Blur
Blurs the screen. Various types such as Gaussian blur and directional blur are provided.

```javascript
const blur = new RedGPU.PostEffect.Blur(redGPUContext);
view.postEffectManager.addEffect(blur);
```

### 2.3 Color Adjustments
Allows for precise adjustment of brightness, contrast, and saturation.

```javascript
const gray = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(gray);
```

## Key Summary
- Effects can be stacked in any order using `addEffect`.
- Each effect object requires `redGPUContext` as an argument during creation.

## Recommended Next Steps
- **[Tone Mapping](./tone-mapping.md)**
- **[Built-in Effects](./builtin-effects.md)**
