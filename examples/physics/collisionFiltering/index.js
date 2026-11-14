import RedGPUExampleHelper from "../../exampleHelper/dist/index.js?t=1794650694512";
import * as RedGPU from "../../../dist/index.js?t=1794650694512";
import {RapierPhysics} from "../../../dist/plugins/physics/rapier/index.js?t=1794650694512";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

/**
 * [KO] Collision Filtering 예제
 * [EN] Collision Filtering example
 *
 * [KO] 충돌 필터링을 사용하여 특정 그룹 간의 충돌만 허용하는 방법을 보여줍니다.
 * [EN] Demonstrates how to use collision filtering to allow collisions only between specific groups.
 */

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		// [KO] 카메라 컨트롤러 설정: 축소된 스케일에 맞춰 거리 조정
		// [EN] Set up camera controller: Adjust distance for reduced scale
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 40;
		controller.tilt = -25;
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

		const directionalLight = new RedGPU.Light.DirectionalLight();
		scene.lightManager.addDirectionalLight(directionalLight);

		// [KO] 충돌 그룹 정의 (16비트 비트마스크)
		// [EN] Define collision groups (16-bit bitmask)
		const GROUP_RED   = 0x0001; 
		const GROUP_BLUE  = 0x0002; 
		const GROUP_BLACK = 0x0004; 
		const GROUP_ALL   = 0xFFFF;

        // [KO] 1. 바닥 생성 함수 (현실적인 미터 단위 스케일)
        // [EN] 1. Ground creation function (realistic meter-scale)
		const createFloor = (x, color, membership) => {
			const mesh = new RedGPU.Display.Mesh(
				redGPUContext,
				new RedGPU.Primitive.Box(redGPUContext),
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
			);
			mesh.x = x;
			mesh.y = -0.5;
			mesh.scaleX = 10;
			mesh.scaleY = 1;
			mesh.scaleZ = 20;
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.BOX
			});
			
			// [KO] 바닥은 오직 자신의 그룹에 속한 물체와만 부딪힘
			// [EN] Floor only collides with objects belonging to its own group
			const bitmask = (membership << 16) | membership;
			body.nativeCollider.setCollisionGroups(bitmask);
		};

        createFloor(-12, '#cc4444', GROUP_RED);
        createFloor(0, '#666666', GROUP_BLACK);
        createFloor(12, '#4466cc', GROUP_BLUE);

        // [KO] 2. 구슬 생성 시스템
        // [EN] 2. Marble spawning system
		const activeBalls = [];
		const ballGeo = new RedGPU.Primitive.Sphere(redGPUContext, 0.5);

		const spawnBall = (type) => {
			let membership, filter, color;
			switch(type) {
				case 'RED':
                    color = '#d9534f';
					membership = GROUP_RED;
					filter = GROUP_RED; 
					break;
				case 'BLUE':
                    color = '#4a90e2';
					membership = GROUP_BLUE;
					filter = GROUP_BLUE; 
					break;
				case 'BLACK':
					color = '#888888';
					membership = GROUP_BLACK;
					filter = GROUP_BLACK; 
					break;
				case 'RAINBOW':
                    color = '#d4d4d8';
					membership = 0x0008; 
					filter = GROUP_ALL; 
					break;
			}

            const mesh = new RedGPU.Display.Mesh(
                redGPUContext,
                ballGeo,
                new RedGPU.Material.PhongMaterial(redGPUContext, color)
            );
            mesh.y = 15;
            mesh.x = (Math.random() * 30) - 15;
            mesh.z = (Math.random() * 10) - 5;
            scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, {
				type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
				shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
				mass: 1,
				restitution: 0.5
			});
			
			const bitmask = (membership << 16) | filter;
			body.nativeCollider.setCollisionGroups(bitmask);

			const ballInfo = { mesh, body };
			activeBalls.push(ballInfo);
			setTimeout(() => {
				const idx = activeBalls.indexOf(ballInfo);
				if (idx > -1) {
					physicsEngine.removeBody(body);
					scene.removeChild(mesh);
					activeBalls.splice(idx, 1);
				}
			}, 8000);
		};

		const resetScene = () => {
			activeBalls.forEach(item => {
				physicsEngine.removeBody(item.body);
				scene.removeChild(item.mesh);
			});
			activeBalls.length = 0;
		};

		setInterval(() => spawnBall('RED'), 800);
		setInterval(() => spawnBall('BLUE'), 800);
		setInterval(() => spawnBall('BLACK'), 800);
		setInterval(() => spawnBall('RAINBOW'), 1500);

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => {
		console.error(failReason);
	}
);

const renderTestPane = async (redGPUContext, resetScene) => {
	
	new RedGPUExampleHelper(redGPUContext, {
		gui: (pane) => {
			pane.addBlade({
				view: 'text',
				label: 'Guide',
				value: 'Colors filter their own floors!',
				parse: (v) => v,
				readonly: true
			});
			pane.addButton({ title: 'Reset Balls' }).on('click', () => resetScene());
		}
	});
};
