import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794639759027";
import * as RedGPU from "../../../dist/index.js?t=1794639759027";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794639759027";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Prismatic Joint 예제
 * [EN] Prismatic Joint example
 *
 * [KO] 프리즈매틱 조인트를 사용하여 직선 운동을 제한하는 방법을 보여줍니다.
 * [EN] Demonstrates how to use a prismatic joint to constrain linear motion.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 20;
		controller.tilt = -25;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정
		// [EN] Lighting setup
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 1. 바닥 생성 (현실적인 미터 단위 스케일)
		// [EN] 1. Create ground (Realistic meter scale)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#666666')
		);
		ground.y = -0.5;
		ground.scaleX = 40;
		ground.scaleY = 1;
		ground.scaleZ = 40;
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const rail = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#888888')
		);
		rail.x = -2.0;
		rail.y = 5;
		rail.z = 0;
		rail.scaleX = 0.2;
		rail.scaleY = 10;
		rail.scaleZ = 0.2;
		scene.addChild(rail);
		const railBody = physicsEngine.createBody(rail, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
            new RedGPU.Material.PhongMaterial(redGPUContext, '#3898c8')
		);
		platform.x = 0;
		platform.y = 1;
		platform.z = 0;
		platform.scaleX = 2.0;
		platform.scaleY = 0.2;
		platform.scaleZ = 2.0;
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 10,
			linearDamping: 0.5,
			angularDamping: 1.0
		});

		const jointData = RAPIER.JointData.prismatic(
			{ x: 2.0, y: -4.0, z: 0 }, 
			{ x: 0, y: 0, z: 0 },    
			{ x: 0, y: 1, z: 0 }     
		);
		
		jointData.limitsEnabled = true;
        // [KO] 월드 좌표 기준 1m ~ 9m 사이만 이동 가능
        // [EN] Restrict movement between 1m and 9m in world coordinates
        jointData.limits = [0, 8];
		physicsEngine.nativeWorld.createImpulseJoint(jointData, railBody.nativeBody, platformBody.nativeBody, true);

		// [KO] 4. 상호작용용 낙하 박스 관리
		// [EN] 4. Interaction falling boxes management
		const activeBoxes = [];
        const getRandomColor = () => {
            const r = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            const g = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            const b = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        };

		const createBox = () => {
			const box = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
                new RedGPU.Material.PhongMaterial(redGPUContext, getRandomColor())
			);
			box.x = (Math.random() * 1.6) - 0.8;
			box.y = 12;
			box.z = (Math.random() * 1.6) - 0.8;
			box.scaleX = 0.4;
			box.scaleY = 0.4;
			box.scaleZ = 0.4;
			scene.addChild(box);

			const body = physicsEngine.createBody(box, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1
			});
			activeBoxes.push({ mesh: box, body });
			
			// [KO] 성능을 위해 8초 후 박스 제거
			// [EN] Remove boxes after 8 seconds for performance
			setTimeout(() => {
				const idx = activeBoxes.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(box);
					activeBoxes.splice(idx, 1);
				}
			}, 8000);
		};

		const resetScene = () => {
			activeBoxes.forEach(v => {
				physicsEngine.removeBody(v.body);
				scene.removeChild(v.mesh);
			});
			activeBoxes.length = 0;
            // [KO] 플랫폼 위치 및 속도 초기화
            // [EN] Reset platform position and velocity
			platformBody.nativeBody.setTranslation({ x: 0, y: 1, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
		};

		// [KO] 박스 자동 생성 인터벌
		// [EN] Auto box spawn interval
		setInterval(createBox, 800);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, platformBody, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, platformBody, resetScene) => {
	
	new RedGPUExampleHelper(redGPUContext, {
		gui: (pane) => {
			const params = {
				liftPower: 150
			};

			pane.addBinding(params, 'liftPower', {
				min: 50,
				max: 500
			});

			pane.addButton({ title: 'LIFT UP!' }).on('click', () => {
				// [KO] 플랫폼에 위쪽 방향으로 충격량(Impulse) 가하기
				// [EN] Apply impulse to the platform in the upward direction
				platformBody.applyImpulse({ x: 0, y: params.liftPower, z: 0 });
			});

			pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
		}
	});
};