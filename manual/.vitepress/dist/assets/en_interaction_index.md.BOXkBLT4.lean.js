import{f as d,D as s,o as c,c as h,a2 as a,G as i,w as o,k as e,a as n}from"./chunks/framework.Dn9yU8Jh.js";const x=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"en/interaction/index.md","filePath":"en/interaction/index.md","lastUpdated":1769512249000}'),p={name:"en/interaction/index.md"};function g(E,t,k,u,y,m){const r=s("CodePen"),l=s("ClientOnly");return c(),h("div",null,[t[1]||(t[1]=a("",10)),i(l,null,{default:o(()=>[i(r,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:o(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),n(`
`),e("pre",null,[e("code",null,`// 1. Create basic cube
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. Create HTML UI for status display (bottom center)
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

// Create two-line structure
statusOverlay.innerHTML = \`
    <div id="event-type" style="color: #00CC99; font-weight: bold; margin-bottom: 4px;">Ready to Interact</div>
    <div id="event-detail" style="font-size: 14px; color: #aaa;">Move or Click the Cube</div>
\`;
document.body.appendChild(statusOverlay);

const typeEl = statusOverlay.querySelector('#event-type');
const detailEl = statusOverlay.querySelector('#event-detail');

// 3. Register event listeners

// [CLICK] Random color change and rotation on click
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

// [DOWN] When mouse button is pressed
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    typeEl.innerText = 'Event: MOUSE_DOWN';
    typeEl.style.color = '#ff4444';
});

// [MOVE] Display coordinates when moving mouse over the object
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    detailEl.innerText = \`MOUSE_MOVE at (\${e.mouseX.toFixed(2)}, \${e.mouseY.toFixed(2)})\`;
});

// [OVER] On mouse over
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    typeEl.innerText = 'Event: MOUSE_OVER';
    typeEl.style.color = '#00CC99';
});

// [OUT] On mouse out
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
    detailEl.innerText = 'Move or Click the Cube';
});

// 4. Camera and View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. Start Rendering
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",5))])}const C=d(p,[["render",g]]);export{x as __pageData,C as default};
