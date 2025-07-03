import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.ObitController(redGPUContext);

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		// view.axis = true;
		view.grid = true;
		redGPUContext.addView(view);


		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.color.setColorByRGB(255, 255, 200);
		directionalLight.intensity = 1.0;
		directionalLight.direction = [0.3, -1, 0.5];
		scene.lightManager.addDirectionalLight(directionalLight);
		directionalLight.enableDebugger = true;
		// 포인트 라이트 추가
		const pointLight = new RedGPU.Light.PointLight();
		pointLight.color.setColorByRGB(255, 0, 0);
		pointLight.intensity = 2.0;
		pointLight.radius = 2.0;
		pointLight.setPosition(0, 1, 0);
		scene.lightManager.addPointLight(pointLight);
		pointLight.enableDebugger = true;

		const spotLight = new RedGPU.Light.SpotLight();
		spotLight.color.setColorByRGB(0, 0, 255);
		spotLight.intensity = 2.0;
		spotLight.radius = 12.0;
		spotLight.setPosition(6, 6, 6);
		spotLight.direction=[-1, -1, -1];
		scene.lightManager.addSpotLight(spotLight);
		spotLight.enableDebugger = true;


		const mesh = new RedGPU.Display.Mesh(redGPUContext,new RedGPU.Primitive.Sphere(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext))
		mesh.enableDebugger = true;
		scene.addChild(mesh)
		mesh.setScale(2,1)

		const mesh2 = new RedGPU.Display.Mesh(redGPUContext,new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext,'#fff000'))
		mesh.addChild(mesh2)
		mesh2.enableDebugger = true;
		mesh2.setPosition(2,2)
		loadGLTFGrid(view,
			[
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF/DamagedHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/FlightHelmet/glTF/FlightHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet.gltf',
				'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Suzanne/glTF/Suzanne.gltf',
			]
		);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// 매 프레임 로직
			const directionalLightTest = scene.lightManager.directionalLights[0]
			if(	directionalLightTest) {
				directionalLightTest.enableDebugger = true;
				directionalLightTest.directionX= Math.sin(time / 1500)
				directionalLightTest.directionY = -1
				directionalLightTest.directionZ = Math.cos(time / 1500)
			}


			mesh.setPosition(Math.sin(time/1000),Math.cos(time/1000),Math.sin(time/1000))
			//
			mesh.rotationX +=.3
			mesh.rotationY +=.3
			mesh.rotationZ +=.3

			mesh2.rotationX +=.6
			mesh2.rotationY +=.6
			mesh2.rotationZ +=.6
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext,view);

	},
	(failReason) => {
		console.error('초기화 실패:', failReason);

		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;
		document.body.appendChild(errorMessage);
	}
);

function loadGLTFGrid(view, urls, gridSize = 4, spacing = 3) {
	const {redGPUContext, scene} = view;

	// 그리드 크기 계산
	const totalCols = Math.min(gridSize, urls.length); // 한 줄의 최대 컬럼 수
	const totalRows = Math.ceil(urls.length / gridSize); // 필요한 줄 수
	const totalWidth = (totalCols - 1) * spacing; // 전체 넓이 (X)
	const totalDepth = (totalRows - 1) * spacing; // 전체 깊이 (Z)

	// GLTF 모델 로드 및 그리드 배치
	urls.forEach((url, index) => {
		new RedGPU.GLTFLoader(redGPUContext, url, (v) => {
			const mesh = v['resultMesh'];
			scene.addChild(mesh);

			// 그리드 위치 계산 (X, Z 축 기준)
			const row = Math.floor(index / gridSize);
			const col = index % gridSize;
			const x = col * spacing - totalWidth / 2; // 중심 정렬
			const z = row * spacing - totalDepth / 2; // 중심 정렬
			mesh.setEnableDebuggerRecursively(true);
			// 메쉬 위치 설정
			mesh.x = x;
			mesh.y = 0; // Y축은 고정
			mesh.z = -4;
			if (index === 0) {
				mesh.setScale(1.5)
			}
			if (index === 1) {
				mesh.setScale(5)
				mesh.y = -1.7
			}
		});
	});
}

const renderTestPane = async (redGPUContext, targetView) => {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const pane = new Pane();

	const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
	const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
	targetView.ibl = ibl;
	targetView.skybox = skybox;
};
