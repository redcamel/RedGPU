let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let rawDepth = fetchDepth(id);

let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpacePos = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let rayLengthRatio = length(viewSpacePos); 

let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpacePos);

let sunDir = normalize(uniforms.sunDirection);
let viewSunCos = dot(viewDir, sunDir);
let mappingH = max(0.0, uniforms.cameraHeight);
let groundRadius = uniforms.groundRadius;
let atmosphereHeight = uniforms.atmosphereHeight;

// 1. 기초 대기 속성 결정 (산란광, 투과율, 장면 블렌딩 배수)
var baseScattering: vec3<f32> = vec3<f32>(0.0);
var atmosphereTrans: f32 = 1.0;
var sceneBlendingTrans: f32 = 1.0;

if (rawDepth >= 1.0) {
    // [Background] 배경은 이미 산란광이 그려졌으므로 추가 산란은 0, 장면 투과율은 1.0(보존)
    let skyUV = getSkyViewUV(viewDir, mappingH, groundRadius, atmosphereHeight);
    atmosphereTrans = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0).a;
    sceneBlendingTrans = 1.0; 
} else {
    // [Object] Aerial Perspective 적용
    let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
    let actualDist = depthKm * rayLengthRatio;
    let maxApDist = uniforms.aerialPerspectiveDistanceScale; 
    let apDist = clamp(actualDist - uniforms.aerialPerspectiveStartDepth, 0.0, maxApDist);

    let apW = clamp(sqrt(apDist / maxApDist), 0.0, 1.0);
    var apSample = textureSampleLevel(aerialPerspectiveLUT, skyAtmosphereSampler, vec3<f32>(uv.x, uv.y, apW), 0.0);

    // 근거리 보정
    if (actualDist < NEAR_FIELD_CORRECTION_DIST) { 
        let d = getAtmosphereDensities(mappingH, uniforms);
        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, mappingH, sunDir.y, atmosphereHeight);
        let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyLuminanceFactor;
        let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyLuminanceFactor;
        let phaseR = phaseRayleigh(viewSunCos);
        let phaseM = phaseMie(viewSunCos, uniforms.mieAnisotropy);
        let localScat = (scatR * phaseR + vec3<f32>(scatM * phaseM)) * sunT;
        let localExt = scatR + vec3<f32>((uniforms.mieScattering + uniforms.mieAbsorption) * d.rhoM * uniforms.skyLuminanceFactor) + uniforms.absorptionCoefficient * d.rhoO;
        let analyticalScat = localScat * actualDist;
        let analyticalTrans = exp(-localExt * actualDist);
        let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) / 3.0;
        apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, smoothstep(0.0, NEAR_FIELD_CORRECTION_DIST, actualDist));
    }
    
    baseScattering = apSample.rgb;
    atmosphereTrans = apSample.a;
    sceneBlendingTrans = apSample.a;
}

// 2. 추가 시각 효과 계산 (Mie Glow, Sun Disk)
let camPos = vec3<f32>(0.0, mappingH + groundRadius, 0.0);
let sunShadow = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);

// 대기 투과율을 적용한 Glow 및 Sun 계산
let mieGlow = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, skyAtmosphereSampler, vec3<f32>(atmosphereTrans), 0.0);
let sunDisk = select(vec3<f32>(0.0), getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, vec3<f32>(atmosphereTrans), 0.01, uniforms), rawDepth >= 1.0);

// 3. 최종 산란광 합산 및 장면 합성 (Unified Formula)
let totalScattering = (baseScattering + (mieGlow + sunDisk) * sunShadow) * uniforms.sunIntensity * systemUniforms.preExposure;
let finalColor = sceneColor * saturate(sceneBlendingTrans) + totalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
