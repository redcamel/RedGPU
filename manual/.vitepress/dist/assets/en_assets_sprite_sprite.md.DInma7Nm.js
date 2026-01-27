import{f as o,D as a,o as d,c as h,a2 as i,G as n,w as l,k as e,a as s}from"./chunks/framework.Dn9yU8Jh.js";const x=JSON.parse('{"title":"Sprite3D","description":"","frontmatter":{"title":"Sprite3D","order":2},"headers":[],"relativePath":"en/assets/sprite/sprite.md","filePath":"en/assets/sprite/sprite.md","lastUpdated":1769513216000}'),c={name:"en/assets/sprite/sprite.md"};function k(g,t,y,u,m,b){const r=a("CodePen"),p=a("ClientOnly");return d(),h("div",null,[t[1]||(t[1]=i(`<h1 id="sprite3d" tabindex="-1">Sprite3D <a class="header-anchor" href="#sprite3d" aria-label="Permalink to &quot;Sprite3D&quot;">​</a></h1><p><strong>Sprite3D</strong> is a 2D plane object placed within 3D space. Unlike general meshes, it has a built-in <strong>Billboard</strong> feature, making it optimized for implementing elements that must always face the front regardless of the camera&#39;s rotation (icons, name tags, special effects, etc.).</p><h2 id="_1-key-features" tabindex="-1">1. Key Features <a class="header-anchor" href="#_1-key-features" aria-label="Permalink to &quot;1. Key Features&quot;">​</a></h2><ul><li><strong>Billboard</strong>: Supports the function to always face the camera by default.</li><li><strong>Automatic Aspect Ratio</strong>: Automatically calculates the aspect ratio of the assigned texture to adjust the size of the plane.</li><li><strong>UI Friendly</strong>: Combines position in 3D space (World Position) with 2D expression methods to provide UI elements with a sense of space.</li></ul><h2 id="_2-basic-usage" tabindex="-1">2. Basic Usage <a class="header-anchor" href="#_2-basic-usage" aria-label="Permalink to &quot;2. Basic Usage&quot;">​</a></h2><p><code>Sprite3D</code> internally uses <strong>Plane</strong> geometry and is used with <strong>BitmapMaterial</strong> to output images.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Create Texture and Material</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> texture</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BitmapTexture</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> material</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Material.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">BitmapMaterial</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, texture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Create and Add Sprite</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sprite</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Sprite3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, material);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(sprite);</span></span></code></pre></div><h2 id="_3-key-property-control" tabindex="-1">3. Key Property Control <a class="header-anchor" href="#_3-key-property-control" aria-label="Permalink to &quot;3. Key Property Control&quot;">​</a></h2><p>Key properties controlling the sprite&#39;s billboard behavior and visual representation.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Property Name</th><th style="text-align:left;">Description</th><th style="text-align:left;">Default Value</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>useBillboard</code></strong></td><td style="text-align:left;">Whether to always face the camera</td><td style="text-align:left;"><code>true</code></td></tr><tr><td style="text-align:left;"><strong><code>useBillboardPerspective</code></strong></td><td style="text-align:left;">Whether to apply perspective (size change) based on distance from the camera</td><td style="text-align:left;"><code>true</code></td></tr></tbody></table><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Set icon style where size remains constant regardless of distance</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sprite.useBillboard </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sprite.useBillboardPerspective </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="_4-practical-example-comparison-by-billboard-type" tabindex="-1">4. Practical Example: Comparison by Billboard Type <a class="header-anchor" href="#_4-practical-example-comparison-by-billboard-type" aria-label="Permalink to &quot;4. Practical Example: Comparison by Billboard Type&quot;">​</a></h2><p>Let&#39;s place sprites with three different settings in 3D space to check the visual differences according to billboard options.</p>`,13)),n(p,null,{default:l(()=>[n(r,{title:"RedGPU - Sprite3D Billboard Showcase",slugHash:"sprite3d-showcase"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// Create shared material
const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/texture/crate.png');
const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

// 1. Basic Billboard (Perspective ON)
const sprite1 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite1.x = -3; sprite1.y = 1;
scene.addChild(sprite1);

// 2. Disable Billboard (Plane fixed in space)
const sprite2 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite2.x = 0; sprite2.y = 1;
sprite2.useBillboard = false;
scene.addChild(sprite2);

// 3. Fixed Size Billboard (Perspective OFF)
const sprite3 = new RedGPU.Display.Sprite3D(redGPUContext, material);
sprite3.x = 3; sprite3.y = 1;
sprite3.useBillboardPerspective = false;
scene.addChild(sprite3);

// 4. Option Description Label (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true; // Labels always face front
    scene.addChild(label);
};

createLabel('Billboard ON', -3, 2.2);
createLabel('Billboard OFF', 0, 2.2);
createLabel('Perspective OFF', 3, 2.2);

// 3D View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer(redGPUContext);
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=i('<hr><h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li><strong>Sprite3D</strong> provides a <strong>Billboard</strong> feature that faces the camera head-on while having a 3D coordinate system.</li><li>You can implement UI-style elements that appear at a constant size regardless of distance via the <code>useBillboardPerspective</code> property.</li><li>Geometry size is automatically adjusted according to the resolution and ratio of the texture, making it convenient to use.</li></ul><hr><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Learn about animation effects using sprites.</p><ul><li><strong><a href="./../sprite/spritesheet.html">SpriteSheet3D</a></strong></li></ul>',7))])}const E=o(c,[["render",k]]);export{x as __pageData,E as default};
