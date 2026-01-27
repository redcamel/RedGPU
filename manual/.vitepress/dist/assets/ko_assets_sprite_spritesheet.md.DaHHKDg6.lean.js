import{f as h,D as t,o as d,c as o,a2 as n,G as a,w as l,k as e,a as i}from"./chunks/framework.Dn9yU8Jh.js";const C=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"ko/assets/sprite/spritesheet.md","filePath":"ko/assets/sprite/spritesheet.md","lastUpdated":1769502195000}'),k={name:"ko/assets/sprite/spritesheet.md"};function c(g,s,S,y,E,P){const p=t("CodePen"),r=t("ClientOnly");return d(),o("div",null,[s[1]||(s[1]=n("",13)),a(r,null,{default:l(()=>[a(p,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),e("pre",null,[e("code",null,`// 1. SpriteSheetInfo 생성 (5x3 격자, 15프레임, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. 기본 빌보드 (Perspective ON)
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
scene.addChild(spriteSheet1);

// 3. 빌보드 비활성화 (공간에 고정된 평면)
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 0; spriteSheet2.y = 1;
spriteSheet2.useBillboard = false;
scene.addChild(spriteSheet2);

// 4. 고정 크기 빌보드 (Perspective OFF)
const spriteSheet3 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet3.x = 3; spriteSheet3.y = 1;
spriteSheet3.useBillboardPerspective = false;
scene.addChild(spriteSheet3);

// 5. 옵션 설명 라벨 (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true; // 라벨은 항상 정면 보기
    scene.addChild(label);
};

createLabel('Billboard ON', -3, 2.2);
createLabel('Billboard OFF', 0, 2.2);
createLabel('Perspective OFF', 3, 2.2);

// 3D 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),i(`
`),e("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=n("",3))])}const u=h(k,[["render",c]]);export{C as __pageData,u as default};
