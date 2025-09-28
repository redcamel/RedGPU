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

/**
 * AView 클래스는 View3D 및 View2D의 공통 기반(Base) 클래스입니다.
 * RedGPU의 뷰 시스템에서 핵심 역할을 하며, Scene, Camera, PickingManager, 디버깅 도구(Grid, Axis),
 * 후처리 효과(TAA, FXAA) 등을 포함합니다.
 *
 * ViewTransform을 확장하며 화면 좌표 변환, 마우스 경계 체크, Culling 설정 등
 * 뷰 렌더링에 필요한 공통 기능을 제공합니다.
 *
 * 이 클래스는 직접 사용되기보다는 View3D와 View2D에서 상속되어 3D/2D 환경에 맞게 확장됩니다.
 */

class AView extends ViewTransform {

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

	/**
	 * 뷰의 이름입니다. 지정하지 않으면 자동으로 인스턴스 ID 기반 이름이 생성됩니다.
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * 뷰의 이름을 설정합니다.
	 * @param value - 설정할 이름 문자열
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * 현재 뷰에 연결된 Scene 객체입니다.
	 */
	get scene(): Scene {
		return this.#scene;
	}

	/**
	 * 뷰에 Scene을 설정합니다.
	 * Scene 인스턴스가 아닌 경우 예외를 발생시킵니다.
	 * @param value - Scene 인스턴스
	 */
	set scene(value: Scene) {
		if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
		this.#scene = value;
	}

	/**
	 * 마우스 좌표 기반 객체 선택을 위한 PickingManager입니다.
	 */
	get pickingManager(): PickingManager {
		return this.#pickingManager;
	}

	/**
	 * Frustum Culling 사용 여부입니다.
	 */
	get useFrustumCulling(): boolean {
		return this.#useFrustumCulling;
	}

	/**
	 * Frustum Culling 사용 여부를 설정합니다.
	 * @param value - true면 사용, false면 비활성화
	 */
	set useFrustumCulling(value: boolean) {
		this.#useFrustumCulling = value;
	}

	/**
	 * 거리 기반 Culling 사용 여부입니다.
	 */
	get useDistanceCulling(): boolean {
		return this.#useDistanceCulling;
	}

	/**
	 * 거리 기반 Culling 사용 여부를 설정합니다.
	 * @param value - true면 사용, false면 비활성화
	 */
	set useDistanceCulling(value: boolean) {
		this.#useDistanceCulling = value;
	}

	/**
	 * 거리 기반 Culling의 기준 거리입니다.
	 */
	get distanceCulling(): number {
		return this.#distanceCulling;
	}

	/**
	 * 거리 기반 Culling의 기준 거리를 설정합니다.
	 * @param value - 거리 값
	 */
	set distanceCulling(value: number) {
		this.#distanceCulling = value;
	}

	/**
	 * 디버깅용 그리드 객체입니다.
	 */
	get grid(): DrawDebuggerGrid {
		return this.#grid;
	}

	/**
	 * 디버깅용 그리드를 설정합니다.
	 * true면 자동 생성, false면 제거, 또는 DrawDebuggerGrid 인스턴스를 직접 설정할 수 있습니다.
	 * @param value - boolean 또는 DrawDebuggerGrid 인스턴스
	 */
	set grid(value: DrawDebuggerGrid | boolean) {
		if (typeof value === 'boolean') {
			if (value === true) {
				value = new DrawDebuggerGrid(this.redGPUContext);
			} else {
				value = null;
			}
		} else if (!(value instanceof DrawDebuggerGrid) && value !== null) {
			throw new TypeError("grid must be of type 'DrawDebuggerGrid', 'boolean', or 'null'.");
		}
		this.#grid = value as DrawDebuggerGrid;
	}

	/**
	 * 디버깅용 축 객체입니다.
	 */
	get axis(): DrawDebuggerAxis {
		return this.#axis;
	}

	/**
	 * 디버깅용 축을 설정합니다.
	 * true면 자동 생성, false면 제거, 또는 DrawDebuggerAxis 인스턴스를 직접 설정할 수 있습니다.
	 * @param value - boolean 또는 DrawDebuggerAxis 인스턴스
	 */
	set axis(value: DrawDebuggerAxis | boolean) {
		if (typeof value === 'boolean') {
			if (value === true) {
				value = new DrawDebuggerAxis(this.redGPUContext);
			} else {
				value = null;
			}
		} else if (!(value instanceof DrawDebuggerAxis) && value !== null) {
			throw new TypeError("axis must be of type 'DrawDebuggerAxis', 'boolean', or 'null'.");
		}
		this.#axis = value as DrawDebuggerAxis;
	}

	/**
	 * FXAA 후처리 효과 객체입니다. 요청 시 자동 생성됩니다.
	 */
	get fxaa(): FXAA {
		if (!this.#fxaa) {
			this.#fxaa = new FXAA(this.redGPUContext);
		}
		return this.#fxaa;
	}

	/**
	 * TAA 후처리 효과 객체입니다. 요청 시 자동 생성됩니다.
	 */
	get taa(): TAA {
		if (!this.#taa) {
			this.#taa = new TAA(this.redGPUContext);
		}
		return this.#taa;
	}

	/**
	 * AView 생성자입니다.
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param scene - Scene 인스턴스
	 * @param camera - AController 또는 Camera2D 인스턴스
	 * @param name - 선택적 이름
	 */
	constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string) {
		super(redGPUContext)
		this.scene = scene
		this.camera = camera
		if (name) this.name = name
	}

	/**
	 * 화면 좌표를 월드 좌표로 변환합니다.
	 * @param screenX - 화면 X 좌표
	 * @param screenY - 화면 Y 좌표
	 * @returns 변환된 월드 좌표
	 */
	screenToWorld(
		screenX: number,
		screenY: number,
	) {
		return screenToWorld(screenX, screenY, this)
	}

	/**
	 * 마우스가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.
	 * @returns true면 뷰 영역 내에 있음
	 */
	checkMouseInViewBounds(): boolean {
		const {pixelRectObject, pickingManager} = this;
		const {mouseX, mouseY} = pickingManager;
		return (0 < mouseX && mouseX < pixelRectObject.width) &&
			(0 < mouseY && mouseY < pixelRectObject.height);
	}
}

Object.freeze(AView);
export default AView;
