#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

struct WaterUniforms {
    debugMode: u32,         // 0u: Soft Surface, 1u: Raw, 2u: Linear Scene, 3u: Linear Water, 4u: Delta Depth, 5u: Fade Mask, 6u: Scene Passthrough
    debugMaxDepth: f32,     // 수심 마스크 정규화 기준 거리 (1.0m ~ 30.0m)
    depthFadeDistance: f32, // 해안선 소프트 페이드 거리 (단위: m, 기본값: 1.0m)
    opacity: f32,           // 수면 기본 불투명도 (0.0 ~ 1.0, 기본값: 0.85)
};

@group(2) @binding(0) var<uniform> uniforms: WaterUniforms;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let pixelCoord = vec2<i32>(inputData.position.xy);
    let cameraNear = systemUniforms.camera.nearClipping;
    let cameraFar = systemUniforms.camera.farClipping;

    // 1. 2Path 바닥 씬 원시 깊이 버퍼 [0, 1] 샘플링
    let rawSceneDepth = textureLoad(renderPath1DepthTexture, pixelCoord, 0);

    // 2. 바닥 씬의 카메라 뷰공간 선형 거리 (Linear View-Z, 단위: m)
    let linearSceneDepth = getLinearizeDepth(rawSceneDepth, cameraNear, cameraFar);

    // 3. 물 표면 프래그먼트의 카메라 뷰공간 선형 거리 (Linear View-Z, 단위: m)
    let rawWaterDepth = inputData.position.z;
    let linearWaterDepth = getLinearizeDepth(rawWaterDepth, cameraNear, cameraFar);

    // 4. 수면과 물밑 지형 간의 물리적 수심 차이 (Delta Depth = Scene Z - Water Z)
    let deltaDepth = max(0.0, linearSceneDepth - linearWaterDepth);

    // 5. Phase 4: 언리얼 표준 Depth Fade 가중치 계산 (0.0: 물가 경계면 -> 1.0: 깊은 물)
    let fadeDist = max(0.001, uniforms.depthFadeDistance);
    let depthFade = clamp(deltaDepth / fadeDist, 0.0, 1.0);

    // 6. Phase 5: 스크린 UV 기반 2Path 바닥 씬 컬러 (Scene Passthrough) 샘플링
    let screenUV = inputData.position.xy / systemUniforms.resolution;
    let sceneColor = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, screenUV, 0.0).rgb;

    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
        case 6u: {
            // Step 5.2: Scene Color Passthrough (투명 유리처럼 순수 바닥 씬 컬러 100% 무왜곡 투과)
            output.color = vec4<f32>(sceneColor, 1.0);
        }
        case 5u: {
            // Step 4.2: Depth Fade 가중치 마스크 (0.0 검은색 -> 1.0 흰색)
            output.color = vec4<f32>(vec3<f32>(depthFade), 1.0);
        }
        case 4u: {
            // Step 3.4: Delta Depth 수심 마스크
            let mask = clamp(deltaDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(mask), 1.0);
        }
        case 3u: {
            // Step 3.2: 물 표면 선형 거리
            let waterZ = clamp(linearWaterDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(waterZ), 1.0);
        }
        case 2u: {
            // Step 3.3: 바닥 지형 선형 거리
            let sceneZ = clamp(linearSceneDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(sceneZ), 1.0);
        }
        case 1u: {
            // Step 2: 비선형 원시 깊이 (Raw Depth)
            output.color = vec4<f32>(vec3<f32>(rawSceneDepth), 1.0);
        }
        default: {
            // Step 5.3: 바닥 투과광(sceneColor)과 소프트 수면 틴트(Soft Water Tint)의 유기적 결합
            // 물가(depthFade -> 0)에서는 바닥 지형이 100% 투명하게 드러나 칼단면이 완전히 소멸하고,
            // 수심이 깊어질수록 opacity와 수면 색상이 점진적으로 결합됩니다.
            let surfaceTint = vec3<f32>(1.0, 0.0, 1.0);
            let surfaceAlpha = clamp(uniforms.opacity * depthFade, 0.0, 1.0);
            let finalRgb = mix(sceneColor, surfaceTint, surfaceAlpha);
            output.color = vec4<f32>(finalRgb, 1.0);
        }
    }

    return output;
}
