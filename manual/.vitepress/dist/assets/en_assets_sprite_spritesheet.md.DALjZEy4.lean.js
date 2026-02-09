import{f as p,D as i,o,c as d,a2 as a,G as n,w as l,k as e,a as s}from"./chunks/framework.DpNgdNqH.js";const E=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"en/assets/sprite/spritesheet.md","filePath":"en/assets/sprite/spritesheet.md","lastUpdated":1770625747000}'),c={name:"en/assets/sprite/spritesheet.md"};function k(g,t,y,m,S,u){const r=i("CodePen"),h=i("ClientOnly");return o(),d("div",null,[t[1]||(t[1]=a("",21)),n(h,null,{default:l(()=>[n(r,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",3))])}const x=p(c,[["render",k]]);export{E as __pageData,x as default};
