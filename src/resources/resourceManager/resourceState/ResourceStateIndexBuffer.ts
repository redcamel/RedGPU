import IndexBufferUint32 from "../../buffer/indexBuffer/IndexBufferUint32";

class ResourceStateIndexBuffer {
	static dirtyList = []
	buffer: IndexBufferUint32
	label: string | number
	uuid: string | number
	#useNum: number = 0

	constructor(buffer: IndexBufferUint32) {
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
