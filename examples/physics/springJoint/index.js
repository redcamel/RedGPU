import * as RedGPU from "../../../dist/index.js?t=1770697269592";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770697269592";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 플랫폼의 움직임을 관찰하기 위해 거리와 높이 조정
		// [EN] Set up camera controller: Adjust distance and height to observe the platform's movement
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.tilt = -25;
		controller.centerY = 8;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 그리드 활성화
		// [EN] Create 3D view and enable grid
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 씬 연결
		// [EN] Initialize physics engine (Rapier) and connect to scene
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정: 씬에 입체감을 주기 위한 환경광과 직사광 추가
		// [EN] Lighting setup: Add ambient and directional light for depth in the scene
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10;
		directionalLight.y = 20;
		directionalLight.z = 10;
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 1. 바닥 생성 및 정적 물리 바디 적용
		// [EN] 1. Create ground and apply static physics body
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -0.5;
		ground.scaleX = 40;
		ground.scaleY = 1;
		ground.scaleZ = 40;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 2. 천장 앵커 포인트 설정 (4개의 고정된 점)
		// [EN] 2. Set up ceiling anchor points (4 fixed points)
		const anchorPoints = [
			{ x: -5, z: -5 },
			{ x: 5, z: -5 },
			{ x: 5, z: 5 },
			{ x: -5, z: 5 }
		];
		
		const anchorMeshList = [];
		const anchorBodies = anchorPoints.map(pt => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.x = pt.x;
			mesh.y = 15;
			mesh.z = pt.z;
			mesh.scaleX = 0.5;
			mesh.scaleY = 0.5;
			mesh.scaleZ = 0.5;
			mesh.material.color.setColorByHEX('#ff4444');
			scene.addChild(mesh);
			anchorMeshList.push(mesh);
			
			return physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		});

		// [KO] 3. 동적 플랫폼 생성 (스프링에 의해 매달릴 메쉬)
		// [EN] 3. Create dynamic platform (Mesh to be suspended by springs)
		const platform = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		platform.y = 5;
		platform.scaleX = 10;
		platform.scaleY = 0.5;
		platform.scaleZ = 10;
		platform.material.color.setColorByHEX('#00aaff');
		scene.addChild(platform);

		// [KO] 플랫폼에 물리 바디 설정: 현실적인 무게감을 위해 질량과 감쇠 조정
		// [EN] Set up physics body on the platform: Adjust mass and damping for realistic weight
		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 30,
			linearDamping: 0.5,
			angularDamping: 1.0
		});

		// [KO] 4. 스프링 조인트 연결: 천장 앵커와 플랫폼 모서리 사이의 탄성 연결
		// [EN] 4. Connect spring joints: Elastic connection between ceiling anchors and platform corners
		const springStiffness = 1200.0; 
		const springDamping = 60.0;
		const restLength = 10.0;

		anchorBodies.forEach((anchorBody, i) => {
			const pt = anchorPoints[i];
			const localAnchor1 = { x: 0, y: 0, z: 0 };
			// [KO] 플랫폼의 각 모서리 위치를 로컬 앵커로 설정
			// [EN] Set each corner position of the platform as a local anchor
			const jointData = RAPIER.JointData.spring(restLength, springStiffness, springDamping, localAnchor1, { x: pt.x, y: 0, z: pt.z });
			physicsEngine.nativeWorld.createImpulseJoint(jointData, anchorBody.nativeBody, platformBody.nativeBody, true);
		});

		// [KO] 5. 시각적 스프링 선 생성 (Line3D를 사용하여 스프링 시각화)
		// [EN] 5. Create visual spring lines (Visualize springs using Line3D)
		const springLines = anchorPoints.map(() => {
			const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
			scene.addChild(line);
			return line;
		});

		// [KO] 6. 떨어지는 장애물 스폰 로직: 크기와 질량이 무작위인 박스와 구체 생성
		// [EN] 6. Falling obstacle spawn logic: Create boxes and spheres with random size and mass
		const activeObjects = [];
		const spawnObject = () => {
			const isBox = Math.random() > 0.5;
			const size = 0.5 + Math.random() * 1.5;
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				isBox ? new RedGPU.Primitive.Box(redGPUContext) : new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = size;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			mesh.x = (Math.random() * 8) - 4;
			mesh.y = 25;
			mesh.z = (Math.random() * 8) - 4;
			scene.addChild(mesh);
			
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: isBox ? RedGPU.Physics.PHYSICS_SHAPE.BOX : RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: size * 10
			});
			// [KO] 빠른 낙하를 위해 초기 선속도 부여
			// [EN] Apply initial linear velocity for fast falling
			body.velocity = { x: 0, y: -20, z: 0 };
			activeObjects.push({ mesh, body });
			
			// [KO] 10초 후 씬에서 제거하여 자원 관리
			// [EN] Remove from the scene after 10 seconds for resource management
			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeObjects.splice(idx, 1);
				}
			}, 10000);
		};

		// [KO] 1초 간격으로 물체 생성
		// [EN] Create objects every 1 second
		const spawnTimer = setInterval(spawnObject, 1000);

		// [KO] 7. 애니메이션 루프: 플랫폼의 움직임에 맞춰 스프링 선 연결 위치 실시간 갱신
		// [EN] 7. Animation loop: Real-time update of spring line connection positions according to the platform's movement
		const updateSpringLines = () => {
			springLines.forEach((line, i) => {
				const anchorMesh = anchorMeshList[i];
				const pt = anchorPoints[i];
				
				// [KO] 플랫폼의 로컬 모서리 좌표를 월드 좌표로 변환하여 선 연결
				// [EN] Connect lines by converting platform's local corner coordinates to world coordinates
				const localX = pt.x > 0 ? 0.5 : -0.5;
				const localZ = pt.z > 0 ? 0.5 : -0.5;
				const worldPos = platform.localToWorld(localX, 0, localZ);

				line.removeAllPoint();
				line.addPoint(anchorMesh.x, anchorMesh.y, anchorMesh.z);
				line.addPoint(worldPos[0], worldPos[1], worldPos[2]);
			});
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, updateSpringLines);

		// [KO] 8. 테스트 UI 구성: 플랫폼 충격 주기 및 오브젝트 제거 기능
		// [EN] 8. Set up test UI: Platform kick and object clearing functions
		const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
		const pane = new Pane();
		
		const params = {
			kick: () => {
				platformBody.nativeBody.wakeUp();
				platformBody.applyImpulse({ x: 0, y: 200, z: 0 });
			},
			reset: () => {
				activeObjects.forEach(item => {
					physicsEngine.removeBody(item.body);
					scene.removeChild(item.mesh);
				});
				activeObjects.length = 0;
			}
		};

		pane.addButton({ title: 'Kick Platform' }).on('click', params.kick);
		pane.addButton({ title: 'Clear Objects' }).on('click', params.reset);
	},
	(failReason) => {
		console.error(failReason);
	}
);