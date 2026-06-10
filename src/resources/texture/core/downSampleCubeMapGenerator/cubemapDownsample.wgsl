// 유니폼 구조체
struct Uniforms {
    targetSize: f32,
    sourceMipLevel: f32,
    targetMipLevel: f32,
    padding: f32,
};

// 바인딩
@group(0) @binding(0) var sourceCubemap: texture_cube<f32>;
@group(0) @binding(1) var targetCubemap: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(2) var cubemapSampler: sampler;
@group(0) @binding(3) var<uniform> uniforms: Uniforms;

// 큐브맵 UV 좌표를 방향 벡터로 변환
fn cubemapUVToDirection(uv: vec2<f32>, face: u32) -> vec3<f32> {
    // UV를 [-1, 1] 범위로 변환
    let u = uv.x * 2.0 - 1.0;
    let v = uv.y * 2.0 - 1.0;

    // 각 큐브맵 면에 대한 방향 벡터 계산
    switch face {
        case 0u: {
            return vec3<f32>(1.0, -v, -u);   // +X (Right)
        }
        case 1u: {
            return vec3<f32>(-1.0, -v, u);   // -X (Left)
        }
        case 2u: {
            return vec3<f32>(u, 1.0, v);     // +Y (Top)
        }
        case 3u: {
            return vec3<f32>(u, -1.0, -v);   // -Y (Bottom)
        }
        case 4u: {
            return vec3<f32>(u, -v, 1.0);    // +Z (Front)
        }
        case 5u: {
            return vec3<f32>(-u, -v, -1.0);  // -Z (Back)
        }
        default: {
            return vec3<f32>(0.0, 0.0, 1.0);
        }
    }
}

// 고품질 가우시안 블러 가중치 계산
fn gaussianWeight(x: f32, y: f32, sigma: f32) -> f32 {
    let sigmaSq = sigma * sigma;
    return exp(-(x * x + y * y) / (2.0 * sigmaSq)) / (2.0 * PI * sigmaSq);
}

// 큐브맵 면 범위 내 UV 클램핑
fn clampCubemapUV(uv: vec2<f32>) -> vec2<f32> {
    return clamp(uv, vec2<f32>(0.0), vec2<f32>(1.0));
}

#redgpu_include color.getLuminance
#redgpu_include math.PI

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let face = global_id.z;
    let coord = vec2<u32>(global_id.xy);
    let targetSize = u32(uniforms.targetSize);

    // 범위 체크
    if (coord.x >= targetSize || coord.y >= targetSize || face >= 6u) {
        return;
    }

    // UV 좌표 계산 (픽셀 중심)
    let uv = (vec2<f32>(coord) + 0.5) / f32(targetSize);

    // 큐브맵 방향 벡터 계산
    let direction = normalize(cubemapUVToDirection(uv, face));

    // 밉맵 레벨 정보
    let sourceMipLevel = uniforms.sourceMipLevel;
    let targetMipLevel = uniforms.targetMipLevel;

    var color = vec4<f32>(0.0);

    // 다운샘플링 품질 레벨 결정
    if (sourceMipLevel == 0.0 && targetSize > 64u) {
        // 고해상도 → 고품질 다중 샘플링 (16개 샘플)
        let sampleCount = 16u;
        let sampleRadius = 1.0 / f32(targetSize);
        var totalWeight = 0.0;

        for (var i = 0u; i < sampleCount; i++) {
            // 원형 패턴으로 샘플링
            let angle = 2.0 * PI * f32(i) / f32(sampleCount);
            let radius = sampleRadius * (0.5 + 0.5 * f32(i % 4u) / 4.0);

            let offsetUV = clampCubemapUV(uv + vec2<f32>(
                cos(angle) * radius,
                sin(angle) * radius
            ));

            let sampleDir = normalize(cubemapUVToDirection(offsetUV, face));
            let sampleColor = textureSampleLevel(sourceCubemap, cubemapSampler, sampleDir, sourceMipLevel);

            // 가중치 적용 (중심에 더 많은 가중치)
            let weight = gaussianWeight(
                cos(angle) * radius * f32(targetSize),
                sin(angle) * radius * f32(targetSize),
                0.8
            );

            color += sampleColor * weight;
            totalWeight += weight;
        }

        // 정규화 (0으로 나누기 방지)
        if (totalWeight > 0.0) {
            color = color / totalWeight;
        }

    } else if (sourceMipLevel == 0.0 && targetSize > 16u) {
        // 중해상도 → 4x4 박스 필터
        let sampleCount = 4u;
        let invSampleCount = 1.0 / f32(sampleCount * sampleCount);
        let sampleOffset = 0.5 / f32(targetSize);

        for (var x = 0u; x < sampleCount; x++) {
            for (var y = 0u; y < sampleCount; y++) {
                let offset = vec2<f32>(
                    (f32(x) - 1.5) * sampleOffset,
                    (f32(y) - 1.5) * sampleOffset
                );

                let offsetUV = clampCubemapUV(uv + offset);
                let sampleDir = normalize(cubemapUVToDirection(offsetUV, face));

                color += textureSampleLevel(sourceCubemap, cubemapSampler, sampleDir, sourceMipLevel);
            }
        }

        color *= invSampleCount;

    } else if (targetSize > 4u) {
        // 저해상도 → 2x2 샘플링
        let sampleCount = 2u;
        let invSampleCount = 1.0 / f32(sampleCount * sampleCount);
        let sampleOffset = 0.25 / f32(targetSize);

        for (var x = 0u; x < sampleCount; x++) {
            for (var y = 0u; y < sampleCount; y++) {
                let offset = vec2<f32>(
                    (f32(x) - 0.5) * sampleOffset,
                    (f32(y) - 0.5) * sampleOffset
                );

                let offsetUV = clampCubemapUV(uv + offset);
                let sampleDir = normalize(cubemapUVToDirection(offsetUV, face));

                color += textureSampleLevel(sourceCubemap, cubemapSampler, sampleDir, sourceMipLevel);
            }
        }

        color *= invSampleCount;

    } else {
        // 초저해상도 → 단일 샘플링
        color = textureSampleLevel(sourceCubemap, cubemapSampler, direction, sourceMipLevel);
    }

    // 색상 보정 (높은 밉맵 레벨에서 채도 조정)
    if (targetMipLevel > 0.0) {
        let luminance = getLuminance(color.rgb);
        let saturation = 0.9 + 0.1 / (1.0 + targetMipLevel * 0.1);
        color = vec4<f32>(mix(vec3<f32>(luminance), color.rgb, saturation), color.a);
    }

    // 최종 색상 출력
    textureStore(targetCubemap, vec2<i32>(coord), i32(face), color);
}
