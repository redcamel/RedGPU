import{f as d,D as t,o as c,c as h,a2 as i,G as s,w as r,k as e,a}from"./chunks/framework.DpNgdNqH.js";const C=JSON.parse('{"title":"FXAA","description":"","frontmatter":{"title":"FXAA","order":3},"headers":[],"relativePath":"en/antialiasing/fxaa.md","filePath":"en/antialiasing/fxaa.md","lastUpdated":1769587164000}'),g={name:"en/antialiasing/fxaa.md"};function p(u,n,x,m,A,b){const o=t("CodePen"),l=t("ClientOnly");return c(),h("div",null,[n[1]||(n[1]=i(`<h1 id="fxaa-fast-approximate-aa" tabindex="-1">FXAA (Fast Approximate AA) <a class="header-anchor" href="#fxaa-fast-approximate-aa" aria-label="Permalink to &quot;FXAA (Fast Approximate AA)&quot;">​</a></h1><p><strong>FXAA</strong> is a <strong>Post-Processing</strong> antialiasing technique that analyzes the rendered image to find edges and blur them.</p><h2 id="_1-features-pros" tabindex="-1">1. Features &amp; Pros <a class="header-anchor" href="#_1-features-pros" aria-label="Permalink to &quot;1. Features &amp; Pros&quot;">​</a></h2><ul><li><strong>Super Fast</strong>: Very low computational cost, suitable for mobile devices.</li><li><strong>Memory Efficient</strong>: Does not require additional buffers like MSAA.</li><li><strong>Cons</strong>: The entire screen may become slightly blurry, reducing texture sharpness.</li></ul><h2 id="_2-usage" tabindex="-1">2. Usage <a class="header-anchor" href="#_2-usage" aria-label="Permalink to &quot;2. Usage&quot;">​</a></h2><p>Enabled via <code>antialiasingManager.useFXAA</code>. Enabling this automatically disables MSAA or TAA.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Enable FXAA (Other AAs are disabled)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.antialiasingManager.useFXAA </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="_3-live-example-fxaa-quality-check" tabindex="-1">3. Live Example: FXAA Quality Check <a class="header-anchor" href="#_3-live-example-fxaa-quality-check" aria-label="Permalink to &quot;3. Live Example: FXAA Quality Check&quot;">​</a></h2><p>Check how FXAA handles edges, textures, and highlights. (Edges are smoothed, but texture details may be slightly blurred.)</p>`,9)),s(l,null,{default:r(()=>[s(o,{title:"RedGPU - FXAA Example",slugHash:"antialiasing-fxaa"},{default:r(()=>[...n[0]||(n[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
light.x = 10; light.y = 10; light.z = 10;
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.3;
scene.lightManager.ambientLight = ambientLight;

// 1. Fine grid floor (To check pattern aliasing)
const grid = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 100, 100, 50, 50),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#999999')
);
grid.drawMode = 'lines';
scene.addChild(grid);

// 2. Wireframe Sphere (To check geometry edges)
const sphere = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 5, 32, 32),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00aaff')
);
sphere.y = 5;
sphere.x = -6;
sphere.drawMode = 'lines';
scene.addChild(sphere);

// 3. Texture Box (To check texture sharpness)
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const boxMaterial = new RedGPU.Material.PhongMaterial(redGPUContext);
boxMaterial.diffuseTexture = texture;

const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 6, 6, 6),
    boxMaterial
);
box.y = 5;
box.x = 6;
scene.addChild(box);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 25;
controller.tilt = -15;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// Initial state: FXAA Enabled
redGPUContext.antialiasingManager.useFXAA = true;

// UI: FXAA Toggle
const btn = document.createElement('button');
btn.textContent = 'FXAA: ON';
Object.assign(btn.style, {
    position: 'fixed', top: '20px', left: '20px',
    padding: '10px 20px', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', background: '#00CC99', border: 'none', borderRadius: '8px'
});
btn.onclick = () => {
    const manager = redGPUContext.antialiasingManager;
    if (manager.useFXAA) {
         manager.useFXAA = false;
    } else {
         manager.useFXAA = true;
    }
    
    btn.textContent = \`FXAA: \${manager.useFXAA ? 'ON' : 'OFF (None)'}\`;
    btn.style.background = manager.useFXAA ? '#00CC99' : '#ccc';
};
document.body.appendChild(btn);

const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    sphere.rotationY += 0.01;
    box.rotationY += 0.01;
});
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=i('<h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li><strong>Post-Processing</strong>: Works on top of the rendered image.</li><li><strong>Exclusive</strong>: Enabling FXAA disables MSAA and TAA.</li><li><strong>Global Control</strong>: Controlled via <code>redGPUContext</code>.</li></ul>',2))])}const f=d(g,[["render",p]]);export{C as __pageData,f as default};
