import{f as p,D as i,o,c as d,a2 as a,G as n,w as l,k as e,a as s}from"./chunks/framework.DpNgdNqH.js";const E=JSON.parse('{"title":"SpriteSheet3D","description":"","frontmatter":{"title":"SpriteSheet3D","order":3},"headers":[],"relativePath":"en/assets/sprite/spritesheet.md","filePath":"en/assets/sprite/spritesheet.md","lastUpdated":1770637469000}'),c={name:"en/assets/sprite/spritesheet.md"};function k(g,t,y,m,S,u){const r=i("CodePen"),h=i("ClientOnly");return o(),d("div",null,[t[1]||(t[1]=a(`<h1 id="spritesheet3d" tabindex="-1">SpriteSheet3D <a class="header-anchor" href="#spritesheet3d" aria-label="Permalink to &quot;SpriteSheet3D&quot;">​</a></h1><p><strong>SpriteSheet3D</strong> is an object that implements continuous motion in 3D space using a <strong>Sprite Sheet</strong> containing multiple animation frames in a single image. It is useful when placing dynamic 2D animations such as explosion effects, flames, or walking characters in 3D space.</p><h2 id="_1-understanding-sprite-sheets" tabindex="-1">1. Understanding Sprite Sheets <a class="header-anchor" href="#_1-understanding-sprite-sheets" aria-label="Permalink to &quot;1. Understanding Sprite Sheets&quot;">​</a></h2><p>A sprite sheet is a single large texture with multiple frame images arranged in a grid. RedGPU completes the animation by dividing this texture into designated segments and displaying them sequentially frame by frame.</p><p><img src="https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png" alt="SpriteSheet Image"></p><h2 id="_2-basic-usage" tabindex="-1">2. Basic Usage <a class="header-anchor" href="#_2-basic-usage" aria-label="Permalink to &quot;2. Basic Usage&quot;">​</a></h2><p>To use a sprite sheet, you must first create a <strong>SpriteSheetInfo</strong> object that defines the structure of the sheet and then pass it to <strong>SpriteSheet3D</strong>.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Define Sprite Sheet Info</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sheetInfo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SpriteSheetInfo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 5 horizontal segments, 3 vertical segments</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,   </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Total frames</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,    </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Start frame index</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Loop playback</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    24</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // Frames per second (FPS)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Create and Add SpriteSheet3D Instance</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> spriteSheet</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SpriteSheet3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sheetInfo);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(spriteSheet);</span></span></code></pre></div><h2 id="_3-key-property-control" tabindex="-1">3. Key Property Control <a class="header-anchor" href="#_3-key-property-control" aria-label="Permalink to &quot;3. Key Property Control&quot;">​</a></h2><p>Key properties controlling the playback state and the size of the sprite.</p><h3 id="animation-control" tabindex="-1">Animation Control <a class="header-anchor" href="#animation-control" aria-label="Permalink to &quot;Animation Control&quot;">​</a></h3><ul><li><strong><code>play()</code></strong>: Starts the animation.</li><li><strong><code>stop()</code></strong>: Pauses the animation at the current frame.</li><li><strong><code>gotoAndPlay(frameIndex)</code></strong>: Moves to the specified frame and plays immediately.</li><li><strong><code>gotoAndStop(frameIndex)</code></strong>: Moves to the specified frame and stops.</li></ul><h3 id="size-and-rendering-mode" tabindex="-1">Size and Rendering Mode <a class="header-anchor" href="#size-and-rendering-mode" aria-label="Permalink to &quot;Size and Rendering Mode&quot;">​</a></h3><p><code>SpriteSheet3D</code> provides the same size setting options as <code>Sprite3D</code>.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Property Name</th><th style="text-align:left;">Description</th><th style="text-align:left;">Default Value</th></tr></thead><tbody><tr><td style="text-align:left;"><strong><code>worldSize</code></strong></td><td style="text-align:left;">Vertical size in world space (Unit).</td><td style="text-align:left;"><code>1</code></td></tr><tr><td style="text-align:left;"><strong><code>usePixelSize</code></strong></td><td style="text-align:left;">Whether to use fixed pixel size mode.</td><td style="text-align:left;"><code>false</code></td></tr><tr><td style="text-align:left;"><strong><code>pixelSize</code></strong></td><td style="text-align:left;">Fixed pixel size value (in <code>px</code>).</td><td style="text-align:left;"><code>0</code></td></tr></tbody></table><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Display character animation at a fixed pixel size</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">spriteSheet.usePixelSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">spriteSheet.pixelSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 128</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="_3-3-size-setting-policy" tabindex="-1">3.3 Size Setting Policy <a class="header-anchor" href="#_3-3-size-setting-policy" aria-label="Permalink to &quot;3.3 Size Setting Policy&quot;">​</a></h3><p><code>SpriteSheet3D</code> shares the same size setting mechanism as <code>Sprite3D</code>. It supports physical size setting in 3D space through <code>worldSize</code> and absolute pixel size setting on the screen through <code>usePixelSize</code>.</p><p>For detailed differences between modes and operating principles, please refer to the <strong><a href="./sprite.html#_3-3-relationship-between-world-size-and-pixel-size">Size Relationship section of the Sprite3D manual</a></strong>.</p><h2 id="_4-practical-example-walking-character-animation" tabindex="-1">4. Practical Example: Walking Character Animation <a class="header-anchor" href="#_4-practical-example-walking-character-animation" aria-label="Permalink to &quot;4. Practical Example: Walking Character Animation&quot;">​</a></h2><p>See how a grid-type sheet image transforms into a natural character motion through <code>SpriteSheet3D</code> and <strong>Billboard</strong> settings.</p>`,21)),n(h,null,{default:l(()=>[n(r,{title:"RedGPU - SpriteSheet3D Animation",slugHash:"spritesheet3d-basic"},{default:l(()=>[...t[0]||(t[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
`),e("pre",null,[e("code",null,`// 1. Create SpriteSheetInfo (5x3 grid, 15 frames, 24FPS)
const sheetInfo = new RedGPU.Display.SpriteSheetInfo(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/spriteSheet/spriteSheet.png',
    5, 3, 15, 0, true, 24
);

// 2. World Size Sprite Sheet
const spriteSheet1 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet1.x = -3; spriteSheet1.y = 1;
spriteSheet1.worldSize = 2;
scene.addChild(spriteSheet1);

// 3. Fixed Pixel Size Sprite Sheet
const spriteSheet2 = new RedGPU.Display.SpriteSheet3D(redGPUContext, sheetInfo);
spriteSheet2.x = 3; spriteSheet2.y = 1;
spriteSheet2.usePixelSize = true;
spriteSheet2.pixelSize = 150;
scene.addChild(spriteSheet2);

// 4. Option Description Label (TextField3D)
const createLabel = (text, x, y) => {
    const label = new RedGPU.Display.TextField3D(redGPUContext, text);
    label.x = x; label.y = y;
    label.color = '#ffffff';
    label.fontSize = 16;
    label.background = '#ff3333';
    label.padding = 8;
    label.useBillboard = true;
    scene.addChild(label);
};

createLabel('World Size', -3, 2.5);
createLabel('Pixel Size', 3, 2.5);

// 3D View Setup
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
redGPUContext.addView(view);

// Start Rendering
const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),t[2]||(t[2]=a('<hr><h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li><strong>SpriteSheetInfo</strong>: Defines image source, sheet grid structure (Segments), animation speed (FPS), etc.</li><li><strong>Animation Control</strong>: Control visual flow through methods like <code>play</code>, <code>stop</code>, <code>gotoAndPlay</code>.</li><li><strong>Efficiency</strong>: Beneficial in terms of network overhead and GPU memory management by using a single sheet file instead of loading multiple images individually.</li></ul>',3))])}const x=p(c,[["render",k]]);export{E as __pageData,x as default};
