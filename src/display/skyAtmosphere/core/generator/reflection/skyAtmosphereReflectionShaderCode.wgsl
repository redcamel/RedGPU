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

    var totalRadiance = vec3<f32>(0.0);
    
    // [KO] 2x2 슈퍼샘플링으로 태양 주변의 얼룩(Artifacts) 제거
    // [EN] 2x2 Supersampling to remove artifacts around the sun
    let offsets = array<vec2<f32>, 4>(
        vec2<f32>(-0.25, -0.25), vec2<f32>(0.25, -0.25),
        vec2<f32>(-0.25, 0.25), vec2<f32>(0.25, 0.25)
    );

    for (var i = 0u; i < 4u; i = i + 1u) {
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offsets[i]) / size;
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
                let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, camH, cosS, atmH);
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosS * 0.5 + 0.5, 1.0 - clamp(camH / atmH, 0.0, 1.0)), 0.0).rgb;
                radiance = (sunT * max(0.0, cosS) + msEnergy * PI + params.groundAmbient) * (params.groundAlbedo * INV_PI);
            }
        }

        // 3. 태양 디스크 (부드러운 경계)
        let viewSunCos = dot(viewDir, sunDir);
        let sunMask = smoothstep(cos(sunRad + 0.003), cos(sunRad), viewSunCos);
        if (sunMask > 0.0) {
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
            radiance += sunMask * sunTrans;
        }
        
        totalRadiance += radiance;
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(totalRadiance * 0.25, 1.0));
}
