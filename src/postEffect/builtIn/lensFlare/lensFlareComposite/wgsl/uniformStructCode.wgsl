struct Uniforms {
    sunDirection: vec3<f32>,
    sunActive: u32,
    sunColor: vec3<f32>,
    sunIntensityScale: f32,
    intensity: f32,
    lensDirtIntensity: f32,
    ghostCount: u32,
    ghostSpacing: f32,
    ghostIntensity: f32,
    chromaticAberration: f32,
    bladeCount: f32,
    starburstIntensity: f32,
    anamorphicIntensity: f32,
    haloRadius: f32,
    haloIntensity: f32,
};

const PI: f32 = 3.141592653589793;
const PI2: f32 = 6.283185307179586;
const GOLDEN_CONJUGATE: f32 = 0.618033988749895;
const SOLAR_ANGULAR_RADIUS: f32 = 0.00465; // Physical solar angular radius in radians (~0.266 deg)
const WAVELENGTHS_UM: vec3<f32> = vec3<f32>(0.650, 0.530, 0.450);
const CAUCHY_DISPERSION: vec3<f32> = vec3<f32>(-0.464, 0.0, 0.536);

const DISK_OFFSETS: array<vec2<f32>, 9> = array<vec2<f32>, 9>(
    vec2<f32>(0.0, 0.0),
    vec2<f32>(0.5, 0.0),
    vec2<f32>(-0.35355339, 0.35355339),
    vec2<f32>(0.0, -0.5),
    vec2<f32>(0.35355339, 0.35355339),
    vec2<f32>(-0.86602540, -0.5),
    vec2<f32>(0.86602540, -0.5),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(-0.70710678, -0.70710678)
);

fn sampleTent9Tap(tex: texture_2d<f32>, uv: vec2<f32>, texelSize: vec2<f32>) -> vec3<f32> {
    let d = texelSize.xyxy * vec4<f32>(1.0, 1.0, -1.0, 0.0);
    let c0 = textureSampleLevel(tex, basicSampler, uv - d.xy, 0.0).rgb;
    let c1 = textureSampleLevel(tex, basicSampler, uv - d.wy, 0.0).rgb;
    let c2 = textureSampleLevel(tex, basicSampler, uv - d.zy, 0.0).rgb;
    let c3 = textureSampleLevel(tex, basicSampler, uv + d.zw, 0.0).rgb;
    let c4 = textureSampleLevel(tex, basicSampler, uv,        0.0).rgb;
    let c5 = textureSampleLevel(tex, basicSampler, uv + d.xw, 0.0).rgb;
    let c6 = textureSampleLevel(tex, basicSampler, uv + d.zy, 0.0).rgb;
    let c7 = textureSampleLevel(tex, basicSampler, uv + d.wy, 0.0).rgb;
    let c8 = textureSampleLevel(tex, basicSampler, uv + d.xy, 0.0).rgb;

    return (c0 + c2 + c6 + c8 + (c1 + c3 + c5 + c7) * 2.0 + c4 * 4.0) * 0.0625;
}

// Cosine-fourth law of off-axis optical illumination: cos^4(theta) = 1 / (1 + (r / f)^2)^2
fn evaluateCos4Vignette(radialDist: f32) -> f32 {
    let tanThetaSq = radialDist * radialDist;
    let invSecSq = 1.0 / (1.0 + tanThetaSq);
    return invSecSq * invSecSq;
}

// Airy thin-film interference reflectance for optical coating thickness opdUm and off-axis sin^2(theta)
fn evaluateThinFilmReflectance(opdUm: f32, sinThetaSq: f32) -> vec3<f32> {
    let nfSq = 1.9044; // MgF2 refractive index squared (1.38^2)
    let cosThetaT = sqrt(max(1.0 - sinThetaSq / nfSq, 0.0));
    let phase = (PI * opdUm * cosThetaT) / WAVELENGTHS_UM;
    let interference = cos(phase);
    return vec3<f32>(0.42) + vec3<f32>(0.58) * (interference * interference);
}

// Analytical Normal CDF (Bowling 2009): integral of 1D Gaussian PSF over signed boundary distance d
fn gaussianCdfTransmittance(signedDist: f32, sigmaPsf: f32) -> f32 {
    let z = clamp((1.702 * signedDist) / max(sigmaPsf, 1e-5), -16.0, 16.0);
    return 1.0 / (1.0 + exp(z));
}

// Exact Euclidean signed distance to a rounded regular N-gon in the fundamental polar wedge
fn sdCurvedRegularPolygon(p: vec2<f32>, radius: f32, blades: f32, camRot: f32) -> f32 {
    let r = length(p);
    let sector = PI2 / blades;
    let halfSector = sector * 0.5;
    let angle = atan2(p.y, p.x) + camRot;
    let localAngle = abs((fract(angle / sector + 0.5) - 0.5) * sector);

    let cosHalf = cos(halfSector);
    let tanHalf = tan(halfSector);
    let apothem = radius * cosHalf;
    // Exact geometric sagitta of circular iris for N blades: s = R * (1 - cos(pi / N))
    let rCorner = radius * (1.0 - cosHalf);
    let apothemCore = max(apothem - rCorner, 1e-5);
    let halfSideCore = apothemCore * tanHalf;

    let x = r * cos(localAngle);
    let y = r * sin(localAngle);
    let dx = x - apothemCore;
    let dy = max(y - halfSideCore, 0.0);
    return select(dx, length(vec2<f32>(dx, dy)), dy > 0.0) - rCorner;
}

// Physical paraxial aperture projection convolved with Defocus Gaussian PSF, Entrance/Exit pupil intersection, and Cauchy dispersion
fn evaluatePhysicalGhostPupil(
    p: vec2<f32>,
    pupilRadius: f32,
    sigmaPsf: f32,
    blades: f32,
    camRot: f32,
    axisOffset: vec2<f32>,
    caStrength: f32
) -> vec3<f32> {
    let dPoly = sdCurvedRegularPolygon(p, pupilRadius, blades, camRot);
    // Cat's-eye mechanical vignetting: entrance & exit pupil circular stop intersection shifted by paraxial chief ray
    let dBarrel = length(p - axisOffset * 0.35) - pupilRadius * 1.08;
    let barrelTransmittance = gaussianCdfTransmittance(dBarrel, sigmaPsf * 1.5);

    // Cauchy wavelength dispersion of pupil magnification: R(lambda) = R_0 * (1 + alpha * delta_n(lambda))
    let dispDelta = pupilRadius * caStrength * CAUCHY_DISPERSION;
    let transR = gaussianCdfTransmittance(dPoly - dispDelta.r, sigmaPsf);
    let transG = gaussianCdfTransmittance(dPoly - dispDelta.g, sigmaPsf);
    let transB = gaussianCdfTransmittance(dPoly - dispDelta.b, sigmaPsf);

    // Seidel 4th-order spherical aberration wavefront phase energy redistribution across the exit pupil
    let rhoSq = min(dot(p, p) / max(pupilRadius * pupilRadius, 1e-6), 1.0);
    let seidelCaustic = 0.78 + 0.22 * (rhoSq * rhoSq);

    return vec3<f32>(transR, transG, transB) * (barrelTransmittance * seidelCaustic);
}

// Finite-aperture polychromatic Fraunhofer diffraction + Spencer-CIE forward-scattering glare PSF
fn evaluateFraunhoferStarburst(
    dSun: vec2<f32>,
    rSun: f32,
    blades: f32,
    camRot: f32,
    edgeDiffractionGain: f32
) -> f32 {
    let isEven = (u32(blades) & 1u) == 0u;
    let spikeCount = select(blades * 2.0, blades, isEven);
    let sector = PI2 / spikeCount;
    let theta = atan2(dSun.y, dSun.x) + camRot;

    // Nearest polygonal edge normal angular offset
    let dTheta = abs(fract(theta / sector + 0.5) - 0.5) * sector;
    let qPerp = rSun * sin(dTheta);
    let qPara = rSun * cos(dTheta);

    // Finite-aperture angular diffraction spread convolved with solar angular diameter (2 * SOLAR_ANGULAR_RADIUS)
    let sigma0 = SOLAR_ANGULAR_RADIUS * 0.35;
    let angularSpread = SOLAR_ANGULAR_RADIUS * 2.0;
    let sigmaPerpSq = sigma0 * sigma0 + (angularSpread * qPara) * (angularSpread * qPara);
    let lorentzianTransverse = sigmaPerpSq / (qPerp * qPerp + sigmaPerpSq);

    // Asymptotic 2D polygonal Fourier transform decay along edge normal: (q_c / sqrt(q_para^2 + q_c^2))^3
    let qc = SOLAR_ANGULAR_RADIUS * 14.0;
    let qcSq = qc * qc;
    let invParaLen = inverseSqrt(qPara * qPara + qcSq);
    let fourierLongitudinal = (qcSq * qc) * (invParaLen * invParaLen * invParaLen);
    let coreTransition = (qPara * qPara) / (qPara * qPara + (SOLAR_ANGULAR_RADIUS * 2.0) * (SOLAR_ANGULAR_RADIUS * 2.0));
    let primarySpike = lorentzianTransverse * fourierLongitudinal * coreTransition;

    // Spencer-CIE small-angle forward scattering glare PSF: (sigma_s / sqrt(r^2 + sigma_s^2))^3
    let sigmaGlare = SOLAR_ANGULAR_RADIUS * 10.0;
    let sigmaGlareSq = sigmaGlare * sigmaGlare;
    let invGlareLen = inverseSqrt(rSun * rSun + sigmaGlareSq);
    let cieGlarePsf = (sigmaGlareSq * sigmaGlare) * (invGlareLen * invGlareLen * invGlareLen);

    return cieGlarePsf * 0.65 + primarySpike * edgeDiffractionGain * 0.75;
}

fn hash12(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn valueNoise2D(p: vec2<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    let a = hash12(i);
    let b = hash12(i + vec2<f32>(1.0, 0.0));
    let c = hash12(i + vec2<f32>(0.0, 1.0));
    let d = hash12(i + vec2<f32>(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Mie forward scattering perturbation by surface micro-particles
fn evaluateMieSurfaceScattering(uv: vec2<f32>, aspect: f32) -> f32 {
    let p = vec2<f32>((uv.x - 0.5) * aspect, uv.y - 0.5);
    let rSq = dot(p, p);
    let fbm = valueNoise2D(p * 16.0) * 0.5714 + valueNoise2D(p * 32.0) * 0.2857 + valueNoise2D(p * 64.0) * 0.1429;
    let particleDensity = max(fbm - 0.5, 0.0) * 2.0;
    let obliqueScatter = rSq / (rSq + 0.125);
    return (particleDensity * particleDensity) * obliqueScatter;
}
