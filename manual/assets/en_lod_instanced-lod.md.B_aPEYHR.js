import{f as r,D as e,o as d,c as p,a2 as o,G as a,w as t,k as s,a as i}from"./chunks/framework.Dn9yU8Jh.js";const P=JSON.parse('{"title":"Instancing Mesh LOD","description":"","frontmatter":{"title":"Instancing Mesh LOD","order":3},"headers":[],"relativePath":"en/lod/instanced-lod.md","filePath":"en/lod/instanced-lod.md","lastUpdated":1769586579000}'),k={name:"en/lod/instanced-lod.md"};function c(g,n,E,m,y,u){const l=e("CodePen"),h=e("ClientOnly");return d(),p("div",null,[n[1]||(n[1]=o(`<h1 id="instancing-mesh-lod" tabindex="-1">Instancing Mesh LOD <a class="header-anchor" href="#instancing-mesh-lod" aria-label="Permalink to &quot;Instancing Mesh LOD&quot;">​</a></h1><p>This section covers how to apply LOD to <strong>Instancing Mesh</strong>, which renders massive amounts of objects. LOD for <code>InstancingMesh</code> calculates the distance for each instance in parallel inside the <strong>GPU Shader</strong>, so there is almost no CPU overhead even when applying LOD to tens of thousands of objects.</p><h2 id="_1-how-it-works" tabindex="-1">1. How it Works <a class="header-anchor" href="#_1-how-it-works" aria-label="Permalink to &quot;1. How it Works&quot;">​</a></h2><p>When LOD is registered to an <code>InstancingMesh</code>, <strong>Sub Draw Calls</strong> equal to the number of LODs may be created internally. However, through rendering pipeline optimization, the GPU determines the camera distance of each instance and references the appropriate geometry buffer for drawing.</p><h2 id="_2-usage" tabindex="-1">2. Usage <a class="header-anchor" href="#_2-usage" aria-label="Permalink to &quot;2. Usage&quot;">​</a></h2><p>Use <code>LODManager.addLOD</code> just like a regular <code>Mesh</code>.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Create InstancingMesh (Base: Sphere High Poly)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> instancedMesh</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">InstancingMesh</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    10000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    material</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Add LOD Levels</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// The GPU calculates the distance for each instance and applies the geometry below.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">instancedMesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">20</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sphere</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">instancedMesh.LODManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addLOD</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">40</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Primitive.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(instancedMesh);</span></span></code></pre></div><h2 id="_3-live-example-2-000-lod-cubes" tabindex="-1">3. Live Example: 2,000 LOD Cubes <a class="header-anchor" href="#_3-live-example-2-000-lod-cubes" aria-label="Permalink to &quot;3. Live Example: 2,000 LOD Cubes&quot;">​</a></h2><p>Observe how 2,000 objects change shape depending on their distance from the camera. If you zoom in/out, distant objects are displayed as <strong>Boxes</strong>, and close objects as <strong>Spheres</strong>.</p>`,9)),a(h,null,{default:t(()=>[a(l,{title:"RedGPU - Instancing LOD Example",slugHash:"lod-instancing"},{default:t(()=>[...n[0]||(n[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),s("pre",null,[s("code",null,`// Add Lights
const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ambientLight = new RedGPU.Light.AmbientLight();
ambientLight.intensity = 0.5;
scene.lightManager.ambientLight = ambientLight;

// 1. Create InstancingMesh
// Base(0~30): Sphere High (32x32)
const maxCount = 2000;
const geometry = new RedGPU.Primitive.Sphere(redGPUContext, 2, 32, 32);

const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.diffuseTexture = texture;

const mesh = new RedGPU.Display.InstancingMesh(
    redGPUContext,
    maxCount,
    maxCount,
    geometry,
    material
);
scene.addChild(mesh);

// 2. Add LOD Levels
// 30 or more: Sphere Low (8x8)
mesh.LODManager.addLOD(30, new RedGPU.Primitive.Sphere(redGPUContext, 2, 8, 8));

// 60 or more: Box
mesh.LODManager.addLOD(60, new RedGPU.Primitive.Box(redGPUContext, 3, 3, 3));

// 3. Random placement of instances
const range = 100;
for (let i = 0; i < maxCount; i++) {
    const instance = mesh.instanceChildren[i];
    instance.setPosition(
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range,
        Math.random() * range * 2 - range
    );
    instance.scale = Math.random() * 1.5 + 1.0;
}

// 4. Camera Settings
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 150;
controller.speedDistance = 5;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// 5. Render
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext, () => {
    // Full rotation
    mesh.rotationY += 0.002;
});
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),n[2]||(n[2]=s("h2",{id:"key-summary",tabindex:"-1"},[i("Key Summary "),s("a",{class:"header-anchor",href:"#key-summary","aria-label":'Permalink to "Key Summary"'},"​")],-1)),n[3]||(n[3]=s("ul",null,[s("li",null,[s("strong",null,"GPU Acceleration"),i(": Since the GPU determines the distance without CPU calculation, there is almost no performance degradation even with massive amounts of objects.")]),s("li",null,[s("strong",null,"Memory Saving"),i(": Using low-resolution models for distant objects dramatically reduces vertex processing costs.")])],-1))])}const F=r(k,[["render",c]]);export{P as __pageData,F as default};
