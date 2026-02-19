/**
 * [KO] KHR_texture_transform 확장을 기반으로 UV 좌표를 변환합니다.
 * [EN] Transforms UV coordinates based on the KHR_texture_transform extension.
 *
 * [KO] 오프셋(Offset), 회전(Rotation), 스케일(Scale)을 적용하여 최종 UV 좌표를 계산하며, 멀티 UV(UV0, UV1)를 지원합니다.
 * [EN] Calculates the final UV coordinates by applying offset, rotation, and scale, supporting multi-UV (UV0, UV1).
 *
 * @param input_uv - [KO] 기본 UV 좌표 (UV0) [EN] Base UV coordinates (UV0)
 * @param input_uv1 - [KO] 보조 UV 좌표 (UV1) [EN] Secondary UV coordinates (UV1)
 * @param texCoord_index - [KO] 사용할 UV 인덱스 (0 또는 1) [EN] UV index to use (0 or 1)
 * @param use_transform - [KO] 변환 적용 여부 [EN] Whether to apply transform
 * @param transform_offset - [KO] UV 오프셋 [EN] UV offset
 * @param transform_rotation - [KO] UV 회전 (Radians) [EN] UV rotation (Radians)
 * @param transform_scale - [KO] UV 스케일 [EN] UV scale
 * @returns [KO] 변환된 최종 UV 좌표 [EN] Transformed final UV coordinates
 */
fn getKHRTextureTransformUV(
    input_uv: vec2<f32>,
    input_uv1: vec2<f32>,
    texCoord_index: u32,
    use_transform: u32,
    transform_offset: vec2<f32>,
    transform_rotation: f32,
    transform_scale: vec2<f32>
) -> vec2<f32> {
    // 1. UV 좌표 선택 (UV index selection)
    var result_uv = select(input_uv, input_uv1, texCoord_index == 1u);

    // 2. 변환 적용 (Apply transformation if enabled)
    if (use_transform == 1u) {
        // Translation Matrix
        let translation = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            transform_offset.x, transform_offset.y, 1.0
        );

        // Rotation Matrix
        let cos_rot = cos(transform_rotation);
        let sin_rot = sin(transform_rotation);
        let rotation_matrix = mat3x3<f32>(
            cos_rot, -sin_rot, 0.0,
            sin_rot, cos_rot, 0.0,
            0.0, 0.0, 1.0
        );

        // Scale Matrix
        let scale_matrix = mat3x3<f32>(
            transform_scale.x, 0.0, 0.0,
            0.0, transform_scale.y, 0.0,
            0.0, 0.0, 1.0
        );

        // glTF KHR_texture_transform 규격에 따른 TRS 행렬 합성
        let result_matrix = translation * rotation_matrix * scale_matrix;
        result_uv = (result_matrix * vec3<f32>(result_uv, 1.0)).xy;
    }

    return result_uv;
}
