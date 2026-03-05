@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;
@group(0) @binding(5) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(6) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.INV_PI
#redgpu_include math.hash.getHash2D_vec2

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    let r = params.earthRadius;
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;
    let sunDir = params.sunDirection;
    let sunRad = params.sunSize * DEG_TO_RAD;

    // [KO] 태양의 입체각(Solid Angle) 계산 (작은 각도 근사: PI * theta^2)
    // [EN] Calculate sun's solid angle (Small angle approximation: PI * theta^2)
    let sunSolidAngle = PI * (sunRad * sunRad);
    // [KO] 태양 광도를 입체각으로 나누어 물리적으로 올바른 Radiance 스케일 도출
    // [EN] Derive physically correct Radiance scale by dividing sun intensity by solid angle
    // [KO] 여기서는 Unit intensity(1.0) 기준 스케일을 계산 (머티리얼에서 최종 강도 곱함)
    let sunRadianceScale = 1.0 / max(sunSolidAngle, 1e-6);

    var totalRadiance = vec3<f32>(0.0);
    let jitter = getHash2D_vec2(vec2<f32>(global_id.xy)) - 0.5;

    let numSamples = 4u;
    let invNumSamples = 1.0 / f32(numSamples);

    for (var sy = 0u; sy < numSamples; sy++) {
        for (var sx = 0u; sx < numSamples; sx++) {
            let offset = (vec2<f32>(f32(sx), f32(sy)) + 0.5 + jitter * 0.8) * invNumSamples - 0.5;
            let uv = (vec2<f32>(global_id.xy) + 0.5 + offset) / size;
            
            let x = uv.x * 2.0 - 1.0;
            let y = uv.y * 2.0 - 1.0;
            let localPos = vec4<f32>(x, y, 1.0, 1.0);
            let worldPos = faceMatrices[face] * localPos;
            let viewDir = normalize(worldPos.xyz);

            // 1. Sky-View LUT 샘플링
            let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
            var radiance = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;

            // 2. 지면 반사 보정
            if (params.useGround > 0.5 && viewDir.y < -0.001) {
                let tEarth = getRaySphereIntersection(vec3<f32>(0.0, r + camH, 0.0), viewDir, r);
                if (tEarth > 0.0) {
                    let hitP = vec3<f32>(0.0, r + camH, 0.0) + viewDir * tEarth;
                    let hitNormal = normalize(hitP);
                    let cosS = dot(hitNormal, sunDir);
                    let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosS, atmH);
                    let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosS * 0.5 + 0.5, 1.0), 0.0).rgb;
                    radiance = (sunT * max(0.0, cosS) + msEnergy * PI + params.groundAmbient) * (params.groundAlbedo * INV_PI);
                }
            }

            // 3. 태양 디스크 (물리적 Radiance 반영)
            let viewSunCos = dot(viewDir, sunDir);
            let sunMask = smoothstep(cos(sunRad + 0.006), cos(sunRad), viewSunCos);
            
            if (sunMask > 0.0) {
                let planetShadow = select(1.0, 0.0, params.useGround > 0.5 && sunDir.y < -0.01);
                if (planetShadow > 0.0) {
                    let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
                    // [KO] 분석적 모델과의 일관성을 위해 물리적 스케일 적용
                    radiance += sunMask * sunTrans * sunRadianceScale;
                }
            }
            
            totalRadiance += radiance;
        }
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(totalRadiance / f32(numSamples * numSamples), 1.0));
}
