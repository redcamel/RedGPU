fn applyCameraOverlay(baseColorIn: vec3<f32>, uv: vec2<f32>, camera: CameraParams) -> vec3<f32> {
    var baseColor = baseColorIn;
    let diff = uv - camera.camUV;
    let distUV = length(diff);

    let panRad = camera.panFovRadius.x;
    let halfFovRad = camera.panFovRadius.y;
    let radiusUV = camera.panFovRadius.z;

    // 1. 로딩 반경 점선 링 (Emerald Green)
    let ringDist = abs(distUV - radiusUV);
    if (ringDist < 0.007 && distUV <= radiusUV + 0.007) {
        let angleDash = sin(atan2(diff.y, diff.x) * 24.0);
        if (angleDash > 0.0) {
            baseColor = mix(baseColor, vec3<f32>(0.2, 0.83, 0.6), 0.85);
        }
    }

    // 2. FOV 시야 부채꼴 (Amber Gold)
    let lookAngle = atan2(-cos(panRad), -sin(panRad));
    let pixelAngle = atan2(diff.y, diff.x);
    let angleDiff = abs(atan2(sin(pixelAngle - lookAngle), cos(pixelAngle - lookAngle)));

    let maxWedgeRadius = min(radiusUV, 0.28);
    if (distUV < maxWedgeRadius && angleDiff < halfFovRad) {
        baseColor = mix(baseColor, vec3<f32>(0.98, 0.75, 0.14), 0.45);
    }

    // 3. 시선 중심 가이드 레이 (Coral Red)
    if (distUV < maxWedgeRadius + 0.06 && angleDiff < 0.02) {
        baseColor = mix(baseColor, vec3<f32>(0.93, 0.27, 0.27), 0.95);
    }

    // 4. 카메라 원점 점 (White Dot with Coral Red Ring)
    if (distUV < 0.014) {
        if (distUV < 0.008) {
            baseColor = vec3<f32>(1.0, 1.0, 1.0);
        } else {
            baseColor = vec3<f32>(0.93, 0.27, 0.27);
        }
    }

    return baseColor;
}
