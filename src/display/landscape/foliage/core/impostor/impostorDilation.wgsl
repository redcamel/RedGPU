/**
 * [KO] 옥타헤드럴 임포스터 아틀라스 텍스처 Dilation (Alpha Bleed / Edge Padding) 컴퓨트 셰이더입니다.
 * [EN] Compute shader for Octahedral Impostor Atlas Texture Dilation (Alpha Bleed / Edge Padding).
 * 
 * [KO] 알파 경계면의 유효 RGB/Normal 색상을 알파 0인 빈 배경 영역으로 방사형 확장하여, 밉맵 다운샘플링 시 검은 테두리(Black Halo) 및 타일 침범을 원천 차단합니다.
 * [EN] Radially expands valid RGB/Normal colors from alpha boundaries into empty background areas (alpha = 0) to prevent black halos and tile bleeding during mipmap downsampling.
 */

@group(0) @binding(0) var inputTexture: texture_2d<f32>;
@group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;

struct DilationUniforms {
    atlasSize: vec2<u32>,
    tileSize: u32,
    stepOffset: i32,
};

@group(0) @binding(2) var<uniform> uniforms: DilationUniforms;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let px = global_id.xy;
    if (px.x >= uniforms.atlasSize.x || px.y >= uniforms.atlasSize.y) {
        return;
    }

    let centerSample = textureLoad(inputTexture, px, 0);

    // 🌿 이미 유효한 불투명 픽셀(Alpha > 0.05)이면 원본 그대로 출력
    if (centerSample.a > 0.05) {
        textureStore(outputTexture, px, centerSample);
        return;
    }

    // 🌿 타일 경계 계산 (타일 간 색상 오염 방지: 타일 내부에서만 Dilation 수행)
    let tileSize = uniforms.tileSize;
    let tileMinX = (px.x / tileSize) * tileSize;
    let tileMaxX = tileMinX + tileSize - 1u;
    let tileMinY = (px.y / tileSize) * tileSize;
    let tileMaxY = tileMinY + tileSize - 1u;

    let step = uniforms.stepOffset;
    var bestColor = centerSample;
    var foundValid = false;

    // 8방향 팽창 탐색 (가로, 세로, 대각선)
    let offsets = array<vec2<i32>, 8>(
        vec2<i32>(-step, 0),
        vec2<i32>(step, 0),
        vec2<i32>(0, -step),
        vec2<i32>(0, step),
        vec2<i32>(-step, -step),
        vec2<i32>(step, -step),
        vec2<i32>(-step, step),
        vec2<i32>(step, step)
    );

    for (var i = 0u; i < 8u; i = i + 1u) {
        let sampleCoord = vec2<i32>(px) + offsets[i];
        let clampedCoord = vec2<u32>(
            clamp(u32(max(0, sampleCoord.x)), tileMinX, tileMaxX),
            clamp(u32(max(0, sampleCoord.y)), tileMinY, tileMaxY)
        );

        let neighbor = textureLoad(inputTexture, clampedCoord, 0);
        if (neighbor.a > 0.05) {
            bestColor = vec4<f32>(neighbor.rgb, 0.0); // 🌿 색상만 확장하고 알파는 0(투명) 유지
            foundValid = true;
            break;
        }
    }

    textureStore(outputTexture, px, bestColor);
}
