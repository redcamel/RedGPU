struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    // [KO] 빌보드 객체는 기본적으로 그림자를 생성하지 않도록 빈 데이터를 반환합니다.
    // [EN] Billboard objects return empty data as they do not generate shadows by default.
    return output;
}