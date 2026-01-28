import{f as o,D as r,o as c,c as f,a2 as i,G as l,w as n,k as e,a as t}from"./chunks/framework.DpNgdNqH.js";const k=JSON.parse('{"title":"General Effects","description":"","frontmatter":{"title":"General Effects","order":2},"headers":[],"relativePath":"en/post-effect/general-effects.md","filePath":"en/post-effect/general-effects.md","lastUpdated":1769587164000}'),g={name:"en/post-effect/general-effects.md"};function h(p,a,u,y,x,m){const s=r("CodePen"),d=r("ClientOnly");return c(),f("div",null,[a[2]||(a[2]=i(`<h1 id="general-effects" tabindex="-1">General Effects <a class="header-anchor" href="#general-effects" aria-label="Permalink to &quot;General Effects&quot;">​</a></h1><p>Manages various standard effects provided by RedGPU, such as radial blur and grayscale.</p><div class="tip custom-block"><p class="custom-block-title">[Learning Guide]</p><p>Technically, tone mapping is executed at the very first stage of the overall post-processing, but in this chapter, we first cover <strong>General Effects</strong> where visual changes can be experienced most intuitively.</p></div><h2 id="_1-usage-addeffect" tabindex="-1">1. Usage (addEffect) <a class="header-anchor" href="#_1-usage-addeffect" aria-label="Permalink to &quot;1. Usage (addEffect)&quot;">​</a></h2><p>After creating an effect object, register it through <code>view.postEffectManager.addEffect()</code>. A pipeline chain is formed in the order of registration.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> radialBlur</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.PostEffect.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">RadialBlur</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.postEffectManager.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addEffect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(radialBlur);</span></span></code></pre></div><h2 id="_2-key-effect-examples" tabindex="-1">2. Key Effect Examples <a class="header-anchor" href="#_2-key-effect-examples" aria-label="Permalink to &quot;2. Key Effect Examples&quot;">​</a></h2><h3 id="_2-1-radial-blur" tabindex="-1">2.1 Radial Blur <a class="header-anchor" href="#_2-1-radial-blur" aria-label="Permalink to &quot;2.1 Radial Blur&quot;">​</a></h3><p>Creates a sense of speed or concentration effects that spread outward from a center point.</p>`,9)),l(d,null,{default:n(()=>[l(s,{title:"RedGPU PostEffect - RadialBlur",slugHash:"posteffect-radialblur"},{default:n(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,[t(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),e("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),t(`'
);`)]),t(`
`),e("pre",null,[e("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const radialBlur = new RedGPU.PostEffect.RadialBlur(redGPUContext);
radialBlur.blur = 0.1;
view.postEffectManager.addEffect(radialBlur);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),a[3]||(a[3]=e("h3",{id:"_2-2-grayscale",tabindex:"-1"},[t("2.2 Grayscale "),e("a",{class:"header-anchor",href:"#_2-2-grayscale","aria-label":'Permalink to "2.2 Grayscale"'},"​")],-1)),a[4]||(a[4]=e("p",null,"Converts the image to black and white to create a classic atmosphere.",-1)),l(d,null,{default:n(()=>[l(s,{title:"RedGPU PostEffect - Grayscale",slugHash:"posteffect-grayscale"},{default:n(()=>[...a[1]||(a[1]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),e("p",null,[t(`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const ibl = new RedGPU.Resource.IBL(
redGPUContext,
'`),e("a",{href:"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr",target:"_blank",rel:"noreferrer"},"https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr"),t(`'
);`)]),t(`
`),e("pre",null,[e("code",null,`new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (result) => { scene.addChild(result.resultMesh); }
);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

redGPUContext.addView(view);

// Add grayscale effect
const grayscale = new RedGPU.PostEffect.Grayscale(redGPUContext);
view.postEffectManager.addEffect(grayscale);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),e("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),a[5]||(a[5]=i('<h2 id="_3-full-support-list" tabindex="-1">3. Full Support List <a class="header-anchor" href="#_3-full-support-list" aria-label="Permalink to &quot;3. Full Support List&quot;">​</a></h2><p>Full list of all general effects provided by RedGPU. All effects are located under the <code>RedGPU.PostEffect</code> namespace.</p><table tabindex="0"><thead><tr><th style="text-align:left;">Category</th><th style="text-align:left;">Class Name</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>Blur</strong></td><td style="text-align:left;"><code>Blur</code>, <code>GaussianBlur</code></td><td style="text-align:left;">Gaussian blur (Most common blur effect)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>BlurX</code>, <code>BlurY</code></td><td style="text-align:left;">Unidirectional (horizontal/vertical) blur</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>DirectionalBlur</code></td><td style="text-align:left;">Blur effect in a specified angle direction</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>RadialBlur</code></td><td style="text-align:left;">Blur effect spreading outward from the center in a circle</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ZoomBlur</code></td><td style="text-align:left;">Blur effect expanding outward from the center</td></tr><tr><td style="text-align:left;"><strong>Adjustments</strong></td><td style="text-align:left;"><code>BrightnessContrast</code></td><td style="text-align:left;">Brightness and contrast adjustment</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>HueSaturation</code></td><td style="text-align:left;">Hue and saturation adjustment</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ColorBalance</code></td><td style="text-align:left;">Color balance (midtones, shadows, highlights) adjustment</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ColorTemperatureTint</code></td><td style="text-align:left;">Color temperature and tint adjustment</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Vibrance</code></td><td style="text-align:left;">Vibrance (adjust mainly unsaturated parts)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Grayscale</code></td><td style="text-align:left;">Converts image to black and white</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Invert</code></td><td style="text-align:left;">Color inversion</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Threshold</code></td><td style="text-align:left;">Binarization based on a threshold</td></tr><tr><td style="text-align:left;"><strong>Lens</strong></td><td style="text-align:left;"><code>OldBloom</code></td><td style="text-align:left;">Classic light bleeding effect</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>DOF</code></td><td style="text-align:left;">Depth of field (blur areas out of focus)</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Vignetting</code></td><td style="text-align:left;">Effect of darkening the outer edges of the screen</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>ChromaticAberration</code></td><td style="text-align:left;">Recreates lens chromatic aberration</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>LensDistortion</code></td><td style="text-align:left;">Lens distortion effect</td></tr><tr><td style="text-align:left;"><strong>Atmospheric</strong></td><td style="text-align:left;"><code>Fog</code></td><td style="text-align:left;">Distance-based fog effect</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>HeightFog</code></td><td style="text-align:left;">Height-based fog effect</td></tr><tr><td style="text-align:left;"><strong>Visual / Utility</strong></td><td style="text-align:left;"><code>FilmGrain</code></td><td style="text-align:left;">Film noise (grain) effect</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Sharpen</code></td><td style="text-align:left;">Sharpening</td></tr><tr><td style="text-align:left;"></td><td style="text-align:left;"><code>Convolution</code></td><td style="text-align:left;">Kernel-based filter (supports Sharpen, Edge, Emboss, etc.)</td></tr></tbody></table><div class="info custom-block"><p class="custom-block-title">[Check Live]</p><p>All the effects above can be checked in real-time demos in the <strong>PostEffect</strong> category of the <a href="https://redcamel.github.io/RedGPU/examples/#postEffect" target="_blank" rel="noreferrer">RedGPU Official Examples Page</a>.</p></div><h2 id="key-summary" tabindex="-1">Key Summary <a class="header-anchor" href="#key-summary" aria-label="Permalink to &quot;Key Summary&quot;">​</a></h2><ul><li>You can layer effects in any order using <code>addEffect()</code>.</li><li>All effect objects require <code>redGPUContext</code> upon creation.</li><li>Actual rendering is performed immediately after the tone mapping stage.</li></ul><h2 id="next-learning-recommendations" tabindex="-1">Next Learning Recommendations <a class="header-anchor" href="#next-learning-recommendations" aria-label="Permalink to &quot;Next Learning Recommendations&quot;">​</a></h2><ul><li><strong><a href="./tone-mapping.html">Tone Mapping</a></strong></li><li><strong><a href="./builtin-effects.html">Built-in Effects</a></strong></li></ul>',8))])}const P=o(g,[["render",h]]);export{k as __pageData,P as default};
