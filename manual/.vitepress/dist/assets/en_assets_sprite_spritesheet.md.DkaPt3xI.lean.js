import{f as p,D as t,c as o,o as d,a2 as a,H as n,w as l,k as e,a as i}from"./chunks/framework.cYGcyyTy.js";const E=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"en/assets/sprite/spritesheet.md","filePath":"en/assets/sprite/spritesheet.md","lastUpdated":1769497943000}'),c={name:"en/assets/sprite/spritesheet.md"};function k(g,s,m,y,u,S){const r=t("CodePen"),h=t("ClientOnly");return d(),o("div",null,[s[1]||(s[1]=a("",13)),n(h,null,{default:l(()=>[n(r,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),e("pre",null,[e("code",null,`// 1. Create SpriteSheetInfo (5x3 grid, 15 frames, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. Basic Billboard (Perspective ON)
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
scene.addChild(spriteSheet1);

// 3. Disable Billboard (Plane fixed in space)
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 0; spriteSheet2.y = 1;
spriteSheet2.useBillboard = false;
scene.addChild(spriteSheet2);

// 4. Fixed Size Billboard (Perspective OFF)
const spriteSheet3 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet3.x = 3; spriteSheet3.y = 1;
spriteSheet3.useBillboardPerspective = false;
scene.addChild(spriteSheet3);

// 5. Option Description Label (TextField3D)
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
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),i(`
`),e("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=a("",3))])}const C=p(c,[["render",k]]);export{E as __pageData,C as default};
