/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.28 14:20:42
 *
 */

"use strict";
import RedCamera from "./RedCamera.js";

export default class RedObitController extends RedCamera {
	get needUpdate() { return this.#needUpdate; }
	set needUpdate(value) { this.#needUpdate = value; }
	get centerX() { return this.#centerX; }
	set centerX(value) { this.#centerX = value; }
	get centerY() { return this.#centerY; }
	set centerY(value) { this.#centerY = value; }
	get centerZ() { return this.#centerZ; }
	set centerZ(value) { this.#centerZ = value; }
	get distance() { return this.#distance; }
	set distance(value) { this.#distance = value; }
	get speedDistance() { return this.#speedDistance; }
	set speedDistance(value) { this.#speedDistance = value; }
	get delayDistance() { return this.#delayDistance; }
	set delayDistance(value) { this.#delayDistance = value; }
	get speedRotation() { return this.#speedRotation; }
	set speedRotation(value) { this.#speedRotation = value; }
	get delayRotation() { return this.#delayRotation; }
	set delayRotation(value) { this.#delayRotation = value; }
	get minTilt() { return this.#minTilt; }
	set minTilt(value) { this.#minTilt = value; }
	get maxTilt() { return this.#maxTilt; }
	set maxTilt(value) { this.#maxTilt = value; }
	get pan() { return this.#pan; }
	set pan(value) { this.#pan = value; }
	get tilt() { return this.#tilt; }
	set tilt(value) { this.#tilt = value; }

	#centerX = 0;
	#centerY = 0;
	#centerZ = 0;
	//
	#distance = 15;
	#speedDistance = 2;
	#delayDistance = 0.1;
	//
	#speedRotation = 3;
	#delayRotation = 0.1;
	//
	#tilt = 0;
	#minTilt = -90;
	#maxTilt = 90;
	#pan = 0;
	//
	#currentPan = 0;
	#currentTilt = 0;
	#currentDistance = 0;
	//
	#needUpdate = true;
	targetView;
	constructor(redGPU) {
		super(redGPU);
		(_ => {
			let HD_down, HD_Move, HD_up, HD_wheel;
			let sX, sY;
			let mX, mY;
			let tX_key, tY_key;
			let tMove, tUp, tDown;
			let checkArea;
			checkArea = e => {
				let targetView = this.targetView;
				if (targetView) {
					let tX, tY;
					let tViewRect = targetView['viewRect'];
					tX = e[tX_key];
					tY = e[tY_key];
					console.log(tViewRect);
					console.log(tX,tY);
					if (!(tViewRect[0] < tX && tX < tViewRect[0] + tViewRect[2])) return;
					if (!(tViewRect[1] < tY && tY < tViewRect[1] + tViewRect[3])) return;
				}
				return true
			};
			tMove = redGPU.detector.move;
			tUp = redGPU.detector.up;
			tDown = redGPU.detector.down;
			sX = 0;
			sY = 0;
			mX = 0;
			mY = 0;
			tX_key = 'layerX';
			tY_key = 'layerY';
			HD_down = e => {
				if (!checkArea(e)) return;
				if (this.#needUpdate) {
					sX = e[tX_key];
					sY = e[tY_key];
					redGPU['canvas'].addEventListener(tMove, HD_Move);
					window.addEventListener(tUp, HD_up);
				}
			};
			HD_Move = e => {
				if (!checkArea(e)) return;
				if (this.#needUpdate) {
					mX = e[tX_key] - sX;
					mY = e[tY_key] - sY;
					sX = e[tX_key];
					sY = e[tY_key];
					this.#pan -= mX * this.#speedRotation * 0.1;
					this.#tilt -= mY * this.#speedRotation * 0.1;
				}
			};
			HD_up = e => {
				redGPU['canvas'].removeEventListener(tMove, HD_Move);
				window.removeEventListener(tUp, HD_up);
			};
			HD_wheel = e => {
				if (this.#needUpdate) {
					if (!checkArea(e)) return;
					this.#distance += e['deltaY'] / 100 * this.#speedDistance
				}
			};
			redGPU['canvas'].addEventListener(tDown, HD_down);
			redGPU['canvas'].addEventListener('wheel', HD_wheel);
		})(this);
	};

	update(redView) {
		let tDelayRotation;
		let tMTX0;
		let PER_PI;
		PER_PI = Math.PI / 180;
		if (!this.#needUpdate) return;
		if (this.#tilt < this.#minTilt) this.#tilt = this.#minTilt;
		if (this.#tilt > this.#maxTilt) this.#tilt = this.#maxTilt;
		tDelayRotation = this.#delayRotation;

		tMTX0 = this.matrix;
		this.#currentPan += (this.#pan - this.#currentPan) * tDelayRotation;
		this.#currentTilt += (this.#tilt - this.#currentTilt) * tDelayRotation;
		this.#currentDistance += (this.#distance - this.#currentDistance) * this.#delayDistance;
		mat4.identity(tMTX0);
		mat4.translate(tMTX0, tMTX0, [this.#centerX, this.#centerY, this.#centerZ]);
		mat4.rotateY(tMTX0, tMTX0, this.#currentPan * PER_PI);
		mat4.rotateX(tMTX0, tMTX0, this.#currentTilt * PER_PI);
		mat4.translate(tMTX0, tMTX0, [0, 0, this.#currentDistance]);
		this.x = tMTX0[12];
		this.y = tMTX0[13];
		this.z = tMTX0[14];
		this.lookAt(this.#centerX, this.#centerY, this.#centerZ);
		// console.log('tilt', this.#tilt, 'pan', this.#pan)
		// console.log('RedObitController update')
	}
}
