let index = global_id.xy;
let outDim = vec2<f32>(postEffectOutputDimensions);
let uv = (vec2<f32>(index) + 0.5) / outDim;
let aspect = outDim.x / max(outDim.y, 1.0);
let flareTexelSize = 1.0 / vec2<f32>(textureDimensions(flareTexture));

let baseColor = textureLoad(sourceTexture, index, 0);
var flareRGB = sampleTent9Tap(flareTexture, uv, flareTexelSize);

let centerUV = vec2<f32>(0.5, 0.5);

if (uniforms.sunActive == 1u) {
    let sunDir = normalize(uniforms.sunDirection);
    let viewSunDir = (systemUniforms.camera.viewMatrix * vec4<f32>(sunDir, 0.0)).xyz;

    if (viewSunDir.z < -1e-4) {
        let clipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewSunDir, 0.0);
        let ndc = clipPos.xy / max(clipPos.w, 1e-5);
        let sunUV = vec2<f32>(ndc.x * 0.5 + 0.5, 0.5 - ndc.y * 0.5);

        let sunOffset = vec2<f32>((sunUV.x - 0.5) * aspect, sunUV.y - 0.5);
        let sunCos4 = evaluateCos4Vignette(length(sunOffset));

        let depthDim = textureDimensions(depthTexture);
        let depthDimF = vec2<f32>(depthDim);
        let projScaleY = abs(systemUniforms.projection.noneJitterProjectionMatrix[1][1]);
        let projectedSunRadius = SOLAR_ANGULAR_RADIUS * projScaleY;

        var visibleSamples = 0.0;
        for (var k = 0u; k < 9u; k = k + 1u) {
            let offset = vec2<f32>(DISK_OFFSETS[k].x / aspect, DISK_OFFSETS[k].y) * projectedSunRadius;
            let sampleUV = sunUV + offset;
            if (all(sampleUV >= vec2<f32>(0.0)) && all(sampleUV <= vec2<f32>(1.0))) {
                let sampleCoord = min(vec2<u32>(sampleUV * depthDimF), depthDim - vec2<u32>(1u));
                if (textureLoad(depthTexture, sampleCoord, 0) >= 0.9999) {
                    visibleSamples += 1.0;
                }
            }
        }

        var sunTransmittance = (visibleSamples * (1.0 / 9.0)) * sunCos4;
        var solarIrradiance = uniforms.sunColor * uniforms.sunIntensityScale;

        if (systemUniforms.useSkyAtmosphere == 1u) {
            if (sunDir.y <= -SOLAR_ANGULAR_RADIUS) {
                sunTransmittance = 0.0;
            } else {
                // Kasten-Young relative optical air mass & Rayleigh (lambda^-4) Beer-Lambert atmospheric transmittance
                let sinAlt = max(sunDir.y, 0.0);
                let airMass = 1.0 / (sinAlt + 0.025 * exp(-11.0 * sinAlt));
                let rayleighBeta = vec3<f32>(0.049, 0.112, 0.215);
                let beerLambertAtmo = exp(-rayleighBeta * airMass);
                let cloudOpticalDepth = systemUniforms.skyAtmosphere.cloudCoverage * systemUniforms.skyAtmosphere.cloudDensity * 2.5;
                sunTransmittance *= exp(-cloudOpticalDepth);
                solarIrradiance *= beerLambertAtmo;
            }
        }

        if (sunTransmittance > 1e-4) {
            let dSun = vec2<f32>((uv.x - sunUV.x) * aspect, uv.y - sunUV.y);
            let rSun = length(dSun);
            let camRot = atan2(systemUniforms.camera.viewMatrix[0][1], systemUniforms.camera.viewMatrix[0][0]) * 0.5;
            let blades = max(uniforms.bladeCount, 4.0);

            // When SkyAtmosphere is absent, synthesize the physical Gaussian solar core & inner aureole at sunUV
            if (systemUniforms.useSkyAtmosphere == 0u) {
                let coreSigma = SOLAR_ANGULAR_RADIUS * 2.4;
                let gaussianDisk = exp(-(rSun * rSun) / (2.0 * coreSigma * coreSigma)) * 2.4;
                let aureoleSigma = 0.024;
                let aureoleSigmaSq = aureoleSigma * aureoleSigma;
                let invAureole = inverseSqrt(rSun * rSun + aureoleSigmaSq);
                let innerAureole = (aureoleSigmaSq * aureoleSigma) * (invAureole * invAureole * invAureole) * 0.65;
                flareRGB += solarIrradiance * ((gaussianDisk + innerAureole) * sunTransmittance);
            }

            // 1. Finite-Aperture Polychromatic Fraunhofer Diffraction & Spencer-CIE Glare PSF
            if (uniforms.starburstIntensity > 0.0) {
                let babinetEdgeGain = 1.0 + 3.0 * sunTransmittance * (1.0 - sunTransmittance);
                let psfStarburst = evaluateFraunhoferStarburst(dSun, rSun, blades, camRot, babinetEdgeGain);
                flareRGB += solarIrradiance * (psfStarburst * uniforms.starburstIntensity * sunTransmittance);
            }

            // 2. Cylindrical Anamorphic Astigmatism Line-Spread Function (Lorentzian LSF)
            if (uniforms.anamorphicIntensity > 0.0) {
                let sigmaY = SOLAR_ANGULAR_RADIUS * 0.5;
                let sigmaX = SOLAR_ANGULAR_RADIUS * 32.0;
                let lsfY = (sigmaY * sigmaY) / (dSun.y * dSun.y + sigmaY * sigmaY);
                let lsfX = (sigmaX * sigmaX) / (dSun.x * dSun.x + sigmaX * sigmaX);
                let anamorphicCoating = evaluateThinFilmReflectance(0.480, (dSun.x * dSun.x) / (1.0 + dSun.x * dSun.x));
                flareRGB += solarIrradiance * anamorphicCoating * (lsfY * lsfX * uniforms.anamorphicIntensity * sunTransmittance);
            }

            let chiefRayVec = sunUV - centerUV;
            let chiefRayAspect = vec2<f32>(chiefRayVec.x * aspect, chiefRayVec.y);
            let chiefRayLenSq = dot(chiefRayAspect, chiefRayAspect);
            let chiefRayLen = sqrt(chiefRayLenSq);
            let chiefRayDir = select(vec2<f32>(1.0, 0.0), chiefRayAspect / chiefRayLen, chiefRayLen > 1e-5);
            // Schlick's Fresnel internal reflection law: R(theta) = R0 * (1 + 4*(1 - cos(theta))^5) * cos^4(theta)
            let cosTheta = inverseSqrt(1.0 + chiefRayLenSq);
            let oneMinusCos = 1.0 - cosTheta;
            let schlickFresnel = 1.0 + 4.0 * (oneMinusCos * oneMinusCos * oneMinusCos * oneMinusCos * oneMinusCos);
            let solarCoreSeparation = chiefRayLenSq / (chiefRayLenSq + SOLAR_ANGULAR_RADIUS * SOLAR_ANGULAR_RADIUS * 4.0);
            let axialEfficiency = schlickFresnel * solarCoreSeparation * evaluateCos4Vignette(chiefRayLen);

            // 3. Paraxial Spherical Surface Halo (Cauchy Dispersed Gaussian Ring)
            if (uniforms.haloIntensity > 0.0 && axialEfficiency > 1e-4) {
                let haloCenter = centerUV - chiefRayVec * 0.45;
                let pHalo = vec2<f32>((uv.x - haloCenter.x) * aspect, uv.y - haloCenter.y);
                let rHalo = length(pHalo);
                let hRadius = uniforms.haloRadius;
                let sigmaRing = hRadius * 0.24;
                let dispRing = hRadius * uniforms.chromaticAberration * CAUCHY_DISPERSION;
                let dRing = vec3<f32>(rHalo - hRadius) - dispRing;
                let ringProfile = exp(-(dRing * dRing) / (2.0 * sigmaRing * sigmaRing));
                let cosAlign = max(0.0, dot(pHalo / max(rHalo, 1e-5), -chiefRayDir));
                let fresnelArc = ringProfile * (cosAlign * cosAlign) * evaluateCos4Vignette(rHalo);
                let ringAngularCompression = (2.0 * SOLAR_ANGULAR_RADIUS) / max(sigmaRing, 1e-4);
                flareRGB += fresnelArc * solarIrradiance * (uniforms.haloIntensity * sunTransmittance * axialEfficiency * ringAngularCompression);
            }

            // 4. Paraxial Double-Reflection Ghost Train with Defocus-Proportional PSF & Flux Conservation
            let ghostCount = min(uniforms.ghostCount, 12u);
            if (uniforms.ghostIntensity > 0.0 && ghostCount > 0u && axialEfficiency > 1e-4) {
                let spacingScale = uniforms.ghostSpacing / 0.35;
                let sinHalfBlade = sin(PI / blades);
                let refSolidAngle = PI * (0.036 * 0.036);
                let invSqrtGhosts = inverseSqrt(f32(ghostCount));
                var ghostIrradiance = vec3<f32>(0.0);

                for (var g = 0u; g < ghostCount; g = g + 1u) {
                    let s = (f32(g) + 0.5) / f32(ghostCount);
                    let weylPhase = fract(f32(g + 1u) * GOLDEN_CONJUGATE);

                    // Paraxial lateral magnification M_g along the optical axis
                    let magnification = (0.65 - 2.25 * s) * spacingScale;
                    let ghostCenterUV = centerUV + chiefRayVec * magnification;
                    let pGhost = vec2<f32>((uv.x - ghostCenterUV.x) * aspect, uv.y - ghostCenterUV.y);

                    // Axial defocus distance determines exit-pupil projection radius R_g and proportional defocus PSF width sigma_g
                    let defocusFactor = sin(PI * weylPhase);
                    let defocusSq = defocusFactor * defocusFactor;
                    let pupilRadius = (0.008 + 0.072 * defocusSq) * sqrt(1.0 + 0.4 * chiefRayLenSq);
                    let edgeBlur = pupilRadius * sinHalfBlade * 0.35;
                    let sigmaPsf = sqrt(SOLAR_ANGULAR_RADIUS * SOLAR_ANGULAR_RADIUS + edgeBlur * edgeBlur);

                    if (length(pGhost) < pupilRadius + 3.5 * sigmaPsf) {
                        let axisShift = chiefRayDir * (magnification * pupilRadius);
                        let pupilTransmittance = evaluatePhysicalGhostPupil(
                            pGhost,
                            pupilRadius,
                            sigmaPsf,
                            blades,
                            camRot,
                            axisShift,
                            uniforms.chromaticAberration
                        );

                        // Airy thin-film reflectance for element coating thickness & local chief-ray angle
                        let opdUm = 0.240 + 0.420 * weylPhase;
                        let localSinSq = (magnification * magnification * chiefRayLenSq) / (1.0 + magnification * magnification * chiefRayLenSq);
                        let coatingReflectance = evaluateThinFilmReflectance(opdUm, localSinSq);

                        // Radiometric Conservation of Flux: Irradiance = Flux / Projected Pupil Solid Angle
                        let pupilSolidAngle = PI * (pupilRadius * pupilRadius + 2.0 * sigmaPsf * sigmaPsf);
                        let fluxDensity = refSolidAngle / (pupilSolidAngle + refSolidAngle);
                        let ghostCos4 = evaluateCos4Vignette(length(vec2<f32>((ghostCenterUV.x - 0.5) * aspect, ghostCenterUV.y - 0.5)));

                        ghostIrradiance += pupilTransmittance * coatingReflectance * (fluxDensity * ghostCos4);
                    }
                }
                flareRGB += ghostIrradiance * solarIrradiance * (uniforms.ghostIntensity * sunTransmittance * axialEfficiency * invSqrtGhosts);
            }
        }
    }
}

if (uniforms.lensDirtIntensity > 0.0) {
    let mieScatter = evaluateMieSurfaceScattering(uv, aspect);
    flareRGB *= 1.0 + mieScatter * uniforms.lensDirtIntensity;
}

let finalRGB = baseColor.rgb + flareRGB * uniforms.intensity;
textureStore(outputTexture, index, vec4<f32>(finalRGB, baseColor.a));
