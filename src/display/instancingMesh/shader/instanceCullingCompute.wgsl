struct InstanceUniforms {
    instanceGroupModelMatrix: mat4x4<f32>,
    instanceModelMatrixs: array<mat4x4<f32>, 100000>,
    instanceNormalModelMatrix: array<mat4x4<f32>, 100000>,
    instanceOpacity: array<f32, 100000>,
    useDisplacementTexture: u32,
    displacementScale: f32,
};

struct CullingUniforms {
    frustumPlanes: array<vec4<f32>, 6>, // Left, Right, Bottom, Top, Near, Far
};

struct IndirectDrawArgs {
    vertexCount: u32,
    instanceCount: atomic<u32>,
    firstVertex: u32,
    baseVertex: u32,
    firstInstance: u32,
};


@group(0) @binding(0) var<storage, read> instanceUniforms: InstanceUniforms;
@group(0) @binding(1) var<storage, read> cullingUniforms: CullingUniforms;
@group(0) @binding(2) var<storage, read_write> visibilityBuffer: array<u32>;
@group(0) @binding(3) var<storage, read_write> indirectDrawArgs: IndirectDrawArgs;

// 바운딩 스피어 반경 (필요에 따라 조정)
const BOUNDING_RADIUS: f32 = 1;

// 점과 평면 사이의 거리 계산
fn distanceToPlane(position: vec3<f32>, plane: vec4<f32>) -> f32 {
    return dot(vec4<f32>(position, 1.0), plane);
}

// 프러스텀 컬링 테스트
fn isInsideFrustum(position: vec3<f32>, radius: f32) -> bool {
    // 6개 평면에 대해 모두 테스트
    for (var i: u32 = 0u; i < 6u; i = i + 1u) {
        let plane = cullingUniforms.frustumPlanes[i];
        let distance = distanceToPlane(position, plane);

        // 평면의 음의 방향(외부)에 있고, 반경보다 멀면 보이지 않음
        if (distance < -radius ) {
            return false;
        }
    }
    return true;
}

// 거리 기반 LOD 레벨 계산 (옵션)
fn calculateLODLevel(distanceToCamera: f32) -> u32 {
    if (distanceToCamera < 50.0) {
        return 0u;
    } else if (distanceToCamera < 100.0) {
        return 1u;
    } else if (distanceToCamera < 200.0) {
        return 2u;
    } else {
        return 3u;
    }
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let instanceIdx = globalId.x;
   if (instanceIdx >= 100000) {
            return;
        }


    // 인스턴스의 월드 위치 추출
    let modelMatrix = instanceUniforms.instanceModelMatrixs[instanceIdx];
    let worldPosition = vec3<f32>(
        modelMatrix[3][0],
        modelMatrix[3][1],
        modelMatrix[3][2]
    );

    // 스케일 추출 (바운딩 스피어 크기 조정용)
    let scaleX = length(vec3<f32>(modelMatrix[0][0], modelMatrix[0][1], modelMatrix[0][2]));
    let scaleY = length(vec3<f32>(modelMatrix[1][0], modelMatrix[1][1], modelMatrix[1][2]));
    let scaleZ = length(vec3<f32>(modelMatrix[2][0], modelMatrix[2][1], modelMatrix[2][2]));
    let maxScale = max(max(scaleX, scaleY), scaleZ);
    let scaledRadius = BOUNDING_RADIUS * maxScale;

    // 프러스텀 컬링 테스트
    let isVisible = isInsideFrustum(worldPosition, scaledRadius);



    // 보이는 인스턴스 카운트 증가
    if (isVisible) {
      let aliveIndex = atomicAdd(&indirectDrawArgs.instanceCount, 1u);
      visibilityBuffer[aliveIndex] = instanceIdx;
    }


    // 옵션: 거리 기반 LOD (추후 활용 가능)
    // let cameraPosition = vec3<f32>(0.0, 0.0, 0.0); // 카메라 위치 전달 필요
    // let distanceToCamera = distance(worldPosition, cameraPosition);
    // let lodLevel = calculateLODLevel(distanceToCamera);
}
