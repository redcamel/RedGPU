#redgpu_include color.linearToSrgbVec3

struct Uniforms {
    contrast: f32,
    brightness: f32,
    pad0: f32,
    pad1: f32,
};

fn linearToneMapping(color: vec3<f32>) -> vec3<f32> {
    return color;
}

// Khronos PBR Neutral Tonemapping - WGSL
// https://github.com/KhronosGroup/ToneMapping

fn khronosPBRNeutralToneMapping(color: vec3<f32>) -> vec3<f32> {
    const startCompression: f32 = 0.76; // 0.8 - 0.04
    const desaturation: f32 = 0.15;
    const d: f32 = 0.24; // 1.0 - startCompression
    const d2: f32 = 0.0576; // d * d
    const dMinusStart: f32 = -0.52; // d - startCompression

    let x = min(color.r, min(color.g, color.b));
    let offset = select(0.04, x - 6.25 * x * x, x < 0.08);
    var col = color - offset;

    let peak = max(col.r, max(col.g, col.b));
    if (peak < startCompression) {
        return saturate(col);
    }

    let newPeak = 1.0 - d2 / (peak + dMinusStart);
    col = col * (newPeak / peak);

    let g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
    return saturate(mix(col, vec3<f32>(newPeak), g));
}

// ACES Filmic Tone Mapping (Narkowicz)
fn acesFilmicNarkowiczToneMapping(color: vec3<f32>) -> vec3<f32> {
    const a: f32 = 2.51;
    const b: f32 = 0.03;
    const c: f32 = 2.43;
    const d: f32 = 0.59;
    const e: f32 = 0.14;
    return saturate((color * (a * color + b)) / (color * (c * color + d) + e));
}

// ACES Filmic Tone Mapping (Hill)
fn acesFilmicHillToneMapping(color: vec3<f32>) -> vec3<f32> {
    let a = vec3<f32>(
        color.r * 0.59719 + color.g * 0.35458 + color.b * 0.04823,
        color.r * 0.07600 + color.g * 0.90834 + color.b * 0.01566,
        color.r * 0.02840 + color.g * 0.13383 + color.b * 0.83777
    );
    let b = (a * (a + 0.0245786) - 0.000090537) / (a * (0.983729 * a + 0.4329510) + 0.238081);
    return saturate(vec3<f32>(
        b.r * 1.60475 - b.g * 0.53108 - b.b * 0.07367,
        b.r * -0.10208 + b.g * 1.10813 - b.b * 0.00605,
        b.r * -0.00327 - b.g * 0.07276 + b.b * 1.07602
    ));
}

fn getFinalSRGB(toneMappedColor: vec3<f32>, contrast: f32, brightness: f32) -> vec3<f32> {
    let offset = 0.5 - 0.5 * contrast + brightness;
    let finalLinearRGB = saturate(toneMappedColor * contrast + offset);
    return linearToSrgbVec3(finalLinearRGB);
}
