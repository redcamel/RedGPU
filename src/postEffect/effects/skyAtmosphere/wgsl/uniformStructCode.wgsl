#redgpu_include math.getHash3D_vec3
#redgpu_include depth.linearizeDepth
struct Uniforms {
	rayleighScattering: vec3<f32>,
	mieAnisotropy: f32,
	ozoneAbsorption: vec3<f32>,
	ozoneLayerCenter: f32,
	groundAlbedo: vec3<f32>,
	groundAmbient: f32,
	sunDirection: vec3<f32>,
	sunSize: f32,
	
	earthRadius: f32,
	atmosphereHeight: f32,
	mieScattering: f32,
	mieExtinction: f32,
	
	rayleighScaleHeight: f32,
	mieScaleHeight: f32,
	cameraHeight: f32,
	multiScatteringAmbient: f32,
	
	exposure: f32,
	sunIntensity: f32,
	heightFogDensity: f32,
	heightFogFalloff: f32,
	
	horizonHaze: f32,
	mieGlow: f32,
	mieHalo: f32,
	groundShininess: f32,
	
	groundSpecular: f32,
	ozoneLayerWidth: f32,
	padding0: f32,
	padding1: f32
};

fn fetchDepth(pos: vec2<u32>) -> f32 {
    let dSize = textureDimensions(depthTexture);
    let clampedPos = min(pos, dSize - 1u);
    return textureLoad(depthTexture, clampedPos, 0);
}

/**
 * [KO] 지면 노이즈를 생성합니다. (표준 getHash3D_vec3 사용)
 * [EN] Generates ground noise. (Using standard getHash3D_vec3)
 */
fn get_ground_noise_pe(p: vec3<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    
    // [KO] 표준 math.getHash3D_vec3를 활용한 노이즈 합성
    // [EN] Noise synthesis using standard math.getHash3D_vec3
    return mix(mix(mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 0.0, 0.0)), f - vec3<f32>(0.0, 0.0, 0.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 0.0, 0.0)), f - vec3<f32>(1.0, 0.0, 0.0)), u.x),
                   mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 1.0, 0.0)), f - vec3<f32>(0.0, 1.0, 0.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 1.0, 0.0)), f - vec3<f32>(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 0.0, 1.0)), f - vec3<f32>(0.0, 0.0, 1.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 0.0, 1.0)), f - vec3<f32>(1.0, 0.0, 1.0)), u.x),
                   mix(dot(getHash3D_vec3(i + vec3<f32>(0.0, 1.0, 1.0)), f - vec3<f32>(0.0, 1.0, 1.0)),
                       dot(getHash3D_vec3(i + vec3<f32>(1.0, 1.0, 1.0)), f - vec3<f32>(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}
