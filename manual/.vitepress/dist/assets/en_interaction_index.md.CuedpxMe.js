import{f as d,D as i,o as c,c as h,a2 as a,G as n,w as l,k as e,a as s}from"./chunks/framework.DZW1bhNM.js";const x=JSON.parse('{"title":"Interaction","description":"","frontmatter":{"title":"Interaction","order":8},"headers":[],"relativePath":"en/interaction/index.md","filePath":"en/interaction/index.md","lastUpdated":1770698112000}'),p={name:"en/interaction/index.md"};function k(g,t,y,E,u,m){const o=i("CodePen"),r=i("ClientOnly");return c(),h("div",null,[t[1]||(t[1]=a(`<h1 id="interaction" tabindex="-1">Interaction <a class="header-anchor" href="#interaction" aria-label="Permalink to &quot;Interaction&quot;">​</a></h1><p>RedGPU provides an intuitive <strong>Picking</strong> system that handles mouse and touch events for both 3D and 2D objects, as well as a <strong>Keyboard Buffer</strong> (<code>keyboardKeyBuffer</code>) feature that manages keyboard states in real-time. This allows you to easily handle various user inputs, from simple mouse clicks to complex character controls.</p><h2 id="_1-mouse-and-touch-interaction-picking" tabindex="-1">1. Mouse and Touch Interaction (Picking) <a class="header-anchor" href="#_1-mouse-and-touch-interaction-picking" aria-label="Permalink to &quot;1. Mouse and Touch Interaction (Picking)&quot;">​</a></h2><p>RedGPU&#39;s picking system enables user input reception and reaction for most display objects, such as <code>Mesh</code>, <code>Sprite3D</code>, and <code>Sprite2D</code>.</p><h3 id="_1-1-registering-event-listeners" tabindex="-1">1.1 Registering Event Listeners <a class="header-anchor" href="#_1-1-registering-event-listeners" aria-label="Permalink to &quot;1.1 Registering Event Listeners&quot;">​</a></h3><p>To register events on an object, use the <code>addListener</code> method. When an event occurs, the registered callback function is executed, and an event information object (<code>e</code>) is passed to it.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Reference event type constants</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Picking;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">PICKING_EVENT_TYPE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">CLICK</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">e</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Clicked object:&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, e.target);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Rotate upon click</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    e.target.rotationY </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 45</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="_1-2-supported-event-types" tabindex="-1">1.2 Supported Event Types <a class="header-anchor" href="#_1-2-supported-event-types" aria-label="Permalink to &quot;1.2 Supported Event Types&quot;">​</a></h3><p>The system supports the 6 basic events defined in <code>RedGPU.Picking.PICKING_EVENT_TYPE</code>.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Event Constant</th><th style="text-align:left;">String Value</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>CLICK</code></strong></td><td style="text-align:left;"><code>&#39;click&#39;</code></td><td style="text-align:left;">Occurs on a mouse click or touch tap</td></tr><tr><td style="text-align:left;"><strong><code>DOWN</code></strong></td><td style="text-align:left;"><code>&#39;down&#39;</code></td><td style="text-align:left;">Occurs when a mouse button is pressed or touch starts</td></tr><tr><td style="text-align:left;"><strong><code>UP</code></strong></td><td style="text-align:left;"><code>&#39;up&#39;</code></td><td style="text-align:left;">Occurs when a mouse button is released or touch ends</td></tr><tr><td style="text-align:left;"><strong><code>OVER</code></strong></td><td style="text-align:left;"><code>&#39;over&#39;</code></td><td style="text-align:left;">Occurs when the mouse cursor enters the object&#39;s area (Hover In)</td></tr><tr><td style="text-align:left;"><strong><code>OUT</code></strong></td><td style="text-align:left;"><code>&#39;out&#39;</code></td><td style="text-align:left;">Occurs when the mouse cursor leaves the object&#39;s area (Hover Out)</td></tr><tr><td style="text-align:left;"><strong><code>MOVE</code></strong></td><td style="text-align:left;"><code>&#39;move&#39;</code></td><td style="text-align:left;">Occurs continuously as the mouse pointer moves over the object</td></tr></tbody></table><h3 id="_1-3-detailed-event-information-pickingevent" tabindex="-1">1.3 Detailed Event Information (PickingEvent) <a class="header-anchor" href="#_1-3-detailed-event-information-pickingevent" aria-label="Permalink to &quot;1.3 Detailed Event Information (PickingEvent)&quot;">​</a></h3><p>The object (<code>e</code>) passed to the event callback contains various pieces of information about the event at the moment it occurred. This allows for the implementation of precise interaction logic.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Property Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>target</code></strong></td><td style="text-align:left;"><code>Mesh</code></td><td style="text-align:left;">The target object where the event occurred.</td></tr><tr><td style="text-align:left;"><strong><code>type</code></strong></td><td style="text-align:left;"><code>string</code></td><td style="text-align:left;">The type of the event that occurred.</td></tr><tr><td style="text-align:left;"><strong><code>pickingId</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">A unique ID used for picking.</td></tr><tr><td style="text-align:left;"><strong><code>mouseX</code></strong>, <strong><code>mouseY</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">Mouse or touch coordinates within the canvas.</td></tr><tr><td style="text-align:left;"><strong><code>movementX</code></strong>, <strong><code>movementY</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">The amount of mouse movement compared to the previous event.</td></tr><tr><td style="text-align:left;"><strong><code>point</code></strong></td><td style="text-align:left;"><code>vec3</code></td><td style="text-align:left;">Precise intersection point coordinates in world space.</td></tr><tr><td style="text-align:left;"><strong><code>localPoint</code></strong></td><td style="text-align:left;"><code>vec3</code></td><td style="text-align:left;">Intersection point coordinates in the object&#39;s local space.</td></tr><tr><td style="text-align:left;"><strong><code>localX</code></strong>, <strong><code>localY</code></strong>, <strong><code>localZ</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">Individual coordinate values in local space.</td></tr><tr><td style="text-align:left;"><strong><code>uv</code></strong></td><td style="text-align:left;"><code>vec2</code></td><td style="text-align:left;">Texture coordinates (UV) at the intersection point.</td></tr><tr><td style="text-align:left;"><strong><code>distance</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">The distance between the camera and the intersection point.</td></tr><tr><td style="text-align:left;"><strong><code>faceIndex</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">The index of the intersected triangle (polygon). (-1 if not available)</td></tr><tr><td style="text-align:left;"><strong><code>time</code></strong></td><td style="text-align:left;"><code>number</code></td><td style="text-align:left;">The time when the event occurred (in ms).</td></tr><tr><td style="text-align:left;"><strong><code>altKey</code></strong>, <strong><code>ctrlKey</code></strong>, <strong><code>shiftKey</code></strong></td><td style="text-align:left;"><code>boolean</code></td><td style="text-align:left;">The state of modifier keys at the time of the event.</td></tr></tbody></table><h3 id="_1-4-practical-example-interactive-cube" tabindex="-1">1.4 Practical Example: Interactive Cube <a class="header-anchor" href="#_1-4-practical-example-interactive-cube" aria-label="Permalink to &quot;1.4 Practical Example: Interactive Cube&quot;">​</a></h3><p>This is an interactive example where the size changes on mouse-over, the color changes upon clicking, and coordinates can be checked while moving the mouse.</p>`,15)),n(r,null,{default:l(()=>[n(o,{title:"RedGPU - Interaction Example",slugHash:"interaction-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a(`<h2 id="_2-keyboard-interaction-keyboardkeybuffer" tabindex="-1">2. Keyboard Interaction (keyboardKeyBuffer) <a class="header-anchor" href="#_2-keyboard-interaction-keyboardkeybuffer" aria-label="Permalink to &quot;2. Keyboard Interaction (keyboardKeyBuffer)&quot;">​</a></h2><p>In addition to object picking, you can check the real-time state of the keyboard via <code>redGPUContext.keyboardKeyBuffer</code>. This is very useful for logic that needs to check key states every frame, such as for character movement or camera control.</p><h3 id="_2-1-basic-usage" tabindex="-1">2.1 Basic Usage <a class="header-anchor" href="#_2-1-basic-usage" aria-label="Permalink to &quot;2.1 Basic Usage&quot;">​</a></h3><p><code>keyboardKeyBuffer</code> is an object that uses the name of the currently pressed key as its key and its pressed state as its value.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(canvas, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Check state within the render loop</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> render</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">time</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">keyboardKeyBuffer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> redGPUContext;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;w&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">||</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;W&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Moving forward...&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (keyboardKeyBuffer[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39; &#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Jump!&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> renderer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Renderer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    renderer.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, render);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="_2-2-key-features" tabindex="-1">2.2 Key Features <a class="header-anchor" href="#_2-2-key-features" aria-label="Permalink to &quot;2.2 Key Features&quot;">​</a></h3><ul><li><strong>Real-time State Management</strong>: Integrated management is provided within <code>redGPUContext</code>, eliminating the need to directly manage separate <code>keydown</code> and <code>keyup</code> listeners.</li><li><strong>Case Sensitivity</strong>: Since it uses the <code>e.key</code> value directly, it is case-sensitive. For universal input, it is recommended to check both <code>&#39;w&#39;</code> and <code>&#39;W&#39;</code>.</li><li><strong>Modifier Key Support</strong>: The state of special keys such as <code>Shift</code>, <code>Control</code>, and <code>Alt</code> can be checked in the same way.</li></ul><h2 id="_3-live-examples" tabindex="-1">3. Live Examples <a class="header-anchor" href="#_3-live-examples" aria-label="Permalink to &quot;3. Live Examples&quot;">​</a></h2><p>You can directly explore various interaction behaviors provided by RedGPU through the examples below.</p><h3 id="_3-1-mouse-and-touch-examples" tabindex="-1">3.1 Mouse and Touch Examples <a class="header-anchor" href="#_3-1-mouse-and-touch-examples" aria-label="Permalink to &quot;3.1 Mouse and Touch Examples&quot;">​</a></h3><ul><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/mesh/" target="_blank" rel="noreferrer">Basic Mesh Interaction</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/sprite3D/" target="_blank" rel="noreferrer">Sprite Interaction</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/textField3D/" target="_blank" rel="noreferrer">Text Field Interaction</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/" target="_blank" rel="noreferrer">High-Precision Raycasting (Raycasting)</a></li></ul><h3 id="_3-2-keyboard-interaction-examples" tabindex="-1">3.2 Keyboard Interaction Examples <a class="header-anchor" href="#_3-2-keyboard-interaction-examples" aria-label="Permalink to &quot;3.2 Keyboard Interaction Examples&quot;">​</a></h3><ul><li><a href="https://redcamel.github.io/RedGPU/examples/3d/interaction/keyboardEvent/" target="_blank" rel="noreferrer">Keyboard Interaction 3D Example</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/2d/interaction/keyboardEvent/" target="_blank" rel="noreferrer">Keyboard Interaction 2D Example</a></li><li><a href="https://redcamel.github.io/RedGPU/examples/3d/controller/characterController/" target="_blank" rel="noreferrer">Character Controller (WASD)</a></li></ul><h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li>Independent event processing for each object is possible through <code>addListener</code>.</li><li>Precise, frame-by-frame keyboard state control is possible through <code>keyboardKeyBuffer</code>.</li><li>A rich user experience (UX) can be provided by using these alongside the web-standard DOM API.</li></ul><h2 id="next-learning-recommendation" tabindex="-1">Next Learning Recommendation <a class="header-anchor" href="#next-learning-recommendation" aria-label="Permalink to &quot;Next Learning Recommendation&quot;">​</a></h2><p>Apply post-processing effects that enhance the visual completion of scenes enriched with interaction.</p><ul><li><strong><a href="./../post-effect/">Post-Effect</a></strong></li></ul>`,18))])}const b=d(p,[["render",k]]);export{x as __pageData,b as default};
