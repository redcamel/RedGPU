#redgpu_include SYSTEM_UNIFORM;

// [KO] 클러스터 셀별 뷰 공간 AABB 결과를 기록할 스토리지 버퍼
// [EN] Storage buffer to write view-space AABB results per cluster cell
@group(1) @binding(0) var<storage, read_write> clusterBoundsGrid : ClusterBoundsGrid;

// [KO] 시점(eye)에서 출발하는 광선(a -> b)과 특정 Z 평면(zDistance)의 교차점을 계산합니다.
// [EN] Calculates the intersection point between a ray (a -> b) originating from the eye and a Z-plane (zDistance).
fn lineIntersectionToZPlane(a : vec3<f32>, b : vec3<f32>, zDistance : f32) -> vec3<f32> {
    let normal = vec3<f32>(0.0, 0.0, 0.5);
    let ab = b - a;
    let t = (zDistance - dot(normal, a)) / dot(normal, ab);
    return a + t * ab;
}

// [KO] 클립 공간(Clip-Space) 좌표를 역투영 행렬을 통해 뷰 공간(View-Space) 좌표로 변환합니다.
// [EN] Transforms clip-space coordinates into view-space coordinates using the inverse projection matrix.
fn clipToView(clip : vec4<f32>) -> vec4<f32> {
    let view = systemUniforms.projection.inverseProjectionMatrix * clip;
    return view / vec4<f32>(view.w, view.w, view.w, view.w);
}

// [KO] 스크린 픽셀 좌표를 NDC를 거쳐 뷰 공간(View-Space) 좌표로 변환합니다.
// [EN] Transforms screen pixel coordinates through NDC into view-space coordinates.
fn screen2View(screen : vec4<f32>) -> vec4<f32> {
    let texCoord = screen.xy / systemUniforms.resolution.xy;
    let clip = vec4<f32>(vec2<f32>(texCoord.x, 1.0 - texCoord.y) * 2.0 - vec2<f32>(1.0, 1.0), screen.z, screen.w );
    return clipToView(clip);
}

const eyePos = vec3<f32>(0.0);

// [KO] 3D 클러스터 그리드 내 각 셀(x, y, z)의 Near/Far 슬라이스 교차점으로부터 뷰 공간 AABB를 계산합니다.
// [EN] Computes the view-space AABB for each cell (x, y, z) in the 3D cluster grid from its Near/Far slice intersections.
@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X, REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let tileIndex = global_id.x +
                    global_id.y * clusterLight_tileCount.x +
                    global_id.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

    let tileSize = vec2<f32>(
              systemUniforms.resolution.x / f32(clusterLight_tileCount.x),
              systemUniforms.resolution.y / f32(clusterLight_tileCount.y)
          );

    let global_id_x_pos_one = vec2<f32>(f32(global_id.x + 1u), f32(global_id.y + 1u)) * tileSize;
    let global_id_x_y = vec2<f32>(f32(global_id.x), f32(global_id.y)) * tileSize;

    let maxPoint_sS = vec4<f32>(global_id_x_pos_one, 0.0, 1.0);
    let minPoint_sS = vec4<f32>(global_id_x_y, 0.0, 1.0);

    let maxPoint_vS = screen2View(maxPoint_sS).xyz;
    let minPoint_vS = screen2View(minPoint_sS).xyz;

    let nearFarX = systemUniforms.camera.nearClipping;
    let nearFarY = systemUniforms.camera.farClipping;

    let tileZ = f32(global_id.z) / f32(clusterLight_tileCount.z);
    let tileZ_plus_one = f32(global_id.z + 1u) / f32(clusterLight_tileCount.z);

    // [KO] 지수적(Logarithmic) 깊이 분할을 통해 클러스터 Z 슬라이스의 Near/Far 평면 거리를 산출합니다.
    // [EN] Calculates the Near/Far plane distances of the cluster Z-slice using logarithmic depth subdivision.
    let tileNear = -nearFarX * pow(nearFarY / nearFarX, tileZ);
    let tileFar = -nearFarX * pow(nearFarY / nearFarX, tileZ_plus_one);

    let minPointNear = lineIntersectionToZPlane(eyePos, minPoint_vS, tileNear);
    let minPointFar = lineIntersectionToZPlane(eyePos, minPoint_vS, tileFar);
    let maxPointNear = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileNear);
    let maxPointFar = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileFar);

    let minAABB = min(min(minPointNear, minPointFar), min(maxPointNear, maxPointFar));
    let maxAABB = max(max(minPointNear, minPointFar), max(maxPointNear, maxPointFar));

    clusterBoundsGrid.cubeList[tileIndex].minAABB = vec4<f32>(minAABB, 0.0);
    clusterBoundsGrid.cubeList[tileIndex].maxAABB = vec4<f32>(maxAABB, 0.0);
}
