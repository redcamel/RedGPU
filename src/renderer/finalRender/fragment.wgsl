#redgpu_include color.getLuminance

struct Uniforms {
    ndcScaleOffset: vec4<f32>,
    backgroundColor: vec4<f32>,
    casPeak: f32,
    subpix: f32,
    edgeThreshold: f32,
    edgeThresholdMin: f32,
};

@group(0) @binding(0)
var sourceSampler: sampler;

@group(0) @binding(1)
var sourceTexture: texture_2d<f32>;

@group(0) @binding(2)
var<uniform> uniforms: Uniforms;

const BASE_MIP_LEVEL_I32: i32 = 0;
const BASE_MIP_LEVEL_F32: f32 = 0.0;
const MIN_COORD: i32 = 0;
const COORD_STEP: i32 = 1;
const ONE_F32: f32 = 1.0;
const ZERO_F32: f32 = 0.0;

const CAS_MIN_MAX_RGB_EPSILON: f32 = 0.0001;
const CAS_NEIGHBOR_COUNT: f32 = 4.0;

const FXAA_SEARCH_STEPS: u32 = 12u;
const FXAA_GRADIENT_SCALE: f32 = 0.25;
const FXAA_HALF_STEP: f32 = 0.5;
const FXAA_EDGE_CENTER_WEIGHT: f32 = 2.0;
const FXAA_SUBPIX_CARDINAL_WEIGHT: f32 = 2.0;
const FXAA_SUBPIX_TENT_WEIGHT_INV: f32 = 1.0 / 12.0;

const FXAA_QUALITY: array<f32, FXAA_SEARCH_STEPS> = array<f32, FXAA_SEARCH_STEPS>(
    1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 2.0, 2.0, 2.0, 2.0, 4.0, 8.0
);

fn applyCAS(pixelCoord: vec2<i32>, maxCoord: vec2<i32>) -> vec4<f32> {
    let yN = max(pixelCoord.y - COORD_STEP, MIN_COORD);
    let yS = min(pixelCoord.y + COORD_STEP, maxCoord.y);
    let xW = max(pixelCoord.x - COORD_STEP, MIN_COORD);
    let xE = min(pixelCoord.x + COORD_STEP, maxCoord.x);

    let b = textureLoad(sourceTexture, vec2<i32>(pixelCoord.x, yN), BASE_MIP_LEVEL_I32).rgb;
    let d = textureLoad(sourceTexture, vec2<i32>(xW, pixelCoord.y), BASE_MIP_LEVEL_I32).rgb;
    let e = textureLoad(sourceTexture, pixelCoord, BASE_MIP_LEVEL_I32);
    let f = textureLoad(sourceTexture, vec2<i32>(xE, pixelCoord.y), BASE_MIP_LEVEL_I32).rgb;
    let h = textureLoad(sourceTexture, vec2<i32>(pixelCoord.x, yS), BASE_MIP_LEVEL_I32).rgb;

    let minRGB = min(min(min(d, e.rgb), min(f, b)), h);
    let maxRGB = max(max(max(d, e.rgb), max(f, b)), h);
    let peakMinRGB = min(minRGB, vec3<f32>(ONE_F32) - maxRGB);

    if (all(peakMinRGB <= vec3<f32>(ZERO_F32))) {
        return e;
    }

    let rcpMRGB = ONE_F32 / max(maxRGB, vec3<f32>(CAS_MIN_MAX_RGB_EPSILON));
    let ampRGB = saturate(peakMinRGB * rcpMRGB);
    let weightRGB = sqrt(ampRGB);

    let wRGB = weightRGB * uniforms.casPeak;
    let rcpWeightRGB = ONE_F32 / (vec3<f32>(ONE_F32) + CAS_NEIGHBOR_COUNT * wRGB);

    let window = b + d + f + h;
    let sharpRGB = (e.rgb + window * wRGB) * rcpWeightRGB;

    return vec4<f32>(saturate(sharpRGB), e.a);
}

fn applyFXAA(uvM: vec2<f32>, pixelCoord: vec2<i32>, dims: vec2<u32>, maxCoord: vec2<i32>) -> vec4<f32> {
    let yN = max(pixelCoord.y - COORD_STEP, MIN_COORD);
    let yS = min(pixelCoord.y + COORD_STEP, maxCoord.y);
    let xW = max(pixelCoord.x - COORD_STEP, MIN_COORD);
    let xE = min(pixelCoord.x + COORD_STEP, maxCoord.x);

    // 1. Sample center and 4-cardinal neighbors (N, S, W, E) to evaluate local contrast
    let colorM4 = textureLoad(sourceTexture, pixelCoord, BASE_MIP_LEVEL_I32);
    let lumaM = getLuminance(colorM4.rgb);

    let lumaN = getLuminance(textureLoad(sourceTexture, vec2<i32>(pixelCoord.x, yN), BASE_MIP_LEVEL_I32).rgb);
    let lumaS = getLuminance(textureLoad(sourceTexture, vec2<i32>(pixelCoord.x, yS), BASE_MIP_LEVEL_I32).rgb);
    let lumaW = getLuminance(textureLoad(sourceTexture, vec2<i32>(xW, pixelCoord.y), BASE_MIP_LEVEL_I32).rgb);
    let lumaE = getLuminance(textureLoad(sourceTexture, vec2<i32>(xE, pixelCoord.y), BASE_MIP_LEVEL_I32).rgb);

    let lumaMin = min(lumaM, min(min(lumaN, lumaS), min(lumaW, lumaE)));
    let lumaMax = max(lumaM, max(max(lumaN, lumaS), max(lumaW, lumaE)));
    let range = lumaMax - lumaMin;

    // Early exit when local luminance contrast is below the edge threshold
    if (range < max(uniforms.edgeThresholdMin, lumaMax * uniforms.edgeThreshold)) {
        return colorM4;
    }

    let invDims = ONE_F32 / vec2<f32>(dims);

    // 2. Sample 4-diagonal neighbors (NW, NE, SW, SE) and determine edge orientation (Horizontal vs Vertical)
    let lumaNW = getLuminance(textureLoad(sourceTexture, vec2<i32>(xW, yN), BASE_MIP_LEVEL_I32).rgb);
    let lumaNE = getLuminance(textureLoad(sourceTexture, vec2<i32>(xE, yN), BASE_MIP_LEVEL_I32).rgb);
    let lumaSW = getLuminance(textureLoad(sourceTexture, vec2<i32>(xW, yS), BASE_MIP_LEVEL_I32).rgb);
    let lumaSE = getLuminance(textureLoad(sourceTexture, vec2<i32>(xE, yS), BASE_MIP_LEVEL_I32).rgb);

    let lumaNS = lumaN + lumaS;
    let lumaWE = lumaW + lumaE;
    let lumaNWSW = lumaNW + lumaSW;
    let lumaNESE = lumaNE + lumaSE;
    let lumaNWNE = lumaNW + lumaNE;
    let lumaSWSE = lumaSW + lumaSE;

    let edgeHor = abs(lumaNWSW - FXAA_EDGE_CENTER_WEIGHT * lumaW) + abs(lumaNS - FXAA_EDGE_CENTER_WEIGHT * lumaM) * FXAA_EDGE_CENTER_WEIGHT + abs(lumaNESE - FXAA_EDGE_CENTER_WEIGHT * lumaE);
    let edgeVer = abs(lumaNWNE - FXAA_EDGE_CENTER_WEIGHT * lumaN) + abs(lumaWE - FXAA_EDGE_CENTER_WEIGHT * lumaM) * FXAA_EDGE_CENTER_WEIGHT + abs(lumaSWSE - FXAA_EDGE_CENTER_WEIGHT * lumaS);
    let isHorizontal = edgeHor >= edgeVer;

    // 3. Select steepest gradient normal across the edge and step 0.5 texel onto the edge boundary
    let luma1 = select(lumaW, lumaN, isHorizontal);
    let luma2 = select(lumaE, lumaS, isHorizontal);
    let gradient1 = luma1 - lumaM;
    let gradient2 = luma2 - lumaM;

    let absGradient1 = abs(gradient1);
    let absGradient2 = abs(gradient2);
    let is1Steepest = absGradient1 >= absGradient2;
    let gradientScaled = FXAA_GRADIENT_SCALE * max(absGradient1, absGradient2);

    let baseStepLength = select(invDims.x, invDims.y, isHorizontal);
    let stepLength = select(baseStepLength, -baseStepLength, is1Steepest);
    let lumaLocalAverage = FXAA_HALF_STEP * (select(luma2, luma1, is1Steepest) + lumaM);

    var currentUv = uvM;
    if (isHorizontal) {
        currentUv.y += stepLength * FXAA_HALF_STEP;
    } else {
        currentUv.x += stepLength * FXAA_HALF_STEP;
    }

    // 4. Search along both directions of the edge using 12-step FXAA 3.11 quality acceleration schedule
    let uvOffset = select(vec2<f32>(ZERO_F32, invDims.y), vec2<f32>(invDims.x, ZERO_F32), isHorizontal);
    var uvP = currentUv + uvOffset;
    var uvN = currentUv - uvOffset;

    var lumaEndP = ZERO_F32;
    var lumaEndN = ZERO_F32;
    var doneP = false;
    var doneN = false;

    for (var i = 0u; i < FXAA_SEARCH_STEPS; i++) {
        if (!doneP) {
            lumaEndP = getLuminance(textureSampleLevel(sourceTexture, sourceSampler, uvP, BASE_MIP_LEVEL_F32).rgb) - lumaLocalAverage;
            doneP = abs(lumaEndP) >= gradientScaled;
        }
        if (!doneN) {
            lumaEndN = getLuminance(textureSampleLevel(sourceTexture, sourceSampler, uvN, BASE_MIP_LEVEL_F32).rgb) - lumaLocalAverage;
            doneN = abs(lumaEndN) >= gradientScaled;
        }
        if (doneP && doneN) {
            break;
        }
        let stepOffset = uvOffset * FXAA_QUALITY[i];
        if (!doneP) {
            uvP += stepOffset;
        }
        if (!doneN) {
            uvN -= stepOffset;
        }
    }

    // 5. Compute edge blend weight from endpoint distances and verify luminance variation direction
    let distP = select(uvP.y - uvM.y, uvP.x - uvM.x, isHorizontal);
    let distN = select(uvM.y - uvN.y, uvM.x - uvN.x, isHorizontal);
    let isDirectionN = distN < distP;
    let distMin = min(distP, distN);
    let lumaEnd = select(lumaEndP, lumaEndN, isDirectionN);
    let isLumaCenterSmaller = lumaM < lumaLocalAverage;
    let correctVariation = (lumaEnd < ZERO_F32) != isLumaCenterSmaller;
    let edgeBlend = select(ZERO_F32, FXAA_HALF_STEP - distMin / (distP + distN), correctVariation);

    // 6. Compute 3x3 tent-weighted sub-pixel anti-aliasing weight and perform final bilinear sample
    let lumaL = (lumaNS + lumaWE) * FXAA_SUBPIX_CARDINAL_WEIGHT + lumaNWSW + lumaNESE;
    let subpixFilter = saturate(abs(lumaL * FXAA_SUBPIX_TENT_WEIGHT_INV - lumaM) / range);
    let subpixF = smoothstep(ZERO_F32, ONE_F32, subpixFilter);
    let subpixBlend = subpixF * subpixF * uniforms.subpix;

    let finalBlend = max(edgeBlend, subpixBlend);
    let finalOffset = stepLength * finalBlend;
    let finalUv = uvM + select(vec2<f32>(finalOffset, ZERO_F32), vec2<f32>(ZERO_F32, finalOffset), isHorizontal);
    let finalColor4 = textureSampleLevel(sourceTexture, sourceSampler, finalUv, BASE_MIP_LEVEL_F32);

    return finalColor4;
}

fn compositeBackground(viewColor: vec4<f32>) -> vec4<f32> {
    let invViewAlpha = ONE_F32 - viewColor.a;
    return viewColor + uniforms.backgroundColor * invViewAlpha;
}

@fragment
fn mainNone(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let viewColor = textureSampleLevel(sourceTexture, sourceSampler, fragUV, BASE_MIP_LEVEL_F32);
    return compositeBackground(viewColor);
}

@fragment
fn mainCAS(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let dims = textureDimensions(sourceTexture);
    let maxCoord = vec2<i32>(dims) - vec2<i32>(COORD_STEP);
    let pixelCoord = clamp(vec2<i32>(fragUV * vec2<f32>(dims)), vec2<i32>(MIN_COORD), maxCoord);
    let viewColor = applyCAS(pixelCoord, maxCoord);
    return compositeBackground(viewColor);
}

@fragment
fn mainFXAA(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
    let dims = textureDimensions(sourceTexture);
    let maxCoord = vec2<i32>(dims) - vec2<i32>(COORD_STEP);
    let pixelCoord = clamp(vec2<i32>(fragUV * vec2<f32>(dims)), vec2<i32>(MIN_COORD), maxCoord);
    let viewColor = applyFXAA(fragUV, pixelCoord, dims, maxCoord);
    return compositeBackground(viewColor);
}
