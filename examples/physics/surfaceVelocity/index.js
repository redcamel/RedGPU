import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정
		// [EN] Camera setup
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -35;
		controller.centerY = 0;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화 및 설정
		// [EN] Initialize and configure physics engine
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 조명 설정
		// [EN] Light setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const beltSystems = [];

		/**
		 * [KO] 컨베이어 벨트 생성 함수
		 * [EN] Function to create a conveyor belt
		 *
		 * [KO] 단일 키네마틱 바디와 텍스처 애니메이션을 조합하여 효율적인 컨베이어 벨트를 시뮬레이션합니다.
		 * [EN] Simulates an efficient conveyor belt by combining a single kinematic body and texture animation.
		 */
		const createRealConveyor = (x, z, length, width, speed, direction) => {
			// [KO] 벨트 텍스처 및 재질 설정
			// [EN] Set up belt texture and material
			const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg');
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.diffuseTexture = texture;

			// [KO] 텍스처가 반복되도록 샘플러 설정
			// [EN] Set up sampler to allow texture tiling
			material.diffuseTextureSampler = new RedGPU.Resource.Sampler(redGPUContext, {
				addressModeU: 'repeat',
				addressModeV: 'repeat'
			});

			// [KO] 벨트 메쉬 생성 및 배치
			// [EN] Create and place belt mesh
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				material
			);
			mesh.x = x;
			mesh.y = -0.3;
			mesh.z = z;
			mesh.scaleX = width;
			mesh.scaleY = 0.1;
			mesh.scaleZ = length;
			scene.addChild(mesh);

			// [KO] 단일 속도 기반 키네마틱 바디 생성
			// [EN] Create a single velocity-based kinematic body
			// [KO] 이 바디는 물리적으로는 물체를 이동시키는 표면 속도를 가지지만, 위치는 매 프레임 고정됩니다.
			// [EN] This body physically has a surface velocity to move objects, but its position is fixed every frame.
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC_VELOCITY,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				friction: 2.0, // [KO] 높은 마찰력으로 물체를 효과적으로 운반 [EN] High friction to carry objects effectively
				restitution: 0.0
			});

			beltSystems.push({
				body,
				mesh,
				x, z,
				length,
				speed: speed * direction,
				initialPos: { x, y: -0.3, z },
				offsetY: 0
			});
		};

		// [KO] 두 개의 컨베이어 생성 (서로 반대 방향)
		// [EN] Create two conveyors (opposite directions)
		createRealConveyor(-3, 0, 10, 3, 5, 1);
		createRealConveyor(3, 0, 10, 3, 5, -1);

		// [KO] 바닥 생성 (정적 바디)
		// [EN] Create ground (Static body)
		const floor = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		floor.y = -3;
		floor.scaleX = 30;
		floor.scaleY = 1;
		floor.scaleZ = 30;
		floor.material.color.setColorByHEX('#111111');
		scene.addChild(floor);
		physicsEngine.createBody(floor, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];

		/**
		 * [KO] 박스 생성 함수
		 * [EN] Function to create a box
		 */
		const createBox = () => {
			const size = 0.4;
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.scaleX = size;
			mesh.scaleY = size;
			mesh.scaleZ = size;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			
			const onLeft = Math.random() > 0.5;
			mesh.x = onLeft ? -3 : 3;
			mesh.y = 3;
			mesh.z = 0;

			scene.addChild(mesh);

			// [KO] 물리 엔진에 동적 바디 등록
			// [EN] Register dynamic body in physics engine
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				friction: 1.0, 
				restitution: 0.1
			});

			activeObjects.push({ mesh, body });

			// [KO] 일정 시간 후 리소스 해제
			// [EN] Release resources after a certain time
			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeObjects.splice(idx, 1);
				}
			}, 15000);
		};

		setInterval(createBox, 800);

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
		};

		/**
		 * [KO] 업데이트 루프
		 * [EN] Update loop
		 */
		let lastTime = 0;
		const render = (time) => {
			if (!lastTime) lastTime = time;
			const dt = (time - lastTime) / 1000;
			lastTime = time;

			beltSystems.forEach(belt => {
				// [KO] 표면 속도 설정 (물리적 이동)
				// [EN] Set surface velocity (Physical movement)
				belt.body.nativeBody.setLinvel({ x: 0, y: 0, z: belt.speed }, true);
				
				// [KO] 바디 위치 고정 (컨베이어 본체는 움직이지 않음)
				// [EN] Fix body position (The conveyor itself does not move)
				belt.body.nativeBody.setTranslation(belt.initialPos, true);

				// [KO] 텍스처 UV 오프셋 애니메이션 (시각적 이동)
				// [EN] Texture UV offset animation (Visual movement)
				// [KO] 물리적 속도와 시각적 흐름이 일치하도록 벨트 길이로 나누어 계산
				// [EN] Calculated by dividing by the belt length to match physical speed and visual flow
				belt.offsetY -= (belt.speed * dt) / belt.length; 
				belt.mesh.material.textureOffset = [0, belt.offsetY];
			});
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addBlade({
		view: 'text',
		label: 'System',
		value: 'Surface Velocity Conveyor',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Objects' }).on('click', () => resetScene());
};
