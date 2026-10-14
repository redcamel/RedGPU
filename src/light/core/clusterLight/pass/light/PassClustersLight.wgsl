#redgpu_include SYSTEM_UNIFORM;

// [KO] 사전 계산된 클러스터 셀별 뷰 공간 AABB 읽기 전용 버퍼
// [EN] Read-only buffer of precomputed view-space AABBs per cluster cell
@group(1) @binding(0) var<storage> clusterBoundsGrid : ClusterBoundsGrid;

// [KO] 워크그룹 내 스레드들이 협업하여 광원 바운딩 구(Sphere) 데이터를 캐싱하는 공유 메모리 (xyz: 중심, w: 반경)
// [EN] Workgroup shared memory for collaboratively caching light bounding spheres (xyz: center, w: radius)
var<workgroup> sharedLights : array<vec4<f32>, 1024>;

// [KO] 뷰 공간의 한 점(targetPoint)과 클러스터 AABB(minAABB ~ maxAABB) 사이의 최소 제곱 거리를 계산합니다.
// [EN] Computes the minimum squared distance between a view-space point (targetPoint) and a cluster AABB (minAABB ~ maxAABB).
fn pointLight_sqDistPointAABB(targetPoint:vec3<f32>, minAABB:vec3<f32>, maxAABB:vec3<f32>) -> f32 {
    var sqDist = 0.0;
    for(var i = 0u; i < 3u; i = i + 1u) {
      let v = targetPoint[i];
      let _minAABB = minAABB[i];
      let _maxAABB = maxAABB[i];

      if(v < _minAABB){
        sqDist +=  (_minAABB - v) * (_minAABB - v);
      }
      if(v > _maxAABB){
        sqDist += (v - _maxAABB) * (v - _maxAABB);
      }
    }
    return sqDist;
}

// [KO] 월드 공간의 광원 바운딩 구(position, radius)를 뷰 공간으로 변환하여 대상 클러스터 타일의 AABB와 교차하는지 판정합니다.
// [EN] Transforms a world-space light bounding sphere (position, radius) to view space and tests intersection against the target cluster tile's AABB.
fn checkSphereAABB(position: vec3<f32>, radius: f32, tileIndex: u32) -> bool {
    let targetTile = clusterBoundsGrid.cubeList[tileIndex];
    let center = (systemUniforms.camera.viewMatrix * vec4<f32>(position, 1.0)).xyz;
    let squaredDistance = pointLight_sqDistPointAABB(center, targetTile.minAABB.xyz, targetTile.maxAABB.xyz);
    return squaredDistance <= (radius * radius);
}

// [KO] 각 클러스터 타일에 영향을 주는 PointLight 및 SpotLight를 컬링하여 클러스터 라이트 인덱스 그리드에 기록합니다.
// [EN] Culls PointLights and SpotLights affecting each cluster tile and writes active indices into the cluster light grid.
@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X, REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)
fn main(
    @builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(local_invocation_index) local_index : u32
) {
    let tileIndex = global_id.x +
                    global_id.y * clusterLight_tileCount.x +
                    global_id.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

    let pointLightCount = u32(clusterLightList.count[0]);
    let spotLightCount = u32(clusterLightList.count[1]);
    let totalLightCount = pointLightCount + spotLightCount;

    // [KO] 워크그룹 스레드 협업으로 광원 바운딩 구(SpotLight는 원뿔에 외접하는 최소 바운딩 구)를 계산하여 공유 메모리에 캐싱합니다.
    // [EN] Collaboratively computes light bounding spheres (minimum circumscribed sphere for SpotLight cones) across workgroup threads and caches them in shared memory.
    let workgroupSize = u32(REDGPU_DEFINE_WORKGROUP_SIZE_X) * u32(REDGPU_DEFINE_WORKGROUP_SIZE_Y) * u32(REDGPU_DEFINE_WORKGROUP_SIZE_Z);
    for (var i = local_index; i < totalLightCount; i = i + workgroupSize) {
        if (i < 1024u) {
            let light = clusterLightList.lights[i];
            if (light.isSpotLight == 1.0) {
                let V = light.position;
                let dir = vec3<f32>(light.directionX, light.directionY, light.directionZ);
                let lenSq = dot(dir, dir);
                var center = V;
                var radius = light.radius;
                
                if (lenSq > 0.0001) {
                    let D = dir * inverseSqrt(lenSq);
                    let L = light.radius;
                    let theta = radians(light.outerCutoff);
                    let cosTheta = cos(theta);
                    let sinTheta = sin(theta);
                    
                    if (sinTheta * sinTheta <= 0.5) {
                        let factor = L / (2.0 * cosTheta);
                        center = V + D * factor;
                        radius = factor;
                    } else {
                        center = V + D * (L * cosTheta);
                        radius = L * sinTheta;
                    }
                }
                sharedLights[i] = vec4<f32>(center, radius);
            } else {
                sharedLights[i] = vec4<f32>(light.position, light.radius);
            }
        }
    }

    workgroupBarrier();

    var clusterLightCount = 0u;
    var clusterLightIndices : array<u32, REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu>;

    // [KO] 1. PointLight 교차 판정
    // [EN] 1. PointLight intersection test
    for (var i = 0u; i < pointLightCount; i = i + 1u) {
        let lightData = sharedLights[i];
        let lightInCluster = checkSphereAABB(lightData.xyz, lightData.w, tileIndex);

        if (lightInCluster) {
            clusterLightIndices[clusterLightCount] = i;
            clusterLightCount = clusterLightCount + 1u;
        }

        if (clusterLightCount == REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu) {
            break;
        }
    }

    // [KO] 2. SpotLight 교차 판정
    // [EN] 2. SpotLight intersection test
    let spotLightStartIndex = pointLightCount;
    for (var i = 0u; i < spotLightCount; i = i + 1u) {
        let actualLightIndex = spotLightStartIndex + i;
        let lightData = sharedLights[actualLightIndex];
        let sphereTest = checkSphereAABB(lightData.xyz, lightData.w, tileIndex);

        if (sphereTest) {
            clusterLightIndices[clusterLightCount] = actualLightIndex;
            clusterLightCount = clusterLightCount + 1u;
        }

        if (clusterLightCount == REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu) {
            break;
        }
    }

    // [KO] 원자적 연산으로 전역 라이트 인덱스 버퍼의 오프셋을 할당하고 타일별 결과를 기록합니다.
    // [EN] Atomically allocates an offset in the global light index buffer and writes per-tile results.
    var offset = atomicAdd(&clusterLightGrid.offset, clusterLightCount);

    for(var i = 0u; i < clusterLightCount; i = i + 1u) {
        clusterLightGrid.indices[offset + i] = clusterLightIndices[i];
    }

    clusterLightGrid.cells[tileIndex].offset = offset;
    clusterLightGrid.cells[tileIndex].count = clusterLightCount;
}
