import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import BaseLight from "../core/BaseLight";

class SpotLight extends BaseLight {
	#radius: number = 1
	#x: number = 0
	#y: number = 2
	#z: number = 0
	#directionX: number = 0
	#directionY: number = -1
	#directionZ: number = 0
	#innerCutoff: number = 15.0  // 15도 (내부 각도)
	#outerCutoff: number = 22.5  // 22.5도 (외부 각도)
	constructor(color: string = '#fff', intensity: number = 1) {
		super(new ColorRGB(...convertHexToRgb(color, true)), intensity)
	}

	get x(): number {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
	}

	get y(): number {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
	}

	get z(): number {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
	}

	get position(): [number, number, number] {
		return [this.#x, this.#y, this.#z];
	}

	get radius(): number {
		return this.#radius;
	}

	set radius(value: number) {
		this.#radius = value;
	}

	get directionX(): number {
		return this.#directionX;
	}

	set directionX(value: number) {
		this.#directionX = value;
	}

	get directionY(): number {
		return this.#directionY;
	}

	set directionY(value: number) {
		this.#directionY = value;
	}

	get directionZ(): number {
		return this.#directionZ;
	}

	set directionZ(value: number) {
		this.#directionZ = value;
	}

	get direction(): [number, number, number] {
		return [this.#directionX, this.#directionY, this.#directionZ];
	}

	set direction(value: [number, number, number]) {
		this.#directionX = value[0];
		this.#directionY = value[1];
		this.#directionZ = value[2];
	}

	// 각도를 직접 반환 (degrees)
	get innerCutoff(): number {
		return this.#innerCutoff;
	}

	set innerCutoff(degrees: number) {
		this.#innerCutoff = degrees;
	}

	get outerCutoff(): number {
		return this.#outerCutoff;
	}

	set outerCutoff(degrees: number) {
		this.#outerCutoff = degrees;
	}

	// 코사인 값이 필요한 경우를 위한 메서드
	get innerCutoffCos(): number {
		return Math.cos(this.#innerCutoff * Math.PI / 180);
	}

	get outerCutoffCos(): number {
		return Math.cos(this.#outerCutoff * Math.PI / 180);
	}

	setPosition(x: number | [number, number, number], y?: number, z?: number): void {
		if (Array.isArray(x)) {
			[this.#x, this.#y, this.#z] = x;
		} else {
			this.#x = x!;
			this.#y = y!;
			this.#z = z!;
		}
	}

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
