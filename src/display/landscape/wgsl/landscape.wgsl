/**
 * Landscape Wireframe & Instancing WGSL Shader
 */

struct CameraUniforms {
    projectionMatrix: mat4x4<f32>,
    viewMatrix: mat4x4<f32>,
    cameraPosition: vec3<f32>,
    padding: f32,
};

@group(0) @binding(0) var<uniform> camera: CameraUniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,

    // Instance Attributes
    @location(2) instOffsetX: f32,
    @location(3) instOffsetZ: f32,
    @location(4) instScale: f32,
    @location(5) instLODLevel: f32,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) lodLevel: f32,
    @location(2) worldPos: vec3<f32>,
};

@vertex
fn mainVertex(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    // Unit Mesh (Centered or Corner) Position Scaling & Translation
    // input.position is assumed to be in range [-0.5, 0.5] or [0, 1]
    let scaledPos = vec3<f32>(
        input.position.x * input.instScale,
        input.position.y,
        input.position.z * input.instScale
    );

    let worldPos = vec3<f32>(
        scaledPos.x + input.instOffsetX,
        scaledPos.y,
        scaledPos.z + input.instOffsetZ
    );

    output.worldPos = worldPos;
    output.uv = input.uv;
    output.lodLevel = input.instLODLevel;
    output.position = camera.projectionMatrix * camera.viewMatrix * vec4<f32>(worldPos, 1.0);

    return output;
}

// LOD 레벨별 디버그 와이어프레임 색상 매핑
fn getLODColor(lod: f32) -> vec4<f32> {
    let lodInt = i32(round(lod));
    switch (lodInt) {
        case 0: { return vec4<f32>(1.0, 0.2, 0.2, 1.0); } // LOD 0: 빨강 (가장 세분화)
        case 1: { return vec4<f32>(1.0, 0.6, 0.0, 1.0); } // LOD 1: 주황
        case 2: { return vec4<f32>(1.0, 1.0, 0.2, 1.0); } // LOD 2: 노랑
        case 3: { return vec4<f32>(0.2, 1.0, 0.2, 1.0); } // LOD 3: 초록
        case 4: { return vec4<f32>(0.2, 0.6, 1.0, 1.0); } // LOD 4: 파랑
        default: { return vec4<f32>(0.8, 0.3, 1.0, 1.0); } // LOD 5+: 보라
    }
}

@fragment
fn mainFragment(input: VertexOutput) -> @location(0) vec4<f32> {
    return getLODColor(input.lodLevel);
}
