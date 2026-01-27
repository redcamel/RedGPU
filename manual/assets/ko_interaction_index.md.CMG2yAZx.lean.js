import{f as r,D as s,c as h,o as p,a2 as a,H as i,w as l,k as e,a as n}from"./chunks/framework.cYGcyyTy.js";const f=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"ko/interaction/index.md","filePath":"ko/interaction/index.md","lastUpdated":1769498891000}'),c={name:"ko/interaction/index.md"};function E(k,t,g,y,x,C){const d=s("CodePen"),o=s("ClientOnly");return p(),h("div",null,[t[1]||(t[1]=a("",10)),i(o,null,{default:l(()=>[i(d,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),n(`
`),e("pre",null,[e("code",null,`// 1. 기본 큐브 생성
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. 상태 표시를 위한 HTML UI 생성 (하단 중앙)
const statusOverlay = document.createElement('div');
Object.assign(statusOverlay.style, {
    position: 'fixed',
    bottom: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 32px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    borderRadius: '12px',
    fontFamily: 'monospace',
    fontSize: '16px',
    textAlign: 'center',
    pointerEvents: 'none',
    border: '1px solid #444',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
});

// 두 줄 구조로 생성
statusOverlay.innerHTML = \`
    <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 4px;">Ready to Interact</div>
    <div id="event-detail" style="font-size: 14px; color: #aaa;">Move or Click the Cube</div>
\`;
document.body.appendChild(statusOverlay);

const typeEl = statusOverlay.querySelector('#event-type');
const detailEl = statusOverlay.querySelector('#event-detail');

// 3. 이벤트 리스너 등록

// [CLICK] 클릭 시 랜덤 색상 변경 및 회전
mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    e.target.material.color.setColorByRGB(r, g, b);
    
    e.target.rotationY += 45;
    e.target.rotationX += 45;

    typeEl.innerText = 'Event: CLICK';
    typeEl.style.color = '#ffcc00';
    detailEl.innerText = 'Color Changed!';
});

// [DOWN] 마우스 버튼을 눌렀을 때
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    typeEl.innerText = 'Event: MOUSE_DOWN';
    typeEl.style.color = '#ff4444';
});

// [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    detailEl.innerText = \`MOUSE_MOVE at (\${e.mouseX.toFixed(2)}, \${e.mouseY.toFixed(2)})\`;
});

// [OVER] 마우스 오버 시
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    typeEl.innerText = 'Event: MOUSE_OVER';
    typeEl.style.color = '#00CC99';
});

// [OUT] 마우스 아웃 시
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
    detailEl.innerText = 'Move or Click the Cube';
});

// 4. 카메라 및 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",5))])}const P=r(c,[["render",E]]);export{f as __pageData,P as default};
