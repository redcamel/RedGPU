import Camera2D from "../../camera/camera/Camera2D";
import AController from "../../camera/core/AController";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_COMPARE_FUNCTION from "../../gpuConst/GPU_COMPARE_FUNCTION";
import PassClusterLightBound from "../../light/clusterLight/PassClusterLightBound";
import PassClustersLight from "../../light/clusterLight/PassClustersLight";
import PassClustersLightHelper from "../../light/clusterLight/PassClustersLightHelper";
import PickingManager from "../../picking/PickingManager";
import PostEffectManager from "../../postEffect/PostEffectManager";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import ResourceManager from "../../resources/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import SystemCode from "../../resources/systemCode/SystemCode";
import CubeTexture from "../../resources/texture/CubeTexture";
import IBL from "../../resources/texture/ibl/IBL";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import screenToWorld from "../../utils/math/screenToWorld";
import DrawDebuggerAxis from "../drawDebugger/DrawDebuggerAxis";
import DrawDebuggerGrid from "../drawDebugger/grid/DrawDebuggerGrid";
import DrawDebuggerPointLight from "../drawDebugger/light/DrawDebuggerPointLight";
import DrawDebuggerSpotLight from "../drawDebugger/light/DrawDebuggerSpotLight";
import Scene from "../scene/Scene";
import SkyBox from "../skyboxs/skyBox/SkyBox";
import ViewRenderTextureManager from "./ViewRenderTextureManager";
import ViewTransform from "./ViewTransform";

const SHADER_INFO = parseWGSL(SystemCode.SYSTEM_UNIFORM)
const UNIFORM_STRUCT = SHADER_INFO.uniforms.systemUniforms;

class View3D extends ViewTransform {
//
	#systemUniform_Vertex_StructInfo: any = UNIFORM_STRUCT;
	#systemUniform_Vertex_UniformBindGroup: GPUBindGroup;
	#systemUniform_Vertex_UniformBuffer: UniformBuffer;
	#instanceId: number
	#grid: DrawDebuggerGrid
	#axis: DrawDebuggerAxis
	#skybox: SkyBox
	#name: string
	#scene: Scene
	//
	#useFrustumCulling: boolean = true
	#useDistanceCulling: boolean = false
	#distanceCulling: number = 50
	#ibl: IBL
	//
	readonly #debugViewRenderState: RenderViewStateData
	readonly #postEffectManager: PostEffectManager
	readonly #viewRenderTextureManager: ViewRenderTextureManager
	#pickingManager: PickingManager = new PickingManager()
//
	#prevInfoList = []
	#shadowDepthSampler: GPUSampler
	#basicSampler: GPUSampler
	//
	#clusterLightsBuffer: GPUBuffer
	#clusterLightsBufferData: Float32Array
	#passLightClusters: PassClustersLight
	#passLightClustersBound: PassClusterLightBound
	#prevWidth: number = undefined
	#prevHeight: number = undefined

	//
	/**
	 * Creates a new instance of the Constructor class.
	 *
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext.
	 * @param {Scene} scene - The scene to render the constructor in.
	 * @param {AController | Camera2D} camera - The camera used for rendering.
	 * @param {string} [name] - The name of the constructor.
	 */
	constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string) {
		super(redGPUContext)
		this.scene = scene
		this.camera = camera
		if (name) this.name = name
		this.#init()
		this.#viewRenderTextureManager = new ViewRenderTextureManager(this)
		this.#debugViewRenderState = new RenderViewStateData(this)
		this.#postEffectManager = new PostEffectManager(this)
		this.setSize('100%', '100%')
	}

	get viewRenderTextureManager(): ViewRenderTextureManager {
		return this.#viewRenderTextureManager;
	}

	get systemUniform_Vertex_StructInfo(): any {
		return this.#systemUniform_Vertex_StructInfo;
	}

	get systemUniform_Vertex_UniformBindGroup(): GPUBindGroup {
		return this.#systemUniform_Vertex_UniformBindGroup;
	}

	get systemUniform_Vertex_UniformBuffer(): UniformBuffer {
		return this.#systemUniform_Vertex_UniformBuffer;
	}

	get passLightClustersBound(): PassClusterLightBound {
		return this.#passLightClustersBound;
	}

	get ibl(): IBL {
		return this.#ibl;
	}

	set ibl(value: IBL) {
		this.#ibl = value;
	}

	get pickingManager(): PickingManager {
		return this.#pickingManager;
	}

	get postEffectManager(): PostEffectManager {
		return this.#postEffectManager;
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get debugViewRenderState(): RenderViewStateData {
		return this.#debugViewRenderState;
	}

	//
	get grid(): DrawDebuggerGrid {
		return this.#grid;
	}

	set grid(value: DrawDebuggerGrid | boolean) {
		if (typeof value === 'boolean') {
			if (value === true) {
				value = new DrawDebuggerGrid(this.redGPUContext); // true면 DrawDebuggerGrid 생성
			} else {
				value = null; // false면 null 설정
			}
		} else if (!(value instanceof DrawDebuggerGrid) && value !== null) {
			// Grid가 아닌 값이 들어오는 경우 예외 처리
			throw new TypeError("grid must be of type 'DrawDebuggerGrid', 'boolean', or 'null'.");
		}
		this.#grid = value as DrawDebuggerGrid;
	}

	get axis(): DrawDebuggerAxis {
		return this.#axis;
	}

	set axis(value: DrawDebuggerAxis | boolean) {
		if (typeof value === 'boolean') {
			if (value === true) {
				value = new DrawDebuggerAxis(this.redGPUContext); // true면 DrawDebuggerAxis 생성
			} else {
				value = null; // false면 null 설정
			}
		} else if (!(value instanceof DrawDebuggerAxis) && value !== null) {
			// Axis가 아닌 값이 들어오는 경우 예외 처리
			throw new TypeError("axis must be of type 'DrawDebuggerAxis', 'boolean', or 'null'.");
		}
		this.#axis = value as DrawDebuggerAxis;
	}

	get skybox(): SkyBox {
		return this.#skybox;
	}

	set skybox(value: SkyBox) {
		this.#skybox = value;
	}

	get useFrustumCulling(): boolean {
		return this.#useFrustumCulling;
	}

	set useFrustumCulling(value: boolean) {
		this.#useFrustumCulling = value;
	}

	get useDistanceCulling(): boolean {
		return this.#useDistanceCulling;
	}

	set useDistanceCulling(value: boolean) {
		this.#useDistanceCulling = value;
	}

	get distanceCulling(): number {
		return this.#distanceCulling;
	}

	set distanceCulling(value: number) {
		this.#distanceCulling = value;
	}

	get scene(): Scene {
		return this.#scene;
	}

	set scene(value: Scene) {
		if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
		this.#scene = value;
	}

	screenToWorld(
		screenX: number,
		screenY: number,
	) {
		return screenToWorld(screenX, screenY, this)
	}

	update(view: View3D, shadowRender: boolean = false, calcPointLightCluster: boolean = false, renderPath1ResultTextureView?: GPUTextureView) {
		//TODO 바인드그룹이 계속 생겨나는걸.... 막아야겠군
		const {scene} = view
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const ibl = view.ibl
		const ibl_iblTexture = ibl?.iblTexture?.gpuTexture
		const ibl_irradianceTexture = ibl?.irradianceTexture?.gpuTexture
		let shadowDepthTextureView = shadowRender ? directionalShadowManager.shadowDepthTextureViewEmpty : directionalShadowManager.shadowDepthTextureView
		const index = view.redGPUContext.viewList.indexOf(view)
		const key = `${index}_${shadowRender ? 'shadowRender' : 'basic'}_2path${!!renderPath1ResultTextureView}`
		if (index > -1) {
			let needResetBindGroup = true
			let prevInfo = this.#prevInfoList[key]
			if (prevInfo) {
				needResetBindGroup = (
					prevInfo.ibl !== ibl ||
					prevInfo.ibl_iblTexture !== ibl_iblTexture ||
					prevInfo.ibl_irradianceTexture !== ibl_irradianceTexture ||
					prevInfo.renderPath1ResultTextureView !== renderPath1ResultTextureView ||
					prevInfo.shadowDepthTextureView !== shadowDepthTextureView
					|| !this.#passLightClusters
				)
			}
			if (needResetBindGroup) this.#createVertexUniformBindGroup(key, shadowDepthTextureView, view.ibl, renderPath1ResultTextureView)
			else this.#systemUniform_Vertex_UniformBindGroup = this.#prevInfoList[key].vertexUniformBindGroup;
			[
				{key: 'useIblTexture', value: [ibl_iblTexture ? 1 : 0]},
				{key: 'time', value: [view.debugViewRenderState.timestamp || 0]},
				{key: 'isView3D', value: [this.constructor === View3D ? 1 : 0]},
			].forEach(({key, value}) => {
				this.redGPUContext.gpuDevice.queue.writeBuffer(
					this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
					this.#systemUniform_Vertex_StructInfo.members[key].uniformOffset,
					new this.#systemUniform_Vertex_StructInfo.members[key].View(value)
				);
			});
			this.#prevInfoList[key] = {
				ibl,
				ibl_iblTexture,
				ibl_irradianceTexture,
				renderPath1ResultTextureView,
				shadowDepthTextureView,
				vertexUniformBindGroup: this.#systemUniform_Vertex_UniformBindGroup
			}
		}
		this.#updateClusters(calcPointLightCluster)
	}

	checkMouseInViewBounds(): boolean {
		const {pixelRectObject, pickingManager} = this;
		const {mouseX, mouseY} = pickingManager;
		return (0 < mouseX && mouseX < pixelRectObject.width) &&
			(0 < mouseY && mouseY < pixelRectObject.height);
	}

	#createVertexUniformBindGroup(key: string, shadowDepthTextureView: GPUTextureView, ibl: IBL, renderPath1ResultTextureView: GPUTextureView) {
		this.#updateClusters(true)
		const ibl_iblTexture = ibl?.iblTexture
		const ibl_irradianceTexture = ibl?.irradianceTexture
		const {resourceManager} = this.redGPUContext;
		const systemUniform_Vertex_BindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
			label: `SYSTEM_UNIFORM_bindGroup_${key}`,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#systemUniform_Vertex_UniformBuffer.gpuBuffer,
						offset: 0,
						size: this.#systemUniform_Vertex_UniformBuffer.size
					},
				},
				{
					binding: 1,
					resource: this.#shadowDepthSampler
				},
				{
					binding: 2,
					resource: shadowDepthTextureView
				},
				{
					binding: 3,
					resource: this.#basicSampler
				},
				{
					binding: 5,
					resource: {
						buffer: this.#clusterLightsBuffer,
						offset: 0,
						size: this.#clusterLightsBuffer.size
					}
				},
				{
					binding: 6,
					resource: {
						buffer: this.#passLightClusters.clusterLightsBuffer,
						offset: 0,
						size: this.#passLightClusters.clusterLightsBuffer.size
					}
				},
				{
					binding: 7,
					resource: this.#basicSampler
				},
				{
					binding: 8,
					resource: renderPath1ResultTextureView
						|| resourceManager.emptyBitmapTextureView
				},
				{
					binding: 9,
					resource: this.#basicSampler
				},
				{
					binding: 10,
					resource:
						resourceManager.getGPUResourceCubeTextureView(ibl_iblTexture,ibl_iblTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)
				},
				{
					binding: 11,
					resource:
						resourceManager.getGPUResourceCubeTextureView(ibl_irradianceTexture,ibl_irradianceTexture?.viewDescriptor || CubeTexture.defaultViewDescriptor)
				},
			]
		}
		this.#systemUniform_Vertex_UniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(systemUniform_Vertex_BindGroupDescriptor);
	}

	#init() {
		const systemUniform_Vertex_UniformData = new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength)
		this.#systemUniform_Vertex_UniformBuffer = new UniformBuffer(this.redGPUContext, systemUniform_Vertex_UniformData, '#systemUniform_Vertex_UniformBuffer');
		//
		this.#clusterLightsBufferData = new Float32Array((16 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS) + 4)
		this.#clusterLightsBuffer = this.redGPUContext.gpuDevice.createBuffer(
			{
				label: 'clusterLightsBuffer',
				size: this.#clusterLightsBufferData.byteLength,
				usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
			}
		)
		this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData)
		//
		this.#shadowDepthSampler = new Sampler(this.redGPUContext, {
			addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			addressModeW: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
			compare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
		}).gpuSampler
		this.#basicSampler = new Sampler(this.redGPUContext).gpuSampler
	}

	#updateClusters(calcClusterLight: boolean = false) {
		if (!calcClusterLight) return
		const {redGPUContext, scene, debugViewRenderState} = this
		// const dirtyPixelSize = this.#prevWidth == undefined || this.#prevHeight == undefined || this.#prevWidth !== this.pixelRectArray[2] || this.#prevHeight !== this.pixelRectArray[3]
		const dirtyPixelSize = true;
		if (!this.#passLightClustersBound) {
			this.#passLightClustersBound = new PassClusterLightBound(redGPUContext, this)
		}
		if (this.#passLightClusters && dirtyPixelSize) {
			// console.log('passLightClustersBound 재계산')
			this.#passLightClustersBound.render()
			this.#prevWidth = this.pixelRectArray[2]
			this.#prevHeight = this.pixelRectArray[3]
		}
		if (!this.#passLightClusters) {
			this.#passLightClusters = new PassClustersLight(redGPUContext, this)
		}
		if (scene) {
			const {pointLights, spotLights} = scene.lightManager
			const pointLightNum = pointLights.length
			const spotLightNum = spotLights.length
			if (pointLightNum) {
				let i = pointLightNum
				// console.log('실행이되긴하하나2')
				while (i--) {
					const tLight = pointLights[i]
					//TODO - 프러스텀 컬링할꺼냐 말꺼냐
					const stride = 16
					const offset = 4 + stride * i
					this.#clusterLightsBufferData.set(
						[
							...tLight.position, tLight.radius,
							...tLight.color.rgbNormal, tLight.intensity, 0
						],
						offset,
					)
					if (tLight.enableDebugger) {
						if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerPointLight(redGPUContext, tLight)
						tLight.drawDebugger.render(debugViewRenderState)
					}
				}
			}
			if (spotLightNum) {
				const stride = 16
				const prevOffset = pointLightNum * stride
				let i = spotLightNum
				// console.log('실행이되긴하하나2')
				while (i--) {
					const tLight = spotLights[i]
					const offset = 4 + stride * i + prevOffset;
					this.#clusterLightsBufferData.set(
						[
							...tLight.position, tLight.radius,
							...tLight.color.rgbNormal, tLight.intensity, 1, ...tLight.direction, tLight.outerCutoff, tLight.innerCutoff
						],
						offset,
					)
					if (tLight.enableDebugger) {
						if (!tLight.drawDebugger) tLight.drawDebugger = new DrawDebuggerSpotLight(redGPUContext, tLight)
						tLight.drawDebugger.render(debugViewRenderState)
					}
				}
			}
			this.#clusterLightsBufferData.set(
				[pointLightNum, spotLightNum, 0, 0],
				0,
			)
			this.redGPUContext.gpuDevice.queue.writeBuffer(this.#clusterLightsBuffer, 0, this.#clusterLightsBufferData);
			this.#passLightClusters.render()
		}
	}
}

Object.freeze(View3D)
export default View3D
