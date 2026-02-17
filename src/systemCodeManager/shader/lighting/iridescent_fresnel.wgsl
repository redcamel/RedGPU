#redgpu_include math.PI2

/**
 * [KO] 박막 간섭(Thin-film interference) 효과를 시뮬레이션하는 고정밀 무지개빛 프레넬을 계산합니다.
 * [EN] Calculates high-precision iridescent Fresnel simulating thin-film interference effects.
 *
 * [KO] 이 함수는 Airy's 공식을 기반으로 복소수 반사 계수를 계산하여 물리적으로 정확한 간섭 무늬를 생성합니다.
 * [EN] This function calculates complex reflection coefficients based on Airy's formulas to produce physically accurate interference patterns.
 *
 * @param outside_ior - [KO] 외부 매질의 굴절률 (보통 공기=1.0) [EN] IOR of the outside medium (usually air=1.0)
 * @param iridescence_ior - [KO] 박막 층의 굴절률 [EN] IOR of the thin-film layer
 * @param base_f0 - [KO] 하단 기저층의 기본 반사율 [EN] Base reflectance of the underlying layer
 * @param iridescence_thickness - [KO] 박막의 두께 (nm) [EN] Thickness of the thin-film (nm)
 * @param iridescence_factor - [KO] 무지개빛 효과의 강도 [0, 1] [EN] Strength of the iridescence effect [0, 1]
 * @param cos_theta1 - [KO] 입사각의 코사인 값 [EN] Cosine of the incidence angle
 * @returns [KO] 간섭 효과가 반영된 최종 반사율 [EN] Final reflectance with interference effects
 */
fn iridescent_fresnel(outside_ior: f32, iridescence_ior: f32, base_f0: vec3<f32>,
                      iridescence_thickness: f32, iridescence_factor: f32, cos_theta1: f32) -> vec3<f32> {
    // 조기 반환
    if (iridescence_thickness <= 0.0 || iridescence_factor <= 0.0) {
        return base_f0;
    }

    let cos_theta1_abs = abs(cos_theta1);
    let safe_iridescence_ior = max(iridescence_ior, 1.01);

    // 스넬의 법칙
    let sin_theta1 = sqrt(max(0.0, 1.0 - cos_theta1_abs * cos_theta1_abs));
    let sin_theta2 = (outside_ior / safe_iridescence_ior) * sin_theta1;

    if (sin_theta2 >= 1.0) {
        return base_f0 + iridescence_factor * (vec3<f32>(1.0) - base_f0);
    }

    let cos_theta2 = sqrt(max(0.0, 1.0 - sin_theta2 * sin_theta2));

    // 상수들 사전 계산
    let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
    let effective_thickness = max(iridescence_thickness, 10.0);
    let ior_scale = max(1.0, 1.5 - 0.5 * (safe_iridescence_ior / 1.5));
    let optical_thickness = 2.0 * effective_thickness * safe_iridescence_ior * cos_theta2 * ior_scale;
    let phase = (PI2 * optical_thickness) / wavelengths;

    // 삼각함수 (한 번만)
    let cos_phase = cos(phase);
    let sin_phase = sin(phase);

    // 공통 계산값들
    let outside_cos1 = outside_ior * cos_theta1_abs;
    let iridescence_cos2 = safe_iridescence_ior * cos_theta2;
    let iridescence_cos1 = safe_iridescence_ior * cos_theta1_abs;
    let outside_cos2 = outside_ior * cos_theta2;

    // 프레넬 계수 (스칼라)
    let r12_s = (outside_cos1 - iridescence_cos2) / (outside_cos1 + iridescence_cos2);
    let r12_p = (iridescence_cos1 - outside_cos2) / (iridescence_cos1 + outside_cos2);

    // 기본 F0에서 굴절률 추출 (벡터화)
    let sqrt_f0 = sqrt(clamp(base_f0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safe_n3 = max((1.0 + sqrt_f0) / (1.0 - sqrt_f0), vec3<f32>(1.2));

    // r23 계산 (벡터화)
    let iridescence_cos2_vec = vec3<f32>(iridescence_cos2);
    let cos_theta1_abs_vec = vec3<f32>(cos_theta1_abs);
    let iridescence_cos1_vec = vec3<f32>(iridescence_cos1);
    let cos_theta2_vec = vec3<f32>(cos_theta2);

    let r23_s = (iridescence_cos2_vec - safe_n3 * cos_theta1_abs_vec) /
                (iridescence_cos2_vec + safe_n3 * cos_theta1_abs_vec);
    let r23_p = (safe_n3 * cos_theta2_vec - iridescence_cos1_vec) /
                (safe_n3 * cos_theta2_vec + iridescence_cos1_vec);

    // 복소수 계산을 위한 공통 값들
    let r12_s_vec = vec3<f32>(r12_s);
    let r12_p_vec = vec3<f32>(r12_p);

    // S-편광 복소수 계산
    let num_s_real = r12_s_vec + r23_s * cos_phase;
    let num_s_imag = r23_s * sin_phase;
    let den_s_real = vec3<f32>(1.0) + r12_s_vec * r23_s * cos_phase;
    let den_s_imag = r12_s_vec * r23_s * sin_phase;

    // P-편광 복소수 계산
    let num_p_real = r12_p_vec + r23_p * cos_phase;
    let num_p_imag = r23_p * sin_phase;
    let den_p_real = vec3<f32>(1.0) + r12_p_vec * r23_p * cos_phase;
    let den_p_imag = r12_p_vec * r23_p * sin_phase;

    // 복소수 나눗셈 인라인 계산 (S-편광)
    let den_s_squared = den_s_real * den_s_real + den_s_imag * den_s_imag + vec3<f32>(0.001);
    let rs_real = (num_s_real * den_s_real + num_s_imag * den_s_imag) / den_s_squared;
    let rs_imag = (num_s_imag * den_s_real - num_s_real * den_s_imag) / den_s_squared;
    let Rs = rs_real * rs_real + rs_imag * rs_imag;

    // 복소수 나눗셈 인라인 계산 (P-편광)
    let den_p_squared = den_p_real * den_p_real + den_p_imag * den_p_imag + vec3<f32>(0.001);
    let rp_real = (num_p_real * den_p_real + num_p_imag * den_p_imag) / den_p_squared;
    let rp_imag = (num_p_imag * den_p_real - num_p_real * den_p_imag) / den_p_squared;
    let Rp = rp_real * rp_real + rp_imag * rp_imag;

    // 전체 반사율
    let reflectance = 0.5 * (Rs + Rp);

    // IOR 영향 최적화
    let ior_influence = smoothstep(1.0, 2.0, safe_iridescence_ior);
    let enhanced_reflectance = mix(
        pow(reflectance, vec3<f32>(0.8)) * 1.2,
        reflectance,
        ior_influence
    );

    // 최종 결과
    let clamped_reflectance = clamp(enhanced_reflectance, vec3<f32>(0.0), vec3<f32>(1.0));
    return mix(base_f0, clamped_reflectance, iridescence_factor);
}
