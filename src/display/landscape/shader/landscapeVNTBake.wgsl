struct VNTBakeUniforms {
    tileRect: vec4<f32>,
    atlasSize: vec2<f32>,
    heightScale: f32,
    texelWorldSize: f32,
}

@group(0) @binding(0) var<uniform> uniforms: VNTBakeUniforms;
@group(0) @binding(1) var heightmapAtlas: texture_2d<f32>;
@group(0) @binding(2) var vntOutput: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let tileWidth = u32(uniforms.tileRect.z);
    let tileHeight = u32(uniforms.tileRect.w);

    if (global_id.x >= tileWidth || global_id.y >= tileHeight) {
        return;
    }

    let startX = i32(uniforms.tileRect.x);
    let startZ = i32(uniforms.tileRect.y);

    let curX = startX + i32(global_id.x);
    let curZ = startZ + i32(global_id.y);

    let atlasW = i32(uniforms.atlasSize.x);
    let atlasH = i32(uniforms.atlasSize.y);

    if (curX >= atlasW || curZ >= atlasH) {
        return;
    }

    let hCur = textureLoad(heightmapAtlas, vec2<i32>(curX, curZ), 0).r;

    let leftX  = max(0, curX - 1);
    let rightX = min(atlasW - 1, curX + 1);
    let topZ   = max(0, curZ - 1);
    let botZ   = min(atlasH - 1, curZ + 1);

    var hL = textureLoad(heightmapAtlas, vec2<i32>(leftX, curZ), 0).r;
    var hR = textureLoad(heightmapAtlas, vec2<i32>(rightX, curZ), 0).r;
    var hT = textureLoad(heightmapAtlas, vec2<i32>(curX, topZ), 0).r;
    var hB = textureLoad(heightmapAtlas, vec2<i32>(curX, botZ), 0).r;

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
