"use strict"
import RedUtil from "./util/RedUtil.js"

export default class RedView {


	#scene;
	#camera;
	#x = 0;
	#y = 0;
	#width = '100%';
	#height = '100%';

	constructor(scene, camera) {
		this.camera = camera;
		this.scene = scene;
	}

	get scene() {
		return this.#scene;
	}

	set scene(value) {
		this.#scene = value;
	}

	get camera() {
		return this.#camera;
	}

	set camera(value) {
		this.#camera = value;
	}

	get y() {
		return this.#y;
	}

	get x() {
		return this.#x;
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	setSize(width = this.#width, height = this.#height) {
		if (typeof width == 'number') this.#width = width < 0 ? 0 : parseInt(width);
		else {
			if (width.includes('%') && (+width.replace('%', '') >= 0)) this.#width = width;
			else RedUtil.throwFunc('RedView setSize : width는 0이상의 숫자나 %만 허용.', width);
		}
		if (typeof height == 'number') this.#height = height < 0 ? 0 : parseInt(height);
		else {
			if (height.includes('%') && (+height.replace('%', '') >= 0)) this.#height = height;
			else RedUtil.throwFunc('RedView setSize : height는 0이상의 숫자나 %만 허용.', height);
		}
	}

	setLocation(x = this.#x, y = this.#y) {
		if (typeof x == 'number') this.#x = x < 0 ? 0 : parseInt(x);
		else {
			if (x.includes('%') && (+x.replace('%', '') >= 0)) this.#x = x;
			else RedUtil.throwFunc('RedView setLocation : x는 0이상의 숫자나 %만 허용.', x);
		}
		if (typeof y == 'number') this.#y = y < 0 ? 0 : parseInt(y);
		else {
			if (y.includes('%') && (+y.replace('%', '') >= 0)) this.#y = y;
			else RedUtil.throwFunc('RedView setLocation : y는 0이상의 숫자나 %만 허용.', y);
		}
		console.log('setLocation', this.#x, this.#y)
	}
}