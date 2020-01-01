/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.1 17:43:39
 *
 */

"use strict";
import UUID from "./UUID.js";
import UTIL from "../util/UTIL.js";
import ColorMaterial from "../material/ColorMaterial.js";
import Mesh from "../object3D/Mesh.js";

export default class BaseLight extends UUID {
	_intensity = 1;
	_x = 0;
	_y = 0;
	_z = 0;

	#color = '#ff0000';
	#colorAlpha = 1;
	_colorRGBA = new Float32Array([1, 0, 0, this.#colorAlpha]);
	_debugMesh;
	_debugMaterial;
	useDebugMesh = false;
	get color() {return this.#color;}
	set color(hex) {
		this.#color = hex;
		let rgb = UTIL.hexToRGB_ZeroToOne(hex);
		this._colorRGBA[0] = rgb[0] * this.#colorAlpha;
		this._colorRGBA[1] = rgb[1] * this.#colorAlpha;
		this._colorRGBA[2] = rgb[2] * this.#colorAlpha;
		this._colorRGBA[3] = this.#colorAlpha;
		this._debugMaterial.color = hex

	}

	get colorAlpha() {return this.#colorAlpha;}
	set colorAlpha(value) {
		let rgb = UTIL.hexToRGB_ZeroToOne(this.#color);
		this._colorRGBA[0] = rgb[0] * value;
		this._colorRGBA[1] = rgb[1] * value;
		this._colorRGBA[2] = rgb[2] * value;
		this._colorRGBA[3] = value;
	}
	get colorRGBA() {return this._colorRGBA;}
	get x() {return this._x}
	set x(v) {
		this._x = this._debugMesh.x = v;
		this._debugMesh.targetTo(0, 0, 0);
	}
	get y() {return this._y}
	set y(v) {
		this._y = this._debugMesh.y = v;
		this._debugMesh.targetTo(0, 0, 0);
	}
	get z() {return this._z;}
	set z(v) {this._z = this._debugMesh.z = v;this._debugMesh.targetTo(0, 0, 0);}
	get intensity() {return this._intensity;}
	set intensity(value) {
		this._intensity = value;
	}
	constructor(redGPUContext) {
		super();
		this._debugMesh = new Mesh(redGPUContext);
		this._debugMaterial = new ColorMaterial(redGPUContext);
	}

}