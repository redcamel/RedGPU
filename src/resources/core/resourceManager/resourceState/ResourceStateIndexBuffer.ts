import IndexBuffer from "../../../buffer/indexBuffer/IndexBuffer";

class ResourceStateIndexBuffer {
	static dirtyList = []
	buffer: IndexBuffer
	label: string | number
	uuid: string | number
	#useNum: number = 0

	constructor(buffer: IndexBuffer) {
		this.buffer = buffer
		this.label = buffer.name
		this.uuid = buffer.uuid
	}

	get useNum(): number {
		return this.#useNum;
	}

	set useNum(value: number) {
		this.#useNum = value;
		ResourceStateIndexBuffer.dirtyList.push(this)
	}
}

export default ResourceStateIndexBuffer;
