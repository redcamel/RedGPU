import Mesh from "../display/mesh/Mesh";
import GPU_CULL_MODE from "../gpuConst/GPU_CULL_MODE";
import GPU_FRONT_FACE from "../gpuConst/GPU_FRONT_FACE";
import GPU_INDEX_FORMAT from "../gpuConst/GPU_INDEX_FORMAT";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import consoleAndThrowError from "../utils/consoleAndThrowError";

const validateStripIndex = Object.values(GPU_INDEX_FORMAT)
const validateFrontFaces = Object.values(GPU_FRONT_FACE)
const validateCullModes = Object.values(GPU_CULL_MODE)
const validatePrimitiveTopology = ['point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip']

/**
 * Represents the renderState of a primitive used for rendering.
 */
class PrimitiveState {
	dirtyPipeline: boolean = false
	state: GPUPrimitiveState
	#targetObject3D: Mesh
	#topology: GPUPrimitiveTopology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST
	#stripIndexFormat: GPUIndexFormat;
	/**
	 * Represents the front-face orientation for the GPU.
	 * Acceptable values are 'ccw' (counter-clockwise) and 'cw' (clockwise).
	 *
	 * @type {GPUFrontFace}
	 */
	#frontFace: GPUFrontFace = GPU_FRONT_FACE.CCW;
	/**
	 * Represents the culling mode used for GPU rendering.
	 *
	 * @typedef {('none' | 'front' | 'back')} GPUCullMode
	 */
	#cullMode: GPUCullMode = GPU_CULL_MODE.BACK;
	/**
	 * Represents the unclipped depth value.
	 *
	 * @type {boolean}
	 * @default false
	 */
	#unclippedDepth: boolean = false;

	/**
	 * Creates a new instance of the Constructor class.
	 *
	 * @constructor
	 */
	constructor(targetObject3D: any) {
		this.#targetObject3D = targetObject3D
		this.#update()
	}

	/**
	 * Get the GPU primitive topology.
	 *
	 * @returns {GPUPrimitiveTopology} The GPU primitive topology.
	 */
	get topology(): GPUPrimitiveTopology {
		return this.#topology;
	}

	/**
	 * Setter method to set the GPU primitive topology.
	 *
	 * @param {GPUPrimitiveTopology} value - The value to set the topology to.
	 * @throws {Error} If the value is not a valid GPU primitive topology.
	 */
	set topology(value: GPUPrimitiveTopology) {
		// set topology(value:  'point-list' | 'line-list'|'triangle-list' ) {
		if (validatePrimitiveTopology.includes(value)) {
			this.#topology = value;
			this.#update()
		} else consoleAndThrowError(`Invalid value for topology. Received ${value}. Expected one of: ${validatePrimitiveTopology.join(", ")}`);
	}

	/**
	 * Retrieves the strip index format.
	 *
	 * @return {GPUIndexFormat} The strip index format.
	 */
	get stripIndexFormat(): GPUIndexFormat {
		return this.#stripIndexFormat;
	}

	/**
	 * Sets the index format for strip indices.
	 *
	 * @param {GPUIndexFormat} format - The new index format to set.
	 */
	set stripIndexFormat(format: GPUIndexFormat) {
		if (validateStripIndex.includes(format)) {
			this.#stripIndexFormat = format;
			this.#update()
		} else consoleAndThrowError(`Invalid value for stripIndexFormat. Received ${format}. Expected one of: ${validateStripIndex.join(", ")}`);
	}

	/**
	 * Returns the front face configuration of the GPU.
	 *
	 * @returns {GPUFrontFace} The front face configuration.
	 */
	get frontFace(): GPUFrontFace {
		return this.#frontFace;
	}

	/**
	 * Sets the front face of the GPU rendering.
	 *
	 * @param {GPUFrontFace} face - The front face value to be set.
	 * @throws {Error} if the given `face` value is not valid.
	 */
	set frontFace(face: GPUFrontFace) {
		if (validateFrontFaces.includes(face)) {
			this.#frontFace = face;
			this.#update()
		} else consoleAndThrowError(`Invalid value for frontFace. Received ${face}. Expected one of: ${validateFrontFaces.join(", ")}`);
	}

	/**
	 * Retrieves the cull mode used for GPU rendering.
	 *
	 * @returns {GPUCullMode} The cull mode currently set.
	 */
	get cullMode(): GPUCullMode {
		return this.#cullMode;
	}

	/**
	 * Sets the cull mode for the GPU.
	 *
	 * @param {GPUCullMode} mode - The cull mode to be set for the GPU.
	 * @throws {Error} - Invalid value for cullMode. Received [mode]. Expected one of: [cullModeValues].
	 */
	set cullMode(mode: GPUCullMode) {
		if (validateCullModes.includes(mode)) {
			this.#cullMode = mode;
			this.#update()
		} else consoleAndThrowError(`Invalid value for cullMode. Received ${mode}. Expected one of: ${validateCullModes.join(", ")}`);
	}

	/**
	 * Retrieves the value of the unclippedDepth property.
	 *
	 * @returns {boolean} The value of the unclippedDepth property.
	 */
	get unclippedDepth(): boolean {
		return this.#unclippedDepth;
	}

	/**
	 * Set the unclippedDepth renderState.
	 *
	 * @param {boolean} state - The new value for the unclippedDepth renderState.
	 * @throws {Error} If the renderState parameter is not of type boolean.
	 */
	set unclippedDepth(state: boolean) {
		if (typeof state === 'boolean') {
			this.#unclippedDepth = state;
			this.#update()
		} else consoleAndThrowError(`Invalid type for unclippedDepth. Received ${typeof state}. Expected type: boolean.`);
	}

	#update() {
		this.state = {
			topology: this.#topology,
			stripIndexFormat: this.#stripIndexFormat,
			frontFace: this.#frontFace,
			cullMode: this.#cullMode,
			unclippedDepth: this.#unclippedDepth,
		};
		this.#targetObject3D.dirtyPipeline = true
	}
}

export default PrimitiveState;
