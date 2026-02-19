#redgpu_include math.EPSILON

/**
 * [KO] RGB 색상을 HSL 색상 공간으로 변환합니다.
 * [EN] Converts RGB color to HSL color space.
 */
fn rgbToHsl(rgb: vec3<f32>) -> vec3<f32> {
    let maxVal: f32 = max(max(rgb.r, rgb.g), rgb.b);
    let minVal: f32 = min(min(rgb.r, rgb.g), rgb.b);
    let delta: f32 = maxVal - minVal;
    let EPSILON = EPSILON;

    let lightness: f32 = (maxVal + minVal) * 0.5;

    if (delta < EPSILON) {
        return vec3<f32>(0.0, 0.0, lightness);
    }

    // Saturation 계산
    var saturation: f32;
    if (lightness < 0.5) {
        saturation = delta / (maxVal + minVal + EPSILON);
    } else {
        saturation = delta / (2.0 - maxVal - minVal + EPSILON);
    }

    // Hue 계산 (부동소수점 비교 개선)
    var hue: f32 = 0.0;
    if (abs(rgb.r - maxVal) < EPSILON) {
        hue = (rgb.g - rgb.b) / delta;
        if (rgb.g < rgb.b) {
            hue += 6.0;
        }
    } else if (abs(rgb.g - maxVal) < EPSILON) {
        hue = (rgb.b - rgb.r) / delta + 2.0;
    } else {
        hue = (rgb.r - rgb.g) / delta + 4.0;
    }

    hue = hue / 6.0;

    return vec3<f32>(hue, saturation, lightness);
}

/**
 * [KO] HSL 색상을 RGB 색상 공간으로 변환합니다.
 * [EN] Converts HSL color to RGB color space.
 */
fn hslToRgb(hsl: vec3<f32>) -> vec3<f32> {
    let h = hsl.x; // Hue: 0.0 ~ 1.0
    let s = hsl.y; // Saturation: 0.0 ~ 1.0
    let l = hsl.z; // Lightness: 0.0 ~ 1.0

    if (s == 0.0) {
        // 무채색(회색)인 경우
        return vec3<f32>(l, l, l);
    }

    // q와 p 계산
    var q: f32;
    if (l < 0.5) {
        q = l * (1.0 + s);
    } else {
        q = l + s - l * s;
    }

    let p = 2.0 * l - q;

    // R, G, B 계산
    var r: f32;
    var g: f32;
    var b: f32;

    for (var i: i32 = 0; i < 3; i = i + 1) {
        var t: f32;
        if (i == 0) {
            t = h + 1.0 / 3.0; // Red
        } else if (i == 1) {
            t = h; // Green
        } else {
            t = h - 1.0 / 3.0; // Blue
        }

        if (t < 0.0) {
            t = t + 1.0;
        }
        if (t > 1.0) {
            t = t - 1.0;
        }

        var color: f32;
        if (t < 1.0 / 6.0) {
            color = p + (q - p) * 6.0 * t;
        } else if (t < 1.0 / 2.0) {
            color = q;
        } else if (t < 2.0 / 3.0) {
            color = p + (q - p) * (2.0 / 3.0 - t) * 6.0;
        } else {
            color = p;
        }

        if (i == 0) {
            r = color;
        } else if (i == 1) {
            g = color;
        } else {
            b = color;
        }
    }

    return vec3<f32>(r, g, b);
}

/**
 * [KO] 베이스 색상에 틴트(Tint) 색상을 지정된 블렌딩 모드로 합성합니다.
 * [EN] Blends the base color with a tint color using the specified blending mode.
 *
 * @param baseColor -
 * [KO] 원본 색상 (RGBA)
 * [EN] Base color (RGBA)
 * @param tintBlendMode -
 * [KO] 블렌딩 모드 인덱스 (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION)
 * [EN] Blending mode index (0: NORMAL, 1: MULTIPLY, ... 22: NEGATION)
 * @param tint -
 * [KO] 합성할 틴트 색상 (RGBA)
 * [EN] Tint color to blend (RGBA)
 * @returns
 * [KO] 합성된 최종 색상 (RGBA)
 * [EN] Final blended color (RGBA)
 */
fn getTintBlendMode(baseColor: vec4<f32>, tintBlendMode: u32, tint: vec4<f32>) -> vec4<f32> {
    var tintedColor: vec3<f32>;

    switch (tintBlendMode) {
        case 0u: { // NORMAL
            tintedColor = mix(baseColor.rgb, tint.rgb, tint.a);
        }
        case 1u: { // MULTIPLY
            tintedColor = baseColor.rgb * tint.rgb;
        }
        case 2u: { // LIGHTEN
            tintedColor = max(baseColor.rgb, tint.rgb);
        }
        case 3u: { // SCREEN
            tintedColor = 1.0 - (1.0 - baseColor.rgb) * (1.0 - tint.rgb);
        }
        case 4u: { // LINEAR_DODGE
            tintedColor = clamp(baseColor.rgb + tint.rgb, vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 5u: { // SUBTRACT
            tintedColor = clamp(baseColor.rgb - tint.rgb, vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 6u: { // DARKEN
            tintedColor = min(baseColor.rgb, tint.rgb);
        }
        case 7u: { // OVERLAY
            tintedColor = mix(
                2.0 * baseColor.rgb * tint.rgb,
                1.0 - 2.0 * (1.0 - baseColor.rgb) * (1.0 - tint.rgb),
                step(vec3<f32>(0.5), baseColor.rgb)
            );
        }
        case 8u: { // COLOR_DODGE
            tintedColor = clamp(baseColor.rgb / (1.0 - tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 9u: { // COLOR_BURN
            tintedColor = 1.0 - clamp((1.0 - baseColor.rgb) / (tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 10u: { // HARD_LIGHT
            tintedColor = mix(
                2.0 * baseColor.rgb * tint.rgb,
                1.0 - 2.0 * (1.0 - baseColor.rgb) * (1.0 - tint.rgb),
                step(vec3<f32>(0.5), tint.rgb)
            );
        }
        case 11u: { // SOFT_LIGHT
            tintedColor = mix(
                baseColor.rgb * (tint.rgb + tint.rgb - vec3<f32>(1.0)),
                baseColor.rgb + tint.rgb - baseColor.rgb * tint.rgb,
                step(vec3<f32>(0.5), tint.rgb)
            );
        }
        case 12u: { // DIFFERENCE
            tintedColor = abs(baseColor.rgb - tint.rgb);
        }
        case 13u: { // EXCLUSION
            tintedColor = baseColor.rgb + tint.rgb - 2.0 * baseColor.rgb * tint.rgb;
        }
        case 14u: { // DIVIDE
            tintedColor = clamp(baseColor.rgb / (tint.rgb + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 15u: { // VIVID_LIGHT
            tintedColor = mix(
                clamp(baseColor.rgb / (1.0 - (tint.rgb - vec3<f32>(0.5)) * 2.0 + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0)),
                1.0 - clamp((1.0 - baseColor.rgb) / (tint.rgb * 2.0 + EPSILON), vec3<f32>(0.0), vec3<f32>(1.0)),
                step(vec3<f32>(0.5), tint.rgb)
            );
        }
        case 16u: { // LINEAR_BURN
            tintedColor = clamp(baseColor.rgb + tint.rgb - vec3<f32>(1.0), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        case 17u: { // PIN_LIGHT
            tintedColor = mix(
                min(baseColor.rgb, 2.0 * tint.rgb),
                max(baseColor.rgb, 2.0 * tint.rgb - vec3<f32>(1.0)),
                step(vec3<f32>(0.5), tint.rgb)
            );
        }
        case 18u: { // SATURATION
            let baseHsl = rgbToHsl(baseColor.rgb);
            let tintHsl = rgbToHsl(tint.rgb);
            tintedColor = hslToRgb(vec3<f32>(baseHsl.x, tintHsl.y, baseHsl.z));
        }
        case 19u: { // HUE
            let baseHsl = rgbToHsl(baseColor.rgb);
            let tintHsl = rgbToHsl(tint.rgb);
            tintedColor = hslToRgb(vec3<f32>(tintHsl.x, baseHsl.y, baseHsl.z));
        }
        case 20u: { // LUMINOSITY
            let baseHsl = rgbToHsl(baseColor.rgb);
            let tintHsl = rgbToHsl(tint.rgb);
            tintedColor = hslToRgb(vec3<f32>(baseHsl.x, baseHsl.y, tintHsl.z));
        }
        case 21u: { // COLOR
            let baseHsl = rgbToHsl(baseColor.rgb);
            let tintHsl = rgbToHsl(tint.rgb);
            tintedColor = hslToRgb(vec3<f32>(tintHsl.x, tintHsl.y, baseHsl.z));
        }
        case 22u: { // NEGATION
            tintedColor = 1.0 - abs(1.0 - baseColor.rgb - tint.rgb);
        }
        default: {
            tintedColor = baseColor.rgb;
        }
    }

    return vec4<f32>(tintedColor, baseColor.a * tint.a);
}
