"use strict"
import RedBaseLight from "../base/RedBaseLight.js";

export default class RedDirectionalLight extends RedBaseLight {
	constructor(color ='#ffffff',alpha=1,intensity=1) {
		super();
		this.color = color;
		this.alpha = alpha;
		this.intensity = intensity;
	}
}