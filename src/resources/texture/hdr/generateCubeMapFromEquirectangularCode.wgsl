struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
    );

    // WebGPU 큐브맵 렌더링을 위한 표준 UV (Top-Left 0,0 기반)
    var texCoord = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), vec2<f32>(1.0, 0.0)
    );


    var output: VertexOutput;
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoord[vertexIndex];
    return output;
}

struct SceneUniforms {
    faceMatrix: mat4x4<f32>,
    exposure: f32,
    _pad: vec3<f32>,
     _extra_pad: vec4<f32>,
}

@group(0) @binding(0) var equirectangularTexture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> uniforms: SceneUniforms;

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    // 1. NDC 좌표 (x, y)를 -1 ~ 1 범위로 변환
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = (input.texCoord.y * 2.0 - 1.0); // 상하 반전 여부에 따라 조정

    // 2. 큐브면에서의 로컬 방향 벡터 (x, y, 1.0)에 면 행렬을 곱함
    // 행렬이 정규 직교 행렬이므로 순수 방향만 추출
    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let worldDir = normalize((uniforms.faceMatrix * localPos).xyz);

    let PI: f32 = 3.14159265359;

    // 3. Equirectangular (Spherical) 매핑 계산
    // atan2(x, z)는 -PI ~ PI 범위를 가짐
    let theta = atan2(worldDir.x, worldDir.z);
    // acos(y)는 0 ~ PI 범위를 가짐
    let phi = acos(clamp(worldDir.y, -1.0, 1.0));

    let u = (theta / (2.0 * PI)) + 0.5;
    let v = phi / PI; // HDR 소스에 따라 1.0 - (phi/PI) 가 필요할 수 있음

    let color = textureSample(equirectangularTexture, textureSampler, vec2<f32>(u, v));

    return vec4<f32>(color.rgb * uniforms.exposure, color.a);
}