# RedGPU
RedGPU - Javascript webGPU Engine

run in Chrome Canary() behind the flag --enable-unsafe-webgpu.
run in Edge Canary() behind the flag --enable-unsafe-webgpu.

## Usage
#### html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RedGPU Example - HelloWorld</title>
    <link type="text/css" rel="stylesheet" href="../css.css"/>
    <script type="module" src="testRnd/index.js"></script>
</head>
<body></body>
</html>
```

#### module
```javascript
"use strict"
import RedGPU from "../../src/RedGPU.js";

const cvs = document.createElement('canvas');
document.body.appendChild(cvs);
new RedGPU.RedGPUContext(
	cvs,
	function () {
		let tView, tScene, tCamera;
		let renderer, render;
		let testMesh;
		tScene = new RedGPU.Scene();
		tCamera = new RedGPU.Camera(this);
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


## etc
 - webGPU basic samples can be found [here](https://github.com/redcamel/webgpu)
