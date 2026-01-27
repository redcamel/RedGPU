import{D as i,c as h,o as c,k as e,H as t,a2 as l,a as n,w as s}from"./chunks/framework.cYGcyyTy.js";const y=JSON.parse('{"title":"IBL","description":"","frontmatter":{"order":2},"headers":[],"relativePath":"en/environment/ibl.md","filePath":"en/environment/ibl.md","lastUpdated":1769496586000}'),u={name:"en/environment/ibl.md"},b=Object.assign(u,{setup(m){const o=`
    HDR["HDR Source"] -->|new| IBL["RedGPU.Resource.IBL"]
    Cube["6 Images (CubeMap)"] -->|new| IBL
    
    subgraph Outputs ["Generated Resources"]
        IBL --> Irradiance["irradianceTexture (Diffuse)"]
        IBL --> Specular["iblTexture (Specular)"]
        IBL --> Environment["environmentTexture (Background)"]
    end

    Irradiance -->|Lighting| PBR["PBR Material"]
    Specular -->|Reflection| PBR
    Environment -->|Background| Skybox["RedGPU.Display.SkyBox"]
`;return(k,a)=>{const d=i("MermaidResponsive"),r=i("ClientOnly"),p=i("CodePen");return c(),h("div",null,[a[1]||(a[1]=e("h1",{id:"ibl",tabindex:"-1"},[n("IBL "),e("a",{class:"header-anchor",href:"#ibl","aria-label":'Permalink to "IBL"'},"​")],-1)),a[2]||(a[2]=e("p",null,"IBL is a method of lighting objects using images from the surrounding environment as light sources. It provides realistic reflection and global illumination effects that are difficult to express with simple light sources alone, maximizing the realism of 3D scenes.",-1)),a[3]||(a[3]=e("h2",{id:"_1-core-components-of-ibl",tabindex:"-1"},[n("1. Core Components of IBL "),e("a",{class:"header-anchor",href:"#_1-core-components-of-ibl","aria-label":'Permalink to "1. Core Components of IBL"'},"​")],-1)),a[4]||(a[4]=e("p",null,[n("RedGPU's "),e("strong",null,"Image-Based Lighting"),n(" (IBL) system analyzes HDR environment maps or cubemap images to automatically create the following three core resources.")],-1)),t(r,null,{default:s(()=>[t(d,{definition:o})]),_:1}),a[5]||(a[5]=l(`<h3 id="_1-1-irradiance-texture" tabindex="-1">1.1 Irradiance Texture <a class="header-anchor" href="#_1-1-irradiance-texture" aria-label="Permalink to &quot;1.1 Irradiance Texture&quot;">​</a></h3><p>Acts as the basic shading and ambient light for objects, giving natural color even where there is no direct light source.</p><h3 id="_1-2-ibl-texture-specular-texture" tabindex="-1">1.2 IBL Texture (Specular Texture) <a class="header-anchor" href="#_1-2-ibl-texture-specular-texture" aria-label="Permalink to &quot;1.2 IBL Texture (Specular Texture)&quot;">​</a></h3><p>Responsible for the effect of the surrounding environment being reflected on the object surface. Expresses reflections from surfaces like metal or glass in Physically Based Rendering (PBR) materials.</p><h3 id="_1-3-environment-texture" tabindex="-1">1.3 Environment Texture <a class="header-anchor" href="#_1-3-environment-texture" aria-label="Permalink to &quot;1.3 Environment Texture&quot;">​</a></h3><p>Data that maintains the original image as a high-resolution cubemap, mainly used as a background texture for <strong>SkyBox</strong>.</p><h2 id="_2-implementation-creation-and-application" tabindex="-1">2. Implementation: Creation and Application <a class="header-anchor" href="#_2-implementation-creation-and-application" aria-label="Permalink to &quot;2. Implementation: Creation and Application&quot;">​</a></h2><p>To apply IBL, you must create the resource and then register it in the camera view (<strong>View3D</strong>).</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. Create IBL resource (HDR file recommended)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. Apply IBL to View (Lighting effect)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.ibl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ibl;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 3. Apply SkyBox to View (Visual background)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span></code></pre></div><h2 id="_3-live-example-environmental-setup" tabindex="-1">3. Live Example: Environmental Setup <a class="header-anchor" href="#_3-live-example-environmental-setup" aria-label="Permalink to &quot;3. Live Example: Environmental Setup&quot;">​</a></h2><p>The example below shows the result of simultaneously creating IBL and Skybox from an HDR source. Right now it just looks like a 360-degree background, but this space is already filled with physically accurate light data.</p>`,11)),t(r,null,{default:s(()=>[t(p,{title:"RedGPU Basics - Environmental Setup",slugHash:"env-setup"},{default:s(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
`),e("pre",null,[e("code",null,`// Setup IBL and Skybox
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = skybox;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),a[6]||(a[6]=l('<h2 id="_4-true-value-synergy-with-gltf" tabindex="-1">4. True Value: Synergy with GLTF <a class="header-anchor" href="#_4-true-value-synergy-with-gltf" aria-label="Permalink to &quot;4. True Value: Synergy with GLTF&quot;">​</a></h2><p>Simply looking at the background (Skybox) may not seem to make much difference. But the true value of this environmental setup is revealed when loading <strong>GLTF models</strong>, which will be covered in the next chapter.</p><p>Detailed models created externally mostly use PBR (Physically Based Rendering) materials. IBL provides these models with realistic reflection data and soft environment light, allowing the models to implement photorealistic textures as if they were actually present in that space.</p><h2 id="next-steps" tabindex="-1">Next Steps <a class="header-anchor" href="#next-steps" aria-label="Permalink to &quot;Next Steps&quot;">​</a></h2><p>Based on the objects and environment settings learned so far, let&#39;s learn more deeply how to load and control models in actual projects.</p><ul><li><strong><a href="./../assets/model-loading/">GLTF Loader</a></strong></li></ul>',6))])}}});export{y as __pageData,b as default};
