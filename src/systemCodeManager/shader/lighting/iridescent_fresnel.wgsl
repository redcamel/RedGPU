#redgpu_include math.PI2

/**
 * [KO] 박막 간섭(Thin-film interference) 효과를 시뮬레이션하는 무지개빛 프레넬을 계산합니다.
 * [EN] Calculates iridescent Fresnel simulating thin-film interference effects.
 */
fn iridescent_fresnel(outside_ior: f32, iridescence_ior: f32, base_f0: vec3<f32>,
                      iridescence_thickness: f32, iridescence_factor: f32, cos_theta1: f32) -> vec3<f32> {
    if (iridescence_thickness <= 0.0 || iridescence_factor <= 0.0) {
        return base_f0;
    }

    let cos_theta1_abs = abs(cos_theta1);
    let safe_iridescence_ior = max(iridescence_ior, 1.01);

    let sin_theta1 = sqrt(max(0.0, 1.0 - cos_theta1_abs * cos_theta1_abs));
    let sin_theta2 = (outside_ior / safe_iridescence_ior) * sin_theta1;

    if (sin_theta2 >= 1.0) {
        return base_f0 + iridescence_factor * (vec3<f32>(1.0) - base_f0);
    }

    let cos_theta2 = sqrt(max(0.0, 1.0 - sin_theta2 * sin_theta2));

    let wavelengths = vec3<f32>(650.0, 510.0, 475.0);
    let effective_thickness = max(iridescence_thickness, 10.0);
    let ior_scale = max(1.0, 1.5 - 0.5 * (safe_iridescence_ior / 1.5));
    let optical_thickness = 2.0 * effective_thickness * safe_iridescence_ior * cos_theta2 * ior_scale;
    let phase = (PI2 * optical_thickness) / wavelengths;

    let cos_phase = cos(phase);
    let sin_phase = sin(phase);

    let r12_s = (outside_ior * cos_theta1_abs - safe_iridescence_ior * cos_theta2) / (outside_ior * cos_theta1_abs + safe_iridescence_ior * cos_theta2);
    let r12_p = (safe_iridescence_ior * cos_theta1_abs - outside_ior * cos_theta2) / (safe_iridescence_ior * cos_theta1_abs + outside_ior * cos_theta2);

    let sqrt_f0 = sqrt(clamp(base_f0, vec3<f32>(0.01), vec3<f32>(0.99)));
    let safe_n3 = max((1.0 + sqrt_f0) / (1.0 - sqrt_f0), vec3<f32>(1.2));

    let r23_s = (safe_iridescence_ior * cos_theta2 - safe_n3 * cos_theta1_abs) / (safe_iridescence_ior * cos_theta2 + safe_n3 * cos_theta1_abs);
    let r23_p = (safe_n3 * cos_theta2 - safe_iridescence_ior * cos_theta1_abs) / (safe_n3 * cos_theta2 + safe_iridescence_ior * cos_theta1_abs);

    let rs_real = (r12_s + r23_s * cos_phase) / (1.0 + r12_s * r23_s * cos_phase);
    let rp_real = (r12_p + r23_p * cos_phase) / (1.0 + r12_p * r23_p * cos_phase);
    let Rs = rs_real * rs_real;
    let Rp = rp_real * rp_real;

    let reflectance = 0.5 * (Rs + Rp);
    return mix(base_f0, clamp(reflectance, vec3<f32>(0.0), vec3<f32>(1.0)), iridescence_factor);
}
