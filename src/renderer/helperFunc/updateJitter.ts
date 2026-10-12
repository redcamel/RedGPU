import View3D from "../../display/view/View3D";

const haltonSequence = (index: number, base: number): number => {
    let result = 0;
    let f = 1;
    let i = index;
    while (i > 0) {
        f = f / base;
        result = result + f * (i % base);
        i = Math.floor(i / base);
    }
    return result;
}
const updateJitter = (view: View3D) => {
    const {taa} = view;
    const frameIndex = taa.frameIndex || 0;
    const jitterScale = taa.jitterStrength; // 보통 1.0 권장
    const sampleCount = 16;
    const currentSample = frameIndex % sampleCount;

    // Halton 시퀀스 (0~1 범위)
    const haltonX = haltonSequence(currentSample + 1, 2);
    const haltonY = haltonSequence(currentSample + 1, 3);

    // 물리적 픽셀 기준의 오프셋 계산: (halton - 0.5)는 [-0.5, 0.5] 물리 반 픽셀 범위
    const jitterX = (haltonX - 0.5) * jitterScale;
    const jitterY = (haltonY - 0.5) * jitterScale;

    view.setJitterOffset(jitterX, jitterY);
}

export default updateJitter