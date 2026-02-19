/**
 * [KO] Charlie Sheen 모델의 가시성(Visibility) 항 계산을 위한 Lambda 함수입니다.
 * [EN] Lambda function for calculating the visibility term in the Charlie Sheen model.
 *
 * @param cosTheta - [KO] 법선과 방향 벡터의 내적 (NdotV 또는 NdotL) [EN] Dot product of normal and direction vector
 * @param alpha - [KO] Sheen 거칠기 값 [EN] Sheen roughness value
 * @returns [KO] 계산된 Lambda 값 [EN] Calculated Lambda value
 */
fn getSheenLambda(cosTheta: f32, alpha: f32) -> f32 {
    if (cosTheta <= 0.0) {
        return 0.0;
    }
    
    // [KO] Charlie Sheen 가시성 근사식 (Estevez and Kulla)
    // [EN] Charlie Sheen visibility approximation (Estevez and Kulla)
    if (cosTheta < 0.5) {
        return exp(-1.01242 / alpha) * pow(cosTheta, 3.72201 + 0.10060 * alpha) / (alpha * (0.00327 - 0.04313 * alpha));
    } else {
        return exp(-0.39031 / alpha) * pow(cosTheta, 0.58707 + 0.04651 * alpha) / (alpha * (0.09028 + 0.03032 * alpha));
    }
}
