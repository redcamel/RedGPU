struct DrawCommand {
    count: u32,
    instanceCount: u32,
    firstVertex: u32,
    baseVertex: u32,
    firstInstance: u32,
    isStatic:u32,
     _padding: vec2<u32>,
    boundingSphere: vec4<f32>, // xyz: center, w: radius
};

struct Frustum {
    planes: array<vec4<f32>, 6>, // 6개 평면: (a, b, c, d) → ax + by + cz + d = 0
};

@group(0) @binding(0) var<uniform> cameraFrustum: Frustum;
@group(0) @binding(1) var<storage, read_write> drawCommands: array<DrawCommand>;

fn isVisible(sphere: vec4<f32>, frustum: Frustum) -> bool {
    for (var i = 0u; i < 6u; i = i + 1u) {
        let plane = frustum.planes[i];
        let distance = dot(plane.xyz, sphere.xyz) + plane.w;
        if (distance < -sphere.w) {
            return false; // 완전히 프러스텀 밖
        }
    }
    return true;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&drawCommands)) {
        return;
    }
    let cmd = drawCommands[index];

    if (isVisible(cmd.boundingSphere, cameraFrustum)) {
        drawCommands[index].instanceCount = 1u; // 보임 → 활성화
    } else {
        drawCommands[index].instanceCount = 0u; // 안 보임 → 무효화
    }
}
