#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include math.INV_PI;
#redgpu_include skyAtmosphere.skyAtmosphereFn;
#redgpu_include shadow.getDirectionalShadowVisibility;

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

// Convert 3D view direction to Hemi-Octahedral (0..1) UV
fn dirToHemiOctahedralUV(dir: vec3<f32>) -> vec2<f32> {
    let d = normalize(vec3<f32>(dir.x, max(dir.y, 0.0), dir.z));
    let l1 = abs(d.x) + d.y + abs(d.z);
    let invL1 = select(1.0 / l1, 1.0, l1 < 0.0001);
    let u = (d.x + d.z) * 0.5 * invL1 + 0.5;
    let v = (d.z - d.x) * 0.5 * invL1 + 0.5;
    return clamp(vec2<f32>(u, v), vec2<f32>(0.0), vec2<f32>(1.0));
}

fn sampleOctahedralAtlas(gridCoords: vec2<f32>, quadUV: vec2<f32>, n: f32) -> vec4<f32> {
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let safeSubUV = clamp(quadUV, vec2<f32>(0.002), vec2<f32>(0.998));
    let atlasUV = (clampedGrid + safeSubUV) / n;
    return textureSample(diffuseTexture, diffuseTextureSampler, atlasUV);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];

    var viewDir = inputData.vertexTangent.xyz;
    if (inputData.vertexTangent.w > -500.0) {
        let camPos = systemUniforms.camera.cameraPosition.xyz;
        viewDir = normalize(camPos - inputData.vertexPosition);
    }

    let n = 8.0;
    let octUV = dirToHemiOctahedralUV(viewDir);

    let gridPos = octUV * n;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    let s00 = sampleOctahedralAtlas(baseGrid, inputData.uv, n);
    let s10 = sampleOctahedralAtlas(baseGrid + vec2<f32>(1.0, 0.0), inputData.uv, n);
    let s01 = sampleOctahedralAtlas(baseGrid + vec2<f32>(0.0, 1.0), inputData.uv, n);
    let s11 = sampleOctahedralAtlas(baseGrid + vec2<f32>(1.0, 1.0), inputData.uv, n);

    // Alpha-weighted blending to eliminate black halo/fringe artifacts
    let w00 = (1.0 - frac.x) * (1.0 - frac.y) * s00.a;
    let w10 = frac.x * (1.0 - frac.y) * s10.a;
    let w01 = (1.0 - frac.x) * frac.y * s01.a;
    let w11 = frac.x * frac.y * s11.a;
    let totalWeight = w00 + w10 + w01 + w11;

    var finalRgb = s00.rgb;
    if (totalWeight > 0.0001) {
        finalRgb = (s00.rgb * w00 + s10.rgb * w10 + s01.rgb * w01 + s11.rgb * w11) / totalWeight;
    }

    let finalAlpha = mix(
        mix(s00.a, s10.a, frac.x),
        mix(s01.a, s11.a, frac.x),
        frac.y
    );

    if (finalAlpha < 0.35) {
        discard;
    }

    // 1. Spherical Normal for natural 3D volumetric foliage shading
    let sphereX = (inputData.uv.x - 0.5) * 2.0;
    let sphereY = (0.5 - inputData.uv.y) * 2.0;
    let r2 = sphereX * sphereX + sphereY * sphereY;
    let sphereZ = sqrt(max(1.0 - r2 * 0.6, 0.2));
    let N = normalize(vec3<f32>(sphereX * 0.6, sphereY * 0.3 + 0.5, sphereZ));

    let preExp = select(1.0, systemUniforms.preExposure, systemUniforms.preExposure > 0.0);

    // 2. Directional Shadow calculation
    var shadowVis: f32 = 1.0;
    shadowVis = getDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        systemUniforms.shadow.directionalShadowDepthTextureSize,
        systemUniforms.shadow.directionalShadowBias,
        systemUniforms.shadow.directionalShadowFilterScale,
        inputData.shadowCoord
    );
    shadowVis = mix(1.0 - systemUniforms.shadow.directionalShadowStrength, 1.0, shadowVis);

    // 3. Directional Light (Sunlight) with Foliage Half-Lambert scattering
    var directLight = vec3<f32>(0.0);
    if (systemUniforms.directionalLightCount > 0u) {
        for (var i = 0u; i < systemUniforms.directionalLightCount; i = i + 1u) {
            let dirLight = systemUniforms.directionalLights[i];
            let L = -normalize(dirLight.direction);
            let NdotL = max(dot(N, L), 0.0);
            let halfLambert = pow(NdotL * 0.5 + 0.5, 2.0);
            directLight += dirLight.color * dirLight.intensity * halfLambert * shadowVis;
        }
    } else {
        directLight = vec3<f32>(1.0);
    }

    // 4. Ambient & Sky Light
    var ambientLight = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity;
    if (systemUniforms.useSkyAtmosphere == 1u) {
        let u_atmo = systemUniforms.skyAtmosphere;
        let camH = u_atmo.cameraHeight;
        let atmH = u_atmo.atmosphereHeight;
        let skyIntensity = u_atmo.sunIntensity;
        let diffTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, N.y, atmH);
        let skyIrradiance = textureSampleLevel(atmosphereIrradianceLUT, atmosphereSampler, N, 0.0).rgb * skyIntensity;
        ambientLight += (ambientLight * diffTrans) + skyIrradiance;
    }
    if (length(ambientLight) < 0.1) {
        ambientLight = vec3<f32>(0.4, 0.42, 0.45);
    }

    // 5. Final Shading
    let totalLight = (directLight + ambientLight) * preExp;
    finalRgb = finalRgb * totalLight;

    let tinted = getTintBlendMode(vec4<f32>(finalRgb, 1.0), globalFragmentData.tintBlendMode, globalFragmentData.tint);
    finalRgb = tinted.rgb;

    output.color = vec4<f32>(finalRgb, finalAlpha * globalFragmentData.opacity);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, 1.0);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);

    return output;
}
