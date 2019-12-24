/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.24 16:41:20
 *
 */

"use strict";
import BaseObject3D from "../base/BaseObject3D.js";
import UTIL from "../util/UTIL.js";
import Plane from "../primitives/Plane.js";
import TextMaterial from "../material/system/TextMaterial.js";
import BitmapTexture from "../resources/BitmapTexture.js";

let setTexture = function (target) {
	target['_height'] = +target['_height'];
	target['_svg'].setAttribute('width', target['_width']);
	target['_svg'].setAttribute('height', target['_height']);
	target['_svg'].querySelector('foreignObject').setAttribute('height', target['_height']);
	target['_svg'].querySelector('table').style.height = target['_height'] + 'px';
	target['_img'].src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(target['_svg'].outerHTML);
};
//TODO - 여기 SVG질도 백그라운드로 보내야함
let setStylePrototype;
setStylePrototype = (function () {
	return function (target, k, baseValue) {
		let tStyle;
		tStyle = target['_svg'].querySelector('td').style;
		target['_' + k] = baseValue;
		Object.defineProperty(target, k, {
			get: function () {
				return target['_' + k]
			},
			set: function (v) {
				target['_' + k] = v;
				tStyle[k] = typeof v == 'number' ? (v += 'px') : v;
				setTexture(target)
			}
		});
		target[k] = baseValue;
	}
})();
let tSVG, tHTMLContainer;
export default class Text extends BaseObject3D {
	_cvs;
	_ctx;
	_svg;
	_img;
	_width = 256;
	_height = 128;
	get height() {
		return this._height;
	}
	set height(v) {
		this['material']['height'] = this['_height'] = v < 2 ? 2 : v;
		setTexture(this);
	}
	get width() {
		return this._width;
	}
	set width(v) {
		this['material']['width'] = this['_width'] = v < 2 ? 2 : v;
		setTexture(this);
	}
	constructor(redGPUContext, width = 256, height = 128) {
		super(redGPUContext);

		if (width > 1024) width = 1024;
		if (height > 1024) height = 1024;
		this['_cvs'] = new OffscreenCanvas(width, height);
		this['_ctx'] = this['_cvs'].getContext('2d');
		// SVG 생성
		this['_svg'] = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this['_svg'].setAttribute('xmlns', "http://www.w3.org/2000/svg");
		this['_svg'].style = 'position:absolute;top:0px;left:0px;text-align:center;z-index:10';
		this['_svg'].innerHTML = '<foreignObject  width="100%" style="position:absolute;top:0;left:0">' +
			'   <table xmlns="http://www.w3.org/1999/xhtml" style="border-collapse: collapse;position:table;top:0;left:0;width:100%;table-layout:fixed">' +
			'       <tr xmlns="http://www.w3.org/1999/xhtml">' +
			'       <td xmlns="http://www.w3.org/1999/xhtml"  > </td>' +
			'       </tr>' +
			'   </table>' +
			'</foreignObject>';
		// document.body.appendChild(this['_svg'])

		this.geometry = new Plane(redGPUContext);
		this.material = new TextMaterial(redGPUContext);
		this.cullMode = 'none';


		this['_img'] = new Image();

		this.width = width;
		this.height = height;
		setStylePrototype(this, 'padding', 0);
		setStylePrototype(this, 'background', '');
		setStylePrototype(this, 'color', '#000');
		setStylePrototype(this, 'fontFamily', 'Arial');
		setStylePrototype(this, 'fontSize', 22);
		setStylePrototype(this, 'fontWeight', 'normal');
		setStylePrototype(this, 'fontStyle', 'normal');
		setStylePrototype(this, 'lineHeight', 22 * 1.5);
		setStylePrototype(this, 'letterSpacing', 0);
		setStylePrototype(this, 'wordBreak', 'break-all');
		setStylePrototype(this, 'verticalAlign', 'middle');
		setStylePrototype(this, 'textAlign', 'center');

		this['_img'].onload = _ => {
			let tW, tH;
			tW = this['_width'];
			tH = this['_height'];

			this['_cvs']['width'] = tW;
			this['_cvs']['height'] = tH;
			this['_ctx'].clearRect(0, 0, tW, tH);
			this['_ctx'].drawImage(this['_img'], 0, 0, tW, tH);
			this['material'].width = tW;
			this['material'].height = tH;
			this['_cvs'].convertToBlob().then(v => {
				new BitmapTexture(redGPUContext, URL.createObjectURL(v), {
					magFilter:  "linear",
					minFilter: "linear",
					mipmapFilter: "nearest",
					addressModeU: "clamp-to-edge",
					addressModeV: "clamp-to-edge",
					addressModeW: "repeat"
				}, true, v => {
					if(this['material'].diffuseTexture) this['material'].diffuseTexture.GPUTexture.destroy();
					this['material'].diffuseTexture = v
				})
			})

		};


		this['renderToTransparentLayer'] = true;

	}
	addChild(child) {
		// Text 에는 추가불가
	}
	set material(v) {
		if (v instanceof TextMaterial) {
			this._material = v;
			this.dirtyPipeline = true;
		} else {
			UTIL.throwFunc(`addChild - only allow TextMaterial Instance. - inputValue : ${v} { type : ${typeof v} }`);
		}

	}
	get material() {
		return this._material
	}
	get text() {
		return this['_text']
	}
	set text(v) {
		tSVG = this['_svg'];
		tHTMLContainer = tSVG.querySelector('foreignObject td');
		this['_text'] = v.replace(/\<br\>/gi, '<div/>');
		// console.log(this['_svg'].querySelector('foreignObject div'))
		// console.log(this['_svg'].width)
		// this['_svg'].setAttribute('width', 100000);
		// this['_svg'].setAttribute('height', 100000);
		let self = this;
		let t0 = this['_text'].match(/<img .*?>/g);
		let t1 = [];
		let result = this['_text'];
		t0 = t0 || [];
		// console.log(t0);
		let max = t0.length;
		let loaded = 0;
		t0.forEach(function (v) {
			console.log(v, v.match(/src\s*=\s*(\'|\").*?(\'|\")/g));
			let tSrc = v.match(/src\s*=\s*(\'|\").*?(\'|\")/g)[0];
			tSrc = tSrc.replace(/src\s*=\s*(\'|\")/g, '').replace(/(\'|\")/g, '');
			console.log(tSrc);
			let test = document.createElement('div');
			test.innerHTML = v;
			let img = test.querySelector('img');
			img.onload = function () {
				let canvas = document.createElement('canvas');
				canvas.width = img.style.width ? +img.style.width : img.width;
				canvas.height = img.style.height ? +img.style.height : img.height;
				let ctx = canvas.getContext('2d');
				ctx.scale(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
				ctx.drawImage(img, 0, 0);
				tInfo.result = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" width="' + img.width + '" height="' + img.height + '" display="inline" style="vertical-align: middle;display: inline-block">' +
					'<image xlink:href="' + (canvas.toDataURL('image/png')) + '" height="' + img.height + 'px" width="' + img.width + 'px" />' +
					'</svg>';
				loaded++;
				if (loaded == max) {
					t1.forEach(function (v) {
						result = result.replace(v.source, v.result)
					});
					tHTMLContainer.innerHTML = result;
					setTexture(self)
				}
				img.onload = null

			};
			let tInfo = {
				source: v,
				sourceSrc: tSrc,
				result: ''
			};
			t1.push(tInfo)
		});
		if (t0.length == 0) {
			tHTMLContainer.innerHTML = result;
			setTexture(this)
		}
	}
}