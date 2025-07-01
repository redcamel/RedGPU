fn hash22(p: vec2<f32>) -> vec2<f32> {
    var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
}

fn hash12(p: vec2<f32>) -> f32 {
    var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

fn euclideanDistance(a: vec2<f32>, b: vec2<f32>) -> f32 {
    let d = a - b;
    return sqrt(d.x * d.x + d.y * d.y);
}

fn manhattanDistance(a: vec2<f32>, b: vec2<f32>) -> f32 {
    let d = abs(a - b);
    return d.x + d.y;
}

fn chebyshevDistance(a: vec2<f32>, b: vec2<f32>) -> f32 {
    let d = abs(a - b);
    return max(d.x, d.y);
}

fn calculateDistance(a: vec2<f32>, b: vec2<f32>, distanceType: i32) -> f32 {
    switch (distanceType) {
        case 0: { return euclideanDistance(a, b); }
        case 1: { return manhattanDistance(a, b); }
        case 2: { return chebyshevDistance(a, b); }
        default: { return euclideanDistance(a, b); }
    }
}

// 셀 ID를 컬러로 변환하는 함수
fn cellIdToColor(cellId: f32, intensity: f32) -> vec3<f32> {
    let h = cellId * 6.28318; // 색상 각도
    let s = 0.7 + 0.3 * fract(cellId * 7.0); // 채도
    let v = 0.6 + 0.4 * fract(cellId * 13.0); // 밝기

    // HSV to RGB 변환
    let c = v * s;
    let x = c * (1.0 - abs(((h / 1.047198) % 2.0) - 1.0));
    let m = v - c;

    var rgb: vec3<f32>;
    let sector = i32(h / 1.047198) % 6;
    switch (sector) {
        case 0: { rgb = vec3<f32>(c, x, 0.0); }
        case 1: { rgb = vec3<f32>(x, c, 0.0); }
        case 2: { rgb = vec3<f32>(0.0, c, x); }
        case 3: { rgb = vec3<f32>(0.0, x, c); }
        case 4: { rgb = vec3<f32>(x, 0.0, c); }
        default: { rgb = vec3<f32>(c, 0.0, x); }
    }

    return (rgb + m) * intensity;
}

struct VoronoiResult {
    f1: f32,
    f2: f32,
    cellId: f32,
}

fn voronoiSingle(pos: vec2<f32>, frequency: f32, seed: f32, jitter: f32, distanceType: i32) -> VoronoiResult {
    let scaledPos = pos * frequency;
    let gridPos = floor(scaledPos);
    let localPos = fract(scaledPos);

    var minDist1 = 999.0;
    var minDist2 = 999.0;
    var closestCellId = 0.0;

    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let neighborGrid = gridPos + vec2<f32>(f32(x), f32(y));

            let randomOffset = hash22(neighborGrid + seed);
            let jitteredOffset = mix(vec2<f32>(0.5), randomOffset, jitter);
            let cellPoint = vec2<f32>(f32(x), f32(y)) + jitteredOffset;

            let dist = calculateDistance(localPos, cellPoint, distanceType);

            if (dist < minDist1) {
                minDist2 = minDist1;
                minDist1 = dist;
                // 가장 가까운 셀의 ID 계산
                closestCellId = hash12(neighborGrid + seed);
            } else if (dist < minDist2) {
                minDist2 = dist;
            }
        }
    }

    return VoronoiResult(minDist1, minDist2, closestCellId);
}

fn getVoronoiNoise(uv: vec2<f32>, uniforms: Uniforms) -> f32 {
    var total = 0.0;
    var frequency = uniforms.frequency;
    var amplitude = 1.0;
    var maxValue = 0.0;

    for (var i = 0; i < uniforms.octaves; i++) {
        let voronoiResult = voronoiSingle(
            uv,
            frequency,
            uniforms.seed + f32(i) * 100.0,
            uniforms.jitter,
            uniforms.distanceType
        );

        let F1 = voronoiResult.f1 * uniforms.distanceScale;
        let F2 = voronoiResult.f2 * uniforms.distanceScale;
        let cellId = voronoiResult.cellId;

        var octaveValue: f32;
        switch (uniforms.outputType) {
            case 0: { octaveValue = F1; }
            case 1: { octaveValue = F2; }
            case 2: { octaveValue = F2 - F1; }
            case 3: { octaveValue = (F1 + F2) * 0.5; }
            case 4: { octaveValue = cellId; } // CELL_ID
            case 5: {
                // CELL_ID_COLOR - 컬러 정보를 단일 값으로 인코딩
                let colorRGB = cellIdToColor(cellId, uniforms.cellIdColorIntensity);
                octaveValue = (colorRGB.r + colorRGB.g + colorRGB.b) / 3.0; // 임시로 평균값 사용
            }
            default: { octaveValue = F1; }
        }

        total += octaveValue * amplitude;
        maxValue += amplitude;

        frequency *= uniforms.lacunarity;
        amplitude *= uniforms.persistence;
    }

    return clamp(total / maxValue, 0.0, 1.0);
}

// 컬러 버전의 Voronoi 노이즈 (셀 ID 컬러 출력용)
fn getVoronoiColorNoise(uv: vec2<f32>, uniforms: Uniforms) -> vec3<f32> {
    if (uniforms.outputType == 5) { // CELL_ID_COLOR
        let voronoiResult = voronoiSingle(
            uv,
            uniforms.frequency,
            uniforms.seed,
            uniforms.jitter,
            uniforms.distanceType
        );
        return cellIdToColor(voronoiResult.cellId, uniforms.cellIdColorIntensity);
    } else {
        let grayValue = getVoronoiNoise(uv, uniforms);
        return vec3<f32>(grayValue, grayValue, grayValue);
    }
}
