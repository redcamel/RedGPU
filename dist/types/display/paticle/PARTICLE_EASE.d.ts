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
declare const PARTICLE_EASE: {
    readonly Linear: 0;
    readonly QuintIn: 1;
    readonly QuintOut: 2;
    readonly QuintInOut: 3;
    readonly BackIn: 4;
    readonly BackOut: 5;
    readonly BackInOut: 6;
    readonly CircIn: 7;
    readonly CircOut: 8;
    readonly CircInOut: 9;
    readonly CubicIn: 10;
    readonly CubicOut: 11;
    readonly CubicInOut: 12;
    readonly ExpoIn: 13;
    readonly ExpoOut: 14;
    readonly ExpoInOut: 15;
    readonly QuadIn: 16;
    readonly QuadOut: 17;
    readonly QuadInOut: 18;
    readonly QuartIn: 19;
    readonly QuartOut: 20;
    readonly QuartInOut: 21;
    readonly SineIn: 22;
    readonly SineOut: 23;
    readonly SineInOut: 24;
    readonly ElasticIn: 25;
    readonly ElasticOut: 26;
    readonly ElasticInOut: 27;
};
export default PARTICLE_EASE;
