import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.body.appendChild(document.createElement('canvas'));

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 폭발로 인해 날아가는 상자들을 한눈에 볼 수 있도록 적절한 거리 유지
		// [EN] Camera setup: Maintain an appropriate distance to observe the boxes flying from the explosion at a glance
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true; // [KO] 1m 단위 격자 활성화 [EN] Enable 1m grid
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 중력 설정
		// [EN] Initialize physics engine (Rapier) and set gravity
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight();
		scene.lightManager.ambientLight.intensity = 0.5;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		// [KO] 1. 넓은 바닥 생성 (60m x 60m)
		// [EN] 1. Create a wide ground (60m x 60m)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = ground.scaleZ = 60;
		ground.scaleY = 1;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeBoxes = [];
		const boxGeo = new RedGPU.Primitive.Box(redGPUContext);

		/**
		 * [KO] 박스 더미 생성 및 관리 함수
		 * 성능 유지를 위해 최대 1000개까지만 상자를 유지하며, 초과 시 가장 오래된 상자부터 제거합니다.
		 * [EN] Box pile creation and management function
		 * To maintain performance, only up to 1000 boxes are kept; if exceeded, the oldest ones are removed.
		 */
		const createPile = (spawnY = 1) => {
			if (activeBoxes.length > 1000) {
				const removeCount = 100;
				for (let i = 0; i < removeCount; i++) {
					const item = activeBoxes.shift();
					physicsEngine.removeBody(item.body);
					scene.removeChild(item.mesh);
				}
			}

			for (let i = 0; i < 100; i++) {
				const material = new RedGPU.Material.PhongMaterial(redGPUContext);
				material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
				const box = new RedGPU.Display.Mesh(redGPUContext, boxGeo, material);
				box.x = (Math.random() * 8) - 4;
				box.y = spawnY + (i * 0.6);
				box.z = (Math.random() * 8) - 4;
				box.scaleX = box.scaleY = box.scaleZ = 0.5;
				scene.addChild(box);

				const body = physicsEngine.createBody(box, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
					mass: 1,
					friction: 0.5,
					restitution: 0.2
				});
				activeBoxes.push({ mesh: box, body });
			}
		};

		/**
		 * [KO] 마우스 클릭 이벤트: 폭발(Radial Impulse) 발생 및 상자 추가 스폰
		 * 클릭 지점에서 모든 동적 객체까지의 거리를 계산하여 방사형으로 힘을 가합니다.
		 * [EN] Mouse click event: Trigger explosion (Radial Impulse) and spawn additional boxes
		 * Calculates the distance from the click point to all dynamic objects and applies radial force.
		 */
		canvas.addEventListener('mousedown', (event) => {
			const rect = canvas.getBoundingClientRect();
			// [KO] 클릭한 화면 좌표를 3D 월드 좌표로 변환
			// [EN] Convert the clicked screen coordinates to 3D world coordinates
			const worldPoint = RedGPU.Util.screenToWorld(event.clientX - rect.left, event.clientY - rect.top, view);
			if (!worldPoint) return;

			const epicenter = { x: worldPoint[0], y: worldPoint[1], z: worldPoint[2] };
			const explosionRadius = 15; // [KO] 폭발 영향 범위 [EN] Explosion radius
			const explosionPower = 60;  // [KO] 폭발 위력 [EN] Explosion power

			physicsEngine.bodies.forEach(body => {
				// 정적 바디(바닥 등)는 제외
				if (body.nativeBody.isFixed()) return;

				const pos = body.position;
				const dx = pos[0] - epicenter.x;
				const dy = pos[1] - epicenter.y;
				const dz = pos[2] - epicenter.z;
				const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

				if (distance < explosionRadius) {
					/**
					 * [KO] 거리에 따른 힘의 감쇄 계산
					 * 폭발 중심지에 가까울수록 더 큰 충격을 받습니다.
					 * [EN] Calculate force attenuation based on distance
					 * Objects closer to the epicenter receive a stronger impact.
					 */
					const forceScalar = (1 - (distance / explosionRadius)) * explosionPower;
					const dir = { x: dx / distance, y: dy / distance, z: dz / distance };
					
					body.applyImpulse({
						x: dir.x * forceScalar,
						y: (dir.y * forceScalar) + (forceScalar * 0.5), // 약간의 상향 기운 추가
						z: dir.z * forceScalar
					});
				}
			});

			// [KO] 폭발과 동시에 공중에서 새로운 상자들을 투하하여 역동성 유지
			// [EN] Spawn new boxes from the air simultaneously with the explosion to maintain dynamism
			createPile(10);
		});

		// [KO] 초기 상자 더미 생성
		createPile();

		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext, activeBoxes);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 */
const renderTestPane = async (redGPUContext, activeBoxes) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'Interaction',
		value: 'Click to EXPLODE & SPAWN!',
		parse: (v) => v,
		readonly: true
	});
	// [KO] 실시간 상자 개수 모니터링
	// [EN] Real-time monitoring of box count
	pane.addBinding(activeBoxes, 'length', {
		label: 'Box Count',
		readonly: true,
		interval: 100
	});
};