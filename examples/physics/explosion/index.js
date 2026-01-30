import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 현실적인 스케일에 맞춰 거리 조정
		// [EN] Camera setup: Adjust distance for realistic scale
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥 생성 (50m x 50m)
		// [EN] Create ground (50m x 50m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -0.5;
		ground.scaleX = 50;
		ground.scaleY = 1;
		ground.scaleZ = 50;
		ground.material.color.setColorByHEX('#444444');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// 2. 박스 관리 시스템
		const activeBoxes = [];
		const boxGeo = new RedGPU.Primitive.Box(redGPUContext);

		/**
		 * [KO] 0.5m 크기의 박스 100개를 쌓는 함수
		 * [EN] Function to pile up 100 boxes of 0.5m size
		 */
		const createPile = () => {
			for (let i = 0; i < 100; i++) {
				const material = new RedGPU.Material.PhongMaterial(redGPUContext);
				material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
				const box = new RedGPU.Display.Mesh(
					redGPUContext,
					boxGeo,
					material
				);
				box.x = (Math.random() * 6) - 3;
				box.y = 1 + (i * 0.6);
				box.z = (Math.random() * 6) - 3;
				box.scaleX = 0.5;
				box.scaleY = 0.5;
				box.scaleZ = 0.5;
				scene.addChild(box);

				const body = physicsEngine.createBody(box, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
					mass: 1,
					friction: 0.5,
					restitution: 0.2,
					linearDamping: 0.1,
					angularDamping: 0.1
				});
				activeBoxes.push({ mesh: box, body });
			}
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeBoxes.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBoxes.length = 0;
			createPile();
		};

		createPile();

		/**
		 * [KO] 클릭 지점 기준 폭발 로직
		 * [EN] Explosion logic based on click point
		 */
		canvas.addEventListener('mousedown', (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			const worldPoint = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
			if (!worldPoint) return;

			const epicenter = { x: worldPoint[0], y: worldPoint[1], z: worldPoint[2] };
			const explosionRadius = 10;
			const explosionPower = 40;

			physicsEngine.bodies.forEach(body => {
				if (body.nativeBody.isFixed()) return;
				const pos = body.position;
				const dx = pos[0] - epicenter.x;
				const dy = pos[1] - epicenter.y;
				const dz = pos[2] - epicenter.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < explosionRadius) {
					// [KO] 거리에 따른 힘의 감쇄 계산
					// [EN] Calculate force attenuation based on distance
					const forceScalar = (1 - (distance / explosionRadius)) * explosionPower;
					const dir = {
						x: dx / distance,
						y: dy / distance,
						z: dz / distance
					};
					body.applyImpulse({
						x: dir.x * forceScalar,
						y: (dir.y * forceScalar) + (forceScalar * 0.5),
						z: dir.z * forceScalar
					});
				}
			});
		});

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Guide',
		value: 'Click anywhere to BOOM!',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
