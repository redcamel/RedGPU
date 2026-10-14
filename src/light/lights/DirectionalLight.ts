import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 태양광처럼 무한히 먼 거리에서 일정한 방향으로 평행하게 입사하는 직사광(Directional Light) 클래스입니다.
 * [EN] Directional light class that emits parallel light rays in a constant direction as if from an infinitely distant source like the sun.
 *
 * [KO] 위치에 따른 거리 감쇠가 없으며, 직교 방향 벡터(`direction`) 또는 구면 좌표계의 고도각(`elevation`)과 방위각(`azimuth`)을 통해 빛의 입사 방향을 제어할 수 있습니다.
 * [EN] Has no distance attenuation based on position, and the light direction can be controlled via a Cartesian direction vector (`direction`) or spherical coordinates (`elevation` and `azimuth`).
 *
 * ### Example
 * ```typescript
 * const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
 * scene.lightManager.addDirectionalLight(directionalLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" ></iframe>
 *
 * @see [DirectionalLight example](/RedGPU/examples/3d/light/directionalLight/)
 * @category Light
 */
class DirectionalLight extends ABaseLight {
    #directionX: number = -1;
    #directionY: number = -1;
    #directionZ: number = -1;

    #elevation: number = 35.264389682754654;
    #azimuth: number = 45;

    #lux: number = 100000;

    /**
     * [KO] 새로운 DirectionalLight 인스턴스를 생성합니다.
     * [EN] Creates a new DirectionalLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#fff', 100000);
     * ```
     *
     * @param direction -
     * [KO] 빛의 진행 방향 벡터 (`[x, y, z]`, 기본값: `[-1, -1, -1]`)
     * [EN] Light direction vector (`[x, y, z]`, default: `[-1, -1, -1]`)
     * @param color -
     * [KO] 조명의 색상 (HEX 문자열, 기본값: `'#fff'`)
     * [EN] Light color (HEX string, default: `'#fff'`)
     * @param lux -
     * [KO] 조명의 조도 (Lux 단위, 기본값: `100000`)
     * [EN] Illuminance of the light (in Lux, default: `100000`)
     */
    constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', lux: number = 100000) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.direction = direction;
        this.#lux = lux;
    }

    /**
     * [KO] 직사광의 조도(Lux)를 반환하거나 설정합니다.
     * [EN] Gets or sets the illuminance (Lux) of the directional light.
     *
     * @returns
     * [KO] 조도 값 (Lux)
     * [EN] Illuminance value (Lux)
     */
    get lux(): number {
        return this.#lux;
    }

    set lux(value: number) {
        this.#lux = value;
    }

    /**
     * [KO] 광원의 고도각(Elevation, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.
     * [EN] Gets or sets the elevation angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.
     *
     * @returns
     * [KO] 고도각 (도 단위, `degree`)
     * [EN] Elevation angle (in degrees)
     */
    get elevation(): number {
        return this.#elevation;
    }

    set elevation(value: number) {
        this.#elevation = value;
        this.#updateDirectionFromSpherical();
    }

    /**
     * [KO] 광원의 방위각(Azimuth, 도 단위)을 반환하거나 설정합니다. 값을 변경하면 `direction` 벡터가 자동으로 갱신됩니다.
     * [EN] Gets or sets the azimuth angle (in degrees) of the light source. Changing this value automatically updates the `direction` vector.
     *
     * @returns
     * [KO] 방위각 (도 단위, `degree`)
     * [EN] Azimuth angle (in degrees)
     */
    get azimuth(): number {
        return this.#azimuth;
    }

    set azimuth(value: number) {
        this.#azimuth = value;
        this.#updateDirectionFromSpherical();
    }

    /**
     * [KO] 빛의 진행 방향 X 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the X component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 X 성분
     * [EN] X component of the direction vector
     */
    get directionX(): number {
        return this.#directionX;
    }

    set directionX(value: number) {
        this.#directionX = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 빛의 진행 방향 Y 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the Y component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 Y 성분
     * [EN] Y component of the direction vector
     */
    get directionY(): number {
        return this.#directionY;
    }

    set directionY(value: number) {
        this.#directionY = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 빛의 진행 방향 Z 성분을 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the Z component of the light direction. Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터의 Z 성분
     * [EN] Z component of the direction vector
     */
    get directionZ(): number {
        return this.#directionZ;
    }

    set directionZ(value: number) {
        this.#directionZ = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 빛의 진행 방향 벡터(`[x, y, z]`)를 반환하거나 설정합니다. 값을 변경하면 구면 좌표(`elevation`, `azimuth`)가 자동으로 갱신됩니다.
     * [EN] Gets or sets the light direction vector (`[x, y, z]`). Changing this value automatically updates spherical coordinates (`elevation`, `azimuth`).
     *
     * @returns
     * [KO] 방향 벡터 튜플 (`[number, number, number]`)
     * [EN] Direction vector tuple (`[number, number, number]`)
     */
    get direction(): [number, number, number] {
        return [this.#directionX, this.#directionY, this.#directionZ];
    }

    set direction(value: [number, number, number]) {
        this.#directionX = value[0];
        this.#directionY = value[1];
        this.#directionZ = value[2];
        this.#updateSphericalFromDirection();
    }

    #updateDirectionFromSpherical() {
        const el = this.#elevation * Math.PI / 180;
        const az = this.#azimuth * Math.PI / 180;

        const cosEl = Math.cos(el);
        const x = cosEl * Math.cos(az);
        const y = Math.sin(el);
        const z = cosEl * Math.sin(az);

        this.#directionX = -x;
        this.#directionY = -y;
        this.#directionZ = -z;
    }

    #updateSphericalFromDirection() {
        const x = -this.#directionX;
        const y = -this.#directionY;
        const z = -this.#directionZ;

        const len = Math.sqrt(x * x + y * y + z * z);
        const nx = x / len;
        const ny = y / len;
        const nz = z / len;

        this.#elevation = Math.asin(ny) * 180 / Math.PI;
        this.#azimuth = Math.atan2(nz, nx) * 180 / Math.PI;
    }
}

Object.freeze(DirectionalLight);
export default DirectionalLight;
