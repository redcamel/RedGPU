// [KO] Irradiance 생성 컴퓨트 쉐이더
// [EN] Irradiance generation compute shader

@group(0) @binding(0) var environmentTexture: texture_cube<f32>;
@group(0) @binding(1) var environmentSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.tnb.getTBN
#redgpu_include math.hash.getHammersley

// Hammersley 시퀀스를 위한 비트 반전 함수 (표준 IBL 기법)


@compute @workgroup_size(8, 8, 1)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture);
    let size = vec2<f32>(size_u);
    
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    
    let x = uv.x * 2.0 - 1.0;
    let y = uv.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let normal = normalize((faceMatrices[face] * localPos).xyz);

    // [KO] 공통 라이브러리 math.getTBN을 사용하여 일관된 기저 생성
    // [EN] Create consistent basis using common library math.getTBN
    let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(normal.z) < 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let totalSamples = 1024u;

    // 원본 환경맵의 해상도
    let envSize = f32(textureDimensions(environmentTexture).x);
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize); // 텍셀당 입체각

    for (var i = 0u; i < totalSamples; i++) {
        let xi = getHammersley(i, totalSamples);

        // Cosine-weighted hemisphere sampling
        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);

        // PDF 계산: 코사인 가중치 샘플링의 경우 cosTheta / PI
        let pdf = max(cosTheta, 0.001) * INV_PI;

        let saSample = 1.0 / (f32(totalSamples) * pdf + 0.0001);
        let mipLevel = max(0.5 * log2(saSample / saTexel), 0.0);

        let sampleColor = textureSampleLevel(environmentTexture, environmentSampler, worldSample, mipLevel);

        irradiance += sampleColor.rgb;
        totalWeight += 1.0;
    }

    irradiance = irradiance / totalWeight;

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}