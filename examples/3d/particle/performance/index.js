import * as RedGPU from "../../../../dist/index.js";

// 1. Create and append a canvas
// 1. 캔버스를 생성하고 문서에 추가
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
// 2. RedGPU 초기화
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controllerTest = new RedGPU.Camera.ObitController(redGPUContext);
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controllerTest);
		const directionalLightTest = new RedGPU.Light.DirectionalLight()
		directionalLightTest.color.r = 255
		directionalLightTest.color.g = 255
		directionalLightTest.color.b = 255
		directionalLightTest.intensity = 1
		controllerTest.distance = 100
		controllerTest.tilt = -15
		// controllerTest.speedDistance =0.2
		controllerTest.delayDistance = 0.7

		scene.lightManager.addDirectionalLight(directionalLightTest)
		view.axis = null
		view.grid = null
		redGPUContext.addView(view);
		const cubeTexture =
			new RedGPU.Resource.CubeTexture(redGPUContext, [
				"../../../assets/skybox/px.jpg", // Positive X
				"../../../assets/skybox/nx.jpg", // Negative X
				"../../../assets/skybox/py.jpg", // Positive Y
				"../../../assets/skybox/ny.jpg", // Negative Y
				"../../../assets/skybox/pz.jpg", // Positive Z
				"../../../assets/skybox/nz.jpg", // Negative Z
			])
		// view.iblTexture = cubeTexture
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture)
		const texture_particle1 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle.png');
		const texture_particle2 = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/particle/particle2.png');
		const testParticleWrap = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Sphere(redGPUContext),
			new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000')
		)
		scene.addChild(testParticleWrap)
		const testParticle = new RedGPU.Display.ParticleEmitter(redGPUContext)
		testParticleWrap.addChild(testParticle)
		testParticle.material.diffuseTexture = texture_particle2

		{
			let i = 100
			while (i--) {
				const testParticle2 = new RedGPU.Display.ParticleEmitter(redGPUContext)
				scene.addChild(testParticle2)
				testParticle2.x = Math.random() * 50 - 25
				testParticle2.y = Math.random() * 50 - 25
				testParticle2.z = Math.random() * 50 - 25
				testParticle2.material.diffuseTexture = [texture_particle1, texture_particle2][Math.floor(Math.random() * 2)]
				testParticle2.material.blendColorState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE
			}
		}

		const renderer = new RedGPU.Renderer(redGPUContext)

		let test = 0
		const render = (time) => {
			directionalLightTest.direction[0] = Math.sin(time / 1500)
			directionalLightTest.direction[1] = -1
			directionalLightTest.direction[2] = Math.cos(time / 1500)
			redGPUContext.viewList.forEach(view => {

			})
			//
			testParticleWrap.x += Math.sin(time / 500)
			testParticleWrap.y += Math.cos(time / 500)
			testParticleWrap.z += Math.sin(time / 500)

		}
		renderer.start(redGPUContext, render)
		renderTestPane(redGPUContext)
	},
	(failReason) => {
		// Handle initialization failure
		console.error('Initialization failed:', failReason); // 초기화 실패 로그 출력
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason; // 실패 원인 메시지를 표시
		document.body.appendChild(errorMessage);
	}
);

const renderTestPane = async (redGPUContext, mesh) => {
	const {setDebugViewButton} = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugViewButton(redGPUContext);

};
