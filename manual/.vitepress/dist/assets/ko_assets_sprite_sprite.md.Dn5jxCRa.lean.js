import{f as o,D as i,o as p,c as h,a2 as a,G as l,w as n,k as e,a as s}from"./chunks/framework.DZW1bhNM.js";const P=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"ko/assets/sprite/sprite.md","filePath":"ko/assets/sprite/sprite.md","lastUpdated":1770698112000}'),c={name:"ko/assets/sprite/sprite.md"};function k(g,t,u,x,y,b){const r=i("CodePen"),d=i("ClientOnly");return p(),h("div",null,[t[1]||(t[1]=a("",26)),l(d,null,{default:n(()=>[l(r,{title:"RedGPU - Sprite3D Showcase",slugHash:"sprite3d-showcase"},{default:n(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// 공용 재질 생성
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. 기본 월드 사이즈 (World Size)
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
sprite1.worldSize = 1.5;
scene.addChild(sprite1);

// 2. 고정 픽셀 사이즈 (Pixel Size) - 멀어져도 크기가 변하지 않음
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 3; sprite2.y = 1;
sprite2.usePixelSize = true;
sprite2.pixelSize = 100;
scene.addChild(sprite2);

// 3. 옵션 설명 라벨 (TextField3D)
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
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",7))])}const D=o(c,[["render",k]]);export{P as __pageData,D as default};
