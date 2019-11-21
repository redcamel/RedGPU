"use strict";

export default class RedBaseObjectContainer {
	#children = [];

	constructor() {

	}

	addChild(v) {
		this.#children.push(v)
	}

	get children() {
		return this.#children
	}
}