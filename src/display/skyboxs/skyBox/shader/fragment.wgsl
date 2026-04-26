#redgpu_include SYSTEM_UNIFORM
#redgpu_include systemStruct.OutputFragment
#redgpu_include color.getLuminance
#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include skyAtmosphere.skyAtmosphereFn

struct Uniforms {
    blur: f32,
    intensityMultiplier: f32,
    luminance: f32,
    averageLuminance: f32,
    opacity: f32,
    transitionProgress: f32,
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var sampler0: sampler;
@group(2) @binding(2) var texture0: texture_cube<f32>;
@group(2) @binding(3) var transitionTexture: texture_cube<f32>;
@group(2) @binding(4) var transitionMask: texture_2d<f32>;

struct InputData {
    @location(0) vertexPosition: vec4<f32>,
};

fn sphericalToUV(dir: vec3<f32>) -> vec2<f32> {
    let normalizedDir = normalize(dir);
    let phi = atan2(normalizedDir.z, normalizedDir.x);
    let theta = acos(clamp(normalizedDir.y, -1.0, 1.0));
    return vec2<f32>((phi + PI) / PI2, theta * INV_PI);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var cubemapVec = inputData.vertexPosition.xyz;
    let viewDir = normalize(cubemapVec);
    let mipmapCount = f32(textureNumLevels(texture0) - 1);
    let blurCurve = uniforms.blur * uniforms.blur;
    
    let skyboxColor = textureSampleLevel(texture0, sampler0, cubemapVec, mipmapCount * blurCurve);
    var sampleColor = skyboxColor;
    let u_transitionProgress = uniforms.transitionProgress;

    if (u_transitionProgress > 0.0) {
        let transitionSample = textureSampleLevel(transitionTexture, sampler0, cubemapVec, mipmapCount * blurCurve);
        #redgpu_if transitionMask
            let uv = sphericalToUV(viewDir);
            let maskSample = textureSampleLevel(transitionMask, sampler0, uv, 0.0);
            let maskValue = getLuminance(maskSample.rgb);
            let threshold = u_transitionProgress;
            let mask = smoothstep(threshold - 0.1, threshold + 0.1, maskValue + (u_transitionProgress - 0.5) * 0.3);
            sampleColor = mix(transitionSample, skyboxColor, mask * (1.0 - u_transitionProgress));
        #redgpu_else
            sampleColor = mix(skyboxColor, transitionSample, u_transitionProgress);
        #redgpu_endIf
    }

    let finalIntensity = systemUniforms.preExposure * (uniforms.intensityMultiplier * uniforms.luminance / uniforms.averageLuminance);
    var finalAlpha = sampleColor.a * uniforms.opacity;

    if (systemUniforms.useSkyAtmosphere == 1u) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let transmittance = getTransmittance(transmittanceTexture, atmosphereSampler, u_atmo.cameraHeight, viewDir.y, u_atmo.atmosphereHeight);
        finalAlpha *= (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    }

    var outColor = vec4<f32>(sampleColor.rgb * finalIntensity, finalAlpha);
    if (outColor.a == 0.0) { discard; }
    
    var output: OutputFragment;
    output.color = outColor;
    output.gBufferNormal = vec4<f32>(0.0);
    output.gBufferMotionVector = vec4<f32>(0.0);
    return output;
}
