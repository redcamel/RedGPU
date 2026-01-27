/**
 * [KO] 파티클 애니메이션에 적용되는 이징(Easing) 함수 타입 정의입니다.
 * [EN] Easing function type definitions applied to particle animations.
 *
 * [KO] 파티클의 위치, 회전, 스케일, 알파 등 각 속성의 변화 흐름을 제어하는 다양한 수학적 보간 방식을 제공합니다.
 * [EN] Provides various mathematical interpolation methods to control the change flow of each attribute such as position, rotation, scale, and alpha of particles.
 *
 * * ### Example
 * ```typescript
 * const emitter = new RedGPU.Display.ParticleEmitter(redGPUContext);
 * emitter.easeX = RedGPU.Display.PARTICLE_EASE.CubicOut;
 * emitter.easeAlpha = RedGPU.Display.PARTICLE_EASE.Linear;
 * ```
 * @category Particle
 */
const PARTICLE_EASE = {
    Linear: 0,
    QuintIn: 1,
    QuintOut: 2,
    QuintInOut: 3,
    //
    BackIn: 4,
    BackOut: 5,
    BackInOut: 6,
    //
    CircIn: 7,
    CircOut: 8,
    CircInOut: 9,
    //
    CubicIn: 10,
    CubicOut: 11,
    CubicInOut: 12,
    //
    ExpoIn: 13,
    ExpoOut: 14,
    ExpoInOut: 15,
    //
    QuadIn: 16,
    QuadOut: 17,
    QuadInOut: 18,
    //
    QuartIn: 19,
    QuartOut: 20,
    QuartInOut: 21,
    //
    SineIn: 22,
    SineOut: 23,
    SineInOut: 24,
    ElasticIn: 25,
    ElasticOut: 26,
    ElasticInOut: 27,
} as const
export default PARTICLE_EASE
