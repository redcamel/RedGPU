import * as RedGPU from "../../../dist/index.js?t=1770713934910";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770713934910";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Soft Body 예제
 * [EN] Soft Body example
 *
 * [KO] 스프링 조인트와 메쉬를 사용하여 천(Cloth)과 같은 소프트 바디를 시뮬레이션하는 방법을 보여줍니다.
 * [EN] Demonstrates how to simulate a soft body like cloth using spring joints and meshes.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 설정: 천의 움직임을 잘 볼 수 있도록 배치
		// [EN] Camera setup: Positioned to see the movement of the cloth
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.tilt = -35;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정
		// [EN] Lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10;
		directionalLight.y = 20;
		directionalLight.z = 10;
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 1. 바닥 생성 (물체가 천 아래로 떨어졌을 때를 대비)
		// [EN] 1. Create ground (In case objects fall below the cloth)
		const ground = new RedGPU.Display.Mesh(
			redGPUContext,
			new RedGPU.Primitive.Box(redGPUContext),
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		ground.y = -5;
		ground.scaleX = 60;
		ground.scaleY = 1;
		ground.scaleZ = 60;
		ground.material.color.setColorByHEX('#333333');
		scene.addChild(ground);
		physicsEngine.createBody(ground, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
		});

		// [KO] 2. 천(Cloth) 시뮬레이션 파라미터
		// [EN] 2. Cloth simulation parameters
		const width = 20;
		const depth = 20;
		const wSegments = 15;
		const hSegments = 15;
		const ncols = wSegments + 1;
		const nrows = hSegments + 1;
		const spacingX = width / wSegments;
		const spacingZ = depth / hSegments;
		const startY = 15;

		// [KO] 묵직한 무게감을 위해 강성은 낮추고 감쇠는 높임
		// [EN] Lower stiffness and higher damping for a heavy feeling
		const stiffness = 350.0;
		const damping = 45.0;

		// [KO] 시각적 메시 생성 (Ground 이용)
		// [EN] Create visual mesh (Using Ground)
		const clothGeometry = new RedGPU.Primitive.Ground(redGPUContext, width, depth, wSegments, hSegments);
		const clothMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			clothGeometry,
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		clothMesh.material.color.setColorByHEX('#ff4444');
		clothMesh.primitiveState.cullMode = 'none';
		scene.addChild(clothMesh);

		const nodes = [];
		/**
		 * [KO] 물리 노드(정점) 생성
		 * 네 모서리 정점은 STATIC으로 설정하여 공중에 고정시킵니다.
		 * [EN] Create physics nodes (vertices)
		 * Set the four corner vertices to STATIC to fix them in mid-air.
		 */
		for (let iz = 0; iz < nrows; iz++) {
			for (let ix = 0; ix < ncols; ix++) {
				const isCorner = 
					(ix === 0 && iz === 0) || 
					(ix === wSegments && iz === 0) || 
					(ix === 0 && iz === hSegments) || 
					(ix === wSegments && iz === hSegments);

				const mesh = new RedGPU.Display.Mesh(
					redGPUContext,
					new RedGPU.Primitive.Sphere(redGPUContext, 0.1),
					new RedGPU.Material.PhongMaterial(redGPUContext)
				);
				mesh.x = ix * spacingX - width / 2;
				mesh.y = startY;
				mesh.z = iz * spacingZ - depth / 2;
				mesh.visible = false; 
				scene.addChild(mesh);

				const body = physicsEngine.createBody(mesh, {
					type: isCorner ? RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC : RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
					mass: 1.5,
					friction: 0.8,
					linearDamping: 0.7,
					angularDamping: 0.5
				});

				nodes.push({ ix, iz, body });
			}
		}

		// [KO] 3. 노드 간 스프링 연결
		// [EN] 3. Connect nodes with springs
		const getNode = (x, z) => {
			if (x < 0 || x >= ncols || z < 0 || z >= nrows) return null;
			return nodes[z * ncols + x];
		};

		nodes.forEach(nodeA => {
			const { ix, iz } = nodeA;
			const connections = [
				{dx: 1, dz: 0}, {dx: 0, dz: 1}, 
				{dx: 1, dz: 1}, {dx: 1, dz: -1}, 
				{dx: 2, dz: 0}, {dx: 0, dz: 2} 
			];

			connections.forEach(c => {
				const nodeB = getNode(ix + c.dx, iz + c.dz);
				if (nodeB) {
					const dist = Math.sqrt(c.dx * c.dx * spacingX * spacingX + c.dz * c.dz * spacingZ * spacingZ);
					const jointData = RAPIER.JointData.spring(dist, stiffness, damping, {x:0, y:0, z:0}, {x:0, y:0, z:0});
					physicsEngine.nativeWorld.createImpulseJoint(jointData, nodeA.body.nativeBody, nodeB.body.nativeBody, true);
				}
			});
		});

		// [KO] 4. 애니메이션 루프: 물리 노드의 위치를 메시의 정점 버퍼에 동기화
		// [EN] 4. Animation loop: Synchronize physics node positions to the mesh vertex buffer
		const updateCloth = () => {
			const vertexData = clothGeometry.vertexBuffer.data;
			const stride = clothGeometry.vertexBuffer.interleavedStruct.arrayStride / 4;
			const positions = [];

			nodes.forEach((node, i) => {
				const pos = node.body.nativeBody.translation();
				const vIdx = i * stride;
				vertexData[vIdx] = pos.x;
				vertexData[vIdx + 1] = pos.y;
				vertexData[vIdx + 2] = pos.z;
				positions.push(pos.x, pos.y, pos.z);
			});

			const indices = Array.from(clothGeometry.indexBuffer.data);
			const normals = RedGPU.Math.calculateNormals(positions, indices);
			for (let i = 0; i < nodes.length; i++) {
				const vIdx = i * stride;
				vertexData[vIdx + 3] = normals[i * 3];
				vertexData[vIdx + 4] = normals[i * 3 + 1];
				vertexData[vIdx + 5] = normals[i * 3 + 2];
			}

			redGPUContext.gpuDevice.queue.writeBuffer(clothGeometry.vertexBuffer.gpuBuffer, 0, vertexData);
		};

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, updateCloth);

		// [KO] 5. 테스트 상호작용
		// [EN] 5. Test interaction
		const spawnObject = () => {
			const isBox = Math.random() > 0.5;
			const size = 1.5 + Math.random() * 2.5;
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				isBox ? new RedGPU.Primitive.Box(redGPUContext) : new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
				new RedGPU.Material.PhongMaterial(redGPUContext)
			);
			mesh.scaleX = mesh.scaleY = mesh.scaleZ = size;
			mesh.x = (Math.random() - 0.5) * 6;
			mesh.y = 25;
			mesh.z = (Math.random() - 0.5) * 6;
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			scene.addChild(mesh);
			
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: isBox ? RedGPU.Physics.PHYSICS_SHAPE.BOX : RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: size * 8
			});
		};

		const windBlast = () => {
			nodes.forEach(n => {
				n.body.nativeBody.wakeUp();
				n.body.applyImpulse({ x: 0, y: 0, z: 25 }, true);
			});
		};

		const resetScene = () => {
			// [KO] 생성된 모든 동적 물체 제거
			// [EN] Remove all created dynamic objects
			const bodiesToRemove = physicsEngine.bodies.filter(body => {
				return !nodes.some(node => node.body === body) && body.mesh !== ground;
			});
			bodiesToRemove.forEach(body => {
				physicsEngine.removeBody(body);
				scene.removeChild(body.mesh);
			});

			// [KO] 천 노드 위치 및 속도 초기화
			// [EN] Reset cloth node positions and velocities
			nodes.forEach(node => {
				const { ix, iz, body } = node;
				const targetX = ix * spacingX - width / 2;
				const targetZ = iz * spacingZ - depth / 2;
				body.nativeBody.setTranslation({ x: targetX, y: startY, z: targetZ }, true);
				body.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
				body.nativeBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
			});
		};

		renderTestPane(redGPUContext, clothMesh, spawnObject, windBlast, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성 함수
 * [EN] Function to create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RedGPU.Display.Mesh} clothMesh
 * @param {function} spawnObject
 * @param {function} windBlast
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, clothMesh, spawnObject, windBlast, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770713934910');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770713934910");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();


	pane.addButton({ title: 'Drop Object' }).on('click', () => spawnObject());
	pane.addButton({ title: 'Wind Blast!' }).on('click', () => windBlast());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};