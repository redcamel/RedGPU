import RedGPUContext from "../../context/RedGPUContext";
import InstancingMesh from "../../display/instancingMesh/InstancingMesh";
import Mesh from "../../display/mesh/Mesh";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import PickingEvent from "./PickingEvent";
import PICKING_EVENT_TYPE from "../PICKING_EVENT_TYPE";
import Raycaster3D from "../Raycaster3D";
import Raycaster2D from "../Raycaster2D";

/**
 * [KO] 마우스 이벤트를 처리하고 객체와의 상호작용을 관리하는 클래스입니다.
 * [EN] Class that handles mouse events and manages interaction with objects.
 *
 * [KO] 마우스 클릭, 이동, 오버 등의 이벤트를 감지하고 처리합니다. GPU 텍스처를 사용하여 픽셀 단위의 객체 선택을 구현합니다.
 * [EN] Detects and processes events such as mouse clicks, moves, and overs. Implements pixel-perfect object selection using GPU textures.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // 올바른 접근 방법 (Correct access)
 * const pickingManager = view.pickingManager;
 * ```
 * @category Picking
 */
class PickingManager {
    lastMouseEvent: MouseEvent
    lastMouseClickEvent: MouseEvent
    #pickingDepthGPUTexture: GPUTexture
    #pickingDepthGPUTextureView: GPUTextureView
    #pickingGPUTexture: GPUTexture
    #pickingGPUTextureView: GPUTextureView
    #redGPUContext: RedGPUContext
    #view: any
    #castingList: (Mesh | InstancingMesh)[] = []
    #mouseX: number = 0
    #mouseY: number = 0
    #prevPickingEvent: PickingEvent
    #prevOverTarget: Mesh
    #videoMemorySize: number = 0
	#raycaster3D: Raycaster3D = new Raycaster3D();
	#raycaster2D: Raycaster2D = new Raycaster2D();

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    /**
     * [KO] 마우스 X 좌표
     * [EN] Mouse X coordinate
     */
    get mouseX(): number {
        return this.#mouseX;
    }

    set mouseX(value: number) {
        this.#mouseX = value;
    }

    /**
     * [KO] 마우스 Y 좌표
     * [EN] Mouse Y coordinate
     */
    get mouseY(): number {
        return this.#mouseY;
    }

    set mouseY(value: number) {
        this.#mouseY = value;
    }

    /**
     * [KO] 피킹 대상 리스트를 반환합니다.
     * [EN] Returns the picking casting list.
     */
    get castingList(): (Mesh | InstancingMesh)[] {
        return this.#castingList;
    }

    /**
     * [KO] 피킹용 GPU 텍스처를 반환합니다.
     * [EN] Returns the GPU texture for picking.
     */
    get pickingGPUTexture(): GPUTexture {
        return this.#pickingGPUTexture;
    }

    /**
     * [KO] 피킹용 GPU 텍스처 뷰를 반환합니다.
     * [EN] Returns the GPU texture view for picking.
     */
    get pickingGPUTextureView(): GPUTextureView {
        return this.#pickingGPUTextureView;
    }

    /**
     * [KO] 피킹용 깊이 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view for picking.
     */
    get pickingDepthGPUTextureView(): GPUTextureView {
        return this.#pickingDepthGPUTextureView;
    }

    /**
     * [KO] 캐스팅 리스트를 초기화합니다.
     * [EN] Resets the casting list.
     */
    resetCastingList() {
        this.#castingList.length = 0
    }

    /**
     * [KO] PickingManager를 파기합니다.
     * [EN] Destroys the PickingManager.
     */
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

    /**
     * [KO] 텍스처 크기를 확인하고 필요시 재생성합니다.
     * [EN] Checks the texture size and recreates it if necessary.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    checkTexture(view: any) {
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

    /**
     * [KO] 이벤트를 확인하고 처리합니다.
     * [EN] Checks and processes events.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param time -
     * [KO] 시간
     * [EN] Time
     */
    checkEvents(view: any, time: number) {
        if (this.castingList.length) {
            this.#readPixelArrayBuffer(view, time)
            this.resetCastingList()
        }
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

    #readPixelArrayBuffer = async (view: any, time: number, width = 1, height = 1) => {
        const {gpuDevice} = view.redGPUContext;
        const {pixelRectArray} = view;
        const x = this.#mouseX;
        const y = this.#mouseY;
        if (x <= 0 || x >= pixelRectArray[2] || y <= 0 || y >= pixelRectArray[3]) {
            return;
        }
        const pickingTable = this.#createPickingTable();
        let readPixelBuffer: GPUBuffer = this.#createReadPixelBuffer(gpuDevice, width, height, x, y);
        const uint32Color = await this.#getUint32Color(readPixelBuffer);
        readPixelBuffer.destroy();
        readPixelBuffer = null
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
        const readPixelCommandEncoder = gpuDevice.createCommandEncoder({
            label: 'PickingManager_ReadPixel_CommandEncoder'
        });
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
    #createPickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, nativeEvent) {
		const isView2D = this.#view.rawCamera.constructor.name === 'Camera2D';
		const raycaster = isView2D ? this.#raycaster2D : this.#raycaster3D;
		raycaster.setFromCamera(this.#mouseX / devicePixelRatio, this.#mouseY / devicePixelRatio, this.#view as any);
		let hit;
		if (tMesh) {
			const intersects = raycaster.intersectObject(tMesh);
			hit = intersects[0];
		}
		const pickingEvent = new PickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, nativeEvent, hit);
		if (!pickingEvent.ray) {
			pickingEvent.ray = raycaster.ray.clone();
		}
		return pickingEvent;
    }

    #processClickEvent = (uint32Color: number, mouseX: number, mouseY: number, time: number, pickingTable: {}) => {
        const tMesh = pickingTable[uint32Color];
        const eventType = this.lastMouseClickEvent?.type;
        if (eventType === PICKING_EVENT_TYPE.CLICK) {
            const pickingEvent = this.#createPickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, this.lastMouseClickEvent);
            this.#fireEvent(eventType, pickingEvent);
        }
    }
    #processEvent = (uint32Color: number, mouseX: number, mouseY: number, time: number, pickingTable: {}) => {
        const tMesh = pickingTable[uint32Color];
        const eventType = this.lastMouseEvent?.type;
        if (eventType) {
            const pickingEvent = this.#createPickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, this.lastMouseEvent);
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
        if (e.target && e.target.events[type]) {
            e.target.events[type](e)
        }
    };
}

Object.freeze(PickingManager)
export default PickingManager
