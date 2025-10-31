struct DrawCommand {
    count: u32,
    instanceCount: u32,
    firstVertex: u32,
    baseVertex: u32,
    firstInstance: u32,
    originInstanceCount: u32,
    isStatic:u32,
     _padding: u32,
    boundingSphere: vec4<f32>, // xyz: center, w: radius
};

struct Frustum {
    planes: array<vec4<f32>, 6>, // 6개 평면: (a, b, c, d) → ax + by + cz + d = 0
};

@group(0) @binding(0) var<uniform> cameraFrustum: Frustum;
@group(0) @binding(1) var<storage, read_write> drawCommands: array<DrawCommand>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    if (index >= arrayLength(&drawCommands)) {
        return;
    }

    let cmd = drawCommands[index];

    // 프러스텀 컬링: boundingSphere와 6개 평면 비교
    var visible = true;
    let sphereCenter = cmd.boundingSphere.xyz;
    let sphereRadius = cmd.boundingSphere.w;

    // loop unrolling 효과를 위해 명시적 반복
    visible = visible && dot(cameraFrustum.planes[0].xyz, sphereCenter) + cameraFrustum.planes[0].w >= -sphereRadius;
    visible = visible && dot(cameraFrustum.planes[1].xyz, sphereCenter) + cameraFrustum.planes[1].w >= -sphereRadius;
    visible = visible && dot(cameraFrustum.planes[2].xyz, sphereCenter) + cameraFrustum.planes[2].w >= -sphereRadius;
    visible = visible && dot(cameraFrustum.planes[3].xyz, sphereCenter) + cameraFrustum.planes[3].w >= -sphereRadius;
    visible = visible && dot(cameraFrustum.planes[4].xyz, sphereCenter) + cameraFrustum.planes[4].w >= -sphereRadius;
    visible = visible && dot(cameraFrustum.planes[5].xyz, sphereCenter) + cameraFrustum.planes[5].w >= -sphereRadius;

    // 조건부 메모리 쓰기 최소화
    var desiredCount: u32;

    if (visible) {
        desiredCount = cmd.originInstanceCount;
    } else {
        desiredCount = 0u;
    }
    if (drawCommands[index].instanceCount != desiredCount) {
        drawCommands[index].instanceCount = desiredCount;
    }
}
