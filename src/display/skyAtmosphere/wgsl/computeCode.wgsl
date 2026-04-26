let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;

let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpacePos = vec3<f32>((uv.x * 2.0 - 1.0) * invP[0][0], ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1], -1.0);
let rayLengthRatio = length(viewSpacePos); 

let worldRotation = mat3x3<f32>(systemUniforms.camera.inverseViewMatrix[0].xyz, systemUniforms.camera.inverseViewMatrix[1].xyz, systemUniforms.camera.inverseViewMatrix[2].xyz);
let viewDir = normalize(worldRotation * viewSpacePos);

let rawDepth = fetchDepth(id);

if (rawDepth >= 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

var mappingH: f32 = 0.0;
let depthKm = getLinearizeDepth(rawDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping) / 1000.0;
let actualDist = depthKm * rayLengthRatio;
let maxApDist = uniforms.aerialPerspectiveDistanceScale; 

let apDist = clamp(actualDist - uniforms.aerialPerspectiveStartDepth, 0.0, maxApDist);

let apU = uv.x;
let apV = uv.y;
let apW = clamp(sqrt(apDist / maxApDist), 0.0, 1.0);

var apSample = textureSampleLevel(aerialPerspectiveLUT, skyAtmosphereSampler, vec3<f32>(apU, apV, apW), 0.0);

if (actualDist < NEAR_FIELD_CORRECTION_DIST) { 
    mappingH = max(0.0, viewHeight);
    let d = getAtmosphereDensities(mappingH, uniforms);
    let sunDir = normalize(uniforms.sunDirection);
    let sunTrans = getTransmittance(transmittanceLUT, skyAtmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);

    let scatR = uniforms.rayleighScattering * d.rhoR * uniforms.skyLuminanceFactor;
    let scatM = uniforms.mieScattering * d.rhoM * uniforms.skyLuminanceFactor;

    let phaseR = phaseRayleigh(dot(viewDir, sunDir));
    let phaseM = phaseMie(dot(viewDir, sunDir), uniforms.mieAnisotropy);

    let localScat = (scatR * phaseR + vec3<f32>(scatM * phaseM)) * sunTrans;
    let localExt = scatR + vec3<f32>((uniforms.mieScattering + uniforms.mieAbsorption) * d.rhoM * uniforms.skyLuminanceFactor) + uniforms.absorptionCoefficient * d.rhoO;

    let analyticalScat = localScat * actualDist;
    let analyticalTrans = exp(-localExt * actualDist);
    let analyticalA = (analyticalTrans.r + analyticalTrans.g + analyticalTrans.b) / 3.0;

    let blend = smoothstep(0.0, NEAR_FIELD_CORRECTION_DIST, actualDist);
    apSample = mix(vec4<f32>(analyticalScat, analyticalA), apSample, blend);
}

let sunDir = normalize(uniforms.sunDirection);
let viewSunCos = dot(viewDir, sunDir);
mappingH = max(0.0, viewHeight);
var mieGlowUnit = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, transmittanceLUT, skyAtmosphereSampler, vec3<f32>(apSample.a), 0.0);

let camPos = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
let occlusionFactor = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);
mieGlowUnit *= occlusionFactor;

let finalScattering = (apSample.rgb + mieGlowUnit) * uniforms.sunIntensity * systemUniforms.preExposure;
let finalColor = sceneColor * saturate(apSample.a) + finalScattering;

textureStore(outputTexture, id, vec4<f32>(finalColor, 1.0));