import{f as d,D as i,o as c,c as h,a2 as a,G as n,w as l,k as e,a as s}from"./chunks/framework.DpNgdNqH.js";const x=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"en/interaction/index.md","filePath":"en/interaction/index.md","lastUpdated":1770625747000}'),p={name:"en/interaction/index.md"};function k(g,t,y,E,u,m){const o=i("CodePen"),r=i("ClientOnly");return c(),h("div",null,[t[1]||(t[1]=a("",15)),n(r,null,{default:l(()=>[n(o,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const { PICKING_EVENT_TYPE } = RedGPU.Picking;`),s(`
`),e("pre",null,[e("code",null,`// 1. Create a basic cube
const geometry = new RedGPU.Primitive.Box(redGPUContext);
const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
scene.addChild(mesh);

// 4. Create an HTML UI for status display (bottom left)
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

// 3. Register event listeners

// [CLICK] Change to a random color and rotate on click
mesh.addListener(PICKING_EVENT_TYPE.CLICK, (e) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    e.target.material.color.setColorByRGB(r, g, b);
    
    updateUI(e);
    typeEl.style.color = '#ffcc00';
});

// [DOWN] When the mouse button is pressed
mesh.addListener(PICKING_EVENT_TYPE.DOWN, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 0.9;
    updateUI(e);
    typeEl.style.color = '#ff4444';
});

// [MOVE] Display coordinates when moving the mouse over the object
mesh.addListener(PICKING_EVENT_TYPE.MOVE, (e) => {
    updateUI(e);
});

// [OVER] On mouse-over
mesh.addListener(PICKING_EVENT_TYPE.OVER, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.2;
    document.body.style.cursor = 'pointer';
    updateUI(e);
    typeEl.style.color = '#00CC99';
});

// [OUT] On mouse-out
mesh.addListener(PICKING_EVENT_TYPE.OUT, (e) => {
    e.target.scaleX = e.target.scaleY = e.target.scaleZ = 1.0;
    document.body.style.cursor = 'default';
    updateUI(e); // Update UI on mouse-out (show dashes)
    typeEl.innerText = 'Event: MOUSE_OUT';
    typeEl.style.color = '#ffffff';
});

// 4. Camera and View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 5;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. Start Rendering
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a("",18))])}const b=d(p,[["render",k]]);export{x as __pageData,b as default};
