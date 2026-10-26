import{D as n,o as k,c as o,k as s,a as e,G as i,w as l,a2 as h}from"./chunks/framework.n5RLHRfo.js";const y=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"en/extended-objects/model-loading/index.md","filePath":"en/extended-objects/model-loading/index.md","lastUpdated":1792993711000}'),c={name:"en/extended-objects/model-loading/index.md"},F=Object.assign(c,{setup(E){const d=`
    GLTF[".gltf / .glb File"] -->|Async Load & Parse| Loader["GLTFLoader (Loader)"]
    Loader -->|Create PBRMaterial| Mat["Material (Surface)"]
    Loader -->|Parse Geometry| Geo["Geometry (Skeleton)"]
    Mat --> Mesh["resultMesh (Final Mesh)"]
    Geo --> Mesh

    %% Grayscale styles applied
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(g,a)=>{const p=n("MermaidResponsive"),t=n("ClientOnly"),r=n("CodePen");return k(),o("div",null,[a[1]||(a[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[e("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),a[2]||(a[2]=s("p",null,[e("While you can create basic shapes with "),s("strong",null,"Primitives"),e(", high-quality assets such as detailed characters or buildings need to be created in external 3D tools (Blender, Maya, etc.) and then imported. RedGPU provides the "),s("a",{href:"/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"},[s("code",null,"GLTFLoader")]),e(", which supports loading the web 3D standard format "),s("strong",null,"glTF"),e(" (GL Transmission Format) 2.0.")],-1)),i(t,null,{default:l(()=>[i(p,{definition:d})]),_:1}),a[3]||(a[3]=h(`<h2 id="_1-loading-a-model" tabindex="-1">1. Loading a Model <a class="header-anchor" href="#_1-loading-a-model" aria-label="Permalink to &quot;1. Loading a Model&quot;">​</a></h2><p>Creating a <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"><code>GLTFLoader</code></a> instance asynchronously loads and parses the file. Once complete, add <code>loader.resultMesh</code> passed to the callback function to the <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a>.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GLTFLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://.../DamagedHelmet.glb&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// Model path</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">loader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // Add the loaded root mesh (resultMesh) to the scene</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(loader.resultMesh);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><ul><li><strong><code>resultMesh</code></strong>: The root <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Mesh.html"><code>Mesh</code></a> object containing the loaded model hierarchy.</li><li><strong><code>parsingResult</code></strong>: Detailed parsed data including <code>materials</code>, <code>textures</code>, and <code>animations</code>.</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>Since most glTF models use <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Material/classes/PBRMaterial.html"><code>PBRMaterial</code></a>, we recommend configuring <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a> environment lighting on <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>view.ibl</code></a> for realistic metallic reflections and shading.</p></div><h2 id="_2-practical-example-environment-light-and-model-loading" tabindex="-1">2. Practical Example: Environment Light and Model Loading <a class="header-anchor" href="#_2-practical-example-environment-light-and-model-loading" aria-label="Permalink to &quot;2. Practical Example: Environment Light and Model Loading&quot;">​</a></h2><p>An example of setting up an environment with <a href="/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a> and loading a metallic helmet model.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(canvas, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> controller</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    controller.distance </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, scene, controller);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(view);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 1. Configure IBL and SkyBox</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        redGPUContext,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &#39;https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    view.ibl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ibl;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 2. Load GLTF Model</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GLTFLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        redGPUContext,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &#39;https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">loader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(loader.resultMesh);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> renderer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Renderer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    renderer.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="live-demo" tabindex="-1">Live Demo <a class="header-anchor" href="#live-demo" aria-label="Permalink to &quot;Live Demo&quot;">​</a></h3>`,9)),i(t,null,{default:l(()=>[i(r,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:l(()=>[...a[0]||(a[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),e(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

let targetMesh;
new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loader) => {
        targetMesh = loader.resultMesh;
        scene.addChild(targetMesh);
    }
);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    if (targetMesh) targetMesh.rotationY += 1;
});
`)]),e(`
`),s("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),a[4]||(a[4]=h('<hr><h2 id="related-examples" tabindex="-1">Related Examples <a class="header-anchor" href="#related-examples" aria-label="Permalink to &quot;Related Examples&quot;">​</a></h2><ul><li><a href="/RedGPU/examples/gltf/models/helmets/" target="_blank" rel="noopener noreferrer">DamagedHelmet Model Loading</a></li><li><a href="/RedGPU/examples/gltf/animation/basicAnimations/" target="_blank" rel="noopener noreferrer">glTF Basic Animations</a></li><li><a href="/RedGPU/examples/gltf/animation/motionBlending/" target="_blank" rel="noopener noreferrer">Animation Motion Blending</a></li><li><a href="/RedGPU/examples/gltf/models/sponza/" target="_blank" rel="noopener noreferrer">Sponza Scene Model</a></li></ul><hr><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Learn how to render thousands of identical objects with high performance in a single draw call.</p><ul><li><strong><a href="./../instanced-mesh/">Instancing Mesh</a></strong></li></ul>',7))])}}});export{y as __pageData,F as default};
