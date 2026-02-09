import{f as o,D as i,o as h,c as p,a2 as a,G as n,w as l,k as t,a as s}from"./chunks/framework.DpNgdNqH.js";const b=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"ko/interaction/index.md","filePath":"ko/interaction/index.md","lastUpdated":1770625747000}'),c={name:"ko/interaction/index.md"};function k(g,e,y,E,x,f){const d=i("CodePen"),r=i("ClientOnly");return h(),p("div",null,[e[1]||(e[1]=a("",15)),n(r,null,{default:l(()=>[n(d,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...e[0]||(e[0]=[t("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),t("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),t("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),t("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),t("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),s(`
`),t("pre",null,[t("code",null,`// 1. 기본 큐브 생성
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. 상태 표시를 위한 HTML UI 생성 (하단 좌측)
const statusOverlay = document.createElement('div');
Object.assign(statusOverlay.style, {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    padding: '12px 16px',
    background: 'rgba(0, 0, 0, 0.85)',
    color: 'white',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '12px',
    textAlign: 'left',
    pointerEvents: 'none',
    border: '1px solid #444',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    minWidth: '240px'
});

statusOverlay.innerHTML = \`
    <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #444; padding-bottom: 4px;">Ready to Interact</div>
    <div style="display: grid; grid-template-columns: 80px 1fr; gap: 4px;">
        <div style="color: #888;">Canvas:</div><div id="canvas-pos">-</div>
        <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">World:</div><div id="world-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
        <div style="color: #888;">Local:</div><div id="local-pos">-</div>
        <div style="color: #888; border-top: 1px solid #222; padding-top: 4px;">UV:</div><div id="uv-pos" style="border-top: 1px solid #222; padding-top: 4px;">-</div>
        <div style="color: #888;">Distance:</div><div id="distance">-</div>
        <div style="color: #888;">FaceIdx:</div><div id="face-index">-</div>
    </div>
\`;
document.body.appendChild(statusOverlay);

const typeEl = statusOverlay.querySelector('#event-type');
const updateUI = (e) => {
    typeEl.innerText = \`Event: \${e.type.toUpperCase()}\`;
 
    statusOverlay.querySelector('#world-pos').innerText = \`\${e.point[0].toFixed(2)}, \${e.point[1].toFixed(2)}, \${e.point[2].toFixed(2)}\`;
    statusOverlay.querySelector('#local-pos').innerText = \`\${e.localPoint[0].toFixed(2)}, \${e.localPoint[1].toFixed(2)}, \${e.localPoint[2].toFixed(2)}\`;
    statusOverlay.querySelector('#uv-pos').innerText = \`\${e.uv[0].toFixed(3)}, \${e.uv[1].toFixed(3)}\`;
    statusOverlay.querySelector('#distance').innerText = e.distance.toFixed(3);
    statusOverlay.querySelector('#face-index').innerText = e.faceIndex;
};

// 3. 이벤트 리스너 등록

// [CLICK] 클릭 시 랜덤 색상 변경 및 회전
mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    e.target.material.color.setColorByRGB(r, g, b);
    
    
    updateUI(e);
    typeEl.style.color = '#ffcc00';
});

// [DOWN] 마우스 버튼을 눌렀을 때
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    updateUI(e);
    typeEl.style.color = '#ff4444';
});

// [MOVE] 객체 위에서 마우스 이동 시 좌표 표시
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    updateUI(e);
});

// [OVER] 마우스 오버 시
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    updateUI(e);
    typeEl.style.color = '#00CC99';
});

// [OUT] 마우스 아웃 시
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    updateUI(e); // 마우스 아웃 시 UI 업데이트 (대시 표시)
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
});

// 4. 카메라 및 뷰 설정
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. 렌더링 시작
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),s(`
`),t("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),e[2]||(e[2]=a("",18))])}const m=o(c,[["render",k]]);export{b as __pageData,m as default};
