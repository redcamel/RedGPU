import{f as r,D as i,o as d,c as o,a2 as a,G as n,w as l,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const D=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"ko/assets/sprite/spritesheet.md","filePath":"ko/assets/sprite/spritesheet.md","lastUpdated":1770625747000}'),k={name:"ko/assets/sprite/spritesheet.md"};function c(g,s,S,y,E,u){const h=i("CodePen"),p=i("ClientOnly");return d(),o("div",null,[s[1]||(s[1]=a("",21)),n(p,null,{default:l(()=>[n(h,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),e("pre",null,[e("code",null,`// 1. SpriteSheetInfo 생성 (5x3 격자, 15프레임, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. 월드 사이즈 스프라이트 시트 (World Size)
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
spriteSheet1.worldSize = 2;
scene.addChild(spriteSheet1);

// 3. 고정 픽셀 사이즈 스프라이트 시트 (Pixel Size)
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 3; spriteSheet2.y = 1;
spriteSheet2.usePixelSize = true;
spriteSheet2.pixelSize = 150;
scene.addChild(spriteSheet2);

// 4. 옵션 설명 라벨 (TextField3D)
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

// 3D 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// 렌더링 시작
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=a("",3))])}const P=r(k,[["render",c]]);export{D as __pageData,P as default};
