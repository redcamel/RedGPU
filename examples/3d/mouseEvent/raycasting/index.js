import * as RedGPU from "../../../../dist/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	(redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 조명 설정
		// [EN] Set up lighting
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.direction = [-1, -1, -1];
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 공통 재질 생성 (반복되는 그리드 텍스처)
		// [EN] Create common material (repeating grid texture)
		const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../../assets/UV_Grid_Sm.jpg');
		const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
			addressModeU: 'repeat',
			addressModeV: 'repeat'
		});
		
		const createMaterial = () => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.diffuseTexture = texture;
			material.diffuseTextureSampler = sampler;
			return material;
		};

		// [KO] 인터랙션 대상 객체들을 담을 배열
		// [EN] Array to hold interactable objects
		const interactableObjects = [];

		// 1. TorusKnot (Left)
		const torusKnot = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32, 2, 3),
			createMaterial()
		);
		torusKnot.setPosition(-6, 0, 0);
		torusKnot.name = "TorusKnot";
		scene.addChild(torusKnot);
		interactableObjects.push(torusKnot);

		// 2. Box (Center)
		const box = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3, 1, 1, 1),
			createMaterial()
		);
		box.name = "Box";
		scene.addChild(box);
		interactableObjects.push(box);

		// 3. Sphere (Right)
		const sphere = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32, 0, Math.PI * 2, 0, Math.PI),
			createMaterial()
		);
		sphere.setPosition(6, 0, 0);
		sphere.name = "Sphere";
		scene.addChild(sphere);
		interactableObjects.push(sphere);

		// 4. Cylinder (Back Left)
		const cylinder = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Cylinder(redGPUContext, 1.5, 1.5, 4, 32, 1, false, 0, Math.PI * 2),
			createMaterial()
		);
		cylinder.setPosition(-4, 0, -5);
		cylinder.name = "Cylinder";
		scene.addChild(cylinder);
		interactableObjects.push(cylinder);

		// 5. Torus (Back Right)
		const torus = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Torus(redGPUContext, 2, 0.5, 32, 32, 0, Math.PI * 2),
			createMaterial()
		);
		torus.setPosition(4, 0, -5);
		torus.rotationX = 90;
		torus.name = "Torus";
		scene.addChild(torus);
		interactableObjects.push(torus);

		// [KO] 교차 지점을 표시할 작은 구체
		// [EN] A small sphere to mark the intersection point
		const markerMaterial = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
		const marker = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Sphere(redGPUContext, 0.15),
			markerMaterial
		);
		marker.visible = false;
		scene.addChild(marker);

		// [KO] 정보 표시용 HTML 요소 생성
		// [EN] Create HTML element for displaying information
		const infoBox = document.createElement('div');
		Object.assign(infoBox.style, {
			position: 'absolute',
			bottom: '70px',
			left: '20px',
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			backdropFilter: 'blur(10px)',
			border: '1px solid rgba(255, 255, 255, 0.2)',
			color: '#fff',
			padding: '6px 12px',
			borderRadius: '12px',
			fontSize: '11px',
			lineHeight: '1.6',
			pointerEvents: 'none',
			textAlign: 'left',
			whiteSpace: 'pre-wrap',
			display: 'none',
			userSelect: 'none',
			zIndex: '100',
			boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
		});
		document.body.appendChild(infoBox);

		const updateInfo = (e) => {
			infoBox.innerHTML = `[Hit Info]
Object: ${e.target.name}
Distance: ${e.distance.toFixed(4)}
World Point: [${e.point[0].toFixed(2)}, ${e.point[1].toFixed(2)}, ${e.point[2].toFixed(2)}]
Local Point: [${e.localPoint[0].toFixed(2)}, ${e.localPoint[1].toFixed(2)}, ${e.localPoint[2].toFixed(2)}]
Face Index: ${e.faceIndex}
UV: [${e.uv ? e.uv[0].toFixed(3) : 'N/A'}, ${e.uv ? e.uv[1].toFixed(3) : 'N/A'}]`;
		};

		interactableObjects.forEach(mesh => {
			mesh.addListener('over', (e) => {
				e.target.material.color.setColorByHEX('#00ff00');
				marker.visible = true;
				marker.setPosition(e.point[0], e.point[1], e.point[2]);
				infoBox.style.display = 'block';
				updateInfo(e);
			});
			mesh.addListener('move', (e) => {
				marker.setPosition(e.point[0], e.point[1], e.point[2]);
				updateInfo(e);
			});
			mesh.addListener('out', (e) => {
				e.target.material.color.setColorByHEX('#ffffff');
				marker.visible = false;
				infoBox.style.display = 'none';
			});
		});

		// [KO] 렌더러 시작
		// [EN] Start renderer
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] 테스트용 컨트롤 패널 실행
		// [EN] Execute test control panel
		renderTestPane(redGPUContext);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	pane.addBlade({
		view: 'text',
		label: 'Guide',
		value: 'Hover over objects to see raycasting in action!',
		parse: (v) => v,
		readonly: true
	});
};