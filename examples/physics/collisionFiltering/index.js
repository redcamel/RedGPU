import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Collision Filtering 예제
 * [EN] Collision Filtering example
 *
 * [KO] 충돌 필터링을 사용하여 특정 그룹 간의 충돌만 허용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to use collision filtering to allow collisions only between specific groups.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 축소된 스케일에 맞춰 거리 조정
		// [EN] Set up camera controller: Adjust distance for reduced scale
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.tilt = -25;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 충돌 그룹 정의 (16비트 비트마스크)
		// [EN] Define collision groups (16-bit bitmask)
		const GROUP_RED   = 0x0001; 
		const GROUP_BLUE  = 0x0002; 
		const GROUP_BLACK = 0x0004; 
		const GROUP_ALL   = 0xFFFF;

		// 1. 바닥 생성 함수 (현실적인 미터 단위 스케일)
		const createFloor = (x, color, membership) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = -0.5;
			mesh.scaleX = 10;
			mesh.scaleY = 1;
			mesh.scaleZ = 20;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
			
			// [KO] 바닥은 오직 자신의 그룹에 속한 물체와만 부딪힘
			// [EN] Floor only collides with objects belonging to its own group
			const bitmask = (membership << 16) | membership;
			body.nativeCollider.setCollisionGroups(bitmask);
		};

		createFloor(-12, '#ff4444', GROUP_RED);
		createFloor(0, '#333333', GROUP_BLACK);
		createFloor(12, '#4444ff', GROUP_BLUE);

		// 2. 구슬 생성 시스템
		const activeBalls = [];
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);

		const spawnBall = (type) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				ballGeo,
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.y = 15;
			mesh.x = (Math.random() * 30) - 15;
			mesh.z = (Math.random() * 10) - 5;
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
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});
			
			const bitmask = (membership << 16) | filter;
			body.nativeCollider.setCollisionGroups(bitmask);

			const ballInfo = { mesh: ball, body };
			activeBalls.push(ballInfo);
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeBalls.splice(idx, 1);
				}
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		setInterval(() => spawnBall('RED'), 800);
		setInterval(() => spawnBall('BLUE'), 800);
		setInterval(() => spawnBall('BLACK'), 800);
		setInterval(() => spawnBall('RAINBOW'), 1500);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 GUI를 렌더링합니다.
 * [EN] Renders the GUI for testing.
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Guide',
		value: 'Colors filter their own floors!',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
};
