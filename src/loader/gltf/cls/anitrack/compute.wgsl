struct Uniforms {
    interpolation_value: f32,
    prev_time_data_index: f32,
    next_time_data_index: f32,
    morph_length: f32,
    vertex_stride: f32,
    vertex_count: f32,
    padding1: f32,
    padding2: f32,
};

@group(0) @binding(0) var<storage, read> animation_data_list: array<f32>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;
@group(0) @binding(2) var<storage, read_write> vertices: array<f32>;
@group(0) @binding(3) var<storage, read> origin_data: array<f32>;
@group(0) @binding(4) var<storage, read> morph_interleave_data: array<f32>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let vertex_index = global_id.x;
    let vertex_count = u32(uniforms.vertex_count);
    let stride = u32(uniforms.vertex_stride);
    let morph_length = u32(uniforms.morph_length);



    let base_vertex_index = vertex_index * stride;
    let base_vertex_index2 = vertex_index * 3u; /* xyz 좌표용 */

    /* 시간 인덱스 오프셋 계산 (JavaScript 코드와 동일) */
    let prev_time_offset = u32(uniforms.prev_time_data_index) * morph_length;
    let next_time_offset = u32(uniforms.next_time_data_index) * morph_length;

    /* 원본 데이터로 초기화 (JavaScript 코드와 동일) */
    var prev_weight = origin_data[base_vertex_index];
    var next_weight = origin_data[base_vertex_index];
    var prev_weight1 = origin_data[base_vertex_index + 1u];
    var next_weight1 = origin_data[base_vertex_index + 1u];
    var prev_weight2 = origin_data[base_vertex_index + 2u];
    var next_weight2 = origin_data[base_vertex_index + 2u];

    /* 각 모프 타겟에 대해 반복 (JavaScript와 동일한 순서) */
    for (var morph_index = 0u; morph_index < morph_length; morph_index++) {
        /* 애니메이션 데이터 가져오기 */
        let prev_animation_data = animation_data_list[prev_time_offset + morph_index];
        let next_animation_data = animation_data_list[next_time_offset + morph_index];

        /* JavaScript의 morphInterleaveData 패턴과 일치하도록 수정 */
        /* 각 morph의 interleaveData는 해당 morph의 모든 정점 데이터를 순차적으로 가짐 */
        let morph_base_offset = morph_index * vertex_count * 3u;

        /* X 컴포넌트 */
        let temp_weight_x = morph_interleave_data[morph_base_offset + base_vertex_index2];
        prev_weight += prev_animation_data * temp_weight_x;
        next_weight += next_animation_data * temp_weight_x;

        /* Y 컴포넌트 */
        let temp_weight_y = morph_interleave_data[morph_base_offset + base_vertex_index2 + 1u];
        prev_weight1 += prev_animation_data * temp_weight_y;
        next_weight1 += next_animation_data * temp_weight_y;

        /* Z 컴포넌트 */
        let temp_weight_z = morph_interleave_data[morph_base_offset + base_vertex_index2 + 2u];
        prev_weight2 += prev_animation_data * temp_weight_z;
        next_weight2 += next_animation_data * temp_weight_z;
    }

    /* 보간 계산 (JavaScript와 동일) */
    let interpolation_diff_x = next_weight - prev_weight;
    let interpolation_diff_y = next_weight1 - prev_weight1;
    let interpolation_diff_z = next_weight2 - prev_weight2;

    /* 최종 보간된 값 계산 */
    let final_x = prev_weight + uniforms.interpolation_value * interpolation_diff_x;
    let final_y = prev_weight1 + uniforms.interpolation_value * interpolation_diff_y;
    let final_z = prev_weight2 + uniforms.interpolation_value * interpolation_diff_z;

    /* 결과를 버텍스 배열에 저장 (xyz 좌표만 업데이트) */
    vertices[base_vertex_index] = final_x;
    vertices[base_vertex_index + 1u] = final_y;
    vertices[base_vertex_index + 2u] = final_z;

}
