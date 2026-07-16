#redgpu_include SYSTEM_UNIFORM;

@group(1) @binding(0) var<storage> clusterBoundsGrid : ClusterBoundsGrid;

// [KO] 조명 정보 캐싱을 위한 워크그룹 공유 메모리 (1024 * 16 bytes = 16 KB)
// [EN] Workgroup shared memory for caching light data (1024 * 16 bytes = 16 KB)
var<workgroup> sharedLights : array<vec4<f32>, 1024>;

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

// [KO] 온칩 캐싱된 라이트 위치/반지름 데이터를 이용해 AABB 영역 교차 여부 검사
// [EN] Test for intersection against AABB using on-chip cached light position/radius data
fn checkSphereAABB(position: vec3<f32>, radius: f32, tileIndex: u32) -> bool {
    let targetTile = clusterBoundsGrid.cubeList[tileIndex];
    let center = (systemUniforms.camera.viewMatrix * vec4<f32>(position, 1.0)).xyz;
    let squaredDistance = pointLight_sqDistPointAABB(center, targetTile.minAABB.xyz, targetTile.maxAABB.xyz);
    return squaredDistance <= (radius * radius);
}

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

    // [KO] 워크그룹 내 256개 스레드가 협력하여 전역 VRAM의 조명 데이터를 로컬 공유 메모리에 고속 로드
    // [EN] 256 threads in the workgroup cooperatively load global light parameters into local shared memory
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
                    
                    if (sinTheta * sinTheta <= 0.5) { // theta <= 45도
                        let factor = L / (2.0 * cosTheta);
                        center = V + D * factor;
                        radius = factor;
                    } else { // theta > 45도
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

    // [KO] 모든 스레드가 로드를 마칠 때까지 대기
    // [EN] Wait for all threads to finish loading
    workgroupBarrier();

    var clusterLightCount = 0u;
    var clusterLightIndices : array<u32, REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu>;

    // 포인트 라이트 처리
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

    // 스폿 라이트 처리
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

    var offset = atomicAdd(&clusterLightGrid.offset, clusterLightCount);

    for(var i = 0u; i < clusterLightCount; i = i + 1u) {
        clusterLightGrid.indices[offset + i] = clusterLightIndices[i];
    }

    clusterLightGrid.cells[tileIndex].offset = offset;
    clusterLightGrid.cells[tileIndex].count = clusterLightCount;
}
