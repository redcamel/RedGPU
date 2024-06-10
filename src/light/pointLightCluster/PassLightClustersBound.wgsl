#REDGPU_DEFINE_SYSTEM_UNIFORMS
@group(1) @binding(0) var<storage, read_write> clusters : PointLight_Clusters;

fn lineIntersectionToZPlane(a : vec3<f32>, b : vec3<f32>, zDistance : f32) -> vec3<f32> {
    let normal = vec3<f32>(0.0, 0.0, 0.5);
    let ab = b - a;
    let t = (zDistance - dot(normal, a)) / dot(normal, ab);
    return a + t * ab;
}

fn clipToView(clip : vec4<f32>) -> vec4<f32> {
    let view = systemUniforms.inverseProjectionMatrix * clip;
    return view / vec4<f32>(view.w, view.w, view.w, view.w);
}

fn screen2View(screen : vec4<f32>) -> vec4<f32> {
    let texCoord = screen.xy / systemUniforms.resolution.xy;
    let clip = vec4<f32>(vec2<f32>(texCoord.x, 1.0 - texCoord.y) * 2.0 - vec2<f32>(1.0, 1.0), screen.z, screen.w );
    return clipToView(clip);
}

const eyePos = vec3<f32>(0.0);

@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X,REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)

fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let tileIndex = global_id.x +
                    global_id.y * pointLight_tileCount.x +
                    global_id.z * pointLight_tileCount.x * pointLight_tileCount.y;
    let tileSize = vec2<f32>(
             systemUniforms.resolution.x / f32(pointLight_tileCount.x),
             systemUniforms.resolution.y / f32(pointLight_tileCount.y)
         );
    let maxPoint_sS = vec4<f32>(vec2<f32>(f32(global_id.x+1u), f32(global_id.y+1u)) * tileSize, -.0, 1.0);
    let minPoint_sS = vec4<f32>(vec2<f32>(f32(global_id.x), f32(global_id.y)) * tileSize, -.0, 1.0);
    let maxPoint_vS = screen2View(maxPoint_sS).xyz;
    let minPoint_vS = screen2View(minPoint_sS).xyz;
    let tileNear = -systemUniforms.nearFar.x * pow(systemUniforms.nearFar.y / systemUniforms.nearFar.x, f32(global_id.z)/f32(pointLight_tileCount.z));
    let tileFar = -systemUniforms.nearFar.x * pow(systemUniforms.nearFar.y / systemUniforms.nearFar.x, f32(global_id.z+1u)/f32(pointLight_tileCount.z));
    let minPointNear = lineIntersectionToZPlane(eyePos, minPoint_vS, tileNear);
    let minPointFar = lineIntersectionToZPlane(eyePos, minPoint_vS, tileFar);
    let maxPointNear = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileNear);
    let maxPointFar = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileFar);
    clusters.cubeList[tileIndex].minAABB = vec4<f32>(min(min(minPointNear, minPointFar),min(maxPointNear, maxPointFar)),0.0);
    clusters.cubeList[tileIndex].maxAABB = vec4<f32>(max(max(minPointNear, minPointFar),max(maxPointNear, maxPointFar)),0.0);
}
