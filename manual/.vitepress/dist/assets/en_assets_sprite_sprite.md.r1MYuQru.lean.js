import{f as o,D as a,c as d,o as h,a2 as i,H as n,w as l,k as e,a as s}from"./chunks/framework.cYGcyyTy.js";const x=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"en/assets/sprite/sprite.md","filePath":"en/assets/sprite/sprite.md","lastUpdated":1769497943000}'),c={name:"en/assets/sprite/sprite.md"};function k(g,t,y,u,m,b){const r=a("CodePen"),p=a("ClientOnly");return h(),d("div",null,[t[1]||(t[1]=i("",13)),n(p,null,{default:l(()=>[n(r,{title:"RedGPU - Sprite3D Billboard Showcase",slugHash:"sprite3d-showcase"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// Create shared material
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. Basic Billboard (Perspective ON)
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
scene.addChild(sprite1);

// 2. Disable Billboard (Plane fixed in space)
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 0; sprite2.y = 1;
sprite2.useBillboard = false;
scene.addChild(sprite2);

// 3. Fixed Size Billboard (Perspective OFF)
const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite3.x = 3; sprite3.y = 1;
sprite3.useBillboardPerspective = false;
scene.addChild(sprite3);

// 4. Option Description Label (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true; // Labels always face front
    scene.addChild(label);
};

createLabel('Billboard ON', -3, 2.2);
createLabel('Billboard OFF', 0, 2.2);
createLabel('Perspective OFF', 3, 2.2);

// 3D View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=i("",7))])}const E=o(c,[["render",k]]);export{x as __pageData,E as default};
