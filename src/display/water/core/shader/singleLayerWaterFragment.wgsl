#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

struct WaterUniforms {
    debugMode: u32,     // 0u: Solid Pink, 1u: Raw Depth, 2u: Linear Scene, 3u: Linear Water, 4u: Delta Depth
    debugMaxDepth: f32, // 수심 마스크 정규화 기준 거리 (1.0m ~ 30.0m)
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

    let maxDepth = max(0.001, uniforms.debugMaxDepth);

    // u32 정수 분기 switch 문 처리
    switch (uniforms.debugMode) {
        case 4u: {
            // Delta Depth 수심 마스크 (물가는 0.0 검은색, 깊어질수록 1.0 흰색)
            let mask = clamp(deltaDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(mask), 1.0);
        }
        case 3u: {
            // Linear Water Depth (물 표면 선형 거리)
            let waterZ = clamp(linearWaterDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(waterZ), 1.0);
        }
        case 2u: {
            // Linear Scene Depth (바닥 지형 선형 거리)
            let sceneZ = clamp(linearSceneDepth / maxDepth, 0.0, 1.0);
            output.color = vec4<f32>(vec3<f32>(sceneZ), 1.0);
        }
        case 1u: {
            // Raw Scene Depth (비선형 원시 뎁스)
            output.color = vec4<f32>(vec3<f32>(rawSceneDepth), 1.0);
        }
        default: {
            // Solid Pink (기본 단색)
            output.color = vec4<f32>(1.0, 0.0, 1.0, 1.0);
        }
    }

    return output;
}
