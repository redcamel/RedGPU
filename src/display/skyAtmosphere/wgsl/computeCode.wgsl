/**
 * [KO] 스카이 애트모스피어(대기 산란) 효과를 위한 컴퓨팅 셰이더입니다.
 * [EN] Compute shader for Sky Atmosphere (atmospheric scattering) effects.
 */
let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpaceDir = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpaceDir);

let rawDepth = fetchDepth(id);
let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
let maxApDist = uniforms.aerialPerspectiveMaxDistance; 
let apDist = clamp(depthKm, 0.0, maxApDist);

let azimuth = atan2(viewDir.z, viewDir.x);
let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
let apU = (azimuth / PI2) + 0.5;
let apV = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let apW = clamp(sqrt(apDist / maxApDist), 0.0, 0.999);

// [KO] Aerial Perspective 3D LUT 샘플링
// [EN] Sample Aerial Perspective 3D LUT
let apSample = textureSampleLevel(atmosphereCameraVolumeTexture, atmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

// [KO] 최종 색상 결정: 씬 색상에 투과율을 곱하고 산란광을 더합니다.
// [EN] Determine final color: Multiply scene color by transmittance and add scattered light.
let finalColor = sceneColor * apSample.a + apSample.rgb;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));
