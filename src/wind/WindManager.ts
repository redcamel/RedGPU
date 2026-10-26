import Scene from "../display/scene/Scene";

/**
 * [KO] 씬 전역의 바람 방향, 속도, 세기를 관리하는 클래스로, Scene에 의해 내부적으로 자동 생성됩니다.
 * [EN] Class that manages scene-wide wind direction, speed, and strength; automatically created internally by the Scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const windManager = scene.windManager;
 * windManager.directionAngle = 45;
 * windManager.speed = 2.0;
 * windManager.strength = 1.5;
 * ```
 *
 * @category Environment
 */
class WindManager {
    #scene: Scene;
    #directionAngle: number = 0;
    #directionX: number = 1.0;
    #directionZ: number = 0.0;
    #speed: number = 1.0;
    #strength: number = 1.0;
    #enabled: boolean = true;

    /**
     * [KO] WindManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a WindManager instance. (Internal system only)
     *
     * @param scene -
     * [KO] 소속 Scene 인스턴스
     * [EN] Parent Scene instance
     */
    constructor(scene: Scene) {
        this.#scene = scene;
    }

    /**
     * [KO] 소속 Scene 인스턴스를 반환합니다.
     * [EN] Returns the parent Scene instance.
     *
     * @returns
     * [KO] 소속 Scene
     * [EN] Parent Scene
     */
    get scene(): Scene {
        return this.#scene;
    }

    /**
     * [KO] XZ 평면 기준 바람의 수평 진행 방향 각도입니다. (단위: degree, 0 ~ 360, 기본값: 0)
     * [EN] Horizontal wind direction angle on the XZ plane. (Unit: degree, 0 ~ 360, default: 0)
     *
     * ### Example
     * ```typescript
     * scene.windManager.directionAngle = 45;
     * ```
     *
     * @returns
     * [KO] 방향 각도 (degree)
     * [EN] Direction angle (degree)
     */
    get directionAngle(): number {
        return this.#directionAngle;
    }

    set directionAngle(deg: number) {
        this.#directionAngle = deg;
        const rad = deg * (Math.PI / 180.0);
        this.#directionX = Math.cos(rad);
        this.#directionZ = Math.sin(rad);
    }

    /**
     * [KO] 바람 진행 방향의 정규화된 X 성분 (`cos(directionAngle)`)을 반환합니다.
     * [EN] Returns the normalized X component (`cos(directionAngle)`) of the wind direction.
     *
     * @returns
     * [KO] 정규화된 X 방향 성분
     * [EN] Normalized X direction component
     */
    get directionX(): number {
        return this.#directionX;
    }

    /**
     * [KO] 바람 진행 방향의 정규화된 Z 성분 (`sin(directionAngle)`)을 반환합니다.
     * [EN] Returns the normalized Z component (`sin(directionAngle)`) of the wind direction.
     *
     * @returns
     * [KO] 정규화된 Z 방향 성분
     * [EN] Normalized Z direction component
     */
    get directionZ(): number {
        return this.#directionZ;
    }

    /**
     * [KO] 바람 애니메이션의 시간 배율입니다. (기본값: 1.0)
     * [EN] Time multiplier of the wind animation. (default: 1.0)
     *
     * @returns
     * [KO] 속도 배율
     * [EN] Speed multiplier
     */
    get speed(): number {
        return this.#speed;
    }

    set speed(value: number) {
        this.#speed = value;
    }

    /**
     * [KO] 바람의 기본 세기(풍압)입니다. (기본값: 1.0)
     * [EN] Base wind strength (force). (default: 1.0)
     *
     * @returns
     * [KO] 바람 세기
     * [EN] Wind strength
     */
    get strength(): number {
        return this.#strength;
    }

    set strength(value: number) {
        this.#strength = value;
    }

    /**
     * [KO] 바람 효과 활성화 여부입니다. (기본값: true)
     * [EN] Whether the wind effect is enabled. (default: true)
     *
     * @returns
     * [KO] 활성화 여부
     * [EN] Enabled state
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(value: boolean) {
        this.#enabled = value;
    }
}

Object.freeze(WindManager);
export default WindManager;
