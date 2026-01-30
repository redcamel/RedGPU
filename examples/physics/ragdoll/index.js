import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.body.appendChild(document.createElement('canvas'));

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 캐릭터 낙하 액션을 관찰하기 위해 지면 근처로 설정
		// [EN] Camera setup: Set near the ground to observe character falling action
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 15;
		controller.tilt = -20;
		controller.centerY = 1.5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true; // [KO] 1m 단위 격자 활성화 [EN] Enable 1m grid
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight();
		scene.lightManager.ambientLight.intensity = 0.5;
		scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());

		// [KO] 1. 바닥 생성 (시인성을 위해 밝은 회색 적용)
		// [EN] 1. Create ground (Applied light gray for visibility)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = ground.scaleZ = 40;
		ground.scaleY = 1;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeRagdolls = [];

		/**
		 * [KO] 신체 부위(Limb) 생성 함수: 메쉬 생성과 물리 바디 등록을 동시에 수행
		 * [EN] Limb creation function: Creates mesh and registers physics body simultaneously
		 */
		const createLimb = (geometry, x, y, z, sx, sy, sz, color) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = sx; mesh.scaleY = sy; mesh.scaleZ = sz;
			mesh.material.color.setColorByHEX(color);
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: geometry instanceof RedGPU.Primitive.Sphere ? RedGPU.Physics.PHYSICS_SHAPE.SPHERE : RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				linearDamping: 0.1,
				angularDamping: 0.1
			});
			return { mesh, body };
		};

		/**
		 * [KO] 인간형 래그돌 생성 및 구형 조인트(Spherical Joint) 연결 로직
		 * [EN] Humanoid ragdoll creation and Spherical Joint connection logic
		 */
		const spawnRagdoll = (offsetX, offsetZ) => {
			const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
			
			// [KO] 주요 신체 부위 생성 (실제 사람 비율에 근접하게 설정)
			// [EN] Create main body parts (Set close to real human proportions)
			const head = createLimb(new RedGPU.Primitive.Sphere(redGPUContext, 0.2), offsetX, 7.2, offsetZ, 1, 1, 1, color);
			const torso = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, 6.6, offsetZ, 0.6, 0.8, 0.3, color);
			const pelvis = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX, 6.0, offsetZ, 0.5, 0.3, 0.3, color);

			const connect = (b1, b2, a1, a2) => {
				const jointData = physicsEngine.RAPIER.JointData.spherical(a1, a2);
				physicsEngine.nativeWorld.createImpulseJoint(jointData, b1.nativeBody, b2.nativeBody, true);
			};

			// 목(Neck) 및 허리(Waist) 연결
			connect(torso.body, head.body, { x: 0, y: 0.45, z: 0 }, { x: 0, y: -0.25, z: 0 });
			connect(torso.body, pelvis.body, { x: 0, y: -0.45, z: 0 }, { x: 0, y: 0.2, z: 0 });

			const createArm = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.55), 6.7, offsetZ, 0.2, 0.5, 0.2, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.55), 6.1, offsetZ, 0.15, 0.5, 0.15, color);
				connect(torso.body, upper.body, { x: side * 0.35, y: 0.3, z: 0 }, { x: 0, y: 0.3, z: 0 });
				connect(upper.body, lower.body, { x: 0, y: -0.3, z: 0 }, { x: 0, y: 0.3, z: 0 });
				return [upper, lower];
			};

			const createLeg = (side) => {
				const upper = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.2), 5.5, offsetZ, 0.2, 0.6, 0.2, color);
				const lower = createLimb(new RedGPU.Primitive.Box(redGPUContext), offsetX + (side * 0.2), 4.8, offsetZ, 0.15, 0.6, 0.15, color);
				connect(pelvis.body, upper.body, { x: side * 0.15, y: -0.15, z: 0 }, { x: 0, y: 0.35, z: 0 });
				connect(upper.body, lower.body, { x: 0, y: -0.35, z: 0 }, { x: 0, y: 0.35, z: 0 });
				return [upper, lower];
			};

			activeRagdolls.push([head, torso, pelvis, ...createArm(-1), ...createArm(1), ...createLeg(-1), ...createLeg(1)]);
		};

		spawnRagdoll(0, 0);

		/**
		 * [KO] 씬 리셋: 기존 캐릭터 제거 및 새 캐릭터 생성
		 * [EN] Scene Reset: Remove existing characters and spawn a new one
		 */
		const resetScene = () => {
			activeRagdolls.forEach(limbs => limbs.forEach(limb => {
				physicsEngine.removeBody(limb.body);
				scene.removeChild(limb.mesh);
			}));
			activeRagdolls.length = 0;
			spawnRagdoll(0, 0);
		};

		new RedGPU.Renderer().start(redGPUContext);
		renderTestPane(redGPUContext, spawnRagdoll, resetScene);
	},
	(failReason) => console.error(failReason)
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 */
const renderTestPane = async (redGPUContext, spawnRagdoll, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Spawn Ragdoll' }).on('click', () => spawnRagdoll((Math.random() * 10) - 5, (Math.random() * 10) - 5));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};