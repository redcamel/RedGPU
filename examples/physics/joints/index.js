import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Joints 예제
 * [EN] Joints example
 *
 * [KO] 물리 조인트(Joint)를 사용하여 물체를 연결하고 사슬 구조를 만드는 방법을 보여줍니다.
 * [EN] Demonstrates how to connect objects using physics joints and create a chain structure.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 45;
		controller.tilt = -15;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정 (그리드 활성화)
		// [EN] Create and configure 3D view (Grid enabled)
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 1. 바닥 생성 (시인성을 위해 #666666 색상 적용)
		// [EN] 1. Create ground (Applied #666666 color for visibility)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.scaleX = 60;
		ground.scaleY = 1;
		ground.scaleZ = 60;
		ground.y = -0.5;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		/**
		 * [KO] 충돌 필터 설정
		 * 사슬 조각들끼리 겹치거나 부딪혀서 발생하는 물리적 불안정함을 방지합니다.
		 * [EN] Collision filter setup
		 * Prevents physical instability caused by chain links colliding or overlapping.
		 */
		const CHAIN_GROUP = 0x0001; 
		const chainCollisionFilter = (CHAIN_GROUP << 16) | (~CHAIN_GROUP & 0xFFFF);

		// 2. 고정 앵커 (천장에 고정된 지점)
		// 2. Fixed anchor (point fixed to the ceiling)
		const anchorMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		anchorMesh.material.color.setColorByHEX('#ff4444');
		anchorMesh.y = 15;
		scene.addChild(anchorMesh);

		const anchorBody = physicsEngine.createBody(anchorMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});
		anchorBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

		const activeChain = [];
		let bigBallInfo = null;

		/**
		 * [KO] 조인트 생성 헬퍼: 명시적으로 spherical 메서드 사용
		 * [EN] Joint creation helper: Explicitly use the spherical method
		 * @param {object} a1
		 * @param {object} a2
		 * @returns {object}
		 */
		const createJointData = (a1, a2) => {
			const JD = RAPIER.JointData;
			// [KO] Rapier의 spherical 조인트를 사용하여 자유로운 회전을 구현합니다.
			// [EN] Use Rapier's spherical joint to implement free rotation.
			return JD.spherical(a1, a2);
		};

		/**
		 * [KO] 사슬 구조 생성 함수
		 * [EN] Function to create the chain structure
		 */
		const initChain = () => {
			const linkGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.4);
			const linkMat = new RedGPU.Material.PhongMaterial(redGPUContext);
			linkMat.color.setColorByHEX('#888888');

			let prevBody = anchorBody;
			const numLinks = 8;
			const spacing = 1.0;

			for (let i = 0; i < numLinks; i++) {
				const linkMesh = new RedGPU.Display.Mesh(
					redGPUContext,
					linkGeo,
					linkMat
				);
				linkMesh.y = 15 - (i + 1) * spacing;
				scene.addChild(linkMesh);

				const currentBody = physicsEngine.createBody(linkMesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
					mass: 0.5,
					linearDamping: 0.01,
					angularDamping: 0.5
				});
				currentBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

				const anchor1 = { x: 0, y: -spacing / 2, z: 0 };
				const anchor2 = { x: 0, y: spacing / 2, z: 0 };
				const jointData = createJointData(anchor1, anchor2);
				physicsEngine.nativeWorld.createImpulseJoint(jointData, prevBody.nativeBody, currentBody.nativeBody, true);

				activeChain.push({ mesh: linkMesh, body: currentBody });
				prevBody = currentBody;
			}

			// [KO] 사슬 끝에 매달릴 묵직한 공 생성
			// [EN] Create a heavy ball to hang at the end of the chain
			const bigBallMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 1.5),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			bigBallMesh.material.color.setColorByHEX('#4444ff');
			bigBallMesh.y = 15 - (numLinks + 1) * spacing - 0.5;
			scene.addChild(bigBallMesh);

			const bigBallBody = physicsEngine.createBody(bigBallMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 10.0,
				linearDamping: 0.01,
				angularDamping: 0.5
			});
			bigBallBody.nativeCollider.setCollisionGroups(chainCollisionFilter);

			const finalJointData = createJointData({ x: 0, y: -spacing / 2, z: 0 }, { x: 0, y: 1.0, z: 0 });
			physicsEngine.nativeWorld.createImpulseJoint(finalJointData, prevBody.nativeBody, bigBallBody.nativeBody, true);
			bigBallInfo = { mesh: bigBallMesh, body: bigBallBody };
		};

		const resetScene = () => {
			activeChain.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeChain.length = 0;
			if (bigBallInfo) {
				physicsEngine.removeBody(bigBallInfo.body);
				scene.removeChild(bigBallInfo.mesh);
				bigBallInfo = null;
			}
			initChain();
		};

		initChain();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, () => bigBallInfo?.body, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 * [EN] Create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {function} getBigBallBody
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, getBigBallBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	pane.addButton({ title: 'Push Ball!' }).on('click', () => {
		const body = getBigBallBody();
		if (body) {
			body.nativeBody.wakeUp();
			body.applyImpulse({ x: 150, y: 0, z: (Math.random() * 100) - 50 });
		}
	});

	pane.addButton({ title: 'Reset Chain' }).on('click', () => resetScene());
};
