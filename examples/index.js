import * as RedGPU from "../dist/index.js";

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'redGPUCanvas')
document.body.appendChild(canvas);
RedGPU.init(
	canvas,
	redGPUContext => {
		// redGPUContext.useMSAA=false
		const controllerTest = new RedGPU.Camera.ObitController(redGPUContext);
		controllerTest.distance = 2
		controllerTest.speedDistance = 0.1
		controllerTest.camera.fieldOfView = 60
		// controllerTest.tilt = -10
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controllerTest);
		// redGPUContext.useDebugPanel = true
		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		directionalLightTest.color.r = 255
		directionalLightTest.color.g = 255
		directionalLightTest.color.b = 255
		directionalLightTest.intensity = 1

		// scene.lightManager.addDirectionalLight(directionalLightTest)

		redGPUContext.addView(view);

		const hdrTexture = new RedGPU.Resource.HDRTexture(
			redGPUContext,
			'./assets/hdr/sphericalSkyBox.hdr'
			,
			true,
			() => {
				const ibl = new RedGPU.Resource.IBL(redGPUContext, hdrTexture.gpuCubeTexture);
				view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture)
				view.ibl = ibl
			}
		);

		const renderer = new RedGPU.Renderer(redGPUContext)

		//
		let model;

		function loadGLTF(url) {
			new RedGPU.GLTFLoader(
				redGPUContext,
				url,
				(v) => {
					console.log('GLTFLoader ', v)
					console.log('GLTFLoader parsingResult', v.parsingResult)
					scene.addChild(model = v['resultMesh'])
					model.setScale(redGPUContext.detector.isMobile ? 0.5 : 10)
					console.log(model)
				}
			)
		}

		const modelURL = redGPUContext.detector.isMobile ? 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf' : 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF/MosquitoInAmber.gltf'
		loadGLTF(modelURL);
		// loadGLTF('./assets/gltf/busterDrone/busterDrone.gltf');
		const render = (time) => {
			directionalLightTest.direction[0] = Math.sin(time / 1500)
			directionalLightTest.direction[1] = -1
			directionalLightTest.direction[2] = Math.cos(time / 1500)
			if (model) {
				model.rotationY += 0.5
			}

		}
		renderer.start(redGPUContext, render)
	},
	failReason => {
		console.log('실패', failReason)
		const t0 = document.createElement('div')
		document.body.appendChild(t0)
		t0.innerHTML = failReason
	},
)
