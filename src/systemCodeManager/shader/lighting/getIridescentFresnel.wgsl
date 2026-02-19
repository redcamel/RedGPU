#redgpu_include math.PI2
#redgpu_include math.EPSILON

/**
 * [KO] 박막 간섭(Thin-film interference) 효과를 시뮬레이션하는 고정밀 무지개빛 프레넬을 계산합니다.
 * [EN] Calculates high-precision iridescent Fresnel simulating thin-film interference effects.
 *
 * [KO] 이 함수는 Airy's 공식을 기반으로 복소수 반사 계수를 계산하여 물리적으로 정확한 간섭 무늬를 생성합니다.
 * [EN] This function calculates complex reflection coefficients based on Airy's formulas to produce physically accurate interference patterns.
 *
 * @param outsideIOR - [KO] 외부 매질의 굴절률 (보통 공기=1.0) [EN] IOR of the outside medium (usually air=1.0)
 * @param iridescenceIOR - [KO] 박막 층의 굴절률 [EN] IOR of the thin-film layer
 * @param baseF0 - [KO] 하단 기저층의 기본 반사율 [EN] Base reflectance of the underlying layer
 * @param iridescenceThickness - [KO] 박막의 두께 (nm) [EN] Thickness of the thin-film (nm)
 * @param iridescenceFactor - [KO] 무지개빛 효과의 강도 [0, 1] [EN] Strength of the iridescence effect [0, 1]
 * @param cosTheta1 - [KO] 입사각의 코사인 값 [EN] Cosine of the incidence angle
 * @returns [KO] 간섭 효과가 반영된 최종 반사율 [EN] Final reflectance with interference effects
 */
fn getIridescentFresnel(outsideIOR: f32, iridescenceIOR: f32, baseF0: vec3<f32>,
                      iridescenceThickness: f32, iridescenceFactor: f32, cosTheta1: f32) -> vec3<f32> {
    // 조기 반환
    if (iridescenceThickness <= 0.0 || iridescenceFactor <= 0.0) {
        return baseF0;
    }

    let cosTheta1Abs = abs(cosTheta1);
    let safeIridescenceIOR = max(iridescenceIOR, 1.01);

    // 스넬의 법칙
    let sinTheta1 = sqrt(max(0.0, 1.0 - cosTheta1Abs * cosTheta1Abs));
    let sinTheta2 = (outsideIOR / safeIridescenceIOR) * sinTheta1;

    if (sinTheta2 >= 1.0) {
        return baseF0 + iridescenceFactor * (vec3<f32>(1.0) - baseF0);
    }

    let cosTheta2 = sqrt(max(0.0, 1.0 - sinTheta2 * sinTheta2));

    // 상수들 사전 계산
    let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
    let opticalThickness = 2.0 * iridescenceThickness * safeIridescenceIOR * cosTheta2;
    let phase = (PI2 * opticalThickness) / wavelengths;

    // 삼각함수 (한 번만)
    let cosPhase = cos(phase);
    let sinPhase = sin(phase);

    // 공통 계산값들
    let outsideCos1 = outsideIOR * cosTheta1Abs;
    let iridescenceCos2 = safeIridescenceIOR * cosTheta2;
    let iridescenceCos1 = safeIridescenceIOR * cosTheta1Abs;
    let outsideCos2 = outsideIOR * cosTheta2;

    // 프레넬 계수 (스칼라)
    let r12_s = (outsideCos1 - iridescenceCos2) / max(outsideCos1 + iridescenceCos2, EPSILON);
    let r12_p = (iridescenceCos1 - outsideCos2) / max(iridescenceCos1 + outsideCos2, EPSILON);

    // 기본 F0에서 굴절률 추출 (벡터화)
    let sqrtF0 = sqrt(clamp(baseF0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safeN3 = max((1.0 + sqrtF0) / max(1.0 - sqrtF0, vec3<f32>(EPSILON)), vec3<f32>(1.2));

    // r23 계산 (벡터화)
    let iridescenceCos2Vec = vec3<f32>(iridescenceCos2);
    let cosTheta1AbsVec = vec3<f32>(cosTheta1Abs);
    let iridescenceCos1Vec = vec3<f32>(iridescenceCos1);
    let cosTheta2Vec = vec3<f32>(cosTheta2);

    let r23_s = (iridescenceCos2Vec - safeN3 * cosTheta1AbsVec) /
                max(iridescenceCos2Vec + safeN3 * cosTheta1AbsVec, vec3<f32>(EPSILON));
    let r23_p = (safeN3 * cosTheta2Vec - iridescenceCos1Vec) /
                max(safeN3 * cosTheta2Vec + iridescenceCos1Vec, vec3<f32>(EPSILON));

    // 복소수 계산을 위한 공통 값들
    let r12_sVec = vec3<f32>(r12_s);
    let r12_pVec = vec3<f32>(r12_p);

    // S-편광 복소수 계산
    let numSReal = r12_sVec + r23_s * cosPhase;
    let numSImag = r23_s * sinPhase;
    let denSReal = vec3<f32>(1.0) + r12_sVec * r23_s * cosPhase;
    let denSImag = r12_sVec * r23_s * sinPhase;

    // P-편광 복소수 계산
    let numPReal = r12_pVec + r23_p * cosPhase;
    let numPImag = r23_p * sinPhase;
    let denPReal = vec3<f32>(1.0) + r12_pVec * r23_p * cosPhase;
    let denPImag = r12_pVec * r23_p * sinPhase;

    // 복소수 나눗셈 인라인 계산 (S-편광)
    let denSSquared = denSReal * denSReal + denSImag * denSImag;
    let rsReal = (numSReal * denSReal + numSImag * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
    let rsImag = (numSImag * denSReal - numSReal * denSImag) / max(denSSquared, vec3<f32>(EPSILON));
    let Rs = rsReal * rsReal + rsImag * rsImag;

    // 복소수 나눗셈 인라인 계산 (P-편광)
    let denPSquared = denPReal * denPReal + denPImag * denPImag;
    let rpReal = (numPReal * denPReal + numPImag * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
    let rpImag = (numPImag * denPReal - numPReal * denPImag) / max(denPSquared, vec3<f32>(EPSILON));
    let Rp = rpReal * rpReal + rpImag * rpImag;

    // 전체 반사율
    let reflectance = 0.5 * (Rs + Rp);

    // 최종 결과
    let clampedReflectance = clamp(reflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    return mix(baseF0, clampedReflectance, iridescenceFactor);
}
