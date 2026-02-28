import * as RedGPU from "../../../../dist/index.js?t=1770713934910";

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
		view.grid = false; // 그리드 비활성화
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

		// [KO] 비트맵 텍스처 생성
		// [EN] Create bitmap textures
		const textureGrid = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
		const textureHTest = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/texture/h_test.jpg');

		// [KO] 반복(Repeat) 설정이 적용된 샘플러 생성
		// [EN] Create a sampler with repeat settings applied
		const repeatSampler = new RedGPU.Resource.Sampler(redGPUContext);
		repeatSampler.addressModeU = 'repeat';
		repeatSampler.addressModeV = 'repeat';

		// [KO] 머티리얼 설정
		// [EN] Set up materials
		const materialTop = new RedGPU.Material.BitmapMaterial(redGPUContext, textureGrid);
		materialTop.diffuseTextureSampler = repeatSampler;

		const materialBottom = new RedGPU.Material.BitmapMaterial(redGPUContext, textureHTest);
		materialBottom.diffuseTextureSampler = repeatSampler;

		// [KO] 프리미티브 정의
		const primitives = [
			{ name: 'Box', geo: new RedGPU.Primitive.Box(redGPUContext) },
			{ name: 'Sphere', geo: new RedGPU.Primitive.Sphere(redGPUContext) },
			{ name: 'Torus', geo: new RedGPU.Primitive.Torus(redGPUContext) },
			{ name: 'TorusKnot', geo: new RedGPU.Primitive.TorusKnot(redGPUContext, 0.7, 0.2) }, // 사이즈 축소
			{ name: 'Circle', geo: new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, false) },
			{ name: 'Cylinder', geo: new RedGPU.Primitive.Cylinder(redGPUContext) },
			{ name: 'Plane', geo: new RedGPU.Primitive.Plane(redGPUContext) }
		];

		// [KO] 하단 Circle용 Radial 지오메트리 별도 생성
		const circleRadialGeo = new RedGPU.Primitive.Circle(redGPUContext, 1, 64, 0, Math.PI * 2, true);

		// [KO] 메시 배치
		const allMeshes = [];
		const gap = 3.0; // 오브젝트 사이의 실제 간격을 조절하는 기준값
		const startX = -(primitives.length - 1) * gap / 2;
		const startY = gap / 2; // 상하 오브젝트 사이의 간격도 동일하게 유지

		primitives.forEach((item, index) => {
			const x = startX + index * gap;

			// [KO] 프리미티브 이름 라벨 추가 (중앙)
			const nameLabel = new RedGPU.Display.TextField3D(redGPUContext);
			nameLabel.text = item.name;
			nameLabel.worldSize = 0.45;
			nameLabel.color = '#888888'; // 회색으로 변경
			nameLabel.x = x;
			nameLabel.y = 0;
			scene.addChild(nameLabel);

			// [KO] 상단: Grid Texture (Circle은 Planar)
			const pMesh = new RedGPU.Display.Mesh(redGPUContext, item.geo, materialTop);
			pMesh.x = x;
			pMesh.y = startY;
			scene.addChild(pMesh);
			allMeshes.push(pMesh);

			// [KO] 하단: H-Test Texture (Circle은 Radial로 교체)
			const geo = item.name === 'Circle' ? circleRadialGeo : item.geo;
			const bMesh = new RedGPU.Display.Mesh(redGPUContext, geo, materialBottom);
			bMesh.x = x;
			bMesh.y = -startY;
			scene.addChild(bMesh);
			allMeshes.push(bMesh);

			// [KO] Circle 전용 모드 라벨 추가
			if (item.name === 'Circle') {
				const planarLabel = new RedGPU.Display.TextField3D(redGPUContext);
				planarLabel.text = 'Planar';
				planarLabel.worldSize = 0.4;
				planarLabel.x = x;
				planarLabel.y = startY + 1.5;
				scene.addChild(planarLabel);

				const radialLabel = new RedGPU.Display.TextField3D(redGPUContext);
				radialLabel.text = 'Radial';
				radialLabel.worldSize = 0.4;
				radialLabel.x = x;
				radialLabel.y = -startY - 1.5;
				scene.addChild(radialLabel);
			}
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
				if (scrollInfo.offsetU > 2) scrollInfo.offsetU -= 4;
				if (scrollInfo.offsetV > 2) scrollInfo.offsetV -= 4;
				if (scrollInfo.offsetU < -2) scrollInfo.offsetU += 4;
				if (scrollInfo.offsetV < -2) scrollInfo.offsetV += 4;

				const offset = [scrollInfo.offsetU, scrollInfo.offsetV];
				materialTop.textureOffset = offset;
				materialBottom.textureOffset = offset;
			}
		});

		// [KO] UI 패널 구성
		renderTestPane(redGPUContext, {
			materialTop,
			materialBottom,
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
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
	const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js?t=1770713934910");

	setDebugButtons(RedGPU, redGPUContext);

	const pane = new Pane();
	const { materialTop, materialBottom, scrollInfo } = testTarget;

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
			materialTop.textureOffset = val;
			materialBottom.textureOffset = val;
		}
	});
	folderManual.addBinding(scrollInfo, 'offsetV', { min: -2, max: 2, step: 0.0001, label: 'Offset V' }).on('change', (ev) => {
		if (!scrollInfo.autoScroll) {
			const val = [scrollInfo.offsetU, ev.value];
			materialTop.textureOffset = val;
			materialBottom.textureOffset = val;
		}
	});

	// Scale
	folderManual.addBinding(scrollInfo, 'scaleU', { min: 0.1, max: 10, step: 0.0001, label: 'Scale U' }).on('change', (ev) => {
		const val = [ev.value, scrollInfo.scaleV];
		materialTop.textureScale = val;
		materialBottom.textureScale = val;
	});
	folderManual.addBinding(scrollInfo, 'scaleV', { min: 0.1, max: 10, step: 0.0001, label: 'Scale V' }).on('change', (ev) => {
		const val = [scrollInfo.scaleU, ev.value];
		materialTop.textureScale = val;
		materialBottom.textureScale = val;
	});

	// [KO] 초기화 버튼
	// [EN] Reset button
	pane.addButton({ title: 'Reset Transform' }).on('click', () => {
		scrollInfo.offsetU = 0;
		scrollInfo.offsetV = 0;
		scrollInfo.scaleU = 1;
		scrollInfo.scaleV = 1;
		materialTop.textureOffset = [0, 0];
		materialBottom.textureOffset = [0, 0];
		materialTop.textureScale = [1, 1];
		materialBottom.textureScale = [1, 1];
		pane.refresh();
	});

	// [KO] UI 동기화
	// [EN] UI Synchronization
	setInterval(() => {
		if (scrollInfo.autoScroll) pane.refresh();
	}, 100);
}
