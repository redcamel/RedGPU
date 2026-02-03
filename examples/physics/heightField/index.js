import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 지형을 조망하기 좋게 거리와 각도 조절
		// [EN] Set up camera controller: Adjust distance and angle for a good view of the terrain
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		
		// [KO] 3D 뷰 생성 및 그리드 설정
		// [EN] Create 3D view and set up grid
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화 및 씬 연결
		// [EN] Initialize physics engine (Rapier) and connect to scene
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		// [KO] 기본 조명 설정
		// [EN] Default lighting setup
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10;
		directionalLight.y = 10;
		directionalLight.z = 10;
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] HeightField 설정을 위한 파라미터 정의 (20m x 20m 크기, 40x40 세그먼트)
		// [EN] Define parameters for HeightField (20m x 20m size, 40x40 segments)
		const width = 20;
		const depth = 20;
		const wSegments = 40;
		const hSegments = 40;
		
		const ncols = wSegments + 1;
		const nrows = hSegments + 1;
		
		// [KO] 시각적 데이터용(Row-major)과 물리 엔진용(Column-major) 높이 배열 준비
		// [EN] Prepare height arrays for visual data (Row-major) and physics engine (Column-major)
		const heights = new Float32Array(ncols * nrows);
		const physicsHeights = new Float32Array(ncols * nrows);
		
		const scaleX = width / wSegments;
		const scaleZ = depth / hSegments;

		// [KO] 사인파를 이용한 지형 높이 데이터 생성
		// [EN] Generate terrain height data using sine waves
		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const x = j * scaleX - width / 2;
				const z = i * scaleZ - depth / 2;
				const h = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
				
				// [KO] 시각적 데이터 저장 (행 우선 방식)
				// [EN] Store visual data (Row-major)
				heights[i * ncols + j] = h;
				// [KO] Rapier 물리 데이터 저장 (열 우선 방식)
				// [EN] Store Rapier physics data (Column-major)
				physicsHeights[j * nrows + i] = h;
			}
		}

		// [KO] 시각적 지형 메시 생성 (Ground 프리미티브 활용)
		// [EN] Create visual terrain mesh (Using Ground primitive)
		const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, width, depth, wSegments, hSegments);
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			groundGeometry,
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#446688');
		scene.addChild(groundMesh);

		// [KO] 지형의 정점 높이(y) 데이터를 생성된 데이터로 업데이트
		// [EN] Update vertex height (y) data of the terrain with the generated data
		const vertexData = groundGeometry.vertexBuffer.data;
		const stride = groundGeometry.vertexBuffer.interleavedStruct.arrayStride / 4;
		
		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const index = (i * ncols + j) * stride;
				vertexData[index + 1] = heights[i * ncols + j];
			}
		}

		// [KO] RedGPU.Math.calculateNormals를 사용하여 지형의 노멀 벡터 재계산 (정확한 조명 효과를 위함)
		// [EN] Recalculate terrain normal vectors using RedGPU.Math.calculateNormals (For accurate lighting effects)
		const numVertices = groundGeometry.vertexBuffer.vertexCount;
		const positions = [];
		for (let i = 0; i < numVertices; i++) {
			const start = i * stride;
			positions.push(vertexData[start], vertexData[start + 1], vertexData[start + 2]);
		}

		const indices = Array.from(groundGeometry.indexBuffer.data);
		const normals = RedGPU.Math.calculateNormals(positions, indices);

		for (let i = 0; i < numVertices; i++) {
			const start = i * stride;
			vertexData[start + 3] = normals[i * 3];
			vertexData[start + 4] = normals[i * 3 + 1];
			vertexData[start + 5] = normals[i * 3 + 2];
		}
		
		// [KO] 수정된 정점 데이터를 GPU 버퍼에 반영
		// [EN] Reflect the modified vertex data to the GPU buffer
		redGPUContext.device.queue.writeBuffer(groundGeometry.vertexBuffer.gpuBuffer, 0, vertexData);

		// [KO] 지형에 물리 충돌체 생성 (HEIGHTFIELD 적용)
		// [EN] Create physics collider on the terrain (Apply HEIGHTFIELD)
		physicsEngine.createBody(groundMesh, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
			shape: RedGPU.Physics.PHYSICS_SHAPE.HEIGHTFIELD,
			heightData: {
				nrows: hSegments,
				ncols: wSegments,
				heights: physicsHeights,
				scale: { x: width, y: 1, z: depth }
			}
		});

		const activeObjects = [];

		/**
		 * [KO] 충돌 테스트를 위한 구체 메시 및 물리 바디 생성 함수
		 * [EN] Function to create sphere mesh and physics body for collision testing
		 */
		const createSphere = (x, y, z) => {
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			const sphereMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
				material
			);
			sphereMesh.x = x;
			sphereMesh.y = y;
			sphereMesh.z = z;
			scene.addChild(sphereMesh);

			// [KO] 구체에 동적 물리 바디 적용
			// [EN] Apply dynamic physics body to the sphere
			const body = physicsEngine.createBody(sphereMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});
			activeObjects.push({ mesh: sphereMesh, body });
		};

		/**
		 * [KO] 다수의 구체를 무작위 위치에 스폰
		 * [EN] Spawn multiple spheres at random positions
		 */
		const spawnSpheres = () => {
			for (let i = 0; i < 10; i++) {
				createSphere(
					Math.random() * 10 - 5,
					10 + i * 2,
					Math.random() * 10 - 5
				);
			}
		};

		spawnSpheres();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] 테스트용 UI 패널 설정
		// [EN] Set up UI panel for testing
		const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
		const pane = new Pane();
		pane.addButton({ title: 'Spawn Spheres' }).on('click', () => spawnSpheres());
		pane.addButton({ title: 'Reset Scene' }).on('click', () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			spawnSpheres();
		});
	},
	(failReason) => {
		console.error(failReason);
	}
);
