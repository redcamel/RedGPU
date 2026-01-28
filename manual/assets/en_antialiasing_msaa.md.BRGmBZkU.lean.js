import{f as o,D as t,o as d,c as h,a2 as g,G as i,w as s,k as e,a as n}from"./chunks/framework.DpNgdNqH.js";const y=JSON.parse('{"title":"MSAA","description":"","frontmatter":{"title":"MSAA","order":2},"headers":[],"relativePath":"en/antialiasing/msaa.md","filePath":"en/antialiasing/msaa.md","lastUpdated":1769587164000}'),p={name:"en/antialiasing/msaa.md"};function c(u,a,m,x,A,P){const r=t("CodePen"),l=t("ClientOnly");return d(),h("div",null,[a[1]||(a[1]=g("",9)),i(l,null,{default:s(()=>[i(r,{title:"RedGPU - MSAA Example",slugHash:"antialiasing-msaa"},{default:s(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
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

// Initial state: MSAA Enabled
redGPUContext.antialiasingManager.useMSAA = true;

// UI: MSAA Toggle
const btn = document.createElement('button');
btn.textContent = 'MSAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00aaff', color: 'white', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useMSAA) {
        manager.useMSAA = false; // Turn off
    } else {
        manager.useMSAA = true; // Turn on
    }
    
    btn.textContent = \`MSAA: \${manager.useMSAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useMSAA ? '#00aaff' : '#ccc';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    sphere.rotationY += 0.01;
    box.rotationY += 0.01;
});
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),a[2]||(a[2]=e("h2",{id:"key-summary",tabindex:"-1"},[n("Key Summary "),e("a",{class:"header-anchor",href:"#key-summary","aria-label":'Permalink to "Key Summary"'},"​")],-1)),a[3]||(a[3]=e("ul",null,[e("li",null,[e("strong",null,"Hardware Support"),n(": Uses built-in GPU features.")]),e("li",null,[e("strong",null,"Edge Specialized"),n(": Excellent for smoothing object outlines.")]),e("li",null,[e("strong",null,"Default"),n(": Enabled by default in standard display environments.")])],-1))])}const U=o(p,[["render",c]]);export{y as __pageData,U as default};
