let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let rawDepth = fetchDepth(id);

// [Strict Separation] 무한 거리(배경)는 처리를 건너뜀
// 배경은 SkyAtmosphereBackground에 의해 이미 그려져 있음
if (rawDepth >= 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpacePos = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let rayLengthRatio = length(viewSpacePos); 

let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpacePos);

let sunDir = normalize(uniforms.sunDirection);
let viewSunCos = dot(viewDir, sunDir);
let mappingH = max(0.0, viewHeight);

// 오브젝트 영역 Aerial Perspective 적용
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
    let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);

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

// Mie Glow 및 그림자 처리
let camPos = vec3<f32>(0.0, mappingH + groundRadius, 0.0);
let sunShadow = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);
let mieGlow = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, skyAtmosphereSampler, vec3<f32>(apSample.a), 0.0);

let finalScattering = (apSample.rgb + mieGlow * sunShadow) * uniforms.sunIntensity * systemUniforms.preExposure;
let finalColor = sceneColor * saturate(apSample.a) + finalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
