import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * [KO] 공간의 한 점에서 특정 방향으로 원뿔(Cone) 형태의 빛을 방출하는 스포트라이트(Spot Light) 클래스입니다.
 * [EN] Spot light class that emits a cone-shaped beam of light in a specific direction from a single point in space.
 *
 * [KO] 반경(`radius`)에 따른 거리 감쇠와 함께, 내부 컷오프 각도(`innerCutoff`)와 외부 컷오프 각도(`outerCutoff`) 사이의 부드러운 가장자리 감쇠를 지원합니다.
 * [EN] Supports distance attenuation based on `radius` along with smooth edge falloff between the inner cutoff angle (`innerCutoff`) and outer cutoff angle (`outerCutoff`).
 *
 * ### Example
 * ```typescript
 * const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
 * spotLight.setPosition(0, 5, 5);
 * spotLight.lookAt(0, 0, 0);
 * spotLight.innerCutoff = 15;
 * spotLight.outerCutoff = 30;
 * scene.lightManager.addSpotLight(spotLight);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/spotLight/" ></iframe>
 *
 * @see [SpotLight basic example](/RedGPU/examples/3d/light/spotLight/)
 * @see [SpotLight performance example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @see [SpotLight with GLTF example](/RedGPU/examples/3d/light/spotLightWithGltf/)
 * @category Light
 */
class SpotLight extends ABaseLight {
    #radius: number = 10;
    #x: number = 0;
    #y: number = 2;
    #z: number = 0;
    #directionX: number = 0;
    #directionY: number = -1;
    #directionZ: number = 0;
    #innerCutoff: number = 0.0;
    #outerCutoff: number = 44.0;
    #lumen: number = 1000;

    /**
     * [KO] 새로운 SpotLight 인스턴스를 생성합니다.
     * [EN] Creates a new SpotLight instance.
     *
     * ### Example
     * ```typescript
     * const light = new RedGPU.Light.SpotLight('#ffffff', 1000);
     * ```
     *
     * @param color -
     * [KO] 조명의 색상 (HEX 문자열, 기본값: `'#fff'`)
     * [EN] Light color (HEX string, default: `'#fff'`)
     * @param lumen -
     * [KO] 조명의 광속 (Lumen 단위, 기본값: `1000`)
     * [EN] Luminous flux of the light (in Lumens, default: `1000`)
     */
    constructor(color: string = '#fff', lumen: number = 1000) {
        super(new ColorRGB(...convertHexToRgb(color, true)));
        this.#lumen = lumen;
    }

    /**
     * [KO] 스포트라이트의 광속(Lumen)을 반환하거나 설정합니다.
     * [EN] Gets or sets the luminous flux (Lumen) of the spot light.
     *
     * @returns
     * [KO] 광속 값 (Lumen)
     * [EN] Luminous flux value (Lumen)
     */
    get lumen(): number {
        return this.#lumen;
    }

    set lumen(value: number) {
        this.#lumen = value;
    }

    /**
     * [KO] 광원의 월드 X 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world X coordinate of the light source.
     *
     * @returns
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        this.#x = value;
    }

    /**
     * [KO] 광원의 월드 Y 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world Y coordinate of the light source.
     *
     * @returns
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        this.#y = value;
    }

    /**
     * [KO] 광원의 월드 Z 좌표를 반환하거나 설정합니다.
     * [EN] Gets or sets the world Z coordinate of the light source.
     *
     * @returns
     * [KO] Z축 좌표
     * [EN] Z-axis coordinate
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        this.#z = value;
    }

    /**
     * [KO] 광원의 월드 위치 좌표(`[x, y, z]`)를 반환합니다.
     * [EN] Returns the world position coordinates (`[x, y, z]`) of the light source.
     *
     * @returns
     * [KO] 위치 좌표 튜플 (`[number, number, number]`)
     * [EN] Position coordinate tuple (`[number, number, number]`)
     */
    get position(): [number, number, number] {
        return [this.#x, this.#y, this.#z];
    }

    /**
     * [KO] 빛이 도달하는 최대 감쇠 반경(`radius`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum attenuation radius (`radius`) of the light.
     *
     * @returns
     * [KO] 광원 반경
     * [EN] Light radius
     */
    get radius(): number {
        return this.#radius;
    }

    set radius(value: number) {
        this.#radius = value;
    }

    /**
     * [KO] 빛의 진행 방향 X 성분을 반환하거나 설정합니다.
     * [EN] Gets or sets the X component of the light direction.
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
    }

    /**
     * [KO] 빛의 진행 방향 Y 성분을 반환하거나 설정합니다.
     * [EN] Gets or sets the Y component of the light direction.
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
    }

    /**
     * [KO] 빛의 진행 방향 Z 성분을 반환하거나 설정합니다.
     * [EN] Gets or sets the Z component of the light direction.
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
    }

    /**
     * [KO] 빛의 진행 방향 벡터(`[x, y, z]`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the light direction vector (`[x, y, z]`).
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
    }

    /**
     * [KO] 빛의 세기가 최대로 유지되는 내부 원뿔 각도(도 단위, `degree`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the inner cone cutoff angle (in degrees) within which light intensity remains at maximum.
     *
     * @returns
     * [KO] 내부 컷오프 각도 (도 단위, `degree`)
     * [EN] Inner cutoff angle (in degrees)
     */
    get innerCutoff(): number {
        return this.#innerCutoff;
    }

    set innerCutoff(degrees: number) {
        this.#innerCutoff = degrees;
    }

    /**
     * [KO] 빛이 완전히 소멸하는 외부 원뿔 각도(도 단위, `degree`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the outer cone cutoff angle (in degrees) beyond which light completely falls off.
     *
     * @returns
     * [KO] 외부 컷오프 각도 (도 단위, `degree`)
     * [EN] Outer cutoff angle (in degrees)
     */
    get outerCutoff(): number {
        return this.#outerCutoff;
    }

    set outerCutoff(degrees: number) {
        this.#outerCutoff = degrees;
    }

    /**
     * [KO] 내부 컷오프 각도(`innerCutoff`)의 코사인 값을 반환합니다.
     * [EN] Returns the cosine value of the inner cutoff angle (`innerCutoff`).
     *
     * @returns
     * [KO] `cos(innerCutoff)` 값
     * [EN] `cos(innerCutoff)` value
     */
    get innerCutoffCos(): number {
        return Math.cos(this.#innerCutoff * Math.PI / 180);
    }

    /**
     * [KO] 외부 컷오프 각도(`outerCutoff`)의 코사인 값을 반환합니다.
     * [EN] Returns the cosine value of the outer cutoff angle (`outerCutoff`).
     *
     * @returns
     * [KO] `cos(outerCutoff)` 값
     * [EN] `cos(outerCutoff)` value
     */
    get outerCutoffCos(): number {
        return Math.cos(this.#outerCutoff * Math.PI / 180);
    }

    /**
     * [KO] 광원의 월드 위치를 설정합니다. 개별 좌표(`x, y, z`) 또는 3요소 배열(`[x, y, z]`)을 전달할 수 있습니다.
     * [EN] Sets the world position of the light source. Accepts individual coordinates (`x, y, z`) or a 3-element array (`[x, y, z]`).
     *
     * ### Example
     * ```typescript
     * // [KO] 개별 좌표로 위치 설정
     * // [EN] Set position with individual coordinates
     * spotLight.setPosition(0, 5, 5);
     *
     * // [KO] 배열로 위치 설정
     * // [EN] Set position with an array
     * spotLight.setPosition([0, 5, 5]);
     * ```
     *
     * @param x -
     * [KO] X축 좌표 또는 `[x, y, z]` 좌표 배열
     * [EN] X-axis coordinate or `[x, y, z]` coordinate array
     * @param y -
     * [KO] Y축 좌표 (`x`가 숫자인 경우)
     * [EN] Y-axis coordinate (when `x` is a number)
     * @param z -
     * [KO] Z축 좌표 (`x`가 숫자인 경우)
     * [EN] Z-axis coordinate (when `x` is a number)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void {
        if (Array.isArray(x)) {
            [this.#x, this.#y, this.#z] = x;
        } else {
            this.#x = x as number;
            this.#y = y as number;
            this.#z = z as number;
        }
    }

    /**
     * [KO] 광원이 지정된 목표 지점을 바라보도록 방향 벡터(`direction`)를 계산하여 갱신합니다.
     * [EN] Calculates and updates the direction vector (`direction`) so that the light points toward the specified target position.
     *
     * ### Example
     * ```typescript
     * // [KO] 원점을 바라보도록 방향 설정
     * // [EN] Point the light toward the origin
     * spotLight.lookAt(0, 0, 0);
     * ```
     *
     * @param targetX -
     * [KO] 목표 지점의 X 좌표 또는 `[x, y, z]` 좌표 배열
     * [EN] Target X coordinate or `[x, y, z]` coordinate array
     * @param targetY -
     * [KO] 목표 지점의 Y 좌표 (`targetX`가 숫자인 경우)
     * [EN] Target Y coordinate (when `targetX` is a number)
     * @param targetZ -
     * [KO] 목표 지점의 Z 좌표 (`targetX`가 숫자인 경우)
     * [EN] Target Z coordinate (when `targetX` is a number)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void {
        let tx: number, ty: number, tz: number;
        if (Array.isArray(targetX)) {
            [tx, ty, tz] = targetX;
        } else {
            tx = targetX as number;
            ty = targetY as number;
            tz = targetZ as number;
        }
        const dx = tx - this.#x;
        const dy = ty - this.#y;
        const dz = tz - this.#z;
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (length > 0) {
            this.#directionX = dx / length;
            this.#directionY = dy / length;
            this.#directionZ = dz / length;
        }
    }
}

Object.freeze(SpotLight);
export default SpotLight;
