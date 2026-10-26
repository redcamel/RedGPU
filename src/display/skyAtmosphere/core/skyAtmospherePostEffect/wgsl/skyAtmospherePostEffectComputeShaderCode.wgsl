let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneColor = textureLoad(sourceTexture, id).rgb;

let rawDepth = fetchDepth(id);

// [KO] 1. 화면 픽셀의 뷰 공간 광선 비율과 월드 공간 시선 방향을 계산합니다.
// [EN] 1. Compute the view-space ray length ratio and world-space view direction for the current pixel.
let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpacePos = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let dotPos = dot(viewSpacePos, viewSpacePos);
let invRayLengthRatio = inverseSqrt(dotPos);
let rayLengthRatio = dotPos * invRayLengthRatio;

let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = (worldRotation * viewSpacePos) * invRayLengthRatio;

let sunDir = uniforms.sunDirection;
let viewSunCos = dot(viewDir, sunDir);
let mappingH = max(0.0, uniforms.cameraHeight);
let groundRadius = uniforms.groundRadius;

// [KO] 2. 배경 여부에 따라 SkyView 투과율 또는 Aerial Perspective 3D LUT 산란광/투과율을 샘플링합니다.
// [EN] 2. Sample SkyView transmittance for background pixels or Aerial Perspective 3D LUT scattering/transmittance for scene geometry.
var baseScattering: vec3<f32> = vec3<f32>(0.0);
var atmosphereTrans: f32 = 1.0;
var sceneBlendingTrans: f32 = 1.0;

if (rawDepth >= 1.0) {
    let skyUV = getSkyViewUV(viewDir, mappingH, groundRadius);
    atmosphereTrans = textureSampleLevel(skyViewLUT, basicSampler, skyUV, 0.0).a;
} else {
    let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
    let actualDist = depthKm * rayLengthRatio;
    let maxApDist = uniforms.aerialPerspectiveDistanceScale; 
    let apDist = clamp(actualDist - uniforms.aerialPerspectiveStartDepth, 0.0, maxApDist);

    let apW = saturate(sqrt(apDist * (1.0 / maxApDist)));
    var apSample = textureSampleLevel(aerialPerspectiveLUT, basicSampler, vec3<f32>(uv.x, uv.y, apW), 0.0);

    // [KO] 3D LUT 첫 번째 슬라이스 이내의 초근거리 구간은 해석적 단일 산란과 부드럽게 보간합니다.
    // [EN] Smoothly interpolate ultra-near-field distances within the first 3D LUT slice using analytical single scattering.
    if (actualDist < NEAR_FIELD_CORRECTION_DIST) { 
        let d = getAtmosphereDensities(mappingH, uniforms);
        let sunT = getTransmittance(transmittanceLUT, basicSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);
        let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyLuminanceFactor;
        let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyLuminanceFactor;
        let phaseR = phaseRayleigh(viewSunCos);
        let phaseM = phaseMie(viewSunCos, uniforms.mieAnisotropy);
        let localScat = (scatR * phaseR + scatM * phaseM) * sunT;
        let localExt = scatR + (uniforms.mieScattering + uniforms.mieAbsorption) * d.rhoM * uniforms.skyLuminanceFactor + uniforms.absorptionCoefficient * d.rhoO;
        let analyticalScat = localScat * actualDist;
        let analyticalTrans = exp(-localExt * actualDist);
        let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) * (1.0 / 3.0);
        apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, smoothstep(0.0, NEAR_FIELD_CORRECTION_DIST, actualDist));
    }
    
    baseScattering = apSample.rgb;
    atmosphereTrans = apSample.a;
    sceneBlendingTrans = apSample.a;
}

// [KO] 3. 행성 그림자 외부에서 전방 미 산란 광륜(Mie Glow)과 배경 태양 디스크·구름 차폐를 계산합니다.
// [EN] 3. Compute forward Mie glow and background sun disk/cloud occlusion outside the planet shadow.
let camPos = vec3<f32>(0.0, mappingH + groundRadius, 0.0);
var addedRadiance = vec3<f32>(0.0);

if (getPlanetShadowMask(camPos, sunDir, groundRadius) > 0.0) {
    let transVec = vec3<f32>(atmosphereTrans);
    addedRadiance = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, basicSampler, transVec);

    if (rawDepth >= 1.0 && !(groundRadius > 0.0 && getRaySphereIntersection(camPos, viewDir, groundRadius) > 0.0)) {
        addedRadiance += getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, transVec);
        if (uniforms.cloudCoverage > 0.0 && any(addedRadiance > vec3<f32>(0.0))) {
            let cloudR = groundRadius + uniforms.cloudHeight;
            let tCloud = getRaySphereIntersection(camPos, viewDir, cloudR);
            if (tCloud > 0.0) {
                let hitP = camPos + viewDir * tCloud;
                let finalCloudMask = getCloudDensity(cloud_fbm(getCloudWarpedUV(hitP, uniforms)), uniforms);
                addedRadiance *= (1.0 - finalCloudMask);
            }
        }
    }
}

// [KO] 4. 원본 씬 색상에 대기 투과율 감쇠와 누적 산란광을 합성하여 출력 텍스처에 기록합니다.
// [EN] 4. Composite atmospheric transmittance attenuation and accumulated scattering onto the scene color and write to outputTexture.
let totalScattering = (baseScattering + addedRadiance) * (uniforms.sunIntensity * systemUniforms.preExposure);
let finalColor = sceneColor * saturate(sceneBlendingTrans) + totalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
