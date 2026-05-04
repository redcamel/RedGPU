import View3D from "../../display/view/View3D";
const haltonSequence = (index: number, base: number): number=> {
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
const updateJitter = (view: View3D)=>{
    const {taa} = view;
    const frameIndex = taa.frameIndex || 0;
    const jitterScale = taa.jitterStrength; // 보통 1.0 권장
    const sampleCount = 16;
    const currentSample = frameIndex % sampleCount;

    // Halton 시퀀스 (0~1 범위)
    const haltonX = haltonSequence(currentSample + 1, 2);
    const haltonY = haltonSequence(currentSample + 1, 3);

    // 1. 디바이스 픽셀 비율 가져오기
    const dpr = window.devicePixelRatio || 1;
    // const dpr =  1;

    // 2. 물리적 픽셀 기준의 오프셋 계산
    // (halton - 0.5)는 [-0.5, 0.5] 범위.
    // 이를 dpr로 나누어 논리적 좌표계에서의 '물리적 반 픽셀' 범위를 잡습니다.
    const jitterX = ((haltonX - 0.5) / dpr) * jitterScale;
    const jitterY = ((haltonY - 0.5) / dpr) * jitterScale;

    view.setJitterOffset(jitterX, jitterY);
}

export default updateJitter