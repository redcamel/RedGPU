import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 30;
		controller.tilt = -30;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 10;
		directionalLight.y = 10;
		directionalLight.z = 10;
		scene.lightManager.addDirectionalLight(directionalLight);

		// HeightField 설정
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

		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const x = j * scaleX - width / 2;
				const z = i * scaleZ - depth / 2;
				const h = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
				
				// 시각적 데이터용 (Row-major)
				heights[i * ncols + j] = h;
				// Rapier 물리 데이터용 (Column-major)
				physicsHeights[j * nrows + i] = h;
			}
		}

		// 시각적 메시 생성 (Ground 이용)
		const groundGeometry = new RedGPU.Primitive.Ground(redGPUContext, width, depth, wSegments, hSegments);
		const groundMesh = new RedGPU.Display.Mesh(
			redGPUContext,
			groundGeometry,
			new RedGPU.Material.PhongMaterial(redGPUContext)
		);
		groundMesh.material.color.setColorByHEX('#446688');
		scene.addChild(groundMesh);

		// Ground 기하구조의 높이(y) 데이터 업데이트 및 노멀 계산
		const vertexData = groundGeometry.vertexBuffer.data;
		const stride = groundGeometry.vertexBuffer.interleavedStruct.arrayStride / 4;
		
		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				const index = (i * ncols + j) * stride;
				vertexData[index + 1] = heights[i * ncols + j];
				
				// 간단한 노멀 계산 (Finite Difference)
				const hL = heights[i * ncols + Math.max(0, j - 1)];
				const hR = heights[i * ncols + Math.min(ncols - 1, j + 1)];
				const hD = heights[Math.max(0, i - 1) * ncols + j];
				const hU = heights[Math.min(nrows - 1, i + 1) * ncols + j];
				
				const normal = RedGPU.Math.vec3.fromValues(hL - hR, 2.0, hD - hU);
				RedGPU.Math.vec3.normalize(normal, normal);
				
				vertexData[index + 3] = normal[0];
				vertexData[index + 4] = normal[1];
				vertexData[index + 5] = normal[2];
			}
		}
		
		// 버퍼 업데이트
		redGPUContext.gpuDevice.queue.writeBuffer(groundGeometry.vertexBuffer.gpuBuffer, 0, vertexData);

		// 물리 바디 생성
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

			const body = physicsEngine.createBody(sphereMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});
			activeObjects.push({ mesh: sphereMesh, body });
		};

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

		// 테스트 패널
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