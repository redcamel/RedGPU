let index = global_id.xy;
let dims = postEffectOutputDimensions;
let invDims = 1.0 / vec2<f32>(dims);
let uvM = (vec2<f32>(index) + 0.5) * invDims;
let i_index = vec2<i32>(index);

// 1. Sample center and 4-cardinal neighbors (N, S, W, E) to evaluate local contrast
let colorM4 = textureLoad(sourceTexture, index, 0);
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
    textureStore(outputTexture, index, colorM4);
    return;
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
let absGrad1 = abs(gradient1);
let absGrad2 = abs(gradient2);
let is1Steeper = absGrad1 >= absGrad2;
let gradientScaled = 0.25 * max(absGrad1, absGrad2);

let stepLength = select(invDims.x, invDims.y, isHorizontal) * select(1.0, -1.0, is1Steeper);
let lumaLocalAverage = 0.5 * (select(luma2, luma1, is1Steeper) + lumaM);
let currentUv = uvM + select(vec2<f32>(stepLength * 0.5, 0.0), vec2<f32>(0.0, stepLength * 0.5), isHorizontal);

// 4. Search along both directions (P/N) of the edge using variable step sizes to locate endpoints
let uvOffset = select(vec2<f32>(0.0, invDims.y), vec2<f32>(invDims.x, 0.0), isHorizontal);
var uvP = currentUv + uvOffset;
var uvN = currentUv - uvOffset;
var lumaEndP = 0.0;
var lumaEndN = 0.0;
var doneP = false;
var doneN = false;

for (var i = 0; i < 10; i++) {
    if (!doneP) {
        lumaEndP = getLuminance(textureSampleLevel(sourceTexture, basicSampler, uvP, 0.0).rgb) - lumaLocalAverage;
    }
    if (!doneN) {
        lumaEndN = getLuminance(textureSampleLevel(sourceTexture, basicSampler, uvN, 0.0).rgb) - lumaLocalAverage;
    }
    doneP = doneP || (abs(lumaEndP) >= gradientScaled);
    doneN = doneN || (abs(lumaEndN) >= gradientScaled);
    if (doneP && doneN) {
        break;
    }
    let stepSize = FXAA_QUALITY_STEPS[i];
    if (!doneP) {
        uvP += uvOffset * stepSize;
    }
    if (!doneN) {
        uvN -= uvOffset * stepSize;
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
let finalColor4 = textureSampleLevel(sourceTexture, basicSampler, finalUv, 0.0);

textureStore(outputTexture, index, finalColor4);
