/**
 * [KO] glTF 모프 타겟 애니메이션을 계산하는 컴퓨팅 셰이더입니다.
 * [EN] Compute shader for calculating glTF morph target animations.
 */
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

/**
 * [KO] 모프 애니메이션 계산 메인 엔트리 포인트입니다.
 * [EN] Main entry point for morph animation calculation.
 */
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let vertex_index = global_id.x;
    let vertex_count = u32(uniforms.vertex_count);
    let stride = u32(uniforms.vertex_stride);
    let morph_length = u32(uniforms.morph_length);

    if (vertex_index >= vertex_count) { return; }

    let base_vertex_index = vertex_index * stride;
    let base_vertex_index2 = vertex_index * 3u; // [KO] xyz 좌표용 오프셋 [EN] Offset for xyz coordinates

    // [KO] 시간 인덱스 오프셋 계산 (JavaScript 로직과 동기화)
    // [EN] Calculate time index offsets (Synchronized with JavaScript logic)
    let prev_time_offset = u32(uniforms.prev_time_data_index) * morph_length;
    let next_time_offset = u32(uniforms.next_time_data_index) * morph_length;

    // [KO] 원본 데이터로 초기화
    // [EN] Initialize with original data
    var prev_weight = origin_data[base_vertex_index];
    var next_weight = origin_data[base_vertex_index];
    var prev_weight1 = origin_data[base_vertex_index + 1u];
    var next_weight1 = origin_data[base_vertex_index + 1u];
    var prev_weight2 = origin_data[base_vertex_index + 2u];
    var next_weight2 = origin_data[base_vertex_index + 2u];

    // [KO] 각 모프 타겟에 대해 누적 계산 수행
    // [EN] Loop through each morph target and perform accumulation
    for (var morph_index = 0u; morph_index < morph_length; morph_index++) {
        // [KO] 현재 프레임 및 다음 프레임의 애니메이션 데이터 획득
        // [EN] Get animation data for current and next frames
        let prev_animation_data = animation_data_list[prev_time_offset + morph_index];
        let next_animation_data = animation_data_list[next_time_offset + morph_index];

        // [KO] morph_interleave_data는 각 모프의 모든 정점 데이터를 순차적으로 포함합니다.
        // [EN] morph_interleave_data contains all vertex data for each morph sequentially.
        let morph_base_offset = morph_index * vertex_count * 3u;

        // [KO] X 컴포넌트 가중치 적용 [EN] Apply weight to X component
        let temp_weight_x = morph_interleave_data[morph_base_offset + base_vertex_index2];
        prev_weight += prev_animation_data * temp_weight_x;
        next_weight += next_animation_data * temp_weight_x;

        // [KO] Y 컴포넌트 가중치 적용 [EN] Apply weight to Y component
        let temp_weight_y = morph_interleave_data[morph_base_offset + base_vertex_index2 + 1u];
        prev_weight1 += prev_animation_data * temp_weight_y;
        next_weight1 += next_animation_data * temp_weight_y;

        // [KO] Z 컴포넌트 가중치 적용 [EN] Apply weight to Z component
        let temp_weight_z = morph_interleave_data[morph_base_offset + base_vertex_index2 + 2u];
        prev_weight2 += prev_animation_data * temp_weight_z;
        next_weight2 += next_animation_data * temp_weight_z;
    }

    // [KO] 선형 보간 계산 [EN] Perform linear interpolation
    let interpolation_diff_x = next_weight - prev_weight;
    let interpolation_diff_y = next_weight1 - prev_weight1;
    let interpolation_diff_z = next_weight2 - prev_weight2;

    // [KO] 최종 보간된 좌표값 산출 [EN] Calculate final interpolated coordinates
    let final_x = prev_weight + uniforms.interpolation_value * interpolation_diff_x;
    let final_y = prev_weight1 + uniforms.interpolation_value * interpolation_diff_y;
    let final_z = prev_weight2 + uniforms.interpolation_value * interpolation_diff_z;

    // [KO] 결과를 버텍스 배열에 저장 (xyz 위치 업데이트) [EN] Store results in vertex array (Update xyz position)
    vertices[base_vertex_index] = final_x;
    vertices[base_vertex_index + 1u] = final_y;
    vertices[base_vertex_index + 2u] = final_z;
}
