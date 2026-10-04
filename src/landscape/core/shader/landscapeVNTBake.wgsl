struct VNTBakeUniforms {
    tileRect: vec4<f32>,
    atlasSize: vec2<f32>,
    heightScale: f32,
    texelWorldSize: f32,
}

@group(0) @binding(0) var<uniform> uniforms: VNTBakeUniforms;
@group(0) @binding(1) var heightmapAtlas: texture_2d<f32>;
@group(0) @binding(2) var vntOutput: texture_storage_2d<rgba16float, write>;

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

    let wgBaseX = startX + i32(workgroup_id.x * 16u);
    let wgBaseZ = startZ + i32(workgroup_id.y * 16u);

    {
        let sy = linearIdx / 18u;
        let sx = linearIdx % 18u;
        let sampleX = clamp(wgBaseX + i32(sx) - 1, 0, atlasW - 1);
        let sampleZ = clamp(wgBaseZ + i32(sy) - 1, 0, atlasH - 1);
        s_height[sy][sx] = textureLoad(heightmapAtlas, vec2<i32>(sampleX, sampleZ), 0).r;
    }

    if (linearIdx < 68u) {
        let k = 256u + linearIdx;
        let sy = k / 18u;
        let sx = k % 18u;
        let sampleX = clamp(wgBaseX + i32(sx) - 1, 0, atlasW - 1);
        let sampleZ = clamp(wgBaseZ + i32(sy) - 1, 0, atlasH - 1);
        s_height[sy][sx] = textureLoad(heightmapAtlas, vec2<i32>(sampleX, sampleZ), 0).r;
    }

    workgroupBarrier();

    if (global_id.x >= tileWidth || global_id.y >= tileHeight) {
        return;
    }

    let curX = startX + i32(global_id.x);
    let curZ = startZ + i32(global_id.y);

    if (curX >= atlasW || curZ >= atlasH) {
        return;
    }

    let lx = local_id.x + 1u;
    let lz = local_id.y + 1u;

    let hCur = s_height[lz][lx];
    var hTL  = s_height[lz - 1u][lx - 1u];
    var hT   = s_height[lz - 1u][lx];
    var hTR  = s_height[lz - 1u][lx + 1u];
    var hL   = s_height[lz][lx - 1u];
    var hR   = s_height[lz][lx + 1u];
    var hBL  = s_height[lz + 1u][lx - 1u];
    var hB   = s_height[lz + 1u][lx];
    var hBR  = s_height[lz + 1u][lx + 1u];

    let leftX  = curX - 1;
    let rightX = curX + 1;
    let topZ   = curZ - 1;
    let botZ   = curZ + 1;

    let isLeftOOB = leftX < startX;
    let isRightOOB = rightX >= startX + i32(tileWidth);
    let isTopOOB = topZ < startZ;
    let isBotOOB = botZ >= startZ + i32(tileHeight);

    if (hCur > 0.00001) {
        if (isLeftOOB && hL <= 0.00001) { hL = hCur; }
        if (isRightOOB && hR <= 0.00001) { hR = hCur; }
        if (isTopOOB && hT <= 0.00001) { hT = hCur; }
        if (isBotOOB && hB <= 0.00001) { hB = hCur; }
        if ((isLeftOOB || isTopOOB) && hTL <= 0.00001) { hTL = hCur; }
        if ((isRightOOB || isTopOOB) && hTR <= 0.00001) { hTR = hCur; }
        if ((isLeftOOB || isBotOOB) && hBL <= 0.00001) { hBL = hCur; }
        if ((isRightOOB || isBotOOB) && hBR <= 0.00001) { hBR = hCur; }
    }

    let hScale = uniforms.heightScale;
    let stepDist = max(0.0001, uniforms.texelWorldSize * 8.0);

    // [KO] 3x3 Sobel 가중치 필터링: 수평/수직 인접에 2.0, 대각선 인접에 1.0 가중치
    // [EN] 3x3 Sobel weighted filtering: 2.0 weight for orthogonal neighbors, 1.0 for diagonal neighbors
    let dX = ((hTR + 2.0 * hR + hBR) - (hTL + 2.0 * hL + hBL)) * hScale;
    let dZ = ((hBL + 2.0 * hB + hBR) - (hTL + 2.0 * hT + hTR)) * hScale;

    let worldNormal = normalize(vec3<f32>(-dX, stepDist, -dZ));
    let encodedNormal = worldNormal * 0.5 + vec3<f32>(0.5);

    textureStore(vntOutput, vec2<i32>(curX, curZ), vec4<f32>(encodedNormal, 1.0));
}
