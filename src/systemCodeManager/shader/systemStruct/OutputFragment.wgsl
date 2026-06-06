/**
 * [KO] 프래그먼트 출력(OutputFragment) 구조체 정의입니다.
 * [EN] Definition of the OutputFragment structure.
 */
struct OutputFragment {
    @location(0) color: vec4<f32>,
    @location(1) gBufferNormal: vec4<f32>,
    @location(2) gBufferMotionVector: vec4<f32>,
}
