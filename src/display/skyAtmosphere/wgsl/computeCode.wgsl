/**
 * [KO] 스카이 애트모스피어(대기 산란) 효과를 위한 컴퓨팅 셰이더입니다. (Froxel AP 버전 - 거리 보정 및 근거리 보정 포함)
 * [EN] Compute shader for Sky Atmosphere (atmospheric scattering) effects. (Froxel AP version - with distance and near-field correction)
 */
let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let invP = systemUniforms.projection.inverseProjectionMatrix;
// [KO] Ray Length Ratio 계산: Z-depth를 실제 Ray 길이로 변환하기 위함
let viewSpacePos = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let rayLengthRatio = length(viewSpacePos); 

let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpacePos);

let rawDepth = fetchDepth(id);

// [KO] 배경 픽셀(이미 renderBackground에서 연산됨)인 경우 연산을 건너뜜
if (rawDepth >= 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

var mappingH: f32 = 0.0;
let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
// [KO] 수직 깊이(depthKm)를 레이 길이(actualDist)로 변환
let actualDist = depthKm * rayLengthRatio;
let maxApDist = uniforms.aerialPerspectiveDistanceScale; 

// [KO] 공중 투시 시작 깊이(Start Depth) 보정 적용
let apDist = clamp(actualDist - uniforms.aerialPerspectiveStartDepth, 0.0, maxApDist);

// [KO] Frustum-Aligned Froxel AP 샘플링 좌표 계산
let apU = uv.x;
let apV = uv.y;
let apW = clamp(sqrt(apDist / maxApDist), 0.0, 1.0);

// [KO] 3D LUT 샘플링
var apSample = textureSampleLevel(aerialPerspectiveLUT, skyAtmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

// [KO] 근거리 보정 (Analytical Approximation): 
// [KO] 3D LUT의 해상도 한계로 인한 근거리 아티팩트(0m에서도 안개가 끼는 현상) 방지
if (actualDist < NEAR_FIELD_CORRECTION_DIST) { 
    mappingH = max(0.0, viewHeight);
    let d = getAtmosphereDensities(mappingH, uniforms);
    let sunDir = normalize(uniforms.sunDirection);
    let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);

    // [KO] 물리적 기본 산란 및 소멸 계수 계산
    let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyLuminanceFactor;
    let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyLuminanceFactor;

    let phaseR = phaseRayleigh(dot(viewDir, sunDir));
    let phaseM = phaseMie(dot(viewDir, sunDir), uniforms.mieAnisotropy);

    let localScat = (scatR * phaseR + vec3<f32>(scatM * phaseM)) * sunTrans;
    let localExt = scatR + vec3<f32>((uniforms.mieScattering + uniforms.mieAbsorption) * d.rhoM * uniforms.skyLuminanceFactor) + uniforms.absorptionCoefficient * d.rhoO;

    // [KO] 선형 근사 및 LUT와 부드럽게 블렌딩
    let analyticalScat = localScat * actualDist;
    let analyticalTrans = exp(-localExt * actualDist);
    let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) / 3.0;

    let blend = smoothstep(0.0, NEAR_FIELD_CORRECTION_DIST, actualDist);
    apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, blend);
}

// [KO] 하이브리드 Mie Glow (AP)
let sunDir = normalize(uniforms.sunDirection);
let viewSunCos = dot(viewDir, sunDir);
mappingH = max(0.0, viewHeight);
var mieGlowUnit = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, skyAtmosphereSampler, vec3<f32>(apSample.a), 0.0);

// [KO] 물리적 오클루전
let camPos = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
let occlusionFactor = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);
mieGlowUnit *= occlusionFactor;

// [KO] 최종 산란광 및 색상 결정
// [KO] apSample.rgb는 이제 단위 광휘(Unit Radiance)를 저장하므로 sunIntensity를 곱해줍니다.
let finalScattering = (apSample.rgb + mieGlowUnit) * uniforms.sunIntensity * systemUniforms.preExposure;
let finalColor = sceneColor * saturate(apSample.a) + finalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
