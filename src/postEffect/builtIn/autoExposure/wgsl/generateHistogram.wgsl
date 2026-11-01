@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var<storage, read_write> histogram : array<atomic<u32>, 256>;

const MIN_LUMINANCE: f32 = 0.0000001;

struct AutoExposureUniforms {
    deltaTime: f32,
    targetEV100Bias: f32,
    adjustmentSpeedUp: f32,
    adjustmentSpeedDown: f32,
    minPossibleEV100: f32,
    minEV100: f32,
    maxEV100: f32,
    ev100Range: f32,
    lowPercentile: f32,
    highPercentile: f32,
    invEv100Range: f32,
    width: f32,
    height: f32,
    invPreExposure: f32,
    meteringMode: f32,
    invHeight: f32
};
@group(1) @binding(1) var<uniform> uniforms : AutoExposureUniforms;

var<workgroup> localHistogram: array<atomic<u32>, 256>;

@compute @workgroup_size(16, 16, 1)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(local_invocation_index) local_index : u32
) {
    atomicStore(&localHistogram[local_index], 0u);
    workgroupBarrier();

    let coords = global_id.xy * 4u;
    if (coords.x < u32(uniforms.width) && coords.y < u32(uniforms.height)) {
        let texel = textureLoad(sourceTexture, vec2<i32>(coords), 0);
        
        if (texel.a > 0.0) {
            let color = texel.rgb;
            let brightness = max(color.r, max(color.g, color.b));
            let lum = brightness * uniforms.invPreExposure;
            
            if (lum > MIN_LUMINANCE) {
                let ev100 = log2(lum) + 3.0;
                let normalizedEV100 = saturate((ev100 - uniforms.minEV100) * uniforms.invEv100Range);
                let binIndex = u32(normalizedEV100 * 255.0);

                var weight = 1.0;
                if (uniforms.meteringMode > 0.5) {
                    let center = vec2<f32>(uniforms.width, uniforms.height) * 0.5;
                    let delta = (vec2<f32>(coords) - center) * uniforms.invHeight;
                    let dist = sqrt(dot(delta, delta));

                    if (uniforms.meteringMode < 1.5) {
                        let w = saturate(1.0 - dist);
                        weight = w * w;
                    } else {
                        let w = saturate(1.0 - dist * 4.0);
                        let w2 = w * w;
                        weight = w2 * w2;
                    }
                }

                atomicAdd(&localHistogram[binIndex], u32(weight * 100.0));
            }
        }
    }

    workgroupBarrier();

    let localCount = atomicLoad(&localHistogram[local_index]);
    if (localCount > 0u) {
        atomicAdd(&histogram[local_index], localCount);
    }
}
