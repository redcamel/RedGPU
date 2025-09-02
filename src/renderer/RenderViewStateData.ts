import Camera2D from "../camera/camera/Camera2D";
import View3D from "../display/view/View3D";

/**
 * Represents the size and position of a viewport.
 *
 * @interface ViewportSize
 * @property {number | string} x - The x-coordinate of the viewport.
 * @property {number | string} y - The y-coordinate of the viewport.
 * @property {number | string} width - The width of the viewport.
 * @property {number | string} height - The height of the viewport.
 * @property {[number, number, number, number]} pixelRectArray - An array representing the pixel coordinates of the viewport ([x, y, width, height]).
 */
interface ViewportSize {
	x: number | string;
	y: number | string;
	width: number | string;
	height: number | string;
	pixelRectArray: [number, number, number, number];
}

/**
 * Represents the rendering state data of a view.
 */
class RenderViewStateData {
	useDistanceCulling: boolean;
	cullingDistanceSquared: number;
	distanceCulling: number;
	num3DGroups: number;
	num3DObjects: number;
	numDrawCalls: number;
	numDirtyPipelines: number;
	numInstances: number;
	numTriangles: number;
	numPoints: number;
	viewRenderTime: number;
	viewportSize: ViewportSize;
	usedVideoMemory: number;
	currentRenderPassEncoder: GPURenderPassEncoder
	timestamp: number
	frustumPlanes: number[][]
	prevVertexGpuBuffer: GPUBuffer
	prevFragmentUniformBindGroup: GPUBindGroup
	dirtyVertexUniformFromMaterial = {}
	alphaLayer = []
	transparentLayer = []
	particleLayer = []
	instanceMeshLayer = []
	render2PathLayer = []
	debugLayer = []
	startTime: number
	isScene2DMode: boolean = false
	readonly #view: View3D

	constructor(view: View3D) {
		this.#view = view
	}

	get view(): View3D {
		return this.#view;
	}

	reset(viewRenderPassEncoder: GPURenderPassEncoder, time: number) {
		if (!time || !this.#view) {
			throw new Error('Invalid parameters provided');
		}
		const view = this.#view
		const {useFrustumCulling, frustumPlanes, scene, postEffectManager, pickingManager, viewRenderTextureManager} = view;
		const {gBufferColorTexture, depthTexture, gBufferColorResolveTexture, renderPath1ResultTexture,} = view.viewRenderTextureManager;
		const {shadowManager} = scene;
		if (!gBufferColorTexture || !depthTexture) {
			throw new Error('Invalid view properties');
		}
		this.useDistanceCulling = view.useDistanceCulling;
		this.distanceCulling = view.distanceCulling
		this.cullingDistanceSquared = this.distanceCulling * this.distanceCulling
		this.num3DGroups = 0;
		this.num3DObjects = 0;
		this.numDrawCalls = 0;
		this.numInstances = 0;
		this.numDirtyPipelines = 0;
		this.numTriangles = 0;
		this.numPoints = 0;
		this.viewRenderTime = 0;
		this.currentRenderPassEncoder = viewRenderPassEncoder
		this.timestamp = time
		this.prevVertexGpuBuffer = null
		this.prevFragmentUniformBindGroup = null
		this.dirtyVertexUniformFromMaterial = {}
		this.alphaLayer = []
		this.transparentLayer = []
		this.particleLayer = []
		this.instanceMeshLayer = []
		this.render2PathLayer = []
		this.debugLayer = []
		this.startTime = performance.now()
		this.isScene2DMode = view.camera instanceof Camera2D
		this.viewportSize = {
			x: view.x,
			y: view.y,
			width: view.width,
			height: view.height,
			pixelRectArray: view.pixelRectArray
		}
		try {
			this.usedVideoMemory = viewRenderTextureManager.videoMemorySize
				+ shadowManager.directionalShadowManager.videoMemorySize
				+ postEffectManager.videoMemorySize
				+ pickingManager.videoMemorySize
		} catch (e) {
			throw new Error('Could not calculate texture size: ' + e.message);
		}
		this.frustumPlanes = useFrustumCulling ? frustumPlanes : null
	}
}

export default RenderViewStateData
