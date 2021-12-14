# RedGPU
RedGPU - Javascript WebGPU Library

## Usage
- When running localhost, port 3003 should be used.
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


## etc
 - webGPU basic samples can be found [here](https://github.com/redcamel/webgpu)
