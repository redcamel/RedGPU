struct Uniforms {
    threshold: f32,
    ghostCount: u32,
    ghostSpacing: f32,
    ghostIntensity: f32,
    haloRadius: f32,
    haloThickness: f32,
    haloIntensity: f32,
    chromaticAberration: f32,
};

#redgpu_include math.PI
const GOLDEN_CONJUGATE: f32 = 0.618033988749895;
const LUMA_REC709: vec3<f32> = vec3<f32>(0.2126, 0.7152, 0.0722);
const WAVELENGTHS_UM: vec3<f32> = vec3<f32>(0.650, 0.530, 0.450);
const CAUCHY_DISPERSION: vec3<f32> = vec3<f32>(-0.464, 0.0, 0.536);

// Airy thin-film single-layer MgF2 coating (n_f = 1.38) spectral reflectance
fn evaluateThinFilmReflectance(opdUm: f32, sinThetaSq: f32) -> vec3<f32> {
    let nfSq = 1.9044; // 1.38^2
    let cosThetaT = sqrt(max(1.0 - sinThetaSq / nfSq, 0.0));
    let phase = (PI * opdUm * cosThetaT) / WAVELENGTHS_UM;
    let interference = cos(phase);
    return vec3<f32>(0.42) + vec3<f32>(0.58) * (interference * interference);
}

// Cosine-fourth law of off-axis optical illumination: cos^4(theta) = 1 / (1 + (r / f)^2)^2
fn evaluateCos4Vignette(radialDist: f32) -> f32 {
    let tanThetaSq = radialDist * radialDist;
    let invSecSq = 1.0 / (1.0 + tanThetaSq);
    return invSecSq * invSecSq;
}

fn extractBrightHighlight(uv: vec2<f32>, texelSize: vec2<f32>, threshold: f32, knee: f32) -> vec3<f32> {
    if (any(uv <= vec2<f32>(0.0)) || any(uv >= vec2<f32>(1.0))) {
        return vec3<f32>(0.0);
    }

    // When SkyAtmosphere is active, Pass 3 analytically evaluates the solar disk flare;
    // exclude background sky pixels (depth >= 0.9999) here to prevent duplicate screen-space solar ghosts/halos.
    if (systemUniforms.useSkyAtmosphere == 1u) {
        let depthDim = textureDimensions(depthTexture);
        let depthCoord = min(vec2<u32>(uv * vec2<f32>(depthDim)), depthDim - vec2<u32>(1u));
        if (textureLoad(depthTexture, depthCoord, 0) >= 0.9999) {
            return vec3<f32>(0.0);
        }
    }

    // 4-Tap Karis-weighted bilinear downsample (suppresses subpixel specular fireflies)
    let halfTexel = texelSize * 0.5;
    let c0 = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-halfTexel.x, -halfTexel.y), 0.0).rgb;
    let c1 = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( halfTexel.x, -halfTexel.y), 0.0).rgb;
    let c2 = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>(-halfTexel.x,  halfTexel.y), 0.0).rgb;
    let c3 = textureSampleLevel(sourceTexture, basicSampler, uv + vec2<f32>( halfTexel.x,  halfTexel.y), 0.0).rgb;

    let w0 = 1.0 / (1.0 + dot(c0, LUMA_REC709));
    let w1 = 1.0 / (1.0 + dot(c1, LUMA_REC709));
    let w2 = 1.0 / (1.0 + dot(c2, LUMA_REC709));
    let w3 = 1.0 / (1.0 + dot(c3, LUMA_REC709));
    let c = (c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3) / max(w0 + w1 + w2 + w3, 1e-6);

    // Exact C1-continuous quadratic soft-knee luminance extraction
    let luma = dot(c, LUMA_REC709);
    let soft = clamp(luma - threshold + knee, 0.0, 2.0 * knee);
    let quadratic = (soft * soft) / max(4.0 * knee, 1e-6);
    let extractedLuma = max(quadratic, luma - threshold);
    let scale = extractedLuma / max(luma, 1e-6);

    // Reinhard radiometric highlight compression to preserve finite energy integral
    let radiance = c * scale;
    return radiance / (vec3<f32>(1.0) + dot(radiance, LUMA_REC709) * 0.08);
}

fn sampleCauchyDispersion(
    uv: vec2<f32>,
    radialVec: vec2<f32>,
    caStrength: f32,
    texelSize: vec2<f32>,
    threshold: f32,
    knee: f32
) -> vec3<f32> {
    let shiftR = radialVec * (caStrength * CAUCHY_DISPERSION.r);
    let shiftB = radialVec * (caStrength * CAUCHY_DISPERSION.b);
    let r = extractBrightHighlight(uv + shiftR, texelSize, threshold, knee).r;
    let g = extractBrightHighlight(uv,          texelSize, threshold, knee).g;
    let b = extractBrightHighlight(uv + shiftB, texelSize, threshold, knee).b;
    return vec3<f32>(r, g, b);
}
