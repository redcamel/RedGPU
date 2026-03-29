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

@group(2) @binding(0) var bg_transmittanceLUT : texture_2d<f32>;
@group(2) @binding(1) var bg_skyViewLUT : texture_2d<f32>;
@group(2) @binding(2) var bg_skyAtmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let groundRadius = uniforms.groundRadius;
    let atmosphereHeight = uniforms.atmosphereHeight;
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);

    var viewHeight = uniforms.cameraHeight;
    viewHeight = max(0.0, viewHeight);
    let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius, atmosphereHeight);
    let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
    
    // [KO] skySample.rgb는 이제 단위 광휘(Unit Radiance)를 저장하므로 sunIntensity와 preExposure를 모두 곱해줍니다.
    // [EN] skySample.rgb now stores Unit Radiance, so multiply by both sunIntensity and preExposure
    let exposedSunIntensity = uniforms.sunIntensity * systemUniforms.preExposure;
    var atmosphereBackground = skySample.rgb * exposedSunIntensity;

    let camPos = vec3<f32>(0.0, groundRadius + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, groundRadius);
    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);

    let isGroundHit = uniforms.groundRadius > 0.0 && tEarth > 0.0;
    let transToEdge = select(getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, viewHeight, viewDir.y, uniforms.atmosphereHeight), vec3<f32>(skySample.a), isGroundHit);

    // [KO] Mie Glow 및 Sun Disk는 단위 휘도를 반환하므로 exposedSunIntensity를 곱해줌
    let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, viewHeight, uniforms, bg_transmittanceLUT, bg_skyAtmosphereSampler, transToEdge, 0.9) 
                        * exposedSunIntensity;
    atmosphereBackground += mieGlowAmount;

    if (tEarth <= 0.0 || uniforms.groundRadius <= 0.0) {
        let sunRadiance = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, transToEdge, 0.01, uniforms)
                        * exposedSunIntensity;
        atmosphereBackground += sunRadiance;
    }
    
    var output : FragmentOutput;
    output.color = vec4<f32>(atmosphereBackground, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
