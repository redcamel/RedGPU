import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794650694512";
import * as RedGPU from "../../../dist/index.js?t=1794650694512";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794650694512";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Galton Board 예제
 * [EN] Galton Board example
 *
 * [KO] 갈톤 보드를 시뮬레이션하여 정규 분포를 형성하는 과정을 보여줍니다.
 * [EN] Simulates a Galton board to demonstrate the formation of a normal distribution.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 축소된 보드 크기에 맞춰 거리 조정
		// [EN] Set up camera controller: Adjust distance for reduced board size
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 25;
		controller.tilt = -20;

		const scene = new RedGPU.Display.Scene();

		// [KO] 3D 뷰 생성 및 설정
		// [EN] Create and configure 3D view
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = false;
		view.grid = false;
		redGPUContext.addView(view);

		// [KO] 물리 엔진(Rapier) 초기화
		// [EN] Initialize physics engine (Rapier)
		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;

		// [KO] 조명 설정
		// [EN] Lighting setup
		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

        const createStaticBox = (x, y, z, w, h, d, color = '#666666') => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
			);
			mesh.x = x;
			mesh.y = y;
			mesh.z = z;
			mesh.scaleX = w;
			mesh.scaleY = h;
			mesh.scaleZ = d;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
		};

        // [KO] 보드 구조물 생성 (약 15m x 20m 스케일: 뒷벽, 바닥, 좌우 벽)
        // [EN] Create board structures (approx. 15m x 20m scale: back wall, floor, left and right walls)
        createStaticBox(0, 0, -0.5, 15, 20, 1, '#585858');
        createStaticBox(0, -10, 0.5, 15, 1, 2, '#707070');
        createStaticBox(-7.5, 0, 0.5, 1, 20, 2, '#707070');
        createStaticBox(7.5, 0, 0.5, 1, 20, 2, '#707070');

		// [KO] 핀(Pins) 배치: 현실적인 간격(1.2m)으로 조정
		// [EN] Pin placement: Adjusted to realistic spacing (1.2m)
		const pinGeo = new RedGPU.Primitive.Cylinder(redGPUContext, 0.1, 0.1, 1);
        const pinMat = new RedGPU.Material.PhongMaterial(redGPUContext, '#888888');

		for (let row = 0; row < 12; row++) {
			const y = 6 - row * 1.25;
			const cols = row + 1;
			const startX = -(cols - 1) * 1.25 / 2;
			for (let col = 0; col < cols; col++) {
				const pinMesh = new RedGPU.Display.Mesh(
					redGPUContext,
					pinGeo,
					pinMat
				);
				pinMesh.x = startX + col * 1.25;
				pinMesh.y = y;
				pinMesh.z = 0.25;
				pinMesh.rotationX = 90;
				scene.addChild(pinMesh);
				physicsEngine.createBody(pinMesh, {
					type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
					shape: RedGPU.Physics.PHYSICS_SHAPE.CYLINDER
				});
			}
		}

		// [KO] 구슬 생성 및 관리 시스템 (지름 0.5m)
		// [EN] Marble creation and management system (diameter 0.5m)
		const activeBalls = [];
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.25);

        const getRandomColor = () => {
            const r = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            const g = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            const b = Math.floor(Math.random() * 255).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        };

		const createBall = () => {
			const ballMesh = new RedGPU.Display.Mesh(
				redGPUContext,
				ballGeo,
                new RedGPU.Material.PhongMaterial(redGPUContext, getRandomColor())
			);
			ballMesh.x = (Math.random() * 0.2) - 0.1;
			ballMesh.y = 9;
			ballMesh.z = 0.25;
			scene.addChild(ballMesh);

			const body = physicsEngine.createBody(ballMesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.6,
				friction: 0.1,
				linearDamping: 0.1
			});
			const ballInfo = { mesh: ballMesh, body };
			activeBalls.push(ballInfo);

			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(ballMesh);
					activeBalls.splice(idx, 1);
				}
			}, 15000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		let intervalId = setInterval(createBall, 100);
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, intervalId, createBall, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, intervalId, createBall, resetScene) => {
	
	new RedGPUExampleHelper(redGPUContext, {
		gui: (pane) => {
			const params = {
				spawnRate: 100,
				pause: false
			};
			
			pane.addBinding(params, 'spawnRate', {
				min: 50,
				max: 1000
			}).on('change', (ev) => {
				clearInterval(intervalId);
				if (!params.pause) intervalId = setInterval(createBall, ev.value);
			});

			pane.addBinding(params, 'pause').on('change', (ev) => {
				if (ev.value) clearInterval(intervalId);
				else intervalId = setInterval(createBall, params.spawnRate);
			});

			pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
		}
	});
};
