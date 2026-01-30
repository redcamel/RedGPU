import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정 (OrbitController)
		// [EN] Set up camera controller (OrbitController)
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 설정
		// [EN] Initialize and configure physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 환경광(AmbientLight) 및 방향광(DirectionalLight) 설정
		// [EN] Set up AmbientLight and DirectionalLight
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 바닥(Ground) 메시 생성 및 정적(Static) 물리 바디 적용
		// [EN] Create ground mesh and apply Static physics body
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#444444');
		scene.addChild(groundMesh);
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		const activeObjects = [];

		/**
		 * [KO] 동적 박스 생성 함수
		 * [EN] Function to create a dynamic box
		 * @param i - [KO] 생성 인덱스 (위치 오프셋용) [EN] Creation index (for position offset)
		 */
		const createBox = (i) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX('#ffffff');
			const boxMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
				material
			);
			boxMesh.x = (Math.random() * 10) - 5;
			boxMesh.y = 2 + (i * 1.5);
			boxMesh.z = (Math.random() * 10) - 5;
			scene.addChild(boxMesh);

			// [KO] 물리 엔진에 동적(Dynamic) 바디 생성 및 등록
			// [EN] Create and register a Dynamic body in the physics engine
			const body = physicsEngine.createBody(boxMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
				mass: 1,
				linearDamping: 0.5,
				angularDamping: 0.5
			});
			activeObjects.push({ mesh: boxMesh, body });
		};

		// [KO] 초기 박스 20개 생성
		// [EN] Create 20 initial boxes
		const initScene = () => {
			for (let i = 0; i < 20; i++) createBox(i);
		};

		/**
		 * [KO] 현재 씬의 모든 물리 객체를 제거하고 초기화하는 함수
		 * [EN] Function to remove all physics objects from the current scene and reset
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			initScene();
		};

		initScene();

		/**
		 * [KO] 마우스 클릭 시 레이캐스트(Raycast)를 수행하는 이벤트 리스너
		 * [EN] Event listener that performs raycasting on mouse click
		 */
		canvas.addEventListener('mousedown', (event) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			// [KO] 1. 클릭한 화면 좌표를 월드 좌표로 변환하여 방향 벡터를 구합니다.
			// [EN] 1. Convert the clicked screen coordinates to world coordinates to get the direction vector.
			const worldPoint = RedGPU.Util.screenToWorld(mouseX, mouseY, view);
			if (!worldPoint) return;

			const rayOrigin = { x: view.rawCamera.x, y: view.rawCamera.y, z: view.rawCamera.z };
			const rayDir = {
				x: worldPoint[0] - rayOrigin.x,
				y: worldPoint[1] - rayOrigin.y,
				z: worldPoint[2] - rayOrigin.z
			};
			const mag = Math.sqrt(rayDir.x * rayDir.x + rayDir.y * rayDir.y + rayDir.z * rayDir.z);
			const normalizedDir = { x: rayDir.x / mag, y: rayDir.y / mag, z: rayDir.z / mag };

			// [KO] 2. 물리 엔진의 월드에서 레이를 발사합니다. (최대 거리 1000)
			// [EN] 2. Cast a ray in the physics engine's world. (Max distance 1000)
			const ray = new RAPIER.Ray(rayOrigin, normalizedDir);
			const hit = physicsEngine.nativeWorld.castRay(ray, 1000.0, true);

			if (hit) {
				// [KO] 3. 충돌한 객체의 핸들(ID)을 통해 RedGPU 바디 객체를 조회합니다.
				// [EN] 3. Lookup the RedGPU body object using the collided object's handle (ID).
				const handle = (typeof hit.colliderHandle === 'number') ? hit.colliderHandle : (hit.collider ? hit.collider.handle : undefined);
				if (handle !== undefined) {
					const targetBody = physicsEngine.getBodyByColliderHandle(handle);
					
					// [KO] 4. 바닥(Static)이 아닌 동적(Dynamic) 객체인 경우에만 상호작용을 수행합니다.
					// [EN] 4. Interaction is performed only if it is a Dynamic object, not the ground (Static).
					if (targetBody && targetBody.nativeBody.isDynamic()) {
						// [KO] 레이의 방향으로 충격량(Impulse)을 가하고 메쉬 색상을 랜덤하게 변경합니다.
						// [EN] Apply an impulse in the ray's direction and randomly change the mesh color.
						targetBody.applyImpulse({
							x: normalizedDir.x * 40,
							y: (normalizedDir.y * 40) + 15,
							z: normalizedDir.z * 40
						});
						targetBody.mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
					}
				}
			}
		});

		// [KO] 렌더러 시작
		// [EN] Start renderer
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] 테스트용 컨트롤 패널 실행
		// [EN] Execute test control panel
		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성 함수 (Tweakpane)
 * [EN] Function to create a test control panel (Tweakpane)
 */
const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	
	// [KO] 안내 메시지 추가
	// [EN] Add guidance message
	pane.addBlade({
		view: 'text',
		label: 'Guide',
		value: 'Click boxes to push them!',
		parse: (v) => v,
		readonly: true
	});

	// [KO] 씬 초기화 버튼
	// [EN] Scene reset button
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
