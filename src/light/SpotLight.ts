import ColorRGB from "../color/ColorRGB";
import BaseLight from "./core/BaseLight";
import convertHexToRgb from "../utils/convertColor/convertHexToRgb";

class SpotLight extends BaseLight {
	#radius: number = 1
	#x: number = 0
	#y: number = 0
	#z: number = 0
	#directionX: number = 0
	#directionY: number = 0
	#directionZ: number = -1
	#innerCutoff: number = Math.cos(Math.PI / 12)
	#outerCutoff: number = Math.cos(Math.PI / 8)

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

	get innerCutoff(): number {
		return this.#innerCutoff;
	}

	set innerCutoff(value: number) {
		this.#innerCutoff = value;
	}

	get outerCutoff(): number {
		return this.#outerCutoff;
	}

	set outerCutoff(value: number) {
		this.#outerCutoff = value;
	}

	get innerAngle(): number {
		return Math.acos(this.#innerCutoff) * 180 / Math.PI;
	}

	set innerAngle(degrees: number) {
		this.#innerCutoff = Math.cos(degrees * Math.PI / 180);
	}

	get outerAngle(): number {
		return Math.acos(this.#outerCutoff) * 180 / Math.PI;
	}

	set outerAngle(degrees: number) {
		this.#outerCutoff = Math.cos(degrees * Math.PI / 180);
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

	setDirection(x: number | [number, number, number], y?: number, z?: number): void {
		if (Array.isArray(x)) {
			[this.#directionX, this.#directionY, this.#directionZ] = x;
		} else {
			this.#directionX = x!;
			this.#directionY = y!;
			this.#directionZ = z!;
		}
	}

	setAngles(innerDegrees: number, outerDegrees: number): void {
		this.innerAngle = innerDegrees;
		this.outerAngle = outerDegrees;
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

	setFlashlightStyle(): void {
		this.setAngles(10, 15);
	}

	setStageStyle(): void {
		this.setAngles(25, 35);
	}

	setLampStyle(): void {
		this.setAngles(15, 25);
	}
}

Object.freeze(SpotLight);
export default SpotLight;
