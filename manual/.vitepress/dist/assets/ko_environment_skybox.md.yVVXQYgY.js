import{D as l,o as h,c as k,a2 as r,G as a,w as n,k as s,a as t}from"./chunks/framework.DZW1bhNM.js";const u=JSON.parse('{"title":"Skybox","description":"","frontmatter":{"order":1},"headers":[],"relativePath":"ko/environment/skybox.md","filePath":"ko/environment/skybox.md","lastUpdated":1770698112000}'),g={name:"ko/environment/skybox.md"},b=Object.assign(g,{setup(c){const d=`
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% 커스텀 클래스 적용
    class View3D,Skybox mermaid-main;
    class IBL,CubeTex mermaid-component;
`;return(y,e)=>{const p=l("MermaidResponsive"),i=l("ClientOnly"),o=l("CodePen");return h(),k("div",null,[e[2]||(e[2]=r(`<h1 id="skybox" tabindex="-1">Skybox <a class="header-anchor" href="#skybox" aria-label="Permalink to &quot;Skybox&quot;">​</a></h1><p>Skybox는 3D 공간의 무한한 배경을 표현하는 기술입니다. <strong>SkyBox</strong> 객체를 생성하여 <strong>View3D</strong>의 <code>skybox</code> 속성에 할당하면 렌더링됩니다.</p><h2 id="_1-기본-사용법" tabindex="-1">1. 기본 사용법 <a class="header-anchor" href="#_1-기본-사용법" aria-label="Permalink to &quot;1. 기본 사용법&quot;">​</a></h2><p>SkyBox는 일반적인 메쉬와 달리 씬(Scene)에 추가하지 않고, <strong>View3D</strong> 에 직접 연결하여 사용합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. SkyBox 생성 (텍스처 필요)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, texture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. View에 적용 (필수)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> skybox;</span></span></code></pre></div><h2 id="_2-텍스처-생성-방법" tabindex="-1">2. 텍스처 생성 방법 <a class="header-anchor" href="#_2-텍스처-생성-방법" aria-label="Permalink to &quot;2. 텍스처 생성 방법&quot;">​</a></h2><p>SkyBox에 적용할 텍스처를 생성하는 방법은 크게 두 가지로 나뉩니다. 가장 권장되는 방식인 <strong>IBL</strong> 부터 고전적인 <strong>큐브맵</strong> 순으로 살펴봅니다.</p>`,7)),a(i,null,{default:n(()=>[a(p,{definition:d})]),_:1}),e[3]||(e[3]=r(`<h3 id="_2-1-ibl-리소스-활용-권장" tabindex="-1">2.1 IBL 리소스 활용 (권장) <a class="header-anchor" href="#_2-1-ibl-리소스-활용-권장" aria-label="Permalink to &quot;2.1 IBL 리소스 활용 (권장)&quot;">​</a></h3><p><code>RedGPU.Resource.IBL</code> 객체를 생성하면 내부적으로 <strong>환경 텍스처</strong>(Environment Texture) 가 함께 생성됩니다. 이 텍스처를 Skybox에 활용하는 방식입니다.</p><ul><li><strong>장점</strong>: 배경과 완벽하게 일치하는 물리 기반 조명(Diffuse/Specular) 데이터를 함께 얻을 수 있습니다.</li><li><strong>활용</strong>: 가장 사실적인 렌더링 결과를 얻기 위해 주로 사용되는 현대적인 방식입니다.</li></ul><div class="info custom-block"><p class="custom-block-title">[HDR 파일 사용 가이드]</p><p>RedGPU에서 한 장의 HDR(.hdr) 파노라마 이미지를 스카이박스로 사용하려면 반드시 <code>IBL</code>을 거쳐야 합니다. 스카이박스는 큐브 형태의 데이터를 요구하며, <code>IBL</code>이 2D 파노라마를 큐브맵으로 자동 변환해 줍니다.</p></div><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// IBL 생성 (조명 데이터 + 배경 텍스처 생성됨)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// IBL 내부의 environmentTexture를 Skybox로 사용</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span></code></pre></div><h3 id="_2-2-6장의-이미지-cubetexture" tabindex="-1">2.2 6장의 이미지 (CubeTexture) <a class="header-anchor" href="#_2-2-6장의-이미지-cubetexture" aria-label="Permalink to &quot;2.2 6장의 이미지 (CubeTexture)&quot;">​</a></h3><p>상, 하, 좌, 우, 앞, 뒤 6장의 일반 이미지(JPG, PNG 등)를 결합하여 <code>CubeTexture</code>를 생성하는 고전적인 방식입니다. 이미지 배열은 반드시 <strong>px, nx, py, ny, pz, nz</strong> 순서로 전달해야 합니다.</p><ul><li><strong>장점</strong>: 리소스를 구하기 쉽고 직관적입니다.</li><li><strong>단점</strong>: HDR 정보를 포함하지 않아 사실적인 광원 효과를 기대하기 어렵습니다.</li></ul><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> cubeTexture</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CubeTexture</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posx.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negx.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posy.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negy.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posz.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negz.jpg&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, cubeTexture);</span></span></code></pre></div><h2 id="_3-구현-방식-비교" tabindex="-1">3. 구현 방식 비교 <a class="header-anchor" href="#_3-구현-방식-비교" aria-label="Permalink to &quot;3. 구현 방식 비교&quot;">​</a></h2><table tabindex="0"><thead><tr><th style="text-align:left;">구분</th><th style="text-align:left;">IBL 활용 (권장)</th><th style="text-align:left;">CubeTexture</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>소스</strong></td><td style="text-align:left;">1장의 HDR 이미지</td><td style="text-align:left;">6장의 이미지</td></tr><tr><td style="text-align:left;"><strong>타입</strong></td><td style="text-align:left;"><code>IBLCubeTexture</code></td><td style="text-align:left;"><code>CubeTexture</code></td></tr><tr><td style="text-align:left;"><strong>조명 데이터</strong></td><td style="text-align:left;">O (자동 생성)</td><td style="text-align:left;">X</td></tr><tr><td style="text-align:left;"><strong>주요 용도</strong></td><td style="text-align:left;">배경 + 물리 기반 조명</td><td style="text-align:left;">단순 배경</td></tr></tbody></table><h2 id="_4-라이브-데모" tabindex="-1">4. 라이브 데모 <a class="header-anchor" href="#_4-라이브-데모" aria-label="Permalink to &quot;4. 라이브 데모&quot;">​</a></h2><h3 id="a-ibl-활용-방식-조명-포함" tabindex="-1">A. IBL 활용 방식 (조명 포함) <a class="header-anchor" href="#a-ibl-활용-방식-조명-포함" aria-label="Permalink to &quot;A. IBL 활용 방식 (조명 포함)&quot;">​</a></h3>`,13)),a(i,null,{default:n(()=>[a(o,{title:"RedGPU Basics - Skybox (IBL)",slugHash:"skybox-ibl"},{default:n(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),s("pre",null,[s("code",null,`// 1. IBL 생성 및 SkyBox 적용
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
const skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.skybox = skybox;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),s("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),e[4]||(e[4]=s("h3",{id:"b-큐브맵-방식-6장-이미지",tabindex:"-1"},[t("B. 큐브맵 방식 (6장 이미지) "),s("a",{class:"header-anchor",href:"#b-큐브맵-방식-6장-이미지","aria-label":'Permalink to "B. 큐브맵 방식 (6장 이미지)"'},"​")],-1)),a(i,null,{default:n(()=>[a(o,{title:"RedGPU Basics - Skybox (CubeMap)",slugHash:"skybox-cubemap"},{default:n(()=>[...e[1]||(e[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[t(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),t(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),t(`
`),s("pre",null,[s("code",null,`// CubeTexture 생성 (순서: px, nx, py, ny, pz, nz)
const cubeTexture = new RedGPU.Resource.CubeTexture(redGPUContext, [
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/px.jpg',
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/nx.jpg',
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/py.jpg',
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/ny.jpg',
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/pz.jpg',
    'https://redcamel.github.io/RedGPU/examples/assets/skybox/nz.jpg'
]);

const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.skybox = skybox;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),t(`
`),s("p",null,"});"),t(`
`)],-1)])]),_:1})]),_:1}),e[5]||(e[5]=r('<h2 id="핵심-요약" tabindex="-1">핵심 요약 <a class="header-anchor" href="#핵심-요약" aria-label="Permalink to &quot;핵심 요약&quot;">​</a></h2><ul><li><strong>SkyBox</strong> 는 뷰(<strong>View3D</strong>)에 설정하여 배경을 렌더링합니다.</li><li>사실적인 조명이 필요하다면 <strong>IBL</strong> 을 통해 생성된 환경 텍스처를 사용하는 것이 가장 좋습니다.</li><li>단순 배경이 목적이라면 <strong>HDRTexture</strong> 나 <strong>CubeTexture</strong> 를 사용합니다.</li></ul><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><ul><li><strong><a href="./ibl.html">IBL</a></strong></li></ul>',4))])}}});export{u as __pageData,b as default};
