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

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		const beltSystems = [];

		/**
		 * [KO] 컨베이어 벨트 시스템 생성 함수 (현실적인 미터 단위 스케일)
		 * [EN] Function to create a conveyor belt system (realistic meter scale)
		 */
		const createRealConveyor = (x, z, length, width, speed, direction) => {
			const segmentLength = 0.5;
			const numSegments = Math.ceil(length / segmentLength) + 1;
			const segments = [];
			
			// [KO] 벨트 지지대(프레임) 생성
			// [EN] Create belt support (frame)
			const frame = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			frame.x = x;
			frame.y = -0.3;
			frame.z = z;
			frame.scaleX = width;
			frame.scaleY = 0.1;
			frame.scaleZ = length;
			frame.material.color.setColorByHEX('#222222');
			scene.addChild(frame);
			physicsEngine.createBody(frame, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});

			// [KO] 움직이는 벨트 세그먼트(판) 생성
			// [EN] Create moving belt segments (plates)
			for (let i = 0; i < numSegments; i++) {
				const mesh = new RedGPU.Display.Mesh(
					redGPUContext,
					new RedGPU.Primitive.Box(redGPUContext),
					new RedGPU.Material.PhongMaterial(redGPUContext)
				);
				mesh.scaleX = width * 0.95;
				mesh.scaleY = 0.1;
				mesh.scaleZ = segmentLength * 0.95;
				
				const isEven = i % 2 === 0;
				mesh.material.color.setColorByHEX(isEven ? '#444444' : '#666666');
				
				const startOffset = - (length / 2);
				const initialZ = startOffset + (i * segmentLength);

				mesh.x = x;
				mesh.y = 0;
				mesh.z = z + initialZ;

				scene.addChild(mesh);

				const body = physicsEngine.createBody(mesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.KINEMATIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
					friction: 2.0, // 물체를 잘 실어나르기 위해 높은 마찰력 설정
					restitution: 0.0
				});

				segments.push({ mesh, body, localZ: initialZ });
			}

			beltSystems.push({
				segments,
				x, z,
				length,
				segmentLength,
				speed: speed * direction,
				totalLength: numSegments * segmentLength
			});
		};

		// 두 개의 컨베이어 생성 (반대 방향)
		createRealConveyor(-3, 0, 10, 3, 1.5, 1);
		createRealConveyor(3, 0, 10, 3, 1.5, -1);

		// [KO] 바닥 생성 (30m x 30m)
		// [EN] Create ground (30m x 30m)
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

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				friction: 1.0, 
				restitution: 0.1
			});

			activeObjects.push({ mesh, body });

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
		 * [KO] 키네마틱 바디 업데이트 루프: 컨베이어 판들을 이동시킴
		 * [EN] Kinematic body update loop: Moves the conveyor plates
		 */
		const render = (time) => {
			const dt = 1 / 60;

			beltSystems.forEach(belt => {
				const moveDist = belt.speed * dt;
				const boundary = belt.length / 2;

				belt.segments.forEach(seg => {
					seg.localZ += moveDist;

					if (belt.speed > 0) {
						if (seg.localZ > boundary + belt.segmentLength) {
							seg.localZ -= belt.totalLength;
						}
					} else {
						if (seg.localZ < -boundary - belt.segmentLength) {
							seg.localZ += belt.totalLength;
						}
					}

					const newZ = belt.z + seg.localZ;
					// [KO] 키네마틱 이동을 위해 setNextKinematicTranslation 사용
					// [EN] Use setNextKinematicTranslation for kinematic movement
					seg.body.nativeBody.setNextKinematicTranslation({ x: belt.x, y: 0, z: newZ });
				});
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
		value: 'Physical Conveyor Plates',
		parse: (v) => v,
		readonly: true
	});
	pane.addButton({ title: 'Reset Objects' }).on('click', () => resetScene());
};