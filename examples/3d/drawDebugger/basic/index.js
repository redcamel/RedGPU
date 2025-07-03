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


			// mesh.setPosition(Math.sin(time/1000),Math.cos(time/1000),Math.sin(time/1000))

			scene.children.forEach(mesh => {
				mesh.rotationX +=.1
				mesh.rotationY +=.1
				mesh.rotationZ +=.1

			})
		};
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext,view,RedGPU);
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
	const {createIblHelper} = await import('../../../exampleHelper/createExample/panes/index.js');

	const pane = new Pane();
	createIblHelper(pane, targetView, RedGPU);
};
