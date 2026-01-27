import{D as p,c as g,o as E,a2 as l,H as e,k as i,w as n,a}from"./chunks/framework.cYGcyyTy.js";const C=JSON.parse(`{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","frontmatter":{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","order":2},"headers":[],"relativePath":"en/view-system/view3d.md","filePath":"en/view-system/view3d.md","lastUpdated":1769496586000}`),c={name:"en/view-system/view3d.md"},w=Object.assign(c,{setup(y){const k=`
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Pass)"]
        Scene["Scene (Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input)"]

        Context -->|Manages| View
        View -->|References| Scene
        View -->|References| Camera
        Controller -->|Updates| Camera
        View -.->|Holds| Controller
`,d=`
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
`,o=`
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared Reference| SceneA
        View2 --> CameraY
`;return(m,s)=>{const h=p("MermaidResponsive"),t=p("ClientOnly"),r=p("CodePen");return E(),g("div",null,[s[2]||(s[2]=l('<h1 id="view3d" tabindex="-1">View3D <a class="header-anchor" href="#view3d" aria-label="Permalink to &quot;View3D&quot;">​</a></h1><p><strong>View3D</strong>, which acts as the core &#39;frame&#39; of the View System, is an object that defines the <strong>Viewport</strong> within the <strong>RedGPUContext</strong> where rendering is actually performed. It acts as a <strong>Render Pass</strong> that groups scene data (<strong>Scene</strong>) and viewpoint information (<strong>Camera</strong>) together to generate the final frame.</p><h2 id="_1-technical-overview" tabindex="-1">1. Technical Overview <a class="header-anchor" href="#_1-technical-overview" aria-label="Permalink to &quot;1. Technical Overview&quot;">​</a></h2><p><strong>View3D</strong> operates on the GPU environment created from <strong>RedGPUContext</strong> and establishes relationships with other components as follows:</p>',4)),e(t,null,{default:n(()=>[e(h,{definition:k})]),_:1}),s[3]||(s[3]=l(`<p>A <strong>View3D</strong> instance has the following independent settings and functions:</p><ul><li><strong>Independent Environmental Settings</strong>: Skyboxes, post-effects, etc., can be applied differently per view.</li><li><strong>Debugging Tool Support</strong>: Individual control of grid and axis display.</li><li><strong>Multi-View Operation</strong>: Allows simultaneous rendering of multiple independent views within a single context.</li></ul><h2 id="_2-initialization-and-registration" tabindex="-1">2. Initialization and Registration <a class="header-anchor" href="#_2-initialization-and-registration" aria-label="Permalink to &quot;2. Initialization and Registration&quot;">​</a></h2><p>To create and display a <strong>View3D</strong> on the screen, follow these steps:</p><ol><li><strong>Instance Creation</strong>: Link and create a <strong>Scene</strong> and <strong>Camera</strong> after <strong>RedGPUContext</strong> is ready.</li><li><strong>Context Registration</strong>: Call the <code>addView()</code> method to include it in the rendering loop. Views not registered are not displayed on the screen.</li></ol><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    canvas,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 1. Prepare components (Scene and Camera)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> camera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 2. Create and configure View3D</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, scene, camera);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        view.grid </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        view.axis </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 3. Register view in context (Required)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(view);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 4. Start renderer</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> renderer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Renderer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        renderer.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><h3 id="live-demo" tabindex="-1">Live Demo <a class="header-anchor" href="#live-demo" aria-label="Permalink to &quot;Live Demo&quot;">​</a></h3>`,7)),e(t,null,{default:n(()=>[e(r,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:n(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.OrbitController(redGPUContext);`),a(`
`),i("pre",null,[i("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=l(`<h2 id="_3-size-and-resolution-management" tabindex="-1">3. Size and Resolution Management <a class="header-anchor" href="#_3-size-and-resolution-management" aria-label="Permalink to &quot;3. Size and Resolution Management&quot;">​</a></h2><p><strong>View3D</strong> determines the area it occupies within the canvas and its rendering resolution. For responsive layout support, it manages the size in CSS pixel units and the actual GPU rendering resolution separately.</p><h3 id="area-configuration-size-position" tabindex="-1">Area Configuration (Size &amp; Position) <a class="header-anchor" href="#area-configuration-size-position" aria-label="Permalink to &quot;Area Configuration (Size &amp; Position)&quot;">​</a></h3><p>You can specify the size and position of the view through <code>setSize()</code> and <code>setPosition()</code> methods. Numeric (Number), percent (<code>%</code>), and pixel (<code>px</code>) units are all supported.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Numeric (Number) or pixel (px) strings can be used</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">500</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">300</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;500px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;300px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Percent (%) units can be used</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Position setup</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;10px&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;10%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">[Pixel Unit Guide]</p><p>Two coordinate objects are provided for High-DPI (Retina) display support:</p><ul><li><strong><code>view.screenRectObject</code></strong>: The <strong>Layout Size</strong> in CSS pixel units. Use this for <strong>UI placement</strong> or <strong>mouse event coordinate calculations</strong>.</li><li><strong><code>view.pixelRectObject</code></strong>: The actual <strong>Physical Resolution</strong> with <code>devicePixelRatio</code> applied. Used for internal rendering calculations.</li></ul></div><h2 id="_4-debugging-tools" tabindex="-1">4. Debugging Tools <a class="header-anchor" href="#_4-debugging-tools" aria-label="Permalink to &quot;4. Debugging Tools&quot;">​</a></h2><p>RedGPU provides visualization tools to help intuitively understand the relative position and direction of objects during development.</p><ul><li><strong>grid</strong>: Renders a grid on the ground plane (<strong>XZ</strong> axis) of the 3D world. It serves as a reference for judging whether objects are touching the ground.</li><li><strong>axis</strong>: Displays <strong>XYZ</strong> axes in colors based on the world origin (<strong>0, 0, 0</strong>). <ul><li><span style="color:#ff3e3e;font-weight:bold;">Red</span>: <strong>X</strong> axis (Right)</li><li><span style="color:#3eff3e;font-weight:bold;">Green</span>: <strong>Y</strong> axis (Up)</li><li><span style="color:#3e3eff;font-weight:bold;">Blue</span>: <strong>Z</strong> axis (Depth)</li></ul></li></ul><h2 id="_5-multi-view-system" tabindex="-1">5. Multi-View System <a class="header-anchor" href="#_5-multi-view-system" aria-label="Permalink to &quot;5. Multi-View System&quot;">​</a></h2><p>RedGPU supports multi-view rendering, allowing the operation of multiple viewports within a single context. Each view occupies a specific area of the screen and independently renders a scene and camera.</p>`,11)),e(t,null,{default:n(()=>[e(h,{definition:o})]),_:1}),s[5]||(s[5]=l(`<h3 id="multi-view-configuration-example" tabindex="-1">Multi-View Configuration Example <a class="header-anchor" href="#multi-view-configuration-example" aria-label="Permalink to &quot;Multi-View Configuration Example&quot;">​</a></h3><p>Method for placing a main screen and a minimap utilizing <strong>Layout Size</strong> (screenRectObject) learned earlier.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// [Assumption] Inside a RedGPU.init callback.</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sharedScene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Setup Main View</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mainCamera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> mainView</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sharedScene, mainCamera);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">mainView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;100%&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(mainView);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Setup Minimap View (Fixed top-right)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapCamera</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PerspectiveCamera</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapCamera.y </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapCamera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lookAt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapView</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, sharedScene, miniMapCamera);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> miniMapSize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 200</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">miniMapView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setSize</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(miniMapSize, miniMapSize);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(miniMapView);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 3. Update minimap position based on main view&#39;s layout size upon resizing</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onResize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> mainView.screenRectObject;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    miniMapView.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setPosition</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(width </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> miniMapSize </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">-</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div>`,3)),e(t,null,{default:n(()=>[e(r,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:n(()=>[...s[1]||(s[1]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),a(`
`),i("pre",null,[i("code",null,`    // Main view setup
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // Minimap view setup
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0.1);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    const updateLayout = () => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // Place scene objects
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    for (let i = 0; i < 30; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.x = Math.random() * 40 - 20;
        mesh.z = Math.random() * 40 - 20;
        sharedScene.addChild(mesh);
    }

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
},
(error) => console.error(error)
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[6]||(s[6]=i("h2",{id:"_6-rendering-flow",tabindex:"-1"},[a("6. Rendering Flow "),i("a",{class:"header-anchor",href:"#_6-rendering-flow","aria-label":'Permalink to "6. Rendering Flow"'},"​")],-1)),s[7]||(s[7]=i("p",null,[a("Work flow performed by "),i("strong",null,"Renderer"),a(" as it iterates through the list of views registered in the context every frame.")],-1)),e(t,null,{default:n(()=>[e(h,{definition:d})]),_:1}),s[8]||(s[8]=l('<h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>We&#39;ve prepared the &#39;frame&#39; to draw the scene through <strong>View3D</strong>. Now it&#39;s time to compose the actual <strong>Scene</strong> to fill that frame.</p><p>Learn about the role and composition method of <strong>Scene</strong>, the space where meshes and lights are placed.</p><ul><li><strong><a href="./scene.html">Scene</a></strong></li></ul>',4))])}}});export{C as __pageData,w as default};
