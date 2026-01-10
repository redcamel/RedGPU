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

@group(0) @binding(0) var environmentTexture: texture_cube<f32>;
@group(0) @binding(1) var environmentSampler: sampler;
@group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

const PI = 3.14159265359;

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    // NDC 좌표 (x, y)를 -1 ~ 1 범위로 변환 (generateCubeMapFromEquirectangular와 동일)
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = input.texCoord.y * 2.0 - 1.0;

    // 큐브면에서의 로컬 방향 벡터에 면 행렬을 곱함
    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let normal = normalize((faceMatrix * localPos).xyz);

    var irradiance = vec3<f32>(0.0);

    // 탄젠트 공간 구성 - normal과 평행하지 않은 up 벡터 선택
    var up = vec3<f32>(0.0, 1.0, 0.0);
    if (abs(normal.y) > 0.999) {
        up = vec3<f32>(1.0, 0.0, 0.0);
    }
    let tangent = normalize(cross(up, normal));
    let bitangent = normalize(cross(normal, tangent));

    // 적분 샘플링
    let sampleCount = 32u;
    let invSampleCount = 1.0 / f32(sampleCount);

    for (var i = 0u; i < sampleCount; i++) {
        for (var j = 0u; j < sampleCount; j++) {
            let u1 = (f32(i) + 0.5) * invSampleCount;
            let u2 = (f32(j) + 0.5) * invSampleCount;

            let cosTheta = sqrt(u1);
            let sinTheta = sqrt(1.0 - u1);
            let phi = 2.0 * PI * u2;

            let cosPhi = cos(phi);
            let sinPhi = sin(phi);

            let sampleVec = vec3<f32>(
                sinTheta * cosPhi,
                sinTheta * sinPhi,
                cosTheta
            );

            let worldSample = sampleVec.x * tangent +
                            sampleVec.y * bitangent +
                            sampleVec.z * normal;

            let sampleColor = textureSample(environmentTexture, environmentSampler, worldSample);
            irradiance += sampleColor.rgb * cosTheta;
        }
    }

    irradiance = irradiance * PI * invSampleCount * invSampleCount;

    return vec4<f32>(irradiance, 1.0);
}
