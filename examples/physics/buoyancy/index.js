import * as RedGPU from "../../../dist/index.js?t=1794639759027";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794639759027";
import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794639759027";

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
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		const waterLevel = 0;
		const waterDepth = 10;

		const waterVolume = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#2a88cc')
		);
		waterVolume.scaleX = waterVolume.scaleZ = 40;
		waterVolume.scaleY = waterDepth;
		waterVolume.y = -waterDepth / 2;
        waterVolume.material.opacity = 0.2;
		waterVolume.material.transparent = true;
		scene.addChild(waterVolume);

		const floor = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#666666')
		);
		floor.scaleX = floor.scaleZ = 40;
		floor.scaleY = 1;
		floor.y = -waterDepth - 0.5;
		scene.addChild(floor);
		physicsEngine.createBody(floor, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
            restitution: 0.0
		});

		const activeObjects = [];

		const createObject = () => {
			const size = 0.8 + Math.random() * 1.0;
			const isBall = Math.random() > 0.5;
			
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
                Math.floor(60 + colorFactor * 150),
                Math.floor(60 + (1 - colorFactor) * 140),
                Math.floor(60 + (1 - colorFactor) * 140)
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
                restitution: 0.0,
				friction: 1.0,    
				linearDamping: 0.01,
				angularDamping: 0.01
			});

			activeObjects.push({ body, size, volume, density });
		};

        // [KO] 초기 객체 스폰
        // [EN] Spawn initial objects
		for (let i = 0; i < 15; i++) {
			createObject();
		}

		const render = () => {
			const dt = 1 / 60;
            // [KO] 물의 밀도 기준
            // [EN] Water density reference
            const liquidDensity = 1.0;
			const gravity = 9.81;

			activeObjects.forEach(obj => {
				const pos = obj.body.position;
				const halfSize = obj.size / 2;
				
				// [KO] 수면 아래로 잠긴 깊이 및 비율(0.0 ~ 1.0) 계산
				// [EN] Calculate submerged depth and ratio (0.0 to 1.0)
				const submergedDepth = waterLevel - (pos[1] - halfSize);
				const submergedRatio = Math.max(0, Math.min(1, submergedDepth / obj.size));
				
				if (submergedRatio > 0) {
					const buoyancyForce = (obj.volume * submergedRatio) * liquidDensity * gravity * 120; 
					obj.body.applyImpulse({ x: 0, y: buoyancyForce * dt, z: 0 });

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

const renderTestPane = async (redGPUContext, createObject, resetScene) => {
	new RedGPUExampleHelper(redGPUContext, {
		gui: (pane) => {
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
		}
	});
};