struct VNTBakeUniforms {
    tileRect: vec4<f32>,
    atlasSize: vec2<f32>,
    heightScale: f32,
    texelWorldSize: f32,
}

@group(0) @binding(0) var<uniform> uniforms: VNTBakeUniforms;
@group(0) @binding(1) var heightmapAtlas: texture_2d<f32>;
@group(0) @binding(2) var vntOutput: texture_storage_2d<rgba8unorm, write>;

// 🌟 [18x18 LDS 온칩 공유 메모리 (16x16 타일 + 외곽 1픽셀 테두리 = 324 floats / 1.3 KB)]
var<workgroup> s_height: array<array<f32, 18>, 18>;

@compute @workgroup_size(16, 16)
fn main(
    @builtin(global_invocation_id) global_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>,
    @builtin(workgroup_id) workgroup_id: vec3<u32>
) {
    let tileWidth = u32(uniforms.tileRect.z);
    let tileHeight = u32(uniforms.tileRect.w);

    let startX = i32(uniforms.tileRect.x);
    let startZ = i32(uniforms.tileRect.y);

    let atlasW = i32(uniforms.atlasSize.x);
    let atlasH = i32(uniforms.atlasSize.y);

    let linearIdx = local_id.y * 16u + local_id.x;

    // 워크그룹(16x16) 좌상단 기준 좌표 (패딩 제외 원점)
    let wgBaseX = startX + i32(workgroup_id.x * 16u);
    let wgBaseZ = startZ + i32(workgroup_id.y * 16u);

    // 🌟 [1단계: 256개 스레드의 324개 높이 픽셀 2단계 협력 로드]
    // 1차 패스: 스레드 0~255가 인덱스 0~255 로드
    {
        let sy = linearIdx / 18u;
        let sx = linearIdx % 18u;
        let sampleX = clamp(wgBaseX + i32(sx) - 1, 0, atlasW - 1);
        let sampleZ = clamp(wgBaseZ + i32(sy) - 1, 0, atlasH - 1);
        s_height[sy][sx] = textureLoad(heightmapAtlas, vec2<i32>(sampleX, sampleZ), 0).r;
    }

    // 2차 패스: 스레드 0~67이 남은 인덱스 256~323 로드
    if (linearIdx < 68u) {
        let k = 256u + linearIdx;
        let sy = k / 18u;
        let sx = k % 18u;
        let sampleX = clamp(wgBaseX + i32(sx) - 1, 0, atlasW - 1);
        let sampleZ = clamp(wgBaseZ + i32(sy) - 1, 0, atlasH - 1);
        s_height[sy][sx] = textureLoad(heightmapAtlas, vec2<i32>(sampleX, sampleZ), 0).r;
    }

    // 🌟 [2단계: 온칩 캐시 로딩 완료 동기화 배리어]
    workgroupBarrier();

    // 🌟 [3단계: 유효 픽셀 판정 및 온칩 편미분/노멀 연산]
    if (global_id.x >= tileWidth || global_id.y >= tileHeight) {
        return;
    }

    let curX = startX + i32(global_id.x);
    let curZ = startZ + i32(global_id.y);

    if (curX >= atlasW || curZ >= atlasH) {
        return;
    }

    // 온칩 공유 메모리 인덱스 (외곽 1픽셀 패딩으로 인해 +1)
    let lx = local_id.x + 1u;
    let lz = local_id.y + 1u;

    let hCur = s_height[lz][lx];
    var hL   = s_height[lz][lx - 1u];
    var hR   = s_height[lz][lx + 1u];
    var hT   = s_height[lz - 1u][lx];
    var hB   = s_height[lz + 1u][lx];

    let leftX  = curX - 1;
    let rightX = curX + 1;
    let topZ   = curZ - 1;
    let botZ   = curZ + 1;

    if (leftX < startX && hL <= 0.00001 && hCur > 0.00001) { hL = hCur; }
    if (rightX >= startX + i32(tileWidth) && hR <= 0.00001 && hCur > 0.00001) { hR = hCur; }
    if (topZ < startZ && hT <= 0.00001 && hCur > 0.00001) { hT = hCur; }
    if (botZ >= startZ + i32(tileHeight) && hB <= 0.00001 && hCur > 0.00001) { hB = hCur; }

    let hScale = uniforms.heightScale;
    let stepDist = max(0.0001, uniforms.texelWorldSize * 2.0);

    let dX = (hR - hL) * hScale;
    let dZ = (hB - hT) * hScale;

    let worldNormal = normalize(vec3<f32>(-dX, stepDist, -dZ));
    let encodedNormal = worldNormal * 0.5 + vec3<f32>(0.5);

    textureStore(vntOutput, vec2<i32>(curX, curZ), vec4<f32>(encodedNormal, 1.0));
}
