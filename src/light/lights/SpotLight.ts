import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../color/convertHexToRgb";
import ABaseLight from "../core/ABaseLight";

/**
 * 스포트라이트(SpotLight)를 정의하는 클래스입니다.
 *
 * 이 광원은 특정 위치에서 지정된 방향으로 빛을 방사하며,
 * 내부/외부 컷오프 각도를 통해 빛의 퍼짐 범위를 제어할 수 있습니다.
 *
 * @example
 * ```javascript
 * const light = new RedGPU.Light.SpotLight('#ffffff', 2.0);
 * light.setPosition(0, 5, 10);
 * light.lookAt(0, 0, 0);
 * scene.lightManager.addSpotLight(light);
 * ```
 * <iframe src="/RedGPU/examples/3d/light/spotLight/" ></iframe>
 *
 * 아래는 SpotLight 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [SpotLight Cluster Performance example](/RedGPU/examples/3d/light/spotLightPerformance/)
 * @category Light
 */
class SpotLight extends ABaseLight {
    /** 광원의 영향을 미치는 반경입니다. */
    #radius: number = 1;
    /** 광원의 X 좌표입니다. */
    #x: number = 0;
    /** 광원의 Y 좌표입니다. */
    #y: number = 2;
    /** 광원의 Z 좌표입니다. */
    #z: number = 0;
    /** 광원의 방향 벡터 X 성분입니다. */
    #directionX: number = 0;
    /** 광원의 방향 벡터 Y 성분입니다. */
    #directionY: number = -1;
    /** 광원의 방향 벡터 Z 성분입니다. */
    #directionZ: number = 0;
    /** 내부 컷오프 각도 (degree)입니다. */
    #innerCutoff: number = 15.0;
    /** 외부 컷오프 각도 (degree)입니다. */
    #outerCutoff: number = 22.5;

    /**
     * 새로운 SpotLight 인스턴스를 생성합니다.
     *
     * @param color - 광원의 색상 (hex 문자열, 예: '#ffffff')
     * @param intensity - 광원의 세기 (기본값: 1)
     */
    constructor(color: string = '#fff', intensity: number = 1) {
        super(new ColorRGB(...convertHexToRgb(color, true)), intensity);
    }

    /** X 좌표를 반환합니다. */
    get x(): number {
        return this.#x;
    }

    /** X 좌표를 설정합니다. */
    set x(value: number) {
        this.#x = value;
    }

    /** Y 좌표를 반환합니다. */
    get y(): number {
        return this.#y;
    }

    /** Y 좌표를 설정합니다. */
    set y(value: number) {
        this.#y = value;
    }

    /** Z 좌표를 반환합니다. */
    get z(): number {
        return this.#z;
    }

    /** Z 좌표를 설정합니다. */
    set z(value: number) {
        this.#z = value;
    }

    /**
     * 광원의 위치를 [x, y, z] 형태로 반환합니다.
     */
    get position(): [number, number, number] {
        return [this.#x, this.#y, this.#z];
    }

    /** 광원의 반경을 반환합니다. */
    get radius(): number {
        return this.#radius;
    }

    /** 광원의 반경을 설정합니다. */
    set radius(value: number) {
        this.#radius = value;
    }

    /** 방향 벡터의 X 성분을 반환합니다. */
    get directionX(): number {
        return this.#directionX;
    }

    /** 방향 벡터의 X 성분을 설정합니다. */
    set directionX(value: number) {
        this.#directionX = value;
    }

    /** 방향 벡터의 Y 성분을 반환합니다. */
    get directionY(): number {
        return this.#directionY;
    }

    /** 방향 벡터의 Y 성분을 설정합니다. */
    set directionY(value: number) {
        this.#directionY = value;
    }

    /** 방향 벡터의 Z 성분을 반환합니다. */
    get directionZ(): number {
        return this.#directionZ;
    }

    /** 방향 벡터의 Z 성분을 설정합니다. */
    set directionZ(value: number) {
        this.#directionZ = value;
    }

    /**
     * 광원의 방향 벡터를 [x, y, z] 형태로 반환합니다.
     */
    get direction(): [number, number, number] {
        return [this.#directionX, this.#directionY, this.#directionZ];
    }

    /**
     * 광원의 방향 벡터를 설정합니다.
     *
     * @param value - [x, y, z] 형태의 방향 벡터
     */
    set direction(value: [number, number, number]) {
        this.#directionX = value[0];
        this.#directionY = value[1];
        this.#directionZ = value[2];
    }

    /** 내부 컷오프 각도를 반환합니다. */
    get innerCutoff(): number {
        return this.#innerCutoff;
    }

    /** 내부 컷오프 각도를 설정합니다. */
    set innerCutoff(degrees: number) {
        this.#innerCutoff = degrees;
    }

    /** 외부 컷오프 각도를 반환합니다. */
    get outerCutoff(): number {
        return this.#outerCutoff;
    }

    /** 외부 컷오프 각도를 설정합니다. */
    set outerCutoff(degrees: number) {
        this.#outerCutoff = degrees;
    }

    /**
     * 내부 컷오프 각도의 코사인 값을 반환합니다.
     * 셰이더 계산 등에 사용됩니다.
     */
    get innerCutoffCos(): number {
        return Math.cos(this.#innerCutoff * Math.PI / 180);
    }

    /**
     * 외부 컷오프 각도의 코사인 값을 반환합니다.
     * 셰이더 계산 등에 사용됩니다.
     */
    get outerCutoffCos(): number {
        return Math.cos(this.#outerCutoff * Math.PI / 180);
    }

    /**
     * 광원의 위치를 설정합니다.
     *
     * @param x - X 좌표 또는 [x, y, z] 배열
     * @param y - Y 좌표 (x가 숫자일 경우)
     * @param z - Z 좌표 (x가 숫자일 경우)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void {
        if (Array.isArray(x)) {
            [this.#x, this.#y, this.#z] = x;
        } else {
            this.#x = x!;
            this.#y = y!;
            this.#z = z!;
        }
    }

    /**
     * 특정 타겟 위치를 바라보도록 방향 벡터를 설정합니다.
     *
     * @param targetX - 타겟 X 좌표 또는 [x, y, z] 배열
     * @param targetY - 타겟 Y 좌표 (targetX가 숫자일 경우)
     * @param targetZ - 타겟 Z 좌표 (targetX가 숫자일 경우)
     */
    lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void {
        let tx: number, ty: number, tz: number;
        if (Array.isArray(targetX)) {
            [tx, ty, tz] = targetX;
        } else {
            tx = targetX!;
            ty = targetY!;
            tz = targetZ!;
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
