/**
 * [KO] Schlick의 프레넬 근사식을 사용하여 반사율을 계산합니다.
 * [EN] Calculates reflectance using Schlick's Fresnel approximation.
 *
 * @param cosTheta - [KO] 입사각의 코사인 값 [EN] Cosine of the incidence angle
 * @param F0 - [KO] 수직 입사 시의 반사율 [EN] Reflectance at normal incidence
 * @returns [KO] 계산된 프레넬 반사율 [EN] Calculated Fresnel reflectance
 */
fn fresnel_schlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}
