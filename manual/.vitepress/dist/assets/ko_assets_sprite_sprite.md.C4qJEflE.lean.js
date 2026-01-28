import{f as d,D as i,o as h,c as o,a2 as a,G as n,w as l,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const P=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"ko/assets/sprite/sprite.md","filePath":"ko/assets/sprite/sprite.md","lastUpdated":1769587164000}'),k={name:"ko/assets/sprite/sprite.md"};function c(g,s,u,y,E,b){const r=i("CodePen"),p=i("ClientOnly");return h(),o("div",null,[s[1]||(s[1]=a("",13)),n(p,null,{default:l(()=>[n(r,{title:"RedGPU - Sprite3D Billboard Showcase",slugHash:"sprite3d-showcase"},{default:l(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),e("pre",null,[e("code",null,`// 공용 재질 생성
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. 기본 빌보드 (Perspective ON)
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
scene.addChild(sprite1);

// 2. 빌보드 비활성화 (공간에 고정된 평면)
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 0; sprite2.y = 1;
sprite2.useBillboard = false;
scene.addChild(sprite2);

// 3. 고정 크기 빌보드 (Perspective OFF)
const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite3.x = 3; sprite3.y = 1;
sprite3.useBillboardPerspective = false;
scene.addChild(sprite3);

// 4. 옵션 설명 라벨 (TextField3D)
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
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=a("",7))])}const C=d(k,[["render",c]]);export{P as __pageData,C as default};
