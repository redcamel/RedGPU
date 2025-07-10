struct Uniforms {
    focusDistance: f32,
    aperture: f32,
    maxCoC: f32,
    nearPlane: f32,
    farPlane: f32,
};

fn linearizeDepth(depth: f32) -> f32 {
    let z = depth * 2.0 - 1.0;
    return (2.0 * uniforms.nearPlane * uniforms.farPlane) /
           (uniforms.farPlane + uniforms.nearPlane - z * (uniforms.farPlane - uniforms.nearPlane));
}

/* CoC 값을 0~1 범위로 인코딩 */
fn encodeCoC(coc: f32) -> f32 {
    return (coc + 1.0) * 0.5;
}

fn calculateCoC(linearDepth: f32) -> f32 {
    let subjectDistance = linearDepth;
    let focalLength = 50.0;

    let focusRange = uniforms.focusDistance * 0.15;
    let transitionRange = uniforms.focusDistance * 0.35;

    let distanceFromFocus = abs(subjectDistance - uniforms.focusDistance);


    if (distanceFromFocus < focusRange) {
        let focusFactor = smoothstep(0.0, focusRange, distanceFromFocus);
        return mix(0.0, 0.02, focusFactor); /* 완전히 0이 아닌 미세한 값 */
    }


    var rawCoC: f32;
    var signedCoC: f32;

    if (subjectDistance < uniforms.focusDistance) {
        /* Near field 처리 */
        let nearDistance = uniforms.focusDistance - subjectDistance;
        let nearFactor = nearDistance / uniforms.focusDistance;

        rawCoC = (uniforms.aperture * focalLength * nearDistance) /
                 (subjectDistance * (uniforms.focusDistance - focalLength));

        /* Near 필드 강화 (하지만 부드럽게) */
        rawCoC = rawCoC * (1.0 + nearFactor * 1.5); /* 2.0 → 1.5로 완화 */

        signedCoC = -(rawCoC / uniforms.maxCoC);

        /* 🎯 부드러운 강화 적용 */
        let absCoC = abs(signedCoC);
        if (absCoC > 0.05) {
            /* 급격한 증폭 대신 부드러운 곡선 사용 */
            signedCoC = -min(1.0, absCoC * smoothstep(0.05, 0.3, absCoC) * 1.5);
        }

        /* 🎯 전환 영역에서 추가 부드러움 */
        if (distanceFromFocus < transitionRange) {
            let transitionFactor = smoothstep(focusRange, transitionRange, distanceFromFocus);
            signedCoC = mix(0.0, signedCoC, transitionFactor);
        }

        return clamp(signedCoC, -1.0, 0.0);
    } else {
        /* Far field 처리 */
        let farDistance = subjectDistance - uniforms.focusDistance;

        rawCoC = (uniforms.aperture * focalLength * farDistance) /
                 (subjectDistance * (uniforms.focusDistance + focalLength));

        rawCoC = rawCoC * (1.0 + farDistance * 0.08); /* 0.1 → 0.08로 완화 */

        signedCoC = rawCoC / uniforms.maxCoC;


        let absCoC = abs(signedCoC);
        if (absCoC > 0.1) {
            signedCoC = min(1.0, absCoC * smoothstep(0.1, 0.5, absCoC) * 1.2);
        }


        if (distanceFromFocus < transitionRange) {
            let transitionFactor = smoothstep(focusRange, transitionRange, distanceFromFocus);
            signedCoC = mix(0.0, signedCoC, transitionFactor);
        }

        return clamp(signedCoC, 0.0, 1.0);
    }
}
