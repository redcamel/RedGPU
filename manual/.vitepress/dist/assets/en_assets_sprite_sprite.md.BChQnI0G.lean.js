import{f as d,D as s,o as p,c as h,a2 as a,G as n,w as l,k as e,a as i}from"./chunks/framework.DZW1bhNM.js";const f=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"en/assets/sprite/sprite.md","filePath":"en/assets/sprite/sprite.md","lastUpdated":1770698112000}'),c={name:"en/assets/sprite/sprite.md"};function g(k,t,u,y,x,m){const r=s("CodePen"),o=s("ClientOnly");return p(),h("div",null,[t[1]||(t[1]=a("",26)),n(o,null,{default:l(()=>[n(r,{title:"RedGPU - Sprite3D Showcase",slugHash:"sprite3d-showcase"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),e("pre",null,[e("code",null,`// Create shared material
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. Basic World Size
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
sprite1.worldSize = 1.5;
scene.addChild(sprite1);

// 2. Fixed Pixel Size - size remains same even when moving away
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 3; sprite2.y = 1;
sprite2.usePixelSize = true;
sprite2.pixelSize = 100;
scene.addChild(sprite2);

// 3. Option Description Label (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true;
    scene.addChild(label);
};

createLabel('World Size', -3, 2.5);
createLabel('Pixel Size', 3, 2.5);

// 3D View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),i(`
`),e("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",7))])}const P=d(c,[["render",g]]);export{f as __pageData,P as default};
