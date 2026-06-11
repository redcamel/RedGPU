import{c as o,$ as i,Q as d,j as p,m as a,o as n,ax as l,g as e,n as s}from"./chunks/framework.D5MFXpji.js";const x=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"en/assets/sprite/spritesheet.md","filePath":"en/assets/sprite/spritesheet.md","lastUpdated":1781144716000}'),c={name:"en/assets/sprite/spritesheet.md"};function g(k,t,y,m,u,S){const r=i("CodePen"),h=i("ClientOnly");return d(),p("div",null,[t[1]||(t[1]=a("",23)),n(h,null,{default:l(()=>[n(r,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// 1. Create SpriteSheetInfo (5x3 grid, 15 frames, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. World Size Sprite Sheet
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
spriteSheet1.worldSize = 2;
scene.addChild(spriteSheet1);

// 3. Fixed Pixel Size Sprite Sheet
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 3; spriteSheet2.y = 1;
spriteSheet2.usePixelSize = true;
spriteSheet2.pixelSize = 150;
scene.addChild(spriteSheet2);

// 4. Option Description Label (TextField3D)
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
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",7))])}const E=o(c,[["render",g]]);export{x as __pageData,E as default};
