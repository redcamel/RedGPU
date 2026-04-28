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

var scattering: vec3<f32> = vec3<f32>(0.0);
var transmittance: f32 = 1.0;

if (rawDepth >= 1.0) {
    // [Infinite Distance - Background]
    // 배경은 SkyAtmosphereBackground에 의해 기초 산란광이 이미 그려져 있습니다.
    // 여기서는 추가적인 효과(Mie Glow, Sun Disk)를 위한 투과율 정보만 가져옵니다.
    let skyUV = getSkyViewUV(viewDir, mappingH, groundRadius, atmosphereHeight);
    let skySample = textureSampleLevel(skyViewLUT, skyAtmosphereSampler, skyUV, 0.0);
    
    // 기초 산란광(skySample.rgb)은 이미 sceneColor에 포함되어 있으므로 scattering에는 더하지 않습니다.
    transmittance = skySample.a;
} else {
    // [Object Region - Aerial Perspective]
    let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
    let actualDist = depthKm * rayLengthRatio;
    let maxApDist = uniforms.aerialPerspectiveDistanceScale; 
    let apDist = clamp(actualDist - uniforms.aerialPerspectiveStartDepth, 0.0, maxApDist);

    let apU = uv.x;
    let apV = uv.y;
    let apW = clamp(sqrt(apDist / maxApDist), 0.0, 1.0);

    var apSample = textureSampleLevel(aerialPerspectiveLUT, skyAtmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

    // 근거리 보정 (Near Field Correction)
    if (actualDist < NEAR_FIELD_CORRECTION_DIST) { 
        let d = getAtmosphereDensities(mappingH, uniforms);
        let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, mappingH, sunDir.y, atmosphereHeight);
        let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyLuminanceFactor;
        let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyLuminanceFactor;
        let phaseR = phaseRayleigh(viewSunCos);
        let phaseM = phaseMie(viewSunCos, uniforms.mieAnisotropy);
        let localScat = (scatR * phaseR + vec3<f32>(scatM * phaseM)) * sunTrans;
        let localExt = scatR + vec3<f32>((uniforms.mieScattering + uniforms.mieAbsorption) * d.rhoM * uniforms.skyLuminanceFactor) + uniforms.absorptionCoefficient * d.rhoO;
        let analyticalScat = localScat * actualDist;
        let analyticalTrans = exp(-localExt * actualDist);
        let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) / 3.0;
        let blend = smoothstep(0.0, NEAR_FIELD_CORRECTION_DIST, actualDist);
        apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, blend);
    }
    
    scattering = apSample.rgb;
    transmittance = apSample.a;
}

// Mie Glow 및 Sun Disk 처리
let camPos = vec3<f32>(0.0, mappingH + groundRadius, 0.0);
let sunShadow = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);
let mieGlow = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, skyAtmosphereSampler, vec3<f32>(transmittance), 0.0);

var sunDisk = vec3<f32>(0.0);
if (rawDepth >= 1.0 && sunShadow > 0.0) {
    sunDisk = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, vec3<f32>(transmittance), 0.01, uniforms);
}

// 최종 산란광 (Post-process specific effects)
let postScattering = (scattering + (mieGlow + sunDisk) * sunShadow) * uniforms.sunIntensity * systemUniforms.preExposure;

// 최종 색상 합성
// 배경일 경우 sceneColor(기초 산란광 포함)에 postScattering(Glow, Sun)만 더해집니다.
// 오브젝트일 경우 sceneColor를 감쇠시키고 scattering을 포함한 postScattering이 적용됩니다.
let finalColor = sceneColor * saturate(transmittance) + postScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
