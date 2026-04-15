#redgpu_include SYSTEM_UNIFORM
#redgpu_include systemStruct.OutputFragment
#redgpu_include color.getLuminance
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include skyAtmosphere.skyAtmosphereFn

struct Uniforms {
    opacity: f32,
    blur: f32,
    transitionProgress: f32,
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var skyboxTextureSampler: sampler;
@group(2) @binding(2) var skyboxTexture: texture_cube<f32>;
@group(2) @binding(3) var transitionTexture: texture_cube<f32>;
@group(2) @binding(4) var transitionAlphaTexture: texture_2d<f32>;

struct InputData {
    @location(0) vertexPosition: vec4<f32>,
};

// 🌐 큐브맵 방향 벡터를 구면 UV 좌표로 변환하는 함수
fn sphericalToUV(dir: vec3<f32>) -> vec2<f32> {
    let normalizedDir = normalize(dir);
    let phi = atan2(normalizedDir.z, normalizedDir.x);
    let theta = acos(clamp(normalizedDir.y, -1.0, 1.0));

    let u = (phi + PI) / PI2;
    let v = theta * INV_PI;

    return vec2<f32>(u, v);
}


@fragment
fn main(inputData: InputData) -> OutputFragment {
    var cubemapVec = (inputData.vertexPosition.xyz);
    let viewDir = normalize(cubemapVec);
    let mipmapCount: f32 = f32(textureNumLevels(skyboxTexture) - 1);
    let blurCurve = uniforms.blur * uniforms.blur; // 제곱 곡선
    let skyboxColor = textureSampleLevel(skyboxTexture, skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve);
    var sampleColor = skyboxColor;
    let u_transitionProgress = uniforms.transitionProgress;

    if (u_transitionProgress > 0.0) {
        let transitionSample = textureSampleLevel(transitionTexture, skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve);

        #redgpu_if transitionAlphaTexture
            // 큐브맵 벡터를 2D UV 좌표로 변환
            let uv = sphericalToUV(viewDir);
            // transitionAlphaTexture 샘플링
            let transitionAlphaSample = textureSampleLevel(transitionAlphaTexture, skyboxTextureSampler, uv, 0.0);
            let transitionAlphaValue = getLuminance(transitionAlphaSample.rgb);
            // 노이즈 기반 트랜지션 마스크 생성
            let threshold = u_transitionProgress;
            let noiseInfluence = 0.3;
            let edgeSoftness = 0.1;
            let maskValue = smoothstep(
                threshold - edgeSoftness,
                threshold + edgeSoftness,
                transitionAlphaValue + (u_transitionProgress - 0.5) * noiseInfluence
            );
            sampleColor = mix(transitionSample, skyboxColor, maskValue * (1.0 - u_transitionProgress));
        #redgpu_else
            sampleColor = mix(skyboxColor, transitionSample, u_transitionProgress);
        #redgpu_endIf
    }

    // [KO] 강도 및 노출 보정 (머티리얼 강도 * 직사광 강도 * Pre-Exposure)
    // [EN] Intensity and Exposure Correction (Material Intensity * Directional Light Intensity * Pre-Exposure)
    var finalIntensity: f32 = systemUniforms.preExposure;
    if (systemUniforms.directionalLightCount > 0u) {
        finalIntensity *= systemUniforms.directionalLights[0].intensity;
    }

    var finalAlpha = sampleColor.a * uniforms.opacity;

    // [KO] 대기가 활성화된 경우 투과율을 알파에 반영 (우주는 대기 너머에 있음)
    // [EN] If atmosphere is enabled, reflect transmittance in alpha (Space is beyond the atmosphere)
    if (systemUniforms.useSkyAtmosphere == 1u) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let transmittance = getTransmittance(
            transmittanceTexture,
            atmosphereSampler,
            u_atmo.cameraHeight,
            viewDir.y,
            u_atmo.atmosphereHeight
        );
        // RGB 투과율의 평균을 사용하여 배경의 가시성 결정
        let T = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
        finalAlpha *= T;
        finalIntensity = systemUniforms.preExposure;
    }

    var outColor = vec4<f32>(sampleColor.rgb * finalIntensity , finalAlpha);
    if (outColor.a == 0.0) {
        discard;
    }
    
    var output: OutputFragment;
    output.color = outColor;
    output.gBufferNormal = vec4<f32>(0.0);
    output.gBufferMotionVector = vec4<f32>(0.0);

    return output;
}
