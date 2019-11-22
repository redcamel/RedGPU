"use strict"
import RedBaseLight from "../base/RedBaseLight.js";

export default class RedDirectionalLight extends RedBaseLight {
	constructor() {
		super();
		this.color = '#ffffff';
		this.alpha = 1.0;
		this.intensity = 1.0;
	}
}