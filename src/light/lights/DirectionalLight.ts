import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 방향성 광원을 정의하는 클래스입니다.
 * [EN] Class that defines a directional light source.
 *
 * [KO] 이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다. 위치 기반이 아닌 방향 기반으로 작동하며, 그림자 생성 및 광원 시뮬레이션에 적합합니다.
 * [EN] This light projects light uniformly in a specific direction and is used to implement effects like sunlight. It operates based on direction rather than position and is suitable for shadow generation and light simulation.
 * * ### Example
 * ```typescript
 * const light = new RedGPU.Light.DirectionalLight();
 * scene.lightManager.addDirectionalLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" ></iframe>
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
     * @param direction -
     * [KO] 광원의 방향 벡터 [x, y, z]
     * [EN] Direction vector of the light [x, y, z]
     * @param color -
     * [KO] 광원의 색상 (hex 문자열, 예: '#ffcc00')
     * [EN] Color of the light (hex string, e.g., '#ffcc00')
     * @param lux -
     * [KO] 광원의 조도 (Lux, lx, 기본값: 100,000)
     * [EN] Illuminance of the light (Lux, lx, default: 100,000)
     */
    constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', lux: number = 100000) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.direction = direction;
        this.#lux = lux;
    }

    /**
     * [KO] 광원의 조도(Lux, lx)를 반환합니다.
     * [EN] Returns the illuminance (Lux, lx) of the light source.
     * @returns
     * [KO] 조도 값
     * [EN] Illuminance value
     */
    get lux(): number {
        return this.#lux;
    }

    /**
     * [KO] 광원의 조도(Lux, lx)를 설정합니다.
     * [EN] Sets the illuminance (Lux, lx) of the light source.
     * @param value -
     * [KO] 조도 값 (예: 100,000)
     * [EN] Illuminance value (e.g., 100,000)
     */
    set lux(value: number) {
        this.#lux = value;
    }

    /**
     * [KO] 광원의 고도(Elevation, 도)입니다.
     * [EN] Elevation of the light source (degrees).
     */
    get elevation(): number {
        return this.#elevation;
    }

    set elevation(value: number) {
        this.#elevation = value;
        this.#updateDirectionFromSpherical();
    }

    /**
     * [KO] 광원의 방위각(Azimuth, 도)입니다.
     * [EN] Azimuth of the light source (degrees).
     */
    get azimuth(): number {
        return this.#azimuth;
    }

    set azimuth(value: number) {
        this.#azimuth = value;
        this.#updateDirectionFromSpherical();
    }

    /**
     * [KO] 광원의 X 방향 벡터 값입니다.
     * [EN] X direction vector value of the light.
     */
    get directionX(): number {
        return this.#directionX;
    }

    set directionX(value: number) {
        this.#directionX = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 광원의 Y 방향 벡터 값입니다.
     * [EN] Y direction vector value of the light.
     */
    get directionY(): number {
        return this.#directionY;
    }

    set directionY(value: number) {
        this.#directionY = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 광원의 Z 방향 벡터 값입니다.
     * [EN] Z direction vector value of the light.
     */
    get directionZ(): number {
        return this.#directionZ;
    }

    set directionZ(value: number) {
        this.#directionZ = value;
        this.#updateSphericalFromDirection();
    }

    /**
     * [KO] 광원의 전체 방향 벡터를 반환합니다.
     * [EN] Returns the full direction vector of the light.
     */
    get direction(): [number, number, number] {
        return [this.#directionX, this.#directionY, this.#directionZ];
    }

    /**
     * [KO] 광원의 전체 방향 벡터를 설정합니다.
     * [EN] Sets the full direction vector of the light.
     */
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

        // [KO] 라이트의 방향은 "광원에서 지면으로" 향하므로 태양 방향의 역벡터를 사용합니다.
        // [EN] Since the light direction is "from light to surface", use the inverse vector of the sun direction.
        this.#directionX = -x;
        this.#directionY = -y;
        this.#directionZ = -z;
    }

    #updateSphericalFromDirection() {
        // [KO] 라이트 방향 벡터의 역벡터(지면에서 광원을 향하는 방향)를 사용하여 각도 계산
        // [EN] Calculate angles using the inverse light direction vector (direction from surface to light)
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
