#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

struct WaterUniforms {
    baseColor: vec3<f32>,
    opacity: f32,

    deepColor: vec3<f32>,
    extinctionFactor: f32,

    debugMode: u32,
    debugMaxDepth: f32,
    depthFadeDistance: f32,
    padding: f32,
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

    // 7. Phase 6: 비어-람베르트(Beer-Lambert) 수심 광학 및 이중 알베도 계산
    // 빛이 수심을 통과하며 거리에 따라 지수적으로 감쇄하는 물리적 투과율 (1.0: 얕은 물가 -> 0.0: 깊은 수심)
    let extinction = exp(-deltaDepth * uniforms.extinctionFactor);

    // 수심에 따른 물 고유의 광학 알베도 (Water Optical Albedo)
    // 얕은 물(baseColor, 에메랄드 그린)에서 깊은 수심(deepColor, 짙은 사파이어 블루)으로 점진적 전이
    let waterAlbedo = mix(uniforms.baseColor, uniforms.deepColor, 1.0 - extinction);

    // 수체 유효 흡수 강도 (Absorption Strength)
    let absorptionStrength = clamp((1.0 - extinction) * uniforms.opacity, 0.0, 1.0);

    // 8. 복사 전달 방정식(RTE) 기반 바닥 투과광(sceneColor)과 수체 체적 색상의 물리적 결합
    let waterCompositeColor = mix(sceneColor, waterAlbedo, absorptionStrength);

    // 9. 해안선 소프트 페이드(depthFade)를 결합하여 물가 칼단면 소멸 및 바닥과의 완벽한 융합
    let finalRgb = mix(sceneColor, waterCompositeColor, depthFade);

    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    switch (uniforms.debugMode) {
        case 8u: {
            // Step 6.6: 수심별 물 고유 알베도 (Water Optical Albedo 단독 뷰)
            output.color = vec4<f32>(waterAlbedo, 1.0);
        }
        case 7u: {
            // Step 6.4: 비어-람베르트 광학 흡수 마스크 (0.0: 얕은 물가 투과 -> 1.0: 깊은 물 완전 흡수)
            output.color = vec4<f32>(vec3<f32>(1.0 - extinction), 1.0);
        }
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
            // Step 6.5: 비어-람베르트 법칙 기반 정통 PBR 수체 물리 렌더링
            output.color = vec4<f32>(finalRgb, 1.0);
        }
    }

    return output;
}
