#redgpu_include math.PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

struct FragmentOutput {
    @location(0) color : vec4<f32>,
    @location(1) normal : vec4<f32>,
    @location(2) motionVector : vec4<f32>,
};

@group(2) @binding(0) var bg_atmosphereTransmittanceTexture : texture_2d<f32>;
@group(2) @binding(1) var bg_atmosphereSkyViewTexture : texture_2d<f32>;
@group(2) @binding(2) var bg_atmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let camH = uniforms.cameraHeight;
    let r = uniforms.earthRadius;
    let atmH = uniforms.atmosphereHeight;
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);

    // [KO] 매핑 안정화를 위한 클램핑 고도 (Sea Level Offset 반영된 camH 기준)
    let mappingH = max(0.0, camH);
    let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(bg_atmosphereSkyViewTexture, bg_atmosphereSampler, skyUV, 0.0);
    var atmosphereBackground = skySample.rgb * uniforms.sunIntensity;

    let camPos = vec3<f32>(0.0, r + camH, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);
    
    if (uniforms.useGround < 0.5 || tEarth <= 0.0 || uniforms.showGround < 0.5) {
        let viewSunCos = dot(viewDir, sunDir);
        let sunRad = uniforms.sunSize * DEG_TO_RAD;
        let sunMask = smoothstep(cos(sunRad) - 0.001, cos(sunRad), viewSunCos);
        let sunTrans = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);
        atmosphereBackground += sunMask * sunTrans * uniforms.sunIntensity;
    }
    
    var output : FragmentOutput;
    output.color = vec4<f32>(atmosphereBackground, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
