import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
import calculateTextureByteSize from "../utils/math/calculateTextureByteSize";
import PickingEvent from "./core/PickingEvent";
import PICKING_EVENT_TYPE from "./PICKING_EVENT_TYPE";

class PickingManager {
	lastMouseEvent: MouseEvent
	lastMouseClickEvent: MouseEvent
	#pickingDepthGPUTexture: GPUTexture
	#pickingDepthGPUTextureView: GPUTextureView
	#pickingGPUTexture: GPUTexture
	#pickingGPUTextureView: GPUTextureView
	#redGPUContext: RedGPUContext
	#view: View3D
	#castingList: (Mesh | InstancingMesh)[] = []
	#mouseX: number = 0
	#mouseY: number = 0
	#prevPickingEvent: PickingEvent
	#prevOverTarget: Mesh
	#videoMemorySize: number = 0
	get videoMemorySize(): number {
		return this.#videoMemorySize;
	}

	get mouseX(): number {
		return this.#mouseX;
	}

	set mouseX(value: number) {
		this.#mouseX = value;
	}

	get mouseY(): number {
		return this.#mouseY;
	}

	set mouseY(value: number) {
		this.#mouseY = value;
	}

	get castingList(): (Mesh | InstancingMesh)[] {
		return this.#castingList;
	}

	get pickingGPUTexture(): GPUTexture {
		return this.#pickingGPUTexture;
	}

	get pickingGPUTextureView(): GPUTextureView {
		return this.#pickingGPUTextureView;
	}

	get pickingDepthGPUTextureView(): GPUTextureView {
		return this.#pickingDepthGPUTextureView;
	}

	resetCastingList() {
		this.#castingList.length = 0
	}

	destroy() {
		if (this.#pickingGPUTexture) {
			this.#pickingGPUTexture.destroy()
			this.#pickingDepthGPUTexture.destroy()
			this.#pickingGPUTexture = null
			this.#pickingGPUTextureView = null
			this.#pickingDepthGPUTexture = null
			this.#pickingDepthGPUTextureView = null
		}
	}

	checkTexture(view: View3D) {
		const {redGPUContext} = view
		const {resourceManager} = redGPUContext
		this.#view = view
		this.#redGPUContext = redGPUContext
		if (this.#pickingGPUTexture?.width !== this.#view.pixelRectObject.width || this.#pickingGPUTexture?.height !== this.#view.pixelRectObject.height) {
			this.destroy()
			this.#pickingGPUTexture = this.#createTexture('picking', navigator.gpu.getPreferredCanvasFormat())
			this.#pickingGPUTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#pickingGPUTexture)
			this.#pickingDepthGPUTexture = this.#createTexture('pickingDepth', 'depth32float')
			this.#pickingDepthGPUTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#pickingDepthGPUTexture)
			this.#calcVideoMemory()
		}
	}

	checkEvents(view: View3D, time: number) {
		this.#readPixelArrayBuffer(
			view,
			time
		)
		this.resetCastingList()
	}

	#calcVideoMemory() {
		const texture = this.#pickingGPUTexture
		if (!texture) return 0;
		this.#videoMemorySize = calculateTextureByteSize(texture) + calculateTextureByteSize(this.#pickingDepthGPUTexture)
	}

	#createTexture(label: string, format: GPUTextureFormat): GPUTexture {
		const {resourceManager} = this.#redGPUContext
		return resourceManager.createManagedTexture({
			size: [this.#view.pixelRectObject.width, this.#view.pixelRectObject.height, 1],
			usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
			format,
			sampleCount: 1,
			label: `${this.#view.name}_${label}_${this.#view.pixelRectObject.width}x${this.#view.pixelRectObject.height}`,
		});
	}

	#readPixelBuffer:GPUBuffer
	#readPixelArrayBuffer = async (view: View3D, time: number, width = 1, height = 1) => {
		const {gpuDevice} = view.redGPUContext;
		const {pixelRectArray} = view;
		const x = this.#mouseX;
		const y = this.#mouseY;
		// console.log(x,y)
		if (x <= 0 || x >= pixelRectArray[2] || y <= 0 || y >= pixelRectArray[3]) {
			return;
		}
		const pickingTable = this.#createPickingTable();
		this.#readPixelBuffer = this.#createReadPixelBuffer(gpuDevice, width, height, x, y);
		const uint32Color = await this.#getUint32Color(this.#readPixelBuffer);
		// readPixelBuffer.destroy();
		// readPixelBuffer = null
		if (uint32Color) {
			this.#processClickEvent(uint32Color, x, y, time, pickingTable);
			this.#processEvent(uint32Color, x, y, time, pickingTable);
		} else {
			this.#resetEvent();
		}
		this.lastMouseEvent = null;
		this.lastMouseClickEvent = null;
	};
	#createPickingTable = () =>
		this.#castingList.reduce((prev, curr) => {
			prev[curr.pickingId] = curr;
			return prev;
		}, {});
	#createReadPixelBuffer = (gpuDevice: GPUDevice, width: number, height: number, x: number, y: number): GPUBuffer => {
		const readPixelCommandEncoder = gpuDevice.createCommandEncoder();
		const readPixelBuffer = gpuDevice.createBuffer({
			size: 4,
			usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
			label: 'readPixelBuffer'
		});
		const textureView = {texture: this.#pickingGPUTexture, origin: {x, y, z: 0}};
		const bufferView = {buffer: readPixelBuffer, bytesPerRow: 256, rowsPerImage: 1};
		const textureExtent = {width: 1, height: 1, depthOrArrayLayers: 1};
		readPixelCommandEncoder.copyTextureToBuffer(textureView, bufferView, textureExtent);
		gpuDevice.queue.submit([readPixelCommandEncoder.finish()]);
		return readPixelBuffer;
	};
	#processClickEvent = (uint32Color: number, mouseX: number, mouseY: number, time: number, pickingTable: {}) => {
		const tMesh = pickingTable[uint32Color];
		const eventType = this.lastMouseClickEvent?.type;
		if (eventType === PICKING_EVENT_TYPE.CLICK) {
			const pickingEvent = new PickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, this.lastMouseClickEvent);
			this.#fireEvent(eventType, pickingEvent);
		}
	}
	#processEvent = (uint32Color: number, mouseX: number, mouseY: number, time: number, pickingTable: {}) => {
		const tMesh = pickingTable[uint32Color];
		const eventType = this.lastMouseEvent?.type;
		if (eventType) {
			const pickingEvent = new PickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, this.lastMouseEvent);
			if (this.#prevPickingEvent) {
				pickingEvent.movementX = mouseX - this.#prevPickingEvent.mouseX;
				pickingEvent.movementY = mouseY - this.#prevPickingEvent.mouseY;
			}
			switch (eventType) {
				case PICKING_EVENT_TYPE.DOWN:
				case PICKING_EVENT_TYPE.UP:
					this.#fireEvent(eventType, pickingEvent);
					break;
				case PICKING_EVENT_TYPE.MOVE:
					this.#processMouseMove(uint32Color, tMesh, pickingEvent);
					break;
			}
			this.#prevPickingEvent = pickingEvent
		}
	}
	#processMouseMove = (uint32Color: number, tMesh: Mesh, pickingEvent: PickingEvent) => {
		const prevPickingId = this.#prevPickingEvent?.pickingId;
		if (prevPickingId !== uint32Color) {
			if (this.#prevPickingEvent && prevPickingId && prevPickingId !== uint32Color) {
				this.#resetEvent()
			}
			if (this.#prevOverTarget !== tMesh) {
				this.#fireEvent(PICKING_EVENT_TYPE.OVER, pickingEvent);
				document.body.style.cursor = 'pointer';
			}
			this.#prevOverTarget = tMesh;
		} else {
			this.#fireEvent(PICKING_EVENT_TYPE.MOVE, pickingEvent);
		}
	}
	#resetEvent = () => {
		if (this.#prevPickingEvent) {
			this.#fireEvent(PICKING_EVENT_TYPE.OUT, this.#prevPickingEvent);
		}
		this.#prevPickingEvent = null;
		this.#prevOverTarget = null;
		document.body.style.cursor = 'default';
	}

	async #getUint32Color(buffer: GPUBuffer) {
		await buffer.mapAsync(GPUMapMode.READ);
		const dataView = new DataView(buffer.getMappedRange());
		const indices = this.#pickingGPUTexture.format == "rgba8unorm" ? [0, 1, 2, 3] : [2, 1, 0, 3];
		const r = dataView.getUint8(indices[0]);
		const g = dataView.getUint8(indices[1]);
		const b = dataView.getUint8(indices[2]);
		const a = dataView.getUint8(indices[3]);
		return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
	}

	#fireEvent(type, e: PickingEvent) {
		if (e.target.events[type]) {
			// const screenPoint = [
			// 	this.#mouseX,
			// 	this.#mouseY,
			// 	this.#view.pixelRectObject.width,
			// 	this.#view.pixelRectObject.height,
			// ];
			// const worldPoint = screenToWorld(screenPoint, this.#view);
			// const origin = vec3.fromValues(this.#view.camera.x, this.#view.camera.y, this.#view.camera.z);
			// // 카메라의 위치를 사용
			// const direction = vec3.subtract(vec3.create(), vec3.fromValues(worldPoint[0], worldPoint[1], worldPoint[2]), origin);
			// 방향은 카메라에서 월드 포인트로의 벡터
			// const rayResult = raycast(
			// 	vec3.fromValues(worldPoint[0], worldPoint[1], worldPoint[2]),
			// 	vec3.normalize(vec3.create(), direction),
			// 	vec3.fromValues(
			// 		e.target.geometry.bound.minX * e.target.scaleX,
			// 		e.target.geometry.bound.minY * e.target.scaleY,
			// 		e.target.geometry.bound.minZ * e.target.scaleZ
			// 	),
			// 	vec3.fromValues(
			// 		e.target.geometry.bound.maxX * e.target.scaleX,
			// 		e.target.geometry.bound.maxY * e.target.scaleY,
			// 		e.target.geometry.bound.maxZ * e.target.scaleZ
			// 	),
			// 	mat4.invert(mat4.create(), e.target.modelMatrix)
			// )
			// if (rayResult) {
			// 	e.localX = rayResult[0]
			// 	e.localY = rayResult[1]
			// 	e.localZ = rayResult[2]
			// }
			// console.log('확인',e.type,e.localX,e.localY,e.localZ)
			e.target.events[type](e)
		}
	};
}

Object.freeze(PickingManager)
export default PickingManager
// const raycast = (origin: vec3, direction: vec3, testBoxMin: vec3, testBoxMax: vec3, inverseTransform: mat4): vec3 | null => {
// 	let t = direction.length;
// 	vec3.transformMat4(origin, origin, inverseTransform);
// 	vec3.transformMat4(direction, direction, inverseTransform);
// 	let dir = vec3.fromValues(direction[0] / t, direction[1] / t, direction[2] / t);
// 	let current = vec3.fromValues(origin[0], origin[1], origin[2]);
// 	while (current[0] >= testBoxMin[0] && current[1] >= testBoxMin[1] && current[2] >= testBoxMin[2] &&
// 	current[0] <= testBoxMax[0] && current[1] <= testBoxMax[1] && current[2] <= testBoxMax[2]) {
// 		current[0] += dir[0];
// 		current[1] += dir[1];
// 		current[2] += dir[2];
// 		if (current[0] >= testBoxMin[0] && current[1] >= testBoxMin[1] && current[2] >= testBoxMin[2] &&
// 			current[0] <= testBoxMax[0] && current[1] <= testBoxMax[1] && current[2] <= testBoxMax[2]) {
// 			return [current[0], current[1], current[2]];
// 		}
// 	}
// 	return null;
// }
