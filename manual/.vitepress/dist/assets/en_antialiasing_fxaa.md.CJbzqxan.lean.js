import{f as d,D as t,c,o as h,a2 as i,H as s,w as r,k as e,a}from"./chunks/framework.cYGcyyTy.js";const C=JSON.parse('{"title":"FXAA","description":"","frontmatter":{"title":"FXAA","order":3},"headers":[],"relativePath":"en/antialiasing/fxaa.md","filePath":"en/antialiasing/fxaa.md","lastUpdated":1769498891000}'),g={name:"en/antialiasing/fxaa.md"};function p(u,n,x,m,A,b){const o=t("CodePen"),l=t("ClientOnly");return h(),c("div",null,[n[1]||(n[1]=i("",9)),s(l,null,{default:r(()=>[s(o,{title:"RedGPU - FXAA Example",slugHash:"antialiasing-fxaa"},{default:r(()=>[...n[0]||(n[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
light.x = 10; light.y = 10; light.z = 10;
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.3;
scene.lightManager.ambientLight = ambientLight;

// 1. Fine grid floor (To check pattern aliasing)
const grid = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 50, 50),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#999999')
);
grid.drawMode = 'lines';
scene.addChild(grid);

// 2. Wireframe Sphere (To check geometry edges)
const sphere = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 5, 32, 32),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00aaff')
);
sphere.y = 5;
sphere.x = -6;
sphere.drawMode = 'lines';
scene.addChild(sphere);

// 3. Texture Box (To check texture sharpness)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
boxMaterial.diffuseTexture = texture;

const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 6, 6, 6),
    boxMaterial
);
box.y = 5;
box.x = 6;
scene.addChild(box);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 25;
controller.tilt = -15;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// Initial state: FXAA Enabled
redGPUContext.antialiasingManager.useFXAA = true;

// UI: FXAA Toggle
const btn = document.createElement('button');
btn.textContent = 'FXAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00CC99', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useFXAA) {
         manager.useFXAA = false;
    } else {
         manager.useFXAA = true;
    }
    
    btn.textContent = \`FXAA: \${manager.useFXAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useFXAA ? '#00CC99' : '#ccc';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    sphere.rotationY += 0.01;
    box.rotationY += 0.01;
});
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=i("",2))])}const f=d(g,[["render",p]]);export{C as __pageData,f as default};
