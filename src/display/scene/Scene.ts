import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/LightManager";
import ShadowManager from "../../shadow/ShdowManager";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import Object3DContainer from "../mesh/core/Object3DContainer";

/**
 * Represents a scene in a 3D environment.
 * @class
 * @extends Object3DContainer
 */
class Scene extends Object3DContainer {
	#instanceId: number
	#name: string
	#backgroundColor: ColorRGBA = new ColorRGBA()
	#useBackgroundColor: boolean = false
	#lightManager: LightManager = new LightManager()
	#shadowManager: ShadowManager = new ShadowManager()

	constructor(name: string) {
		super()
		this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		this.#name = name
	}

	get lightManager(): LightManager {
		return this.#lightManager;
	}

	get shadowManager(): ShadowManager {
		return this.#shadowManager;
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get backgroundColor(): ColorRGBA {
		return this.#backgroundColor;
	}

	set backgroundColor(value: ColorRGBA) {
		if (!(value instanceof ColorRGBA)) consoleAndThrowError('allow only ColorRGBA instance')
		this.#backgroundColor = value;
	}

	get useBackgroundColor(): boolean {
		return this.#useBackgroundColor;
	}

	set useBackgroundColor(value: boolean) {
		this.#useBackgroundColor = value;
	}
}

export default Scene
