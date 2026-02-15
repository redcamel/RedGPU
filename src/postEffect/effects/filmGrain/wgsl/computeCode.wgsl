let index = vec2<i32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let originalColor = textureLoad(sourceTexture, index);

let filmGrainIntensity_value: f32 = uniforms.filmGrainIntensity;
let filmGrainResponse_value: f32 = uniforms.filmGrainResponse;
let filmGrainScale_value: f32 = uniforms.filmGrainScale;
let coloredGrain_value: f32 = uniforms.coloredGrain;
let grainSaturation_value: f32 = uniforms.grainSaturation;
let time_value: f32 = uniforms.time;

if (filmGrainIntensity_value <= 0.0) {
    textureStore(outputTexture, index, originalColor);
    return;
}

// 1. 입자 좌표계 (픽셀 단위 정밀 보정)
let baseScale = max(filmGrainScale_value, 0.1);
let grainCoord = floor(vec2<f32>(global_id.xy) / baseScale);

// 2. 시네마틱 입자 생성 ( -1.0 ~ 1.0 범위)
var grain = getFilmicGrain(grainCoord, time_value, coloredGrain_value);

// 3. 입자 채도 제어
let grainLum = get_luminance(grain);
grain = mix(vec3<f32>(grainLum), grain, grainSaturation_value);

// 4. 휘도 마스킹
let sceneLuminance = get_luminance(originalColor.rgb);
let responseMask = pow(1.0 - sceneLuminance, filmGrainResponse_value);
let finalMask = responseMask * smoothstep(0.0, 0.1, sceneLuminance);

// 5. 입자 강도 적용 및 합성
let intensity = filmGrainIntensity_value * max(0.05, finalMask);
let finalColor = originalColor.rgb + grain * intensity;

// 6. 결과 출력
let outputColor = vec4<f32>(saturate(finalColor), originalColor.a);
textureStore(outputTexture, index, outputColor);
