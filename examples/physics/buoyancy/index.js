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
		controller.distance = 30;
		controller.tilt = -20;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false;
		view.grid = false;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 수면(Water Level) 및 평면 생성
		// [EN] Water level and plane creation
		const waterLevel = 0;
		const waterMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Plane(redGPUContext, 50, 50),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		waterMesh.rotationX = -90;
		waterMesh.y = waterLevel;
		waterMesh.material.color.setColorByHEX('#00aaff');
		waterMesh.material.opacity = 0.4;
		waterMesh.material.transparent = true;
		scene.addChild(waterMesh);

		// [KO] 수조 바닥 생성
		// [EN] Create tank floor
		const floor = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		floor.y = -10;
		floor.scaleX = 50;
		floor.scaleY = 1;
		floor.scaleZ = 50;
		floor.material.color.setColorByHEX('#222222');
		scene.addChild(floor);
		physicsEngine.createBody(floor, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];

		/**
		 * [KO] 부력이 적용될 객체 생성 함수 (0.5m~1.5m 스케일)
		 * [EN] Function to create objects affected by buoyancy (0.5m-1.5m scale)
		 */
		const createObject = () => {
			const size = 0.5 + Math.random() * 1.0;
			const isBall = Math.random() > 0.5;
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext, 
				isBall ? new RedGPU.Primitive.Sphere(redGPUContext, size / 2) : new RedGPU.Primitive.Box(redGPUContext), 
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			if (!isBall) {
				mesh.scaleX = size;
				mesh.scaleY = size;
				mesh.scaleZ = size;
			}
			
			mesh.x = (Math.random() * 10) - 5;
			mesh.y = 10 + (Math.random() * 5);
			mesh.z = (Math.random() * 10) - 5;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: isBall ? RedGPU.Physics.PHYSICS_SHAPE.SPHERE : RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: size,
				restitution: 0.3
			});

			activeObjects.push({ mesh, body, size });
		};

		for (let i = 0; i < 10; i++) createObject();

		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			for (let i = 0; i < 10; i++) createObject();
		};

		const render = (time) => {
			activeObjects.forEach(obj => {
				const pos = obj.body.position;
				const halfSize = obj.size / 2;
				
				// [KO] 객체가 수면 아래로 내려갔는지 확인
				// [EN] Check if the object has gone below the water level
				const depth = waterLevel - (pos[1] - halfSize);
				
				if (depth > 0) {
					// [KO] 부력 계산: 깊이와 크기에 비례하여 위쪽 방향으로 힘(Impulse) 적용
					// [EN] Buoyancy calculation: Apply impulse upward proportional to depth and size
					const buoyancyFactor = 35.0; 
					const lift = Math.min(depth, obj.size) * buoyancyFactor;
					
					obj.body.applyImpulse({ x: 0, y: lift * (1 / 60), z: 0 });

					// [KO] 물속에서의 저항(Damping) 적용
					// [EN] Apply damping in water
					obj.body.nativeBody.setLinearDamping(2.0);
					obj.body.nativeBody.setAngularDamping(2.0);
				} else {
					// [KO] 공기 중에서는 저항 제거
					// [EN] Remove damping in air
					obj.body.nativeBody.setLinearDamping(0.0);
					obj.body.nativeBody.setAngularDamping(0.0);
				}
			});
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, createObject, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, createObject, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Object' }).on('click', () => createObject());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};