import Scene from "../display/scene/Scene";

/**
 * [KO] 씬 전체의 대기 바람 물리 시뮬레이션을 총괄하는 환경 관리자입니다.
 * [EN] Environmental manager overseeing atmospheric wind physics simulation across the entire scene.
 * ::: warning
 * [KO] 이 클래스는 Scene에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the Scene.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // 씬에서 바람 매니저 접근 (Access wind manager from scene)
 * const windManager = scene.windManager;
 *
 * // 바람 속성 설정 (Configure wind properties)
 * windManager.direction = [1, 0, 0.5];
 * windManager.speed = 2.0;
 * windManager.strength = 1.5;
 * ```
 *
 * @category Environment
 */
export default class WindManager {
    #scene: Scene;
    #direction: [number, number, number] = [1, 0, 0];
    #speed: number = 1.0;
    #strength: number = 1.0;
    #frequency: number = 1.0;
    #flutterStrength: number = 0.5;
    #enabled: boolean = true;

    /**
     * [KO] WindManager 인스턴스를 생성합니다.
     * [EN] Creates a WindManager instance.
     * @param scene [KO] 소속된 씬 인스턴스 [EN] The parent Scene instance
     */
    constructor(scene: Scene) {
        this.#scene = scene;
    }

    /**
     * [KO] 소속된 씬(Scene) 인스턴스를 반환합니다.
     * [EN] Returns the parent Scene instance.
     */
    get scene(): Scene {
        return this.#scene;
    }

    /**
     * [KO] 바람이 불어가는 진행 방향 단위 벡터 [X, Y, Z]를 반환하거나 설정합니다. (설정 시 자동 정규화)
     * [EN] Returns or sets the unit direction vector [X, Y, Z] of the wind. (Automatically normalized upon setting)
     */
    get direction(): [number, number, number] {
        return this.#direction;
    }

    set direction(value: [number, number, number]) {
        const x = value[0];
        const y = value[1];
        const z = value[2];
        const len = Math.hypot(x, y, z) || 1.0;
        this.#direction[0] = x / len;
        this.#direction[1] = y / len;
        this.#direction[2] = z / len;
    }

    /**
     * [KO] 바람의 수평 진행 방향 각도를 반환합니다. (XZ 평면, 단위: 도(degree), 0° ~ 360°)
     * [EN] Returns the horizontal wind direction angle in degrees on the XZ plane (0° to 360°).
     */
    get directionAngle(): number {
        const rad = Math.atan2(this.#direction[2], this.#direction[0]);
        let deg = rad * (180.0 / Math.PI);
        if (deg < 0) deg += 360;
        return deg;
    }

    /**
     * [KO] 바람의 수평 진행 방향 각도를 설정합니다. (XZ 평면, 단위: 도(degree))
     * [EN] Sets the horizontal wind direction angle in degrees on the XZ plane.
     */
    set directionAngle(deg: number) {
        const rad = deg * (Math.PI / 180.0);
        this.direction = [Math.cos(rad), this.#direction[1], Math.sin(rad)];
    }

    /**
     * [KO] 바람의 이동 속도(시간 배율)를 반환하거나 설정합니다.
     * [EN] Returns or sets the wind movement speed (time multiplier).
     */
    get speed(): number {
        return this.#speed;
    }

    set speed(value: number) {
        this.#speed = value;
    }

    /**
     * [KO] 줄기 및 식생 본체의 주 굽힘 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the main bending strength of stems and main foliage bodies.
     */
    get strength(): number {
        return this.#strength;
    }

    set strength(value: number) {
        this.#strength = value;
    }

    /**
     * [KO] 바람 진동 주파수(물결 주기 배율)를 반환하거나 설정합니다.
     * [EN] Returns or sets the wind oscillation frequency (wave cycle multiplier).
     */
    get frequency(): number {
        return this.#frequency;
    }

    set frequency(value: number) {
        this.#frequency = value;
    }

    /**
     * [KO] 잎사귀 및 잔가지의 미세 떨림 강도를 반환하거나 설정합니다.
     * [EN] Returns or sets the flutter strength of leaves and twigs.
     */
    get flutterStrength(): number {
        return this.#flutterStrength;
    }

    set flutterStrength(value: number) {
        this.#flutterStrength = value;
    }

    /**
     * [KO] 바람 효과의 활성화 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether the wind effect is enabled.
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(value: boolean) {
        this.#enabled = value;
    }
}
