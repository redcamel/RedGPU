let index = global_id.xy;
let outDim = vec2<f32>(postEffectOutputDimensions);
let uv = (vec2<f32>(index) + 0.5) / outDim;
let aspect = outDim.x / max(outDim.y, 1.0);
let srcTexelSize = 1.0 / vec2<f32>(textureDimensions(sourceTexture));

let centerUV = vec2<f32>(0.5, 0.5);
let fromCenter = uv - centerUV;
let toCenter = -fromCenter;

let threshold = uniforms.threshold;
let knee = threshold * 0.5 + 1e-4;
let caStrength = uniforms.chromaticAberration;

var flareColor = vec3<f32>(0.0);

let ghostCount = min(uniforms.ghostCount, 12u);
if (uniforms.ghostIntensity > 0.0 && ghostCount > 0u) {
    var ssGhosts = vec3<f32>(0.0);
    let invSpacing = 0.35 / max(uniforms.ghostSpacing, 0.05);
    let invCount = 1.0 / f32(ghostCount);

    for (var i = 0u; i < ghostCount; i = i + 1u) {
        let s = (f32(i) + 0.5) * invCount;
        // Paraxial inverse magnification alpha_i > 0 across optical center (maps opposite quadrant without center singularity)
        let invMag = (0.42 + 1.85 * s) * invSpacing;
        let sampleUV = centerUV - fromCenter * invMag;

        if (all(sampleUV > vec2<f32>(0.0)) && all(sampleUV < vec2<f32>(1.0))) {
            let offsetFromCenter = vec2<f32>((sampleUV.x - 0.5) * aspect, sampleUV.y - 0.5);
            let rSq = dot(offsetFromCenter, offsetFromCenter);
            let radialDist = sqrt(rSq);
            let cos4Weight = evaluateCos4Vignette(radialDist * 1.41421356);
            let pupilWindow = clamp(1.0 - rSq * 1.8, 0.0, 1.0);
            let radialWeight = cos4Weight * pupilWindow * pupilWindow;

            if (radialWeight > 1e-4) {
                let radialDir = select(vec2<f32>(0.0), offsetFromCenter / radialDist, radialDist > 1e-5);
                let sampleCol = sampleCauchyDispersion(sampleUV, radialDir, caStrength, srcTexelSize, threshold, knee);
                let opdUm = 0.240 + s * 0.480;
                let sinThetaSq = rSq / (1.0 + rSq);
                let coatingReflectance = evaluateThinFilmReflectance(opdUm, sinThetaSq);
                // 2D Jacobian area-conservation weight: invMag^2 / (1 + invMag^2)
                let jacobianWeight = (invMag * invMag) / (1.0 + invMag * invMag);
                ssGhosts += sampleCol * coatingReflectance * (radialWeight * jacobianWeight);
            }
        }
    }
    flareColor += ssGhosts * (uniforms.ghostIntensity * invCount * 0.85);
}

if (uniforms.haloIntensity > 0.0) {
    let aspectDelta = vec2<f32>(toCenter.x * aspect, toCenter.y);
    let rSq = dot(aspectDelta, aspectDelta);
    let aspectDist = sqrt(rSq);
    let aspectDir = select(vec2<f32>(0.0), aspectDelta / aspectDist, aspectDist > 1e-5);
    let sigmaHalo = max(uniforms.haloThickness * 0.5, 1e-3);
    let deltaR = aspectDist - uniforms.haloRadius;
    // Gaussian radial cross-section convolved with central entrance-pupil obscuration
    let gaussianRing = exp(-(deltaR * deltaR) / (2.0 * sigmaHalo * sigmaHalo));
    let pupilObscuration = rSq / (rSq + uniforms.haloRadius * uniforms.haloRadius * 0.25);
    let haloWindow = gaussianRing * pupilObscuration * evaluateCos4Vignette(aspectDist);

    if (haloWindow > 1e-4) {
        let haloOffsetUV = vec2<f32>(aspectDir.x / aspect, aspectDir.y) * uniforms.haloRadius;
        let haloSampleUV = uv + haloOffsetUV;
        if (all(haloSampleUV > vec2<f32>(0.0)) && all(haloSampleUV < vec2<f32>(1.0))) {
            let haloCol = sampleCauchyDispersion(haloSampleUV, aspectDir, caStrength, srcTexelSize, threshold, knee);
            let sinThetaSq = rSq / (1.0 + rSq);
            let haloCoating = evaluateThinFilmReflectance(0.530, sinThetaSq);
            flareColor += haloCol * haloCoating * (haloWindow * uniforms.haloIntensity * 0.35);
        }
    }
}

textureStore(outputTexture, index, vec4<f32>(flareColor, 1.0));
