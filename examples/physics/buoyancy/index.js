import * as RedGPU from "../../../dist/index.js?t=1770699661827";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770699661827";

const canvas = document.body.appendChild(document.createElement('canvas'));

/**
 * [KO] Buoyancy 예제
 * [EN] Buoyancy example
 *
 * [KO] 부력(Buoyancy) 시뮬레이션 예제입니다. 물체의 잠긴 깊이와 부피에 따라 위쪽 방향으로 힘(Impulse)을 가하고, 수중 저항(Damping)을 적용하여 현실적인 부력 효과를 구현하는 방법을 보여줍니다.
 * [EN] Buoyancy simulation example. Shows how to implement realistic buoyancy effects by applying upward force (Impulse) based on the submerged depth and volume of an object, along with underwater resistance (Damping).
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 수조의 전체적인 시뮬레이션을 관찰하기 위해 적절한 거리와 각도로 배치
		// [EN] Camera setup: Positioned at an appropriate distance and angle to observe the tank simulation
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -25;
		controller.centerY = -2;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 설정: 1유닛=1미터 스케일을 가늠하기 위해 그리드 활성화
		// [EN] 3D view setup: Enable grid to gauge 1 unit = 1 meter scale
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 조명 설정
		// [EN] Lighting setup
		scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight();
		scene.lightManager.ambientLight.intensity = 0.5;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		const waterLevel = 0;
		const waterDepth = 10;

		/**
		 * [KO] 1. 수조(Water Volume) 시각화
		 * 물리적인 충돌체는 아니며, 물속 영역을 시각적으로 나타내기 위한 반투명 박스입니다.
		 * [EN] 1. Water Volume visualization
		 * A semi-transparent box to visually represent the underwater area, not a physical collider.
		 */
		const waterVolume = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		waterVolume.scaleX = waterVolume.scaleZ = 40;
		waterVolume.scaleY = waterDepth;
		waterVolume.y = -waterDepth / 2;
		waterVolume.material.color.setColorByHEX('#00aaff');
		waterVolume.material.opacity = 0.15;
		waterVolume.material.transparent = true;
		scene.addChild(waterVolume);

		/**
		 * [KO] 2. 실제 바닥 생성
		 * 수조의 바닥을 구성하며, 물체가 무한히 떨어지는 것을 방지하는 정적 물리 바디입니다.
		 * [EN] 2. Create actual floor
		 * A static physics body that forms the bottom of the tank and prevents objects from falling infinitely.
		 */
		const floor = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		floor.scaleX = floor.scaleZ = 40;
		floor.scaleY = 1;
		floor.y = -waterDepth - 0.5;
		floor.material.color.setColorByHEX('#333333');
		scene.addChild(floor);
		physicsEngine.createBody(floor, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			restitution: 0.0 // 묵직한 느낌을 위해 탄성 제거
		});

		const activeObjects = [];

		/**
		 * [KO] 물리 기반 객체 생성 함수
		 * 각 객체는 고유의 크기(Volume)와 밀도(Density)를 가지며, 이에 따라 질량과 부력이 결정됩니다.
		 * [EN] Physics-based object creation function
		 * Each object has its own volume and density, which determine its mass and buoyancy.
		 */
		const createObject = () => {
			const size = 0.8 + Math.random() * 1.0;
			const isBall = Math.random() > 0.5;
			
			/**
			 * [KO] 밀도 설정: 0.8(가벼움, 뜸) ~ 5.0(매우 무거움, 가라앉음)
			 * [EN] Density setup: 0.8 (Light, floats) to 5.0 (Very heavy, sinks)
			 */
			const density = 0.8 + Math.random() * 4.2;
			
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext, 
				isBall ? new RedGPU.Primitive.Sphere(redGPUContext, size / 2) : new RedGPU.Primitive.Box(redGPUContext), 
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			if (!isBall) {
				mesh.scaleX = mesh.scaleY = mesh.scaleZ = size;
			}
			
			mesh.x = (Math.random() * 15) - 7.5;
			mesh.y = 12 + (Math.random() * 5);
			mesh.z = (Math.random() * 15) - 7.5;
			
			// [KO] 밀도 시각화: 빨간색에 가까울수록 밀도가 높고 무거운 물체입니다.
			// [EN] Density visualization: Colors closer to red represent denser and heavier objects.
			const colorFactor = (density - 0.8) / 4.2;
			mesh.material.color.setColorByRGB(
				Math.floor(colorFactor * 255), 
				Math.floor((1 - colorFactor) * 255), 
				Math.floor((1 - colorFactor) * 255)
			);
			scene.addChild(mesh);

			// [KO] 기하학적 형상에 따른 부피 계산
			// [EN] Volume calculation based on geometric shape
			const volume = isBall ? (4/3) * Math.PI * Math.pow(size/2, 3) : Math.pow(size, 3);
			const mass = volume * density * 50; 

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: isBall ? RedGPU.Physics.PHYSICS_SHAPE.SPHERE : RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: mass,
				restitution: 0.0, // 납덩어리 같은 무게감을 위해 탄성 제거
				friction: 1.0,    
				linearDamping: 0.01,
				angularDamping: 0.01
			});

			activeObjects.push({ body, size, volume, density });
		};

		// 초기 객체 스폰
		for (let i = 0; i < 15; i++) {
			createObject();
		}

		/**
		 * [KO] 정교한 부력 및 수중 항력 시뮬레이션 루프
		 * 아르키메데스의 원리(부력 = 잠긴 부피 * 액체 밀도 * 중력)를 실시간으로 계산합니다.
		 * [EN] Advanced buoyancy and underwater drag simulation loop
		 * Calculates Archimedes' Principle (Buoyancy = Submerged Volume * Liquid Density * Gravity) in real-time.
		 */
		const render = () => {
			const dt = 1 / 60;
			const liquidDensity = 1.0; // 물의 밀도 기준
			const gravity = 9.81;

			activeObjects.forEach(obj => {
				const pos = obj.body.position;
				const halfSize = obj.size / 2;
				
				// [KO] 수면 아래로 잠긴 깊이 및 비율(0.0 ~ 1.0) 계산
				// [EN] Calculate submerged depth and ratio (0.0 to 1.0)
				const submergedDepth = waterLevel - (pos[1] - halfSize);
				const submergedRatio = Math.max(0, Math.min(1, submergedDepth / obj.size));
				
				if (submergedRatio > 0) {
					/**
					 * [KO] 부력(Buoyancy Force) 적용
					 * 잠긴 부피에 비례하여 위쪽으로 충격량(Impulse)을 가합니다.
					 * [EN] Apply Buoyancy Force
					 * Applies an upward impulse proportional to the submerged volume.
					 */
					const buoyancyForce = (obj.volume * submergedRatio) * liquidDensity * gravity * 120; 
					obj.body.applyImpulse({ x: 0, y: buoyancyForce * dt, z: 0 });

					/**
					 * [KO] 수중 저항(Underwater Drag) 적용
					 * 물속에 잠긴 정도에 비례하여 이동 및 회전 저항(Damping)을 가변적으로 적용합니다.
					 * [EN] Apply Underwater Drag
					 * Variably applies movement and rotational damping proportional to the submerged degree.
					 */
					const dragFactor = 1.0 + (submergedRatio * 8.0); 
					obj.body.nativeBody.setLinearDamping(dragFactor);
					obj.body.nativeBody.setAngularDamping(dragFactor);
				} else {
					// [KO] 물 밖으로 나온 경우 일반적인 공기 저항(최소값)으로 복구
					// [EN] Restore to normal air resistance (minimum) when out of water
					obj.body.nativeBody.setLinearDamping(0.01);
					obj.body.nativeBody.setAngularDamping(0.01);
				}
			});
		};

		new RedGPU.Renderer().start(redGPUContext, render);

		/**
		 * [KO] 씬 초기화 및 재구성
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.body.mesh);
			});
			activeObjects.length = 0;
			for (let i = 0; i < 15; i++) {
				createObject();
			}
		};

		renderTestPane(redGPUContext, createObject, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} createObject
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, createObject, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770699661827');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770699661827");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	pane.addBlade({
		view: 'text',
		label: 'Density Info',
		value: 'Cyan: Floats / Red: Heavy Sink',
		parse: (v) => v,
		readonly: true
	});

	pane.addButton({ title: 'Drop Heavy Object' }).on('click', () => {
		createObject();
	});

	pane.addButton({ title: 'Reset Scene' }).on('click', () => {
		resetScene();
	});
};