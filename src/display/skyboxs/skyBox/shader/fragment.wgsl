#redgpu_include FragmentOutput
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

    let u = (phi + 3.14159265359) / (2.0 * 3.14159265359);
    let v = theta / 3.14159265359;

    return vec2<f32>(u, v);
}


@fragment
fn main(inputData: InputData) -> FragmentOutput {
    var cubemapVec = inputData.vertexPosition.xyz - vec3<f32>(0.5);
    let mipmapCount: f32 = f32(textureNumLevels(skyboxTexture) - 1);
    let blurCurve = uniforms.blur * uniforms.blur; // 제곱 곡선
    let skyboxColor = textureSampleLevel(skyboxTexture, skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve);
    var sampleColor = skyboxColor;
    let u_transitionProgress = uniforms.transitionProgress;

    if (u_transitionProgress > 0.0) {
        let transitionSample = textureSampleLevel(transitionTexture, skyboxTextureSampler, cubemapVec, mipmapCount * blurCurve);

        #redgpu_if transitionAlphaTexture
            // 큐브맵 벡터를 2D UV 좌표로 변환
            let uv = sphericalToUV(normalize(cubemapVec));
            // transitionAlphaTexture 샘플링
            let transitionAlphaSample = textureSampleLevel(transitionAlphaTexture, skyboxTextureSampler, uv, 0.0);
            let transitionAlphaValue = dot(transitionAlphaSample.rgb, vec3<f32>(0.299, 0.587, 0.114));
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

    var outColor = vec4<f32>(sampleColor.rgb, sampleColor.a * uniforms.opacity);
    if (outColor.a == 0.0) {
        discard;
    }
    var output: FragmentOutput;
    output.color = outColor;

    return output;
}
