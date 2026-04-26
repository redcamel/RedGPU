#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var transmittanceLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let x = uv.x * 2.0 - 1.0;
    let cosTheta = sign(x) * x * x;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let T = exp(-min(getOpticalDepth(viewHeight, cosTheta), vec3<f32>(100.0)));
    textureStore(transmittanceLUT, global_id.xy, vec4<f32>(T, 1.0));
}

fn getOpticalDepth(viewHeight: f32, cosTheta: f32) -> vec3<f32> {
    let groundRadius = params.groundRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
    let rayDir = vec3<f32>(sinTheta, cosTheta, 0.0);

    let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
    if (tMax <= 0.0) { return vec3<f32>(0.0); }

    let tEarth = getRaySphereIntersection(rayOrigin, rayDir, groundRadius);
    if (groundRadius > 0.0 && tEarth > 0.0) {
        return vec3<f32>(MAX_TAU);
    }

    return integrateOpticalDepth(rayOrigin, rayDir, 0.0, tMax, TRANSMITTANCE_STEPS, params);
}