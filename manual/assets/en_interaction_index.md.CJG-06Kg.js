import{f as d,D as s,c,o as h,a2 as a,H as i,w as o,k as e,a as n}from"./chunks/framework.cYGcyyTy.js";const x=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"en/interaction/index.md","filePath":"en/interaction/index.md","lastUpdated":1769498891000}'),p={name:"en/interaction/index.md"};function g(E,t,k,u,y,m){const r=s("CodePen"),l=s("ClientOnly");return h(),c("div",null,[t[1]||(t[1]=a(`<h1 id="interaction" tabindex="-1">Interaction <a class="header-anchor" href="#interaction" aria-label="Permalink to &quot;Interaction&quot;">​</a></h1><p>RedGPU provides an intuitive <strong>Picking</strong> system that handles mouse and touch events for 3D and 2D objects. Most display objects such as <code>Mesh</code>, <code>Sprite3D</code>, and <code>Sprite2D</code> can receive and react to user input.</p><h2 id="_1-registering-event-listeners" tabindex="-1">1. Registering Event Listeners <a class="header-anchor" href="#_1-registering-event-listeners" aria-label="Permalink to &quot;1. Registering Event Listeners&quot;">​</a></h2><p>Use the <code>addListener</code> method to register events on an object. When an event occurs, the registered callback function is executed, and an event information object (<code>e</code>) is passed.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Reference event type constant</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Picking;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CLICK</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Clicked object:&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, e.target);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Rotate upon click</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    e.target.rotationY </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 45</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h2 id="_2-supported-event-types" tabindex="-1">2. Supported Event Types <a class="header-anchor" href="#_2-supported-event-types" aria-label="Permalink to &quot;2. Supported Event Types&quot;">​</a></h2><p>The system supports 6 basic events defined in <code>RedGPU.Picking.PICKING_EVENT_TYPE</code>.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Event Constant</th><th style="text-align:left;">String Value</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>CLICK</code></strong></td><td style="text-align:left;"><code>&#39;click&#39;</code></td><td style="text-align:left;">Occurs upon mouse click or touch tap</td></tr><tr><td style="text-align:left;"><strong><code>DOWN</code></strong></td><td style="text-align:left;"><code>&#39;down&#39;</code></td><td style="text-align:left;">Occurs upon mouse button press or touch start</td></tr><tr><td style="text-align:left;"><strong><code>UP</code></strong></td><td style="text-align:left;"><code>&#39;up&#39;</code></td><td style="text-align:left;">Occurs upon mouse button release or touch end</td></tr><tr><td style="text-align:left;"><strong><code>OVER</code></strong></td><td style="text-align:left;"><code>&#39;over&#39;</code></td><td style="text-align:left;">Occurs when the mouse cursor enters over the object (Hover In)</td></tr><tr><td style="text-align:left;"><strong><code>OUT</code></strong></td><td style="text-align:left;"><code>&#39;out&#39;</code></td><td style="text-align:left;">Occurs when the mouse cursor leaves the object (Hover Out)</td></tr><tr><td style="text-align:left;"><strong><code>MOVE</code></strong></td><td style="text-align:left;"><code>&#39;move&#39;</code></td><td style="text-align:left;">Occurs continuously while the mouse pointer moves over the object</td></tr></tbody></table><h2 id="_3-practical-example-interactive-cube" tabindex="-1">3. Practical Example: Interactive Cube <a class="header-anchor" href="#_3-practical-example-interactive-cube" aria-label="Permalink to &quot;3. Practical Example: Interactive Cube&quot;">​</a></h2><p>This is an interactive example where the size changes on mouse over, the color changes upon clicking, and coordinates can be checked during movement.</p>`,10)),i(l,null,{default:o(()=>[i(r,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:o(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a('<h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li>Independent event processing per object is possible through <code>addListener</code>.</li><li>You can directly access the object that triggered the event via <code>e.target</code>.</li><li>UX can be enhanced by using it along with web standard DOM APIs such as mouse cursor style changes (<code>document.body.style.cursor</code>).</li></ul><h2 id="next-learning-recommendation" tabindex="-1">Next Learning Recommendation <a class="header-anchor" href="#next-learning-recommendation" aria-label="Permalink to &quot;Next Learning Recommendation&quot;">​</a></h2><p>Apply post-processing effects that enhance the visual completion of scenes enriched with interaction.</p><ul><li><strong><a href="./../post-effect/">Post-Effect</a></strong></li></ul>',5))])}const C=d(p,[["render",g]]);export{x as __pageData,C as default};
