let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
// [KO] 전경 색상과 알파 채널을 읽어옵니다. (이미 블렌딩이 완료된 상태로 가정)
// [EN] Read foreground color and alpha channel. (Assuming blending is already completed)
let sceneSample = textureLoad(sourceTexture, id, 0);
let sceneColor = sceneSample.rgb;
let sceneAlpha = sceneSample.a;

// 1. 시선 방향(viewDir) 및 카메라 정보 재구성
let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
var viewSpacePos = systemUniforms.inverseProjectionMatrix * vec4<f32>(ndc, 1.0, 1.0);
let viewSpaceDir = normalize(viewSpacePos.xyz / viewSpacePos.w);

let worldRotation = mat3x3<f32>(
    systemUniforms.camera.inverseCameraMatrix[0].xyz,
    systemUniforms.camera.inverseCameraMatrix[1].xyz,
    systemUniforms.camera.inverseCameraMatrix[2].xyz
);
let viewDir = normalize(worldRotation * viewSpaceDir);
let camForward = normalize(worldRotation * vec3<f32>(0.0, 0.0, -1.0));

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// 2. 대기 배경 연산 (모든 영역에 대해 배경 베이스를 구합니다)
var atmosphereBackground: vec3<f32>;
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

if (t_earth > 0.0) {
    // 가상 지면 영역
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
    let albedo = uniforms.groundAlbedo / PI;
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    atmosphereBackground = (diffuse * skySample.a) + (skySample.rgb * uniforms.sunIntensity);
} else {
    // 순수 하늘 영역
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    atmosphereBackground = skySample.rgb * uniforms.sunIntensity;
    
    // 태양 디스크 합성
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * (PI / 180.0);
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    let sun_trans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);
    atmosphereBackground += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
}

// 공통 지평선 연무 (Haze) 추가
let distFromHorizon = asin(clamp(viewDir.y, -1.0, 1.0)) - (asin(clamp(-sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH), -1.0, 1.0)));
let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));
let horizon_haze_mask = exp(-abs(distFromHorizon) * (15.0 / (haze_amount + 0.01)));
let skyUVForHaze = get_sky_view_uv(viewDir, camH, r, atmH);
let skySampleForHaze = textureSampleLevel(skyViewTexture, tSampler, skyUVForHaze, 0.0);
atmosphereBackground += (skySampleForHaze.rgb * uniforms.sunIntensity) * uniforms.horizonHaze * horizon_haze_mask * 0.2;

// 3. 최종 합성 (Pre-multiplied Alpha 대응)
// [KO] 하드웨어 블렌딩 설정(SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ADD)의 최종 논리적 결과를 재현합니다.
// [EN] Reproduces the final logical result of hardware blending settings (SRC_ALPHA, ONE_MINUS_SRC_ALPHA, ADD).
// Result = SrcColor + (DstColor * (1.0 - SrcAlpha))
let backColor = atmosphereBackground * uniforms.exposure;
let finalColor = sceneColor + (backColor * (1.0 - sceneAlpha));

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
