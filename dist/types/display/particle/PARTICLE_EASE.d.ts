/**
 * [KO] 파티클 애니메이션에 적용되는 이징(Easing) 함수 상수 정의입니다.
 * [EN] Easing function constant definitions applied to particle animations.
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
    /** [KO] 선형 보간 [EN] Linear interpolation */
    readonly Linear: 0;
    /** [KO] 5차 곡선 인 [EN] Quintic ease-in */
    readonly QuintIn: 1;
    /** [KO] 5차 곡선 아웃 [EN] Quintic ease-out */
    readonly QuintOut: 2;
    /** [KO] 5차 곡선 인-아웃 [EN] Quintic ease-in-out */
    readonly QuintInOut: 3;
    /** [KO] 백 인 [EN] Back ease-in */
    readonly BackIn: 4;
    /** [KO] 백 아웃 [EN] Back ease-out */
    readonly BackOut: 5;
    /** [KO] 백 인-아웃 [EN] Back ease-in-out */
    readonly BackInOut: 6;
    /** [KO] 원형 인 [EN] Circular ease-in */
    readonly CircIn: 7;
    /** [KO] 원형 아웃 [EN] Circular ease-out */
    readonly CircOut: 8;
    /** [KO] 원형 인-아웃 [EN] Circular ease-in-out */
    readonly CircInOut: 9;
    /** [KO] 3차 곡선 인 [EN] Cubic ease-in */
    readonly CubicIn: 10;
    /** [KO] 3차 곡선 아웃 [EN] Cubic ease-out */
    readonly CubicOut: 11;
    /** [KO] 3차 곡선 인-아웃 [EN] Cubic ease-in-out */
    readonly CubicInOut: 12;
    /** [KO] 지수 곡선 인 [EN] Exponential ease-in */
    readonly ExpoIn: 13;
    /** [KO] 지수 곡선 아웃 [EN] Exponential ease-out */
    readonly ExpoOut: 14;
    /** [KO] 지수 곡선 인-아웃 [EN] Exponential ease-in-out */
    readonly ExpoInOut: 15;
    /** [KO] 2차 곡선 인 [EN] Quadratic ease-in */
    readonly QuadIn: 16;
    /** [KO] 2차 곡선 아웃 [EN] Quadratic ease-out */
    readonly QuadOut: 17;
    /** [KO] 2차 곡선 인-아웃 [EN] Quadratic ease-in-out */
    readonly QuadInOut: 18;
    /** [KO] 4차 곡선 인 [EN] Quartic ease-in */
    readonly QuartIn: 19;
    /** [KO] 4차 곡선 아웃 [EN] Quartic ease-out */
    readonly QuartOut: 20;
    /** [KO] 4차 곡선 인-아웃 [EN] Quartic ease-in-out */
    readonly QuartInOut: 21;
    /** [KO] 사인 곡선 인 [EN] Sine ease-in */
    readonly SineIn: 22;
    /** [KO] 사인 곡선 아웃 [EN] Sine ease-out */
    readonly SineOut: 23;
    /** [KO] 사인 곡선 인-아웃 [EN] Sine ease-in-out */
    readonly SineInOut: 24;
    /** [KO] 탄성 인 [EN] Elastic ease-in */
    readonly ElasticIn: 25;
    /** [KO] 탄성 아웃 [EN] Elastic ease-out */
    readonly ElasticOut: 26;
    /** [KO] 탄성 인-아웃 [EN] Elastic ease-in-out */
    readonly ElasticInOut: 27;
};
export default PARTICLE_EASE;
