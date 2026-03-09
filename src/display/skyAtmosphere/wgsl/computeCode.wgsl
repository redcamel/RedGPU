/**
 * [KO] 스카이 애트모스피어(대기 산란) 효과를 위한 컴퓨팅 셰이더입니다.
 * [EN] Compute shader for Sky Atmosphere (atmospheric scattering) effects.
 */
let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpaceDir = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpaceDir);

let rawDepth = fetchDepth(id);

// [KO] 배경 픽셀(이미 renderBackground에서 연산됨)인 경우 연산을 건너뜁니다.
// [EN] Skip calculation if it is a background pixel (already calculated in renderBackground).
if (rawDepth >= 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
let maxApDist = uniforms.aerialPerspectiveMaxDistance; 
let apDist = clamp(depthKm, 0.0, maxApDist);

let azimuth = atan2(viewDir.z, viewDir.x);
let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
let apU = clamp((azimuth / PI2) + 0.5, 0.001, 0.999);
let apV = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let apW = clamp(sqrt(apDist / maxApDist), 0.001, 0.999);

// [KO] Aerial Perspective 3D LUT 샘플링 (단위 강도)
// [EN] Sample Aerial Perspective 3D LUT (Unit intensity)
var apSample = textureSampleLevel(atmosphereCameraVolumeTexture, atmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

// [KO] 근거리 보정 (Analytical Approximation): 
// [KO] 3D LUT의 해상도 한계로 인한 근거리 아티팩트를 방지하기 위해, 매우 가까운 거리는 직접 계산합니다.
// [EN] Near-field correction (Analytical Approximation):
// [EN] To prevent near-field artifacts due to the resolution limits of the 3D LUT, calculate very close distances directly.
let sunDir = normalize(uniforms.sunDirection);
let viewSunCos = dot(viewDir, sunDir);
let mappingH = max(0.0, camH);

// [KO] 임의의 페이드아웃(nearFade)을 제거하고 물리적 근사치로 대체
// [EN] Remove arbitrary fade-out (nearFade) and replace with physical approximation
if (apDist < 0.2) { // 200m 이내 [Within 200m]
    let d = getAtmosphereDensities(mappingH, uniforms);
    let sunTrans = getTransmittance(atmosphereTransmittanceTexture, atmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);

    let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyViewScatMult;
    let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyViewScatMult;
    let scatF = uniforms.heightFogDensity * d.rhoF * uniforms.skyViewScatMult;

    // [KO] 분석적 산란광 계산 (LUT에 포함된 Rayleigh + MieBase + FogBase)
    // [EN] Analytical scattering calculation (Rayleigh + MieBase + FogBase included in LUT)
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM_Base = phaseMie(viewSunCos, uniforms.mieAnisotropy) * (1.0 - uniforms.mieGlow);
    let phaseF = phaseMie(viewSunCos, uniforms.heightFogAnisotropy);

    let localScat = (scatR * phaseR + vec3<f32>(scatM * phaseM_Base + scatF * phaseF)) * sunTrans;
    let localExt = scatR + vec3<f32>(uniforms.mieExtinction * d.rhoM * uniforms.skyViewScatMult) + uniforms.ozoneAbsorption * d.rhoO + vec3<f32>(scatF);

    // [KO] 0~200m 구간에 대해 선형 근사 및 LUT와 부드럽게 블렌딩
    // [EN] Linear approximation for 0~200m segment and smooth blending with LUT
    let analyticalScat = localScat * apDist;
    let analyticalTrans = exp(-localExt * apDist);
    let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) / 3.0;

    let blend = smoothstep(0.0, 0.2, apDist);
    apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, blend);
}

// [KO] 하이브리드 Mie Glow (AP): 공중 투시 효과에도 날카로운 피크 합산
// [EN] Hybrid Mie Glow (AP): Add sharp peaks even to aerial perspective effects
var mieGlowUnit = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, atmosphereTransmittanceTexture, atmosphereSampler, vec3<f32>(apSample.a), 0.0);

// [KO] 물리적 오클루전 및 감쇄 (Physical Occlusion & Attenuation)
// [EN] Physical Occlusion & Attenuation
let camPos = vec3<f32>(0.0, camH + r, 0.0);

// 1. 행성 그림자 (Planet Shadow): 지구가 태양을 가리는 경우 Glow 제거
// 1. Planet Shadow: Remove Glow if the Earth blocks the sun
let planetShadow = getPlanetShadowMask(camPos, sunDir, r, uniforms);

// 2. 지면 방향 감쇄 (Nadir Attenuation): 물리적 산란 계산에 맡기고 인위적 감쇄 제거
// 2. Nadir Attenuation: Rely on physical scattering calculation and remove artificial attenuation
let occlusionFactor = planetShadow;

mieGlowUnit *= occlusionFactor;

// [KO] 최종 산란광 계산: LUT 샘플과 Mie Glow에 태양 강도 배율 적용
// [EN] Final scattering calculation: Apply sun intensity multiplier to LUT sample and Mie Glow
let finalScattering = (apSample.rgb + mieGlowUnit) * uniforms.sunIntensity;

// [KO] 최종 색상 결정: 씬 색상에 투과율을 곱하고 산란광을 더합니다.
// [EN] Determine final color: Multiply scene color by transmittance and add scattered light.
let finalColor = sceneColor * apSample.a + finalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
