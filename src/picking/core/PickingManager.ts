import InstancingMesh from "../../display/instancingMesh/InstancingMesh";
import Mesh from "../../display/mesh/Mesh";
import createBasePipeline from "../../display/mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../../display/mesh/core/pipeline/PIPELINE_TYPE";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import PickingEvent from "./PickingEvent";
import PICKING_EVENT_TYPE from "../PICKING_EVENT_TYPE";
import Raycaster3D from "../Raycaster3D";
import Raycaster2D from "../Raycaster2D";
import {COMMAND_ENCODER_TYPE} from "../../renderer/commandEncoder/COMMAND_ENCODER_TYPE";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import View3D from "../../display/view/View3D";
import updateViewportAndScissor from "../../renderer/helperFunc/updateViewportAndScissor";
import renderPickingLayer from "../../renderer/renderLayers/renderPickingLayer";
import RedGPUObject from "../../base/RedGPUObject";
import AView from "../../display/view/core/AView";

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
class PickingManager extends RedGPUObject{
    lastMouseEvent: MouseEvent
    lastMouseClickEvent: MouseEvent
    #pickingDepthGPUTexture: GPUTexture
    #pickingDepthGPUTextureView: GPUTextureView
    #pickingGPUTexture: GPUTexture
    #pickingGPUTextureView: GPUTextureView

    #view: AView
    #castingList: (Mesh | InstancingMesh)[] = []
    #mouseX: number = 0
    #mouseY: number = 0
    #prevPickingEvent: PickingEvent
    #prevOverTarget: Mesh
    #videoMemorySize: number = 0
    #raycaster3D: Raycaster3D = new Raycaster3D();
    #raycaster2D: Raycaster2D = new Raycaster2D();
    /** [KO] 픽셀 값을 읽어올 임시 버퍼 [EN] Temporary buffer to read pixel values */
    #readPixelBuffer: GPUBuffer;
    #isReading: boolean = false;
    #pickingPassDescriptor: GPURenderPassDescriptor

    constructor(view:AView) {
        super(view.redGPUContext);
        this.#view = view
    }
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

    get pickingPassDescriptor(): GPURenderPassDescriptor {
        return this.#pickingPassDescriptor;
    }

    render(view: View3D) {
        if (this.castingList.length) {
            const {redGPUContext} = view
            this.#checkTexture(view)
            const list = this.#castingList;
            let i = 0;
            const len = list.length;
            for (i; i < len; i++) {
                const target = list[i];
                const {gpuRenderInfo} = target;
                if (gpuRenderInfo && !gpuRenderInfo.pickingPipeline) {
                    gpuRenderInfo.pickingPipeline = gpuRenderInfo.vertexStructInfo.vertexEntries.includes('entryPointPickingVertex') ? createBasePipeline(target as Mesh, gpuRenderInfo.vertexShaderModule, gpuRenderInfo.vertexBindGroupLayout, PIPELINE_TYPE.PICKING) : null
                }
            }
            this.#pickingPassDescriptor = {
                label: `${view.name} Picking Render Pass`,
                colorAttachments: [
                    {
                        view: this.pickingGPUTextureView,
                        clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                        loadOp: GPU_LOAD_OP.CLEAR,
                        storeOp: GPU_STORE_OP.STORE
                    }
                ],
                depthStencilAttachment: {
                    view: this.pickingDepthGPUTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: GPU_LOAD_OP.CLEAR,
                    depthStoreOp: GPU_STORE_OP.STORE,
                },
            };
            redGPUContext.commandEncoderManager.addMainRenderPass(this.pickingPassDescriptor, (viewPickingRenderPassEncoder) => {
                updateViewportAndScissor(view, viewPickingRenderPassEncoder, 'PICKING')
                renderPickingLayer(view, viewPickingRenderPassEncoder)
            });
        }
        this.#prepareRead(view);
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
    async checkEvents(view: any, time: number) {
        if (this.castingList.length && !this.#isReading) {
            const {pixelRectArray, redGPUContext} = view;
            const dpr = window.devicePixelRatio;
            const renderScale = redGPUContext.renderScale;
            const combinedScale = dpr * renderScale;

            const x = this.#mouseX;
            const y = this.#mouseY;

            // [KO] 논리 좌표를 물리 좌표로 변환하여 범위 검사 [EN] Convert logical coordinates to physical coordinates for bounds checking
            const physicalX = x * combinedScale;
            const physicalY = y * combinedScale;

            if (physicalX >= 0 && physicalX < pixelRectArray[2] && physicalY >= 0 && physicalY < pixelRectArray[3] && this.#readPixelBuffer) {
                const pickingTable = this.#createPickingTable();
                this.#isReading = true;
                try {
                    const uint32Color = await this.#getUint32Color(this.#readPixelBuffer);
                    if (uint32Color) {
                        this.#processClickEvent(uint32Color, x, y, time, pickingTable);
                        this.#processEvent(uint32Color, x, y, time, pickingTable);
                    } else {
                        this.#resetEvent();
                    }
                } finally {
                    this.#isReading = false;
                }
            }
            this.lastMouseEvent = null;
            this.lastMouseClickEvent = null;
            this.resetCastingList()
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
    #checkTexture(view: any) {
        const {redGPUContext} = view
        const {resourceManager} = redGPUContext

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
     * [KO] 다음 렌더링 시 픽셀 읽기 작업을 준비합니다.
     * [EN] Prepares for a pixel read operation during the next render.
     *
     * @param view - View3D 인스턴스
     */
    #prepareRead(view: any) {
        if (!this.castingList.length) return;
        if (this.#isReading) return; // [KO] 이미 읽기 작업 중이면 스킵 [EN] Skip if already reading

        const {gpuDevice,commandEncoderManager,redGPUContext} = this
        const dpr = window.devicePixelRatio;
        const {renderScale} = redGPUContext
        const combinedScale = dpr * renderScale;

        const x = this.#mouseX;
        const y = this.#mouseY;
        const {pixelRectArray} = view;

        // [KO] 논리 좌표를 물리 좌표로 변환 [EN] Convert logical coordinates to physical coordinates
        const physicalX = Math.floor(x * combinedScale);
        const physicalY = Math.floor(y * combinedScale);

        if (physicalX < 0 || physicalX >= pixelRectArray[2] || physicalY < 0 || physicalY >= pixelRectArray[3]) {
            return;
        }

        if (!this.#readPixelBuffer) {
            this.#readPixelBuffer = gpuDevice.createBuffer({
                size: 4,
                usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
                label: 'PickingManager_ReadPixelBuffer'
            });
        }

        commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.MAIN, mainRenderEncoder => {
            const textureView = {texture: this.#pickingGPUTexture, origin: {x: physicalX, y: physicalY, z: 0}};
            const bufferView = {buffer: this.#readPixelBuffer, bytesPerRow: 256, rowsPerImage: 1};
            const textureExtent = {width: 1, height: 1, depthOrArrayLayers: 1};
            mainRenderEncoder.copyTextureToBuffer(textureView, bufferView, textureExtent);
        });
    }

    #calcVideoMemory() {
        const texture = this.#pickingGPUTexture
        if (!texture) return 0;
        this.#videoMemorySize = calculateTextureByteSize(texture) + calculateTextureByteSize(this.#pickingDepthGPUTexture)
    }

    #createTexture(label: string, format: GPUTextureFormat): GPUTexture {
        const {resourceManager} = this
        return resourceManager.createManagedTexture({
            size: [this.#view.pixelRectObject.width, this.#view.pixelRectObject.height, 1],
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
            format,
            sampleCount: 1,
            label: `${this.#view.name}_${label}_${this.#view.pixelRectObject.width}x${this.#view.pixelRectObject.height}`,
        });
    }

    #createPickingTable = () =>
        this.#castingList.reduce((prev, curr) => {
            prev[curr.pickingId] = curr;
            return prev;
        }, {});

    #createPickingEvent(uint32Color, mouseX, mouseY, tMesh, time, eventType, nativeEvent) {
        // [KO] mouseX, mouseY는 이미 논리 좌표(CSS)임 [EN] mouseX and mouseY are already in logical coordinates (CSS)
        const isView2D = this.#view.rawCamera.constructor.name === 'Camera2D';
        const raycaster = isView2D ? this.#raycaster2D : this.#raycaster3D;
        raycaster.setFromCamera(this.#mouseX, this.#mouseY, this.#view as any);
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
        buffer.unmap();
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
