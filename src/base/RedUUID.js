"use strict";
let UUID = 1;
export default class RedUUID {
	static makeUUID() {
		return UUID++
	}

	constructor() {
		this._UUID = UUID++;
	}
}