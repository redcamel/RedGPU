import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 65;
		controller.tilt = -25;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// ---------------------------------------------------------
		// 충돌 그룹 정의 (16비트 비트마스크)
		// ---------------------------------------------------------
		const GROUP_RED   = 0x0001; // 1 (비트 0)
		const GROUP_BLUE  = 0x0002; // 2 (비트 1)
		const GROUP_BLACK = 0x0004; // 4 (비트 2)
		const GROUP_ALL   = 0xFFFF; // 모든 비트 활성화

		// 1. 바닥 생성 함수
		const createFloor = (x, color, membership) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = -1;
			mesh.scaleX = 15; mesh.scaleY = 2; mesh.scaleZ = 40;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
			
			// 바닥은 오직 자신의 그룹에 속한 물체(filter)와만 부딪힘
			const bitmask = (membership << 16) | membership;
			body.nativeCollider.setCollisionGroups(bitmask);
		};

		// 왼쪽: 빨간 바닥 (멤버십: RED, 필터: RED)
		createFloor(-18, '#ff0000', GROUP_RED);
		// 중앙: 검은 바닥 (멤버십: BLACK, 필터: BLACK)
		createFloor(0, '#333333', GROUP_BLACK);
		// 오른쪽: 파란 바닥 (멤버십: BLUE, 필터: BLUE)
		createFloor(18, '#0000ff', GROUP_BLUE);

		// 2. 구슬 생성 시스템
		const activeBalls = [];
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 1.0);

		const spawnBall = (type) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, ballGeo, new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.y = 35;
			// [KO] 모든 구슬이 전체 영역(-25 ~ 25) 내에서 랜덤하게 낙하
			// [EN] All balls fall randomly within the entire range (-25 to 25)
			mesh.x = (Math.random() * 50) - 25;
			mesh.z = (Math.random() * 20) - 10;
			scene.addChild(mesh);

			let membership, filter, color;
			switch(type) {
				case 'RED':
					color = '#ff4444';
					membership = GROUP_RED;
					filter = GROUP_RED; 
					break;
				case 'BLUE':
					color = '#4444ff';
					membership = GROUP_BLUE;
					filter = GROUP_BLUE; 
					break;
				case 'BLACK':
					color = '#888888';
					membership = GROUP_BLACK;
					filter = GROUP_BLACK; 
					break;
				case 'RAINBOW':
					color = '#ffffff';
					membership = 0x0008; 
					filter = GROUP_ALL; 
					break;
			}

			mesh.material.color.setColorByHEX(color);
			const body = physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE, mass: 1, restitution: 0.5 });
			
			const bitmask = (membership << 16) | filter;
			body.nativeCollider.setCollisionGroups(bitmask);

			const ballInfo = { mesh, body };
			activeBalls.push(ballInfo);
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(mesh); activeBalls.splice(idx, 1); }
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeBalls.length = 0;
		};

		// 공들 스폰 (흰색 공은 모든 곳에 충돌하는 만능 공)
		setInterval(() => spawnBall('RED'), 800);
		setInterval(() => spawnBall('BLUE'), 800);
		setInterval(() => spawnBall('BLACK'), 800);
		setInterval(() => spawnBall('RAINBOW'), 1500);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({ view: 'text', label: 'Guide', value: 'Colors filter their own floors!', parse: (v) => v, readonly: true });
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};