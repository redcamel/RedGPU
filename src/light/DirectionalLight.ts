import RedGPUContext from "../context/RedGPUContext";
import TypeSize from "../resource/buffers/TypeSize";
import UniformBufferDescriptor from "../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import BaseLight from "./BaseLight";

const bufferDefine = new UniformBufferDescriptor(
	[
		{size: TypeSize.float32x3, valueName: 'color'},
		{size: TypeSize.float32, valueName: 'intensity'},
	]
);

class DirectionalLight extends BaseLight {
	#targetX: number = 0
	#targetY: number = 0
	#targetZ: number = 0

	constructor(redGPUContext: RedGPUContext, color: number = 0x404040, intensity: number = 1) {
		super(redGPUContext, bufferDefine, color, intensity)
		this.x = 0
		this.y = 1
		this.z = 0
	}

	get targetX(): number {
		return this.#targetX;
	}

	set targetX(value: number) {
		this.#targetX = value;
	}

	get targetY(): number {
		return this.#targetY;
	}

	set targetY(value: number) {
		this.#targetY = value;
	}

	get targetZ(): number {
		return this.#targetZ;
	}

	set targetZ(value: number) {
		this.#targetZ = value;
	}

	get targetPosition(): number[] {
		return [this.#targetX, this.#targetY, this.#targetZ];
	}

	setTargetPosition(x: number, y: number, z: number) {
		this.#targetX = x
		this.#targetY = y
		this.#targetZ = z
	}
}

export default DirectionalLight
