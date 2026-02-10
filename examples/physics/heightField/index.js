import * as RedGPU from "../../../dist/index.js?t=1770697269592";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js?t=1770697269592";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] HeightField 예제
 * [EN] HeightField example
 *
 * [KO] 높이 맵 데이터를 사용하여 지형을 생성하고 물리 엔진에 HeightField 콜라이더로 적용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to create a terrain using height map data and apply it as a HeightField collider in the physics engine.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정
		// [EN] Set up camera controller
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -30;
		controller.centerY = 5;

		const scene = new RedGPU.Display.Scene();
		
		// [KO] 3D 뷰 생성 및 그리드 활성화
		// [EN] Create 3D view and enable grid
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

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

		// [KO] HeightField 설정 파라미터 (20m x 20m, 40x40 세그먼트)
		// [EN] HeightField setup parameters (20m x 20m, 40x40 segments)
		const width = 20;
		const depth = 20;
		const wSegments = 40;
		const hSegments = 40;
		
		const ncols = wSegments + 1;
		const nrows = hSegments + 1;
		
		const heights = new Float32Array(ncols * nrows);
		const physicsHeights = new Float32Array(ncols * nrows);
		
		const scaleX = width / wSegments;
		const scaleZ = depth / hSegments;

		// [KO] 사인파를 이용한 지형 데이터 생성
		// [EN] Generate terrain data using sine waves
		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const x = j * scaleX - width / 2;
				const z = i * scaleZ - depth / 2;
				const h = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 3;
				
				heights[i * ncols + j] = h;
				physicsHeights[j * nrows + i] = h;
			}
		}

		// [KO] 시각적 지형 메시 생성
		// [EN] Create visual terrain mesh
		const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, width, depth, wSegments, hSegments);
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			groundGeometry,
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#446688');
		scene.addChild(groundMesh);

		// [KO] 정점 데이터 및 노멀 업데이트
		// [EN] Update vertex data and normals
		const vertexData = groundGeometry.vertexBuffer.data;
		const stride = groundGeometry.vertexBuffer.interleavedStruct.arrayStride / 4;
		const numVertices = groundGeometry.vertexBuffer.vertexCount;

		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const index = (i * ncols + j) * stride;
				vertexData[index + 1] = heights[i * ncols + j];
			}
		}

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
		
		redGPUContext.gpuDevice.queue.writeBuffer(groundGeometry.vertexBuffer.gpuBuffer, 0, vertexData);

		// [KO] 물리 충돌체 생성 (HEIGHTFIELD)
		// [EN] Create physics collider (HEIGHTFIELD)
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
		 * [KO] 구체 스폰 함수
		 * [EN] Sphere spawn function
		 */
		const spawnSpheres = () => {
			for (let i = 0; i < 10; i++) {
				const material = new RedGPU.Material.PhongMaterial(redGPUContext);
				material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
				const sphereMesh = new RedGPU.Display.Mesh(
					redGPUContext,
					new RedGPU.Primitive.Sphere(redGPUContext, 0.5),
					material
				);
				sphereMesh.x = Math.random() * 10 - 5;
				sphereMesh.y = 15 + i * 2;
				sphereMesh.z = Math.random() * 10 - 5;
				scene.addChild(sphereMesh);

				const body = physicsEngine.createBody(sphereMesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
					mass: 1,
					restitution: 0.5
				});
				activeObjects.push({ mesh: sphereMesh, body });
			}
		};

		/**
		 * [KO] 씬 초기화 함수
		 * [EN] Scene reset function
		 */
		const resetScene = () => {
			activeObjects.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeObjects.length = 0;
			spawnSpheres();
		};

		spawnSpheres();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		// [KO] 테스트 패널 생성
		// [EN] Create test pane
		renderTestPane(redGPUContext, physicsEngine, spawnSpheres, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

/**
 * [KO] 테스트용 컨트롤 패널 생성 함수
 * [EN] Function to create a control panel for testing
 * @param {RedGPU.RedGPUContext} redGPUContext
 * @param {RapierPhysics} physicsEngine
 * @param {function} spawnSpheres
 * @param {function} resetScene
 */
const renderTestPane = async (redGPUContext, physicsEngine, spawnSpheres, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js?t=1770697269592');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js?t=1770697269592");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();

	pane.addButton({ title: 'Spawn Spheres' }).on('click', () => spawnSpheres());
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
