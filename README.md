# RedGPU
RedGPU - Javascript WebGPU Library
<p>
  <a href="https://twitter.com/redcamel15"><img src="https://img.shields.io/twitter/follow/redcamel15.svg?style=social" alt="Twitter Follow" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=ff0000"></a>
</p>


## RedGPU 2.0 research progress.
```
V2.0.0 research is ongoing. Other repositories are in the works and will be released as meaningful work progresses.
The first target will be released on December 1, 2022.
```
- You can check the 2.0 source at [RedGPU2.0 Preview branch.](https://github.com/redcamel/RedGPU/tree/preview2.0)</a>
- You can check the 2.0 Demo at [RedGPU2.0 Demo.](https://redcamel.github.io/Rnd_Doc/host/index.html)</a>

## V1.0 -----------------
## Usage
- When running localhost, port 3003 should be used.
- Running in chrome canary.
#### html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RedGPU Example - HelloWorld</title>
    <link type="text/css" rel="stylesheet" href="../css.css"/>
    <script type="module" src="your host.js"></script>
</head>
<body></body>
</html>
```

#### module
```javascript
"use strict"
import RedGPU from "dist/RedGPU.min.mjs";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tScene, tCamera;
		let renderer, render;
		let testMesh;
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.Camera3D(this);
		tView = new RedGPU.View(this, tScene, tCamera);
		renderer = new RedGPU.Render();
		this.addView(tView)

		testMesh = new RedGPU.Mesh(this, new RedGPU.Box(this), new RedGPU.ColorMaterial(this))
		tScene.addChild(testMesh)

		tCamera.z = -5;
		tCamera.lookAt(0, 0, 0);

		render = time => {
			renderer.render(time, this)
			requestAnimationFrame(render)
		}
		requestAnimationFrame(render);
	}
);
```
## [Examples](https://redcamel.github.io/RedGPU/examples/)
   - See the [example](https://redcamel.github.io/RedGPU/examples/). Various examples are available.



https://user-images.githubusercontent.com/820587/172777357-32c64963-abbe-432c-80e0-7893025b58ef.mp4


## etc
 - webGPU basic samples can be found [here](https://github.com/redcamel/webgpu)
