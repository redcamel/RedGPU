/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.12.16 20:34:19
 *
 */
import RedGPU from "../src/RedGPU.js";

const cvs = document.createElement('canvas');

new RedGPU.RedGPUContext(
	cvs,
	function () {
		document.body.appendChild(cvs);
		let t0 = new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('첫로딩완료',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료1',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료2',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료3',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료4',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료5',this)
		})
		new RedGPU.RedImageLoader(this, '../assets/UV_Grid_Sm.jpg', function () {
			console.log('캐싱로딩완료6',this)
		})
		console.log(t0)
	}
)
