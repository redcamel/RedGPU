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
let apU = (azimuth / PI2) + 0.5;
let apV = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let apW = clamp(sqrt(apDist / maxApDist), 0.0, 0.999);

// [KO] Aerial Perspective 3D LUT 샘플링 (단위 강도)
// [EN] Sample Aerial Perspective 3D LUT (Unit intensity)
var apSample = textureSampleLevel(atmosphereCameraVolumeTexture, atmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

// [KO] 하이브리드 Mie Glow (AP): 공중 투시 효과에도 날카로운 피크 합산
// [EN] Hybrid Mie Glow (AP): Add sharp peaks even to aerial perspective effects
let sunDir = normalize(uniforms.sunDirection);
let mappingH = max(0.0, camH);
let mieGlowUnit = getMieGlowAmountUnit(viewDir, sunDir, mappingH, uniforms, atmosphereTransmittanceTexture, atmosphereSampler, vec3<f32>(apSample.a));

// [KO] 근거리 보정: 아주 가까운 거리(약 50m 이내)에서는 LUT의 정밀도 한계로 인해 안개가 맺히는 현상이 있음.
// [KO] 이를 방지하기 위해 거리에 비례하여 효과를 페이드아웃 처리.
// [EN] Near-field correction: Due to LUT precision limits, fog may appear at very close distances.
// [EN] To prevent this, fade out the effect proportional to distance.
let nearFade = saturate(apDist * 20.0); // 0.05km(50m) 지점에서 1.0이 됨
apSample = vec4<f32>(apSample.rgb * nearFade, mix(1.0, apSample.a, nearFade));

// [KO] 최종 산란광 계산: LUT 샘플과 Mie Glow에 태양 강도 배율 적용
// [EN] Final scattering calculation: Apply sun intensity multiplier to LUT sample and Mie Glow
let finalScattering = (apSample.rgb + mieGlowUnit) * uniforms.sunIntensity;

// [KO] 최종 색상 결정: 씬 색상에 투과율을 곱하고 산란광을 더합니다.

// [EN] Determine final color: Multiply scene color by transmittance and add scattered light.
let finalColor = sceneColor * apSample.a + finalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
