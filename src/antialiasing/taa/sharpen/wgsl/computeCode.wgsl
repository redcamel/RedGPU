{
    let screenSizeU = textureDimensions(sourceTexture);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // 🚀 [1단계: LDS 협력 로딩 (Cooperative LDS Loading)]
    // 8x8 타일 + 1픽셀 외곽 패딩 = 10x10 (총 100개 픽셀)을 64개 스레드가 협동 로드
    // VRAM 텍스처 접근: 픽셀당 5회(총 320회) ➡️ 100회로 68.75% 급감
    let tileOrigin = vec2<i32>(workgroup_id.xy) * 8 - vec2<i32>(1, 1);
    let tid = i32(local_invocation_index);

    // 1차 로드 (스레드 0~63 ➡️ 슬롯 0~63)
    let lx0 = tid % 10;
    let ly0 = tid / 10;
    let coord0 = clamp(tileOrigin + vec2<i32>(lx0, ly0), vec2<i32>(0), c_max);
    s_sharpenColor[ly0][lx0] = textureLoad(sourceTexture, coord0, 0);

    // 2차 로드 (스레드 0~35 ➡️ 슬롯 64~99)
    let tid2 = tid + 64;
    if (tid2 < 100) {
        let lx1 = tid2 % 10;
        let ly1 = tid2 / 10;
        let coord1 = clamp(tileOrigin + vec2<i32>(lx1, ly1), vec2<i32>(0), c_max);
        s_sharpenColor[ly1][lx1] = textureLoad(sourceTexture, coord1, 0);
    }

    // 워크그룹 전체 100개 픽셀 로딩 완료 동기화
    workgroupBarrier();

    // 화면 경계 밖 스레드는 동기화 이후 안전하게 종료
    let pixelCoord = vec2<i32>(global_id.xy);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 🚀 [2단계: 온칩 SRAM 십자 5-Tap 라플라시안 샤프닝 (VRAM 접근 0회)]
    let localCoord = vec2<i32>(local_id.xy) + vec2<i32>(1, 1);

    let centerRGBA = s_sharpenColor[localCoord.y][localCoord.x];
    let leftRGBA   = s_sharpenColor[localCoord.y][localCoord.x - 1];
    let rightRGBA  = s_sharpenColor[localCoord.y][localCoord.x + 1];
    let upRGBA     = s_sharpenColor[localCoord.y - 1][localCoord.x];
    let downRGBA   = s_sharpenColor[localCoord.y + 1][localCoord.x];

    // 로컬 대비(Contrast) 분석
    let lCenter = getLuminance(centerRGBA.rgb);
    let lLeft   = getLuminance(leftRGBA.rgb);
    let lRight  = getLuminance(rightRGBA.rgb);
    let lUp     = getLuminance(upRGBA.rgb);
    let lDown   = getLuminance(downRGBA.rgb);

    let minL = min(lCenter, min(min(lLeft, lRight), min(lUp, lDown)));
    let maxL = max(lCenter, max(max(lLeft, lRight), max(lUp, lDown)));
    let contrast = maxL - minL;

    // 엣지 보존형 샤프닝 적용
    var finalRGBA: vec4<f32>;
    let k = uniforms.sharpness * 0.2;

    if (contrast > 0.001) {
        let edgeRGB = 4.0 * centerRGBA.rgb - (leftRGBA.rgb + rightRGBA.rgb + upRGBA.rgb + downRGBA.rgb);
        let sharpRGB = centerRGBA.rgb + edgeRGB * k;

        let edgeAlpha = 4.0 * centerRGBA.a - (leftRGBA.a + rightRGBA.a + upRGBA.a + downRGBA.a);
        let sharpAlpha = centerRGBA.a + edgeAlpha * k;

        finalRGBA = vec4<f32>(sharpRGB, sharpAlpha);
    } else {
        finalRGBA = centerRGBA;
    }

    // 결과 저장 (안전한 LDR 범위 보장)
    textureStore(outputTexture, vec2<u32>(pixelCoord), saturate(finalRGBA));
}
