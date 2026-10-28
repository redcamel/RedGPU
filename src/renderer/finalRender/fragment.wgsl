#redgpu_include color.getLuminance

struct Uniforms {
    backgroundColor: vec4<f32>,
    aaMode: u32,
    casPeak: f32,
    subpix: f32,
    edgeThreshold: f32,
    edgeThresholdMin: f32,
    _pad0: f32,
    _pad1: f32,
    _pad2: f32,
}

@group(1) @binding(0)
var _sampler: sampler;

@group(1) @binding(1)
var _texture: texture_2d<f32>;

@group(1) @binding(2)
var<uniform> uniforms : Uniforms;

const FXAA_QUALITY: array<f32, 12> = array<f32, 12>(
    1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 4.0, 8.0
);

fn fetchColor4(coord: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let clampedCoord = clamp(coord, vec2<i32>(0), vec2<i32>(dims) - vec2<i32>(1));
    return textureLoad(_texture, clampedCoord, 0);
}

fn applyCAS(pixelCoord: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let maxCoord = vec2<i32>(dims) - vec2<i32>(1);

    let b = textureLoad(_texture, clamp(pixelCoord + vec2<i32>(0, -1), vec2<i32>(0), maxCoord), 0).rgb;
    let d = textureLoad(_texture, clamp(pixelCoord + vec2<i32>(-1, 0), vec2<i32>(0), maxCoord), 0).rgb;
    let e = textureLoad(_texture, pixelCoord, 0);
    let f = textureLoad(_texture, clamp(pixelCoord + vec2<i32>(1, 0), vec2<i32>(0), maxCoord), 0).rgb;
    let h = textureLoad(_texture, clamp(pixelCoord + vec2<i32>(0, 1), vec2<i32>(0), maxCoord), 0).rgb;

    let minRGB = min(min(min(d, e.rgb), min(f, b)), h);
    let maxRGB = max(max(max(d, e.rgb), max(f, b)), h);

    let rcpMRGB = 1.0 / max(maxRGB, vec3<f32>(0.0001));
    let ampRGB = saturate(min(minRGB, 1.0 - maxRGB) * rcpMRGB);
    let weightRGB = sqrt(ampRGB);

    let wRGB = weightRGB * uniforms.casPeak;
    let rcpWeightRGB = 1.0 / (1.0 + 4.0 * wRGB);

    let window = b + d + f + h;
    let sharpRGB = (e.rgb + window * wRGB) * rcpWeightRGB;

    return vec4<f32>(saturate(sharpRGB), e.a);
}

fn applyFXAA(uvM: vec2<f32>, i_index: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let invDims = 1.0 / vec2<f32>(dims);

    // 1. Sample center and 4-cardinal neighbors (N, S, W, E) to evaluate local contrast
    let colorM4 = textureLoad(_texture, i_index, 0);
    let lumaM = getLuminance(colorM4.rgb);

    let lumaN = getLuminance(fetchColor4(i_index + vec2<i32>(0, -1), dims).rgb);
    let lumaS = getLuminance(fetchColor4(i_index + vec2<i32>(0, 1), dims).rgb);
    let lumaW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, 0), dims).rgb);
    let lumaE = getLuminance(fetchColor4(i_index + vec2<i32>(1, 0), dims).rgb);

    let lumaMin = min(lumaM, min(min(lumaN, lumaS), min(lumaW, lumaE)));
    let lumaMax = max(lumaM, max(max(lumaN, lumaS), max(lumaW, lumaE)));
    let range = lumaMax - lumaMin;

    // Early exit when local luminance contrast is below the edge threshold
    if (range < max(uniforms.edgeThresholdMin, lumaMax * uniforms.edgeThreshold)) {
        return colorM4;
    }

    // 2. Sample 4-diagonal neighbors (NW, NE, SW, SE) and determine edge orientation (Horizontal vs Vertical)
    let lumaNW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, -1), dims).rgb);
    let lumaNE = getLuminance(fetchColor4(i_index + vec2<i32>(1, -1), dims).rgb);
    let lumaSW = getLuminance(fetchColor4(i_index + vec2<i32>(-1, 1), dims).rgb);
    let lumaSE = getLuminance(fetchColor4(i_index + vec2<i32>(1, 1), dims).rgb);

    let lumaNS = lumaN + lumaS;
    let lumaWE = lumaW + lumaE;
    let lumaNWSW = lumaNW + lumaSW;
    let lumaNESE = lumaNE + lumaSE;
    let lumaNWNE = lumaNW + lumaNE;
    let lumaSWSE = lumaSW + lumaSE;

    let edgeHor = abs(lumaNWSW - 2.0 * lumaW) + abs(lumaNS - 2.0 * lumaM) * 2.0 + abs(lumaNESE - 2.0 * lumaE);
    let edgeVer = abs(lumaNWNE - 2.0 * lumaN) + abs(lumaWE - 2.0 * lumaM) * 2.0 + abs(lumaSWSE - 2.0 * lumaS);
    let isHorizontal = edgeHor >= edgeVer;

    // 3. Select steepest gradient normal across the edge and step 0.5 texel onto the edge boundary
    let luma1 = select(lumaW, lumaN, isHorizontal);
    let luma2 = select(lumaE, lumaS, isHorizontal);
    let gradient1 = luma1 - lumaM;
    let gradient2 = luma2 - lumaM;

    let is1Steepest = abs(gradient1) >= abs(gradient2);
    let gradientScaled = 0.25 * max(abs(gradient1), abs(gradient2));

    var stepLength = select(invDims.x, invDims.y, isHorizontal);
    var lumaLocalAverage = 0.0;

    if (is1Steepest) {
        stepLength = -stepLength;
        lumaLocalAverage = 0.5 * (luma1 + lumaM);
    } else {
        lumaLocalAverage = 0.5 * (luma2 + lumaM);
    }

    var currentUv = uvM;
    if (isHorizontal) {
        currentUv.y += stepLength * 0.5;
    } else {
        currentUv.x += stepLength * 0.5;
    }

    // 4. Search along both directions of the edge using 12-step FXAA 3.11 quality acceleration schedule
    let uvOffset = select(vec2<f32>(0.0, invDims.y), vec2<f32>(invDims.x, 0.0), isHorizontal);
    var uvP = currentUv + uvOffset;
    var uvN = currentUv - uvOffset;

    var lumaEndP = 0.0;
    var lumaEndN = 0.0;
    var doneP = false;
    var doneN = false;

    for (var i = 0; i < 12; i++) {
        let stepSize = FXAA_QUALITY[i];
        if (!doneP) {
            lumaEndP = getLuminance(textureSampleLevel(_texture, _sampler, uvP, 0.0).rgb) - lumaLocalAverage;
            doneP = abs(lumaEndP) >= gradientScaled;
            if (!doneP) {
                uvP += uvOffset * stepSize;
            }
        }
        if (!doneN) {
            lumaEndN = getLuminance(textureSampleLevel(_texture, _sampler, uvN, 0.0).rgb) - lumaLocalAverage;
            doneN = abs(lumaEndN) >= gradientScaled;
            if (!doneN) {
                uvN -= uvOffset * stepSize;
            }
        }
        if (doneP && doneN) {
            break;
        }
    }

    // 5. Compute edge blend weight from endpoint distances and verify luminance variation direction
    let distP = select(uvP.y - uvM.y, uvP.x - uvM.x, isHorizontal);
    let distN = select(uvM.y - uvN.y, uvM.x - uvN.x, isHorizontal);
    let isDirectionN = distN < distP;
    let distMin = min(distP, distN);
    let lumaEnd = select(lumaEndP, lumaEndN, isDirectionN);
    let isLumaCenterSmaller = lumaM < lumaLocalAverage;
    let correctVariation = (lumaEnd < 0.0) != isLumaCenterSmaller;
    let edgeBlend = select(0.0, 0.5 - distMin / (distP + distN), correctVariation);

    // 6. Compute 3x3 tent-weighted sub-pixel anti-aliasing weight and perform final bilinear sample
    let lumaL = (lumaNS + lumaWE) * 2.0 + lumaNWSW + lumaNESE;
    let subpixFilter = saturate(abs(lumaL * (1.0 / 12.0) - lumaM) / range);
    let subpixF = smoothstep(0.0, 1.0, subpixFilter);
    let subpixBlend = subpixF * subpixF * uniforms.subpix;

    let finalBlend = max(edgeBlend, subpixBlend);
    let finalUv = uvM + select(vec2<f32>(stepLength * finalBlend, 0.0), vec2<f32>(0.0, stepLength * finalBlend), isHorizontal);
    let finalColor4 = textureSampleLevel(_texture, _sampler, finalUv, 0.0);

    return finalColor4;
}

@fragment
fn main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
    var viewColor: vec4<f32>;
    if (uniforms.aaMode != 0u) {
        let dims = textureDimensions(_texture);
        let pixelCoord = clamp(vec2<i32>(fragUV * vec2<f32>(dims)), vec2<i32>(0), vec2<i32>(dims) - vec2<i32>(1));
        if (uniforms.aaMode == 2u) {
            viewColor = applyCAS(pixelCoord, dims);
        } else {
            viewColor = applyFXAA(fragUV, pixelCoord, dims);
        }
    } else {
        viewColor = textureSampleLevel(_texture, _sampler, fragUV, 0.0);
    }

    let backgroundColor = uniforms.backgroundColor;

    let blendedColor = vec4<f32>(
        viewColor.rgb + backgroundColor.rgb * (1.0 - viewColor.a),
        viewColor.a + backgroundColor.a * (1.0 - viewColor.a)
    );

    return blendedColor;
}
