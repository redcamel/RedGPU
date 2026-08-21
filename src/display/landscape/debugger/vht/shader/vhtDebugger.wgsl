@group(0) @binding(0) var vhtTexture: texture_2d<f32>;
@group(0) @binding(1) var<uniform> camera: CameraParams;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let texSize = vec2<f32>(textureDimensions(vhtTexture));
    let texCoord = vec2<i32>(clamp(in.uv * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
    let h = textureLoad(vhtTexture, texCoord, 0).r;

    // 1. 타일 셀 내부 격자 그리드
    let compCount = max(camera.componentCount, vec2<f32>(1.0));
    let gridCoord = fract(in.uv * compCount);
    let gridDist = min(gridCoord, vec2<f32>(1.0) - gridCoord);
    let gridDeriv = fwidth(in.uv * compCount);
    let gridAlpha = 1.0 - smoothstep(vec2<f32>(0.0), max(gridDeriv * 1.5, vec2<f32>(0.001)), gridDist);
    let isGrid = max(gridAlpha.x, gridAlpha.y);

    var baseColor = mix(vec3<f32>(h, h * 0.9 + 0.1, h * 0.8), vec3<f32>(0.22, 0.74, 0.97), isGrid * 0.75);

    // 2. 공통 카메라 시야각/FOV/시선/로딩반경 오버레이 적용
    let finalColor = applyCameraOverlay(baseColor, in.uv, camera);

    return vec4<f32>(finalColor, 1.0);
}
