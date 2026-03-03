@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;
@group(0) @binding(5) var transmittanceTexture: texture_2d<f32>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outputTexture).xy;
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let clipPos = vec4<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, 1.0, 1.0);
    
    let worldPos = faceMatrices[face] * clipPos;
    var viewDir = normalize(worldPos.xyz);
    if (params.useGround < 0.5) { viewDir.y = abs(viewDir.y); }
    
    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    let rayOrigin = vec3<f32>(0.0, camH + r, 0.0);
    let tMax = getRaySphereIntersection(rayOrigin, viewDir, r + params.atmosphereHeight);
    let intersect = getPlanetIntersection(rayOrigin, viewDir, r);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (intersect.x > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, intersect.x, 16u, params, transmittanceTexture, atmosphereSampler, multiScatTexture, false, &radiance, &transmittance);
        if (params.useGround > 0.5) {
            let hitPos = rayOrigin + viewDir * intersect.x;
            let up = normalize(hitPos);
            let cosSun = dot(up, params.sunDirection);
            let sunTrans = getSunTransmittanceManual(hitPos, params.sunDirection, params);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosSun * 0.5 + 0.5, 1.0), 0.0).rgb;
            radiance += transmittance * (sunTrans * max(0.0, cosSun) + msEnergy + params.groundAmbient) * (params.groundAlbedo * INV_PI);
        }
    } else if (tMax > 0.0) {
        integrateScatSegment(rayOrigin, viewDir, 0.0, tMax, 32u, params, transmittanceTexture, atmosphereSampler, multiScatTexture, false, &radiance, &transmittance);
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
