"use strict";

export default class RedDisplayContainer {
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