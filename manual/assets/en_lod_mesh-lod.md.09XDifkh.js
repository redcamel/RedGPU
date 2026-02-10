import{f as r,D as a,o as d,c as p,a2 as o,G as n,w as t,k as e,a as s}from"./chunks/framework.DZW1bhNM.js";const x=JSON.parse('{"title":"Mesh LOD","description":"","frontmatter":{"title":"Mesh LOD","order":2},"headers":[],"relativePath":"en/lod/mesh-lod.md","filePath":"en/lod/mesh-lod.md","lastUpdated":1770698112000}'),k={name:"en/lod/mesh-lod.md"};function c(g,i,E,m,y,u){const l=a("CodePen"),h=a("ClientOnly");return d(),p("div",null,[i[1]||(i[1]=o(`<h1 id="mesh-lod" tabindex="-1">Mesh LOD <a class="header-anchor" href="#mesh-lod" aria-label="Permalink to &quot;Mesh LOD&quot;">​</a></h1><p>This section covers how to apply LOD to general <strong>Mesh</strong> objects. LOD for a <code>Mesh</code> works by calculating the distance from the camera on the CPU every frame and swapping to the <strong>Geometry</strong> that meets the specified distance condition.</p><h2 id="_1-how-it-works" tabindex="-1">1. How it Works <a class="header-anchor" href="#_1-how-it-works" aria-label="Permalink to &quot;1. How it Works&quot;">​</a></h2><p>The <code>LODManager</code> within the <code>Mesh</code> iterates through the registered LOD levels and finds the level with the largest distance value that is less than or equal to the current camera distance. When a suitable level is found, the rendering target is swapped to the geometry registered at that level.</p><h2 id="_2-usage" tabindex="-1">2. Usage <a class="header-anchor" href="#_2-usage" aria-label="Permalink to &quot;2. Usage&quot;">​</a></h2><p>Use <code>mesh.LODManager.addLOD(distance, geometry)</code> to register geometry by distance.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Create Base Mesh (Distance 0~10)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mesh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Mesh</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    material</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Add LOD Levels</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Distance 10 or more: Sphere (16x16)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Distance 20 or more: Box</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(mesh);</span></span></code></pre></div><h2 id="_3-live-example" tabindex="-1">3. Live Example <a class="header-anchor" href="#_3-live-example" aria-label="Permalink to &quot;3. Live Example&quot;">​</a></h2><p>Observe how the sphere shape becomes simpler and eventually turns into a box as the distance from the camera increases.</p>`,9)),n(h,null,{default:t(()=>[n(l,{title:"RedGPU - Mesh LOD Example",slugHash:"lod-mesh-basic"},{default:t(()=>[...i[0]||(i[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. Setup Material and Texture
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

// 2. Create Base Mesh (Distance 0 ~ 10)
// High Detail: Sphere (radius 2, segments 32x32)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32),
    material
);
scene.addChild(mesh);

// 3. Add LOD Levels
// Level 1: Distance 10 or more (Mid Detail - Sphere 2, 8x8)
mesh.LODManager.addLOD(10, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// Level 2: Distance 20 or more (Low Detail - Box 3x3x3)
mesh.LODManager.addLOD(20, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 4. Status Display UI
const label = document.createElement('div');
Object.assign(label.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    color: 'white', background: 'rgba(0,0,0,0.7)', padding: '10px 20px', borderRadius: '8px',
    fontFamily: 'monospace', fontSize: '16px', textAlign: 'center'
});
document.body.appendChild(label);

// 5. Camera Settings
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
controller.speedDistance = 0.5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 6. Render Loop
const renderer = new RedGPU.Renderer(redGPUContext);
const render = () => {
    // Calculate distance and update UI (for visual confirmation)
    const dist = Math.sqrt(
        Math.pow(view.camera.x - mesh.x, 2) +
        Math.pow(view.camera.y - mesh.y, 2) +
        Math.pow(view.camera.z - mesh.z, 2)
    );
    
    let currentLevel = "High (Sphere 32)";
    if (dist >= 20) currentLevel = "Low (Box)";
    else if (dist >= 10) currentLevel = "Mid (Sphere 8)";

    label.innerHTML = \`Distance: \${dist.toFixed(1)}m <br/> Geometry: \${currentLevel}\`;
};

renderer.start(redGPUContext, render);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1})])}const D=r(k,[["render",c]]);export{x as __pageData,D as default};
