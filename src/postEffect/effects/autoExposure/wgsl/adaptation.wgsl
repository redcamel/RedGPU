struct AutoExposureUniforms {
    speed: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    targetLuminance: f32
};

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var<storage, read_write> adaptedLuminance : f32;
@group(1) @binding(1) var<uniform> uniforms : AutoExposureUniforms;

var<workgroup> sharedLum: array<f32, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(local_invocation_index) local_index: u32,
    @builtin(global_invocation_id) global_id: vec3<u32>
) {
    let size = textureDimensions(sourceTexture);
    var lum: f32 = 0.0;
    if (global_id.x < size.x && global_id.y < size.y) {
        lum = textureLoad(sourceTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), 0).r;
    }
    
    sharedLum[local_index] = lum;
    workgroupBarrier();
    
    // Simple reduction
    for (var i = 128u; i > 0u; i = i >> 1u) {
        if (local_index < i) {
            sharedLum[local_index] += sharedLum[local_index + i];
        }
        workgroupBarrier();
    }
    
    if (local_index == 0u) {
        let avgLogLum = sharedLum[0] / 256.0;
        let currentLum = exp(avgLogLum);
        
        // Eye adaptation
        let prevLum = adaptedLuminance;
        let diff = currentLum - prevLum;
        let speedMult = select(uniforms.adjustmentSpeedDown, uniforms.adjustmentSpeedUp, diff > 0.0);
        
        adaptedLuminance = prevLum + diff * (1.0 - exp(-uniforms.speed * speedMult));
    }
}
