import * as RedGPU from "../../../../dist";

// 1. Create and append a canvas
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

// 2. Initialize RedGPU
RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.speedDistance = 10;
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		redGPUContext.addView(view);

		const light = new RedGPU.Light.DirectionalLight()
		scene.lightManager.addDirectionalLight(light)

		const texture = new RedGPU.Resource.BitmapTexture(
			redGPUContext,
			'../../../assets/UV_Grid_Sm.jpg'
		);
		const material = new RedGPU.Material.PhongMaterial(redGPUContext);
		material.diffuseTexture = texture;

		const skyboxTexture = new RedGPU.Resource.CubeTexture(
			redGPUContext,
			[
				"../../../assets/skybox/px.jpg", // Positive X
				"../../../assets/skybox/nx.jpg", // Negative X
				"../../../assets/skybox/py.jpg", // Positive Y
				"../../../assets/skybox/ny.jpg", // Negative Y
				"../../../assets/skybox/pz.jpg", // Positive Z
				"../../../assets/skybox/nz.jpg", // Negative Z
			]
		);
		view.skybox = new RedGPU.Display.SkyBox(redGPUContext, skyboxTexture);
		view.grid = true

		createTest(redGPUContext, scene, material);

		const renderer = new RedGPU.Renderer(redGPUContext);
		const render = (time) => {
			// Logic for every frame goes here
			// 매 프레임마다 실행될 로직 추가
			if (scene.children[0]) {
				// scene.children[0].rotationY += 0.001;
			}
		};
		renderer.start(redGPUContext, render);

	},
	(failReason) => {
		// Show the error if initialization fails
		// 초기화 실패 시 에러 표시
		console.error('초기화 실패:', failReason);

		// Create an element for the error message
		// 에러 메시지 표시용 요소 생성
		const errorMessage = document.createElement('div');
		errorMessage.innerHTML = failReason;

		// Append the error message to the document body
		// 문서 본문에 에러 메시지 추가
		document.body.appendChild(errorMessage);
	}
);

async function createTest(context, scene, material) {
	const {Pane} = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');

	const {setDebugButtons} = await import("../../../exampleHelper/createExample/panes");
	setDebugButtons(context);

	const maxInstanceCount = context.detector.isMobile ? 100000 : RedGPU.Display.InstancingMesh.getLimitSize();
	const instanceCount = context.detector.isMobile ? 20000 : 200000;

	const url = '../../../assets/gltf/lod/scene.gltf';
	new RedGPU.GLTFLoader(context, url, (result) => {
		console.log(result.resultMesh)
		const mesh = result.resultMesh.children[0].children[0].children[0].children[0]
		const materialLOD0 = new RedGPU.Material.PhongMaterial(context, '#ff0000');
		const materialLOD1 = new RedGPU.Material.PhongMaterial(context, '#00ff00');
		const materialLOD2 = new RedGPU.Material.PhongMaterial(context, '#0000ff');
		material = new RedGPU.Material.PhongMaterial(context)
		const instancingMesh = new RedGPU.Display.InstancingMesh(
			context,
			maxInstanceCount,
			instanceCount,
			mesh.geometry,
            mesh.material
		);
		mesh.primitiveState.cullMode = 'none'
		scene.addChild(instancingMesh);

		const initializeInstances = () => {
			for (let i = 0; i < instancingMesh.instanceCount; i++) {
				if (instancingMesh.instanceChildren[i].x === 0) {
					instancingMesh.instanceChildren[i].setPosition(
						Math.random() * 2000 - 1000,
						0,
						Math.random() * 2000 - 1000,
					);
					instancingMesh.instanceChildren[i].rotationX = 90
					instancingMesh.instanceChildren[i].setScale(Math.random() * 6);
				}

				// mesh.instanceChildren[i].opacity = Math.random();
			}
		};

		initializeInstances();

		const pane = new Pane();

		// ---- 기본 메쉬 (LOD 0) 표시용 - 토글 불가 ----
		const baseInfo = {
			baseMesh: "Base Mesh (Sphere 32x32)",
		};
		pane.addBinding(baseInfo, "baseMesh", {
			label: "Base Mesh",
			readonly: true,
		});

		// ---- LOD 토글용 유틸 ----
		const hasLOD = (distance) => {
			return instancingMesh.LODManager.LODList.some(lod => lod.distance === distance);
		};

		const addLODIfNeeded = (distance, createGeometry,material) => {
			if (!hasLOD(distance)) {
				instancingMesh.LODManager.addLOD(distance, createGeometry(),material);
			}
		};

		const removeLODIfExists = (distance) => {
			if (hasLOD(distance)) {
				instancingMesh.LODManager.removeLOD(distance);
			}
		};
        const distanceLOD0 = 300
        const distanceLOD1 = 600
        const distanceLOD2 = 900
		const lodState = {
			[`lod${distanceLOD0}`]: true,
            [`lod${distanceLOD1}`]: true,
            [`lod${distanceLOD2}`]: true,
			lodCount: 0,
			lodDistances: '',
		};

		const updateLODInfo = () => {
			const list = instancingMesh.LODManager.LODList;
			lodState.lodCount = list.length;
			lodState.lodDistances = list
				.map(lod => lod.distance)
				.sort((a, b) => a - b)
				.join(', ');
		};

		// 초기 LOD 3개 활성화

		addLODIfNeeded(distanceLOD0, () => mesh.geometry, materialLOD0);
		addLODIfNeeded(distanceLOD1, () => new RedGPU.Primitive.Sphere(context, 0.5, 8, 8, 8), materialLOD1);
		addLODIfNeeded(distanceLOD2, () => new RedGPU.Primitive.Circle(context, 0.5), materialLOD2);
		updateLODInfo();

		// 100 LOD 토글
		pane.addBinding(lodState, `lod${distanceLOD0}`, {label: `LOD ${distanceLOD0}`})
			.on('change', (ev) => {
				if (ev.value) {
					addLODIfNeeded(distanceLOD0, () => mesh.geometry, materialLOD0);
				} else {
					removeLODIfExists(distanceLOD0);
				}
				updateLODInfo();
			});

		// 50 LOD 토글
		pane.addBinding(lodState, `lod${distanceLOD1}`, {label: `LOD ${distanceLOD1}`})
			.on('change', (ev) => {
				if (ev.value) {
					addLODIfNeeded(distanceLOD1, () => new RedGPU.Primitive.Sphere(context, 0.5, 8, 8, 8), materialLOD1);
				} else {
					removeLODIfExists(distanceLOD1);
				}
				updateLODInfo();
			});

		// 70 LOD 토글
		pane.addBinding(lodState, `lod${distanceLOD2}`, {label: `LOD ${distanceLOD2}`})
			.on('change', (ev) => {
				if (ev.value) {
					addLODIfNeeded(distanceLOD2, () => new RedGPU.Primitive.Circle(context, 0.5), materialLOD2);
				} else {
					removeLODIfExists(distanceLOD2);
				}
				updateLODInfo();
			});

		// 현재 LOD 상태 표시
		pane.addBinding(lodState, 'lodCount', {
			label: 'LOD Count',
			readonly: true,
			format: (v) => `${Math.floor(v).toLocaleString()}`
		});
		pane.addBinding(lodState, 'lodDistances', {
			label: 'LOD Distances',
			readonly: true,
		});

		pane.addBinding(instancingMesh, 'instanceCount', {min: 100, max: maxInstanceCount, step: 1})
			.on('change', initializeInstances);
		pane.addBinding({maxInstanceCount: maxInstanceCount}, 'maxInstanceCount', {
			readonly: true,
			format: (v) => `${Math.floor(v).toLocaleString()}`
		});
	});

}
