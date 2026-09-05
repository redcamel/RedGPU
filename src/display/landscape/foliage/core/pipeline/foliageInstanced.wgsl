#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    hasHierarchyTransform: u32,
    pad1: u32,
    pad2: u32,
};

@group(1) @binding(0) var<uniform> subMeshUniforms: SubMeshUniforms;

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) uv1 : vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,

    @location(6) instancePos_scaleY : vec4<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScaleXZ : vec2<f32>,
    @location(9) instanceFade : f32,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,
    @location(6) instanceRotQuat: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> OutputData {
    var output : OutputData;

    let instancePos = input.instancePos_scaleY.xyz;
    let scaleY = input.instancePos_scaleY.w;

    
    
    let instanceRotQuat = input.instanceRotQuat;
    let instanceScale = vec3<f32>(input.instanceScaleXZ.x, scaleY, input.instanceScaleXZ.y);

    let combinedOpacity = input.instanceFade;

    var hierarchyPos = input.position;
    var hierarchyNormal = input.vertexNormal;
    var hierarchyTangent = input.vertexTangent.xyz;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
        hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexNormal, 0.0)).xyz;
        hierarchyTangent = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexTangent.xyz, 0.0)).xyz;
    }

    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, instanceRotQuat);

    var worldPos = rotatedPos + instancePos;
    var worldNormal = vec3<f32>(0.0, 1.0, 0.0);

    let isImpostor = (input.vertexTangent.w < -500.0);
    if (isImpostor) {
        
        
        
        let rightXZ = vec2<f32>(systemUniforms.camera.viewMatrix[0][0], systemUniforms.camera.viewMatrix[2][0]);
        let rightLenSq = dot(rightXZ, rightXZ);
        let billboardRight = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(rightXZ.x, 0.0, rightXZ.y) * inverseSqrt(rightLenSq), rightLenSq > 0.0001);
        let billboardUp = vec3<f32>(0.0, 1.0, 0.0);

        let centerYLocal = hierarchyPos.z;
        let treeCenter = instancePos + vec3<f32>(0.0, centerYLocal * safeScale.y, 0.0);
        let toCam = systemUniforms.camera.cameraPosition.xyz - treeCenter;

        let impostorOffset = billboardRight * (hierarchyPos.x * safeScale.x) + billboardUp * (hierarchyPos.y * safeScale.y);
        worldPos = treeCenter + impostorOffset;
        worldNormal = vec3<f32>(-billboardRight.z, 0.0, billboardRight.x);

        let invQuat = vec4<f32>(-instanceRotQuat.xyz, instanceRotQuat.w);
        let localView = normalize(rotateVectorByQuaternion(toCam, invQuat));
        output.vertexTangent = vec4<f32>(localView, -999.0);
    } else {
        if (dot(hierarchyNormal, hierarchyNormal) > 0.0001) {
            let scaledNormal = hierarchyNormal / safeScale;
            worldNormal = normalize(rotateVectorByQuaternion(scaledNormal, instanceRotQuat));
        }

        var inTan = hierarchyTangent;
        if (dot(inTan, inTan) < 0.0001) {
            var rawT = vec3<f32>(1.0, 0.0, 0.0);
            if (abs(hierarchyNormal.x) > 0.9) { rawT = vec3<f32>(0.0, 1.0, 0.0); }
            inTan = normalize(cross(hierarchyNormal, rawT));
        }
        let scaledTangent = inTan * safeScale;
        let worldTangent = normalize(rotateVectorByQuaternion(scaledTangent, instanceRotQuat));
        let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
        output.vertexTangent = vec4<f32>(worldTangent, tanW);
    }

    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv1;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.instanceRotQuat = instanceRotQuat;
    output.vertexColor_0 = input.vertexColor_0;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(safeScale.x, safeScale.y);

    output.combinedOpacity = combinedOpacity;
    output.receiveShadow = 1.0;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);

    return output;
}




struct FoliageShadowOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
};

@vertex
fn entryPointShadowVertex(input : VertexInput) -> FoliageShadowOutput {
    var output : FoliageShadowOutput;
    output.vertexTangent = input.vertexTangent;

    let instancePos = input.instancePos_scaleY.xyz;
    let scaleY = input.instancePos_scaleY.w;

    
    
    let instanceRotQuat = input.instanceRotQuat;
    let instanceScale = vec3<f32>(input.instanceScaleXZ.x, scaleY, input.instanceScaleXZ.y);

    let combinedOpacity = input.instanceFade;

    var hierarchyPos = input.position;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    }

    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, instanceRotQuat);

    var worldPos = rotatedPos + instancePos;

    let isImpostor = (input.vertexTangent.w < -500.0);
    if (isImpostor) {
        
        var billboardRight = vec3<f32>(1.0, 0.0, 0.0);
        var lightForward = vec3<f32>(0.0, 0.0, 1.0);
        if (systemUniforms.directionalLightCount > 0u) {
            let lightDir = -normalize(systemUniforms.directionalLights[0].direction);
            let crossUp = cross(vec3<f32>(0.0, 1.0, 0.0), lightDir);
            let crossLenSq = dot(crossUp, crossUp);
            if (crossLenSq > 0.0001) {
                billboardRight = crossUp * inverseSqrt(crossLenSq);
            }
            lightForward = lightDir;
        }
        let billboardUp = vec3<f32>(0.0, 1.0, 0.0);

        let centerYLocal = hierarchyPos.z;
        let treeCenter = instancePos + vec3<f32>(0.0, centerYLocal * safeScale.y, 0.0);

        let impostorOffset = billboardRight * (hierarchyPos.x * safeScale.x) + billboardUp * (hierarchyPos.y * safeScale.y);
        worldPos = treeCenter + impostorOffset;

        let invQuat = vec4<f32>(-instanceRotQuat.xyz, instanceRotQuat.w);
        let localLightDir = normalize(rotateVectorByQuaternion(lightForward, invQuat));
        output.vertexTangent = vec4<f32>(localLightDir, -999.0);
    }

    let clipPos = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);

    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.uv = input.uv;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.combinedOpacity = combinedOpacity;

    return output;
}



struct ShadowOpaqueVertexInput {
    @location(0) position : vec3<f32>,

    @location(6) instancePos_scaleY : vec4<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScaleXZ : vec2<f32>,
};




struct FoliageShadowOpaqueOutput {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn entryPointShadowOpaqueVertex(input : ShadowOpaqueVertexInput) -> FoliageShadowOpaqueOutput {
    var output : FoliageShadowOpaqueOutput;

    let instancePos = input.instancePos_scaleY.xyz;
    let scaleY = input.instancePos_scaleY.w;

    let instanceRotQuat = input.instanceRotQuat;
    let instanceScale = vec3<f32>(input.instanceScaleXZ.x, scaleY, input.instanceScaleXZ.y);

    var hierarchyPos = input.position;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    }

    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, instanceRotQuat);

    let worldPos = rotatedPos + instancePos;

    output.position = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    return output;
}


