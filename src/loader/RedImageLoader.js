/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.9 16:15:54
 *
 */

"use strict";

import RedUTIL from "../util/RedUTIL.js";

var base64toBlob = function (base64Data, contentType) {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);
	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, {type: contentType});
};

var makeImageBitmap = function (v, option) {
	return createImageBitmap(v, option ? option : {imageOrientation: 'none'})
};
var fileLoader = function (src, onLoader, onError, option) {

	var self = this;
	var request = new XMLHttpRequest();
	request.open("GET", src, true);
	request.responseType = "blob";
	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			// console.log(request)
			// console.log(request.response)
			if (request.status === 200) {
				makeImageBitmap(request.response, option ? option : {
					imageOrientation: 'none'
				}).then(function (v) {
					v['src'] = src;
					self['source'] = v;
					if (self['_onLoad']) {
						self['_onLoad'](request);
						self['_onLoad'] = undefined;
						self['_onError'] = undefined
					}
					// console.log('fileLoader', v)
					// console.log('성공!')
				}).catch(function () {
					console.log('에러!');
					if (self['_onError']) {
						self['_onError'](request);
						self['_onLoad'] = undefined;
						self['_onError'] = undefined
					}
				})
			} else {
				console.log('에러!');
				if (self['_onError']) {
					self['_onError'](request);
					self['_onLoad'] = undefined;
					self['_onError'] = undefined
				}


			}

		}
	};

	request.send();
};
export default class RedImageLoader {
	constructor(src, onLoad, onError, option) {
		var self = this;
		if (!(this instanceof RedImageLoader)) return new RedImageLoader(src, onLoad, onError, option);
		if (typeof src !== 'string') RedUTIL.throwFunc('RedImageLoader : src는 문자열 만 허용.', '입력값 : ' + src);
		self['_src'] = src;
		self['_onLoad'] = onLoad;
		self['_onError'] = onError;
		if (src.split(',').length === 2 && src.substr(0, 5) === 'data:') {
			makeImageBitmap(base64toBlob(src.split(',')[1], 'image/png'), option ? option : {
				// imageOrientation: 'flipY'
			}).then(function (v) {
				// console.log(v)
				v['src'] = src;
				self['source'] = v;
				if (self['_onLoad']) {
					self['_onLoad'](v);
					self['_onLoad'] = undefined;
					self['_onError'] = undefined
				}
				// console.log('베이스이미지성공', v)

			});
		} else fileLoader.apply(self, [self['_src'], onLoad, onError, option])

	};
}