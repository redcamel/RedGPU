import * as RedGPU from "../../../dist/index.js";
import { RapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 55;
		controller.tilt = -25;
		controller.centerY = 10;

		const scene = new RedGPU.Display.Scene();
		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RapierPhysics();
		await physicsEngine.init();
		scene.physicsEngine = physicsEngine;

		const RAPIER = physicsEngine.RAPIER;
		// [KO] 디버깅을 위해 JointData 키 목록 출력
		console.log('RAPIER.JointData keys:', Object.keys(RAPIER.JointData));

		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.intensity = 1;
		scene.lightManager.addDirectionalLight(directionalLight);

		// 1. 천장 앵커 포인트
		const anchorMeshList = [];
		const createAnchor = (x, z) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = 25; mesh.z = z;
			mesh.material.color.setColorByHEX('#ff4444');
			scene.addChild(mesh);
			anchorMeshList.push(mesh);
			return physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX });
		};

		const anchors = [
			createAnchor(-10, -10), createAnchor(10, -10),
			createAnchor(10, 10), createAnchor(-10, 10)
		];

		// 2. 탄성 플랫폼
		const platform = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
		platform.y = 15;
		platform.scaleX = 20; platform.scaleY = 1; platform.scaleZ = 20;
		platform.material.color.setColorByHEX('#00ccff');
		scene.addChild(platform);

		const platformBody = physicsEngine.createBody(platform, {
			type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX,
			mass: 15, linearDamping: 0.5, angularDamping: 0.5
		});

		// 3. 스프링 물리 연결
		const springStiffness = 1000.0;
		const springDamping = 50.0;
		const restLength = 10.0;

		anchors.forEach((anchor, i) => {
			const xSign = (i === 0 || i === 3) ? -1 : 1;
			const zSign = (i === 0 || i === 1) ? -1 : 1;

			const JD = RAPIER.JointData;
			let jointData;

			// [KO] 가능한 명칭들을 순서대로 시도
			if (typeof JD.spring === 'function') {
				jointData = JD.spring(restLength, springStiffness, springDamping, { x: 0, y: 0, z: 0 }, { x: 10 * xSign, y: 0, z: 10 * zSign });
			} else if (typeof JD.distance === 'function') {
				jointData = JD.distance(restLength, { x: 0, y: 0, z: 0 }, { x: 10 * xSign, y: 0, z: 10 * zSign });
			} else {
				// 최후의 수단: ball 관절로 연결만 해둠
				console.warn('Spring or Distance joint method not found, falling back to ball joint');
				jointData = JD.ball({ x: 0, y: 0, z: 0 }, { x: 10 * xSign, y: 0, z: 10 * zSign });
			}

			physicsEngine.nativeWorld.createImpulseJoint(jointData, anchor.nativeBody, platformBody.nativeBody, true);
		});

		// 4. 시각적 스프링 선
		const springLines = [];
		anchorMeshList.forEach(() => {
			const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.LINEAR, '#ffffff');
			scene.addChild(line);
			springLines.push(line);
		});

		// 5. 낙하 물체 및 리셋
		const activeObjects = [];
		const createObject = () => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.material.color.setColorByHEX(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
			mesh.x = (Math.random() * 10) - 5; mesh.y = 35; mesh.z = (Math.random() * 10) - 5;
			scene.addChild(mesh);
			const body = physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, mass: 2 });
			activeObjects.push({ mesh, body });
			setTimeout(() => {
				const idx = activeObjects.findIndex(v => v.body === body);
				if (idx > -1) { physicsEngine.removeBody(body); scene.removeChild(mesh); }
			}, 10000);
		};

		const resetScene = () => {
			activeObjects.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeObjects.length = 0;
			platformBody.nativeBody.setTranslation({ x: 0, y: 15, z: 0 }, true);
			platformBody.nativeBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
			platformBody.nativeBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
		};

		setInterval(createObject, 1500);

		const render = () => {
			springLines.forEach((line, i) => {
				const anchorMesh = anchorMeshList[i];
				const xSign = (i === 0 || i === 3) ? -1 : 1;
				const zSign = (i === 0 || i === 1) ? -1 : 1;
				line.removeAllPoint();
				line.addPoint(anchorMesh.x, anchorMesh.y, anchorMesh.z);
				line.addPoint(platform.x + (10 * xSign), platform.y, platform.z + (10 * zSign));
			});
		};
		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext, render);

		renderTestPane(redGPUContext, resetScene);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};