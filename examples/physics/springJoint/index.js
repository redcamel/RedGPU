import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -20;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();

		/**
		 * [KO] 3D 뷰 설정: 그리드 활성화
		 * RedGPU의 기본 그리드는 한 칸의 가로/세로 길이가 정확히 1유닛(1미터)입니다.
		 * [EN] 3D view setup: Enable grid
		 * RedGPU's default grid has a width/height of exactly 1 unit (1 meter) per cell.
		 */
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진 초기화
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
		ground.y = -0.5;
		ground.scaleX = 40;
		ground.scaleY = 1;
		ground.scaleZ = 40;
		ground.material.color.setColorByHEX('#666666');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 2. 천장 앵커 포인트 생성 (높이 15m)
		// [EN] 2. Create ceiling anchor points (Height 15m)
		const anchorMeshList = [];
		const createAnchor = (x, z) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = x;
			mesh.y = 15;
			mesh.z = z;
			mesh.scaleX = 0.4;
			mesh.scaleY = 0.4;
			mesh.scaleZ = 0.4;
			mesh.material.color.setColorByHEX('#ff4444');
			scene.addChild(mesh);
			anchorMeshList.push(mesh);
			return physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

		const anchors = [
			createAnchor(-4, -4),
			createAnchor(4, -4),
			createAnchor(4, 4),
			createAnchor(-4, 4)
		];

		// [KO] 3. 탄성 플랫폼 생성 (Y=2 지점)
		// [EN] 3. Create elastic platform (at Y=2)
		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		platform.y = 2;
		platform.scaleX = 8;
		platform.scaleY = 0.2;
		platform.scaleZ = 8;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 10,
			linearDamping: 0.2,
			angularDamping: 0.2
		});

		/**
		 * [KO] 4. 스프링 조인트 설정 (Spherical Joint + Stiffness)
		 * 물리적 피봇(Hinge)을 천장(Y=15)에 두어 자연스러운 스윙이 가능하게 합니다.
		 * spherical 메서드를 직접 사용하여 조인트를 생성합니다.
		 * [EN] 4. Spring Joint setup (Spherical Joint + Stiffness)
		 * Place the physical pivot (Hinge) at the ceiling (Y=15) for natural swinging.
		 * Explicitly use the spherical method to create the joint.
		 */
		const springStiffness = 400.0;
		const springDamping = 10.0;

		anchors.forEach((anchor, i) => {
			const xSign = (i === 0 || i === 3) ? -1 : 1;
			const zSign = (i === 0 || i === 1) ? -1 : 1;

			const JD = RAPIER.JointData;
			// [KO] 천장(15m) 기준 오프셋 0 지점과 플랫폼(2m) 기준 위쪽으로 13m 지점을 연결
			// [EN] Connect the offset 0 point from the ceiling (15m) and the 13m upward point from the platform (2m)
			const localAnchor1 = { x: 0, y: 0, z: 0 };
			const localAnchor2 = { x: 4 * xSign, y: 13, z: 4 * zSign }; 
			
			const jointData = JD.spherical(localAnchor1, localAnchor2);
			const joint = physicsEngine.nativeWorld.createImpulseJoint(jointData, anchor.nativeBody, platformBody.nativeBody, true);
			
			if (joint.setStiffness) joint.setStiffness(springStiffness);
			if (joint.setDamping) joint.setDamping(springDamping);
		});

		// [KO] 5. 시각적 스프링 선 생성
		const springLines = [];
		anchorMeshList.forEach(() => {
			const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
			scene.addChild(line);
			springLines.push(line);
		});

		// [KO] 6. 낙하 물체 관리
		const activeObjects = [];
		const createObject = () => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			mesh.x = (Math.random() * 6) - 3;
			mesh.y = 12;
			mesh.z = (Math.random() * 6) - 3;
			mesh.scaleX = 0.6;
			mesh.scaleY = 0.6;
			mesh.scaleZ = 0.6;
			scene.addChild(mesh);
			
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 15 
			});
			activeObjects.push({ mesh, body });
			
			// 플랫폼 강제 활성화 (졸음 방지)
			platformBody.nativeBody.wakeUp();
			
			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeObjects.splice(idx, 1);
				}
			}, 10000);
		};

		/**
		 * [KO] 씬 초기화 함수
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			platformBody.nativeBody.setTranslation({ x: 0, y: 2, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			platformBody.nativeBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			platformBody.nativeBody.wakeUp();
		};

		setInterval(createObject, 1200);

		// [KO] 7. 렌더 루프
		const render = () => {
			springLines.forEach((line, i) => {
				const anchorMesh = anchorMeshList[i];
				const xSign = (i === 0 || i === 3) ? -1 : 1;
				const zSign = (i === 0 || i === 1) ? -1 : 1;
				
				// [KO] 플랫폼 모서리의 실시간 월드 좌표 계산
				const worldPos = platform.localToWorld(4 * xSign, 0, 4 * zSign);

				line.removeAllPoint();
				line.addPoint(anchorMesh.x, anchorMesh.y, anchorMesh.z);
				line.addPoint(worldPos[0], worldPos[1], worldPos[2]);
			});
		};
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, platformBody, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성
 */
const renderTestPane = async (redGPUContext, platformBody, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	pane.addButton({ title: 'KICK PLATFORM!' }).on('click', () => {
		platformBody.nativeBody.wakeUp();
		platformBody.applyImpulse({
			x: (Math.random() * 100) - 50,
			y: 50,
			z: (Math.random() * 100) - 50
		});
	});

	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
