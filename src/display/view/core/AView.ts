import Camera2D from "../../../camera/camera/Camera2D";
import AController from "../../../camera/core/AController";
import RedGPUContext from "../../../context/RedGPUContext";
import PickingManager from "../../../picking/PickingManager";
import FXAA from "../../../postEffect/FXAA";
import TAA from "../../../postEffect/TAA/TAA";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import InstanceIdGenerator from "../../../utils/InstanceIdGenerator";
import screenToWorld from "../../../utils/math/screenToWorld";
import DrawDebuggerAxis from "../../drawDebugger/DrawDebuggerAxis";
import DrawDebuggerGrid from "../../drawDebugger/grid/DrawDebuggerGrid";
import Scene from "../../scene/Scene";
import ViewTransform from "./ViewTransform";

class AView extends ViewTransform{

	#name: string
	#scene: Scene
	#instanceId: number
	#pickingManager: PickingManager = new PickingManager()

	#useFrustumCulling: boolean = true
	#useDistanceCulling: boolean = false
	#distanceCulling: number = 50

	#grid: DrawDebuggerGrid
	#axis: DrawDebuggerAxis

	#taa: TAA
	#fxaa: FXAA

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get scene(): Scene {
		return this.#scene;
	}

	set scene(value: Scene) {
		if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
		this.#scene = value;
	}
	get pickingManager(): PickingManager {
		return this.#pickingManager;
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
	get fxaa(): FXAA {
		if (!this.#fxaa) {
			this.#fxaa = new FXAA(this.redGPUContext);
		}
		return this.#fxaa;
	}

	get taa(): TAA {
		if (!this.#taa) {
			this.#taa = new TAA(this.redGPUContext);
		}
		return this.#taa;
	}
	constructor(redGPUContext: RedGPUContext,scene: Scene, camera: AController | Camera2D, name?: string) {
		super(redGPUContext)
		this.scene = scene
		this.camera = camera
		if (name) this.name = name
	}


	screenToWorld(
		screenX: number,
		screenY: number,
	) {
		return screenToWorld(screenX, screenY, this)
	}

	checkMouseInViewBounds(): boolean {
		const {pixelRectObject, pickingManager} = this;
		const {mouseX, mouseY} = pickingManager;
		return (0 < mouseX && mouseX < pixelRectObject.width) &&
			(0 < mouseY && mouseY < pixelRectObject.height);
	}
}
Object.freeze(AView);
export default AView
