import * as RedGPU from "../../../../dist/index.js?t=1770637396475";

/**
 * [KO] UV Transform 예제
 * [EN] UV Transform example
 *
 * [KO] 텍스처 UV 좌표의 오프셋(이동)과 스케일(크기)을 변환하는 기능을 시연합니다.
 * [EN] Demonstrates the function of transforming the offset (move) and scale (size) of texture UV coordinates.
 */

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10;
		directionalLight.y = 20;
		directionalLight.z = 10;
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 단일 비트맵 텍스처 생성
		// [EN] Create a single bitmap texture
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');

		// [KO] 반복(Repeat) 설정이 적용된 샘플러 생성
		// [EN] Create a sampler with repeat settings applied
		const repeatSampler = new RedGPU.Resource.Sampler(redGPUContext);
		repeatSampler.addressModeU = 'repeat';
		repeatSampler.addressModeV = 'repeat';

		// [KO] 공용 머티리얼 설정
		// [EN] Set up shared materials
		const phongMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
		phongMaterial.diffuseTexture = texture;
		phongMaterial.diffuseTextureSampler = repeatSampler; // [KO] 반복 샘플러 적용

		const bitmapMaterial = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);
		bitmapMaterial.diffuseTextureSampler = repeatSampler; // [KO] 반복 샘플러 적용

		// [KO] 프리미티브 정의
		// [EN] Define primitives
		const primitives = [
			{ name: 'Box', geo: new RedGPU.Primitive.Box(redGPUContext) },
			{ name: 'Sphere', geo: new RedGPU.Primitive.Sphere(redGPUContext) },
			{ name: 'Torus', geo: new RedGPU.Primitive.Torus(redGPUContext) },
			{ name: 'TorusKnot', geo: new RedGPU.Primitive.TorusKnot(redGPUContext) },
			{ name: 'Cylinder', geo: new RedGPU.Primitive.Cylinder(redGPUContext) },
			{ name: 'Plane', geo: new RedGPU.Primitive.Plane(redGPUContext) }
		];

		// [KO] 메시 배치
		// [EN] Place meshes
		const allMeshes = [];
		const spacing = 3.0; // [KO] 공통 간격 [EN] Uniform spacing
		const startX = -(primitives.length - 1) * spacing / 2;
		const startY = spacing / 2;

		primitives.forEach((item, index) => {
			const x = startX + index * spacing;

			// [KO] 상단: PhongMaterial 메시
			// [EN] Top: PhongMaterial meshes
			const pMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, phongMaterial);
			pMesh.x = x;
			pMesh.y = startY;
			scene.addChild(pMesh);
			allMeshes.push(pMesh);

			// [KO] 하단: BitmapMaterial 메시
			// [EN] Bottom: BitmapMaterial meshes
			const bMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, bitmapMaterial);
			bMesh.x = x;
			bMesh.y = -startY;
			scene.addChild(bMesh);
			allMeshes.push(bMesh);
		});

		const renderer = new RedGPU.Renderer();
		const scrollInfo = {
			autoScroll: true,
			speedU: 0.001,
			speedV: 0.002,
			offsetU: 0,
			offsetV: 0,
			scaleU: 1,
			scaleV: 1
		};

		renderer.start(redGPUContext, (time) => {
			if (scrollInfo.autoScroll) {
				scrollInfo.offsetU += scrollInfo.speedU;
				scrollInfo.offsetV += scrollInfo.speedV;

				// [KO] 순환 처리
				// [EN] Circular processing
				if (scrollInfo.offsetU > 2) scrollInfo.offsetU -= 4;
				if (scrollInfo.offsetV > 2) scrollInfo.offsetV -= 4;
				if (scrollInfo.offsetU < -2) scrollInfo.offsetU += 4;
				if (scrollInfo.offsetV < -2) scrollInfo.offsetV += 4;

				const offset = [scrollInfo.offsetU, scrollInfo.offsetV];
				phongMaterial.textureOffset = offset;
				bitmapMaterial.textureOffset = offset;
			}
		});

		// [KO] UI 패널 구성
		// [EN] Configure UI panel
		renderTestPane(redGPUContext, {
			phongMaterial,
			bitmapMaterial,
			scrollInfo
		});
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트 조작을 위한 UI 패널 생성 함수
 * [EN] Create UI panel function for test manipulation
 */
async function renderTestPane(redGPUContext, testTarget) {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770637396475');
	const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770637396475");

	setDebugButtons(RedGPU, redGPUContext);

	const pane = new Pane();
	const { phongMaterial, bitmapMaterial, scrollInfo } = testTarget;

	// [KO] 자동 스크롤 제어 폴더
	// [EN] Auto Scroll Control Folder
	const folderScroll = pane.addFolder({ title: 'Auto Scroll Control' });
	folderScroll.addBinding(scrollInfo, 'autoScroll', { label: 'Use Auto Scroll' });
	folderScroll.addBinding(scrollInfo, 'speedU', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed U' });
	folderScroll.addBinding(scrollInfo, 'speedV', { min: -0.01, max: 0.01, step: 0.0001, label: 'Speed V' });

	// [KO] 수동 UV 트랜스폼 폴더
	// [EN] Manual UV Transform Folder
	const folderManual = pane.addFolder({ title: 'Manual UV Transform' });

	// Offset
	folderManual.addBinding(scrollInfo, 'offsetU', { min: -2, max: 2, step: 0.0001, label: 'Offset U' }).on('change', (ev) => {
		if (!scrollInfo.autoScroll) {
			const val = [ev.value, scrollInfo.offsetV];
			phongMaterial.textureOffset = val;
			bitmapMaterial.textureOffset = val;
		}
	});
	folderManual.addBinding(scrollInfo, 'offsetV', { min: -2, max: 2, step: 0.0001, label: 'Offset V' }).on('change', (ev) => {
		if (!scrollInfo.autoScroll) {
			const val = [scrollInfo.offsetU, ev.value];
			phongMaterial.textureOffset = val;
			bitmapMaterial.textureOffset = val;
		}
	});

	// Scale
	folderManual.addBinding(scrollInfo, 'scaleU', { min: 0.1, max: 10, step: 0.0001, label: 'Scale U' }).on('change', (ev) => {
		const val = [ev.value, scrollInfo.scaleV];
		phongMaterial.textureScale = val;
		bitmapMaterial.textureScale = val;
	});
	folderManual.addBinding(scrollInfo, 'scaleV', { min: 0.1, max: 10, step: 0.0001, label: 'Scale V' }).on('change', (ev) => {
		const val = [scrollInfo.scaleU, ev.value];
		phongMaterial.textureScale = val;
		bitmapMaterial.textureScale = val;
	});

	// [KO] 초기화 버튼
	// [EN] Reset button
	pane.addButton({ title: 'Reset Transform' }).on('click', () => {
		scrollInfo.offsetU = 0;
		scrollInfo.offsetV = 0;
		scrollInfo.scaleU = 1;
		scrollInfo.scaleV = 1;
		phongMaterial.textureOffset = [0, 0];
		bitmapMaterial.textureOffset = [0, 0];
		phongMaterial.textureScale = [1, 1];
		bitmapMaterial.textureScale = [1, 1];
		pane.refresh();
	});

	// [KO] UI 동기화
	// [EN] UI Synchronization
	setInterval(() => {
		if (scrollInfo.autoScroll) pane.refresh();
	}, 100);
}
