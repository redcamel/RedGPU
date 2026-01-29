import * as RedGPU from "../../../dist/index.js";
import { RedRapierPhysics } from "../../../dist/plugins/physics/rapier/index.js";

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

RedGPU.init(
	canvas,
	async (redGPUContext) => {
		const controller = new RedGPU.Camera.OrbitController(redGPUContext);
		controller.distance = 35;
		controller.tilt = -35;
		controller.pan = 45;

		const scene = new RedGPU.Display.Scene();

		const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
		view.axis = true; view.grid = true;
		redGPUContext.addView(view);

		const physicsEngine = new RedRapierPhysics();
		await physicsEngine.init();
		physicsEngine.setGravity(0, -9.81, 0);
		scene.physicsEngine = physicsEngine;

		// 조명 설정
		const ambientLight = new RedGPU.Light.AmbientLight();
		ambientLight.intensity = 0.5;
		scene.lightManager.ambientLight = ambientLight;

		const directionalLight = new RedGPU.Light.DirectionalLight();
		directionalLight.x = 20; directionalLight.y = 40; directionalLight.z = 20;
		directionalLight.intensity = 1.2;
		scene.lightManager.addDirectionalLight(directionalLight);

		const ibl = new RedGPU.Resource.IBL(redGPUContext, '../../assets/hdr/2k/the_sky_is_on_fire_2k.hdr');
		view.ibl = ibl;

		// 1. 실험실 환경 구축
		const createStaticBox = (x, y, z, w, h, d, rx = 0, rz = 0) => {
			const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.Box(redGPUContext), new RedGPU.Material.PhongMaterial(redGPUContext));
			mesh.x = x; mesh.y = y; mesh.z = z;
			mesh.scaleX = w; mesh.scaleY = h; mesh.scaleZ = d;
			mesh.rotationX = rx; mesh.rotationZ = rz;
			scene.addChild(mesh);
			physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.STATIC, shape: RedGPU.Physics.PHYSICS_SHAPE.BOX, friction: 0.8 });
		};

		createStaticBox(0, -0.5, 0, 50, 1, 50);
		createStaticBox(-12, 6, 0, 20, 1, 25, 0, -25);

		// 2. 물리 객체 관리 및 리셋
		const activeObjects = [];
		const createPhysicalObject = (type, x, y, z, color, restitution = 0.5, friction = 0.5) => {
			let geometry, shape;
			switch (type) {
				case 'box': geometry = new RedGPU.Primitive.Box(redGPUContext); shape = RedGPU.Physics.PHYSICS_SHAPE.BOX; break;
				case 'sphere': geometry = new RedGPU.Primitive.Sphere(redGPUContext); shape = RedGPU.Physics.PHYSICS_SHAPE.SPHERE; break;
				case 'cylinder': geometry = new RedGPU.Primitive.Cylinder(redGPUContext); shape = RedGPU.Physics.PHYSICS_SHAPE.CYLINDER; break;
				case 'capsule': geometry = new RedGPU.Primitive.Cylinder(redGPUContext); shape = RedGPU.Physics.PHYSICS_SHAPE.CAPSULE; break;
			}
			const material = new RedGPU.Material.PhongMaterial(redGPUContext);
			material.color.setColorByHEX(color);
			const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
			mesh.x = x; mesh.y = y; mesh.z = z;
			scene.addChild(mesh);

			const body = physicsEngine.createBody(mesh, { type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC, shape: shape, mass: 1, restitution, friction });
			if (type === 'cylinder' || type === 'capsule') body.rotation = [0, 0, 0.707, 0.707];
			activeObjects.push({ mesh, body });
		};

		const initScene = () => {
			const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff'];
			const shapes = ['box', 'sphere', 'cylinder', 'capsule'];
			for (let i = 0; i < 12; i++) createPhysicalObject(shapes[i % shapes.length], -15 - Math.random() * 5, 10 + Math.random() * 5, (Math.random() * 16) - 8, colors[i % colors.length]);
		};

		const resetScene = () => {
			activeObjects.forEach(item => { physicsEngine.removeBody(item.body); scene.removeChild(item.mesh); });
			activeObjects.length = 0;
			initScene();
		};

		initScene();

		const renderer = new RedGPU.Renderer();
		renderer.start(redGPUContext);

		renderTestPane(redGPUContext, resetScene, createPhysicalObject);
	},
	(failReason) => { console.error(failReason); }
);

const renderTestPane = async (redGPUContext, resetScene, createPhysicalObject) => {
	const { Pane } = await import('https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js');
	const { setDebugButtons } = await import("../../exampleHelper/createExample/panes/index.js");
	setDebugButtons(RedGPU, redGPUContext)
	const pane = new Pane();
	const params = { type: 'sphere', color: '#ffffff', restitution: 0.6, friction: 0.4 };
	const folder = pane.addFolder({ title: 'Spawn Object' });
	folder.addBinding(params, 'type', { options: { Box: 'box', Sphere: 'sphere', Cylinder: 'cylinder', Capsule: 'capsule' } });
	folder.addBinding(params, 'color');
	folder.addButton({ title: 'Spawn' }).on('click', () => createPhysicalObject(params.type, -18 + (Math.random() * 4), 15, (Math.random() * 10) - 5, params.color, params.restitution, params.friction));
	pane.addButton({ title: 'Reset Scene' }).on('click', () => resetScene());
};
