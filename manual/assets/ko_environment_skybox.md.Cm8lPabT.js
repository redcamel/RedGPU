import{D as l,o as h,c as k,a2 as r,G as t,w as i,k as e,a}from"./chunks/framework.n5RLHRfo.js";const g=JSON.parse('{"title":"Skybox","description":"","frontmatter":{"order":1},"headers":[],"relativePath":"ko/environment/skybox.md","filePath":"ko/environment/skybox.md","lastUpdated":1792993711000}'),c={name:"ko/environment/skybox.md"},b=Object.assign(c,{setup(y){const d=`
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% 회색조 스타일 적용
    style HDRSource fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Images fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style CubeTex fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Skybox fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View3D fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(x,s)=>{const p=l("MermaidResponsive"),n=l("ClientOnly"),o=l("CodePen");return h(),k("div",null,[s[2]||(s[2]=r(`<h1 id="skybox" tabindex="-1">Skybox <a class="header-anchor" href="#skybox" aria-label="Permalink to &quot;Skybox&quot;">​</a></h1><p>Skybox는 3D 공간의 무한한 배경을 표현하는 기술입니다. <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyBox.html"><code>SkyBox</code></a> 객체를 생성하여 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a>의 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/SkyBox.html"><code>skybox</code></a> 속성에 할당하면 렌더링됩니다.</p><h2 id="_1-기본-사용법" tabindex="-1">1. 기본 사용법 <a class="header-anchor" href="#_1-기본-사용법" aria-label="Permalink to &quot;1. 기본 사용법&quot;">​</a></h2><p>SkyBox는 일반적인 메쉬와 달리 씬 (Scene)에 추가하지 않고, <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/View3D.html"><code>View3D</code></a> 에 직접 연결하여 사용합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. SkyBox 생성 (텍스처 필요)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, texture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. View에 적용 (필수)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> skybox;</span></span></code></pre></div><h2 id="_2-텍스처-생성-방법" tabindex="-1">2. 텍스처 생성 방법 <a class="header-anchor" href="#_2-텍스처-생성-방법" aria-label="Permalink to &quot;2. 텍스처 생성 방법&quot;">​</a></h2><p>SkyBox에 적용할 텍스처를 생성하는 방법은 크게 두 가지로 나뉩니다. 가장 권장되는 방식인 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a> 부터 고전적인 <strong>큐브맵</strong> 순으로 살펴봅니다.</p>`,7)),t(n,null,{default:i(()=>[t(p,{definition:d})]),_:1}),s[3]||(s[3]=r(`<h3 id="_2-1-ibl-리소스-활용-권장" tabindex="-1">2.1 IBL 리소스 활용 (권장) <a class="header-anchor" href="#_2-1-ibl-리소스-활용-권장" aria-label="Permalink to &quot;2.1 IBL 리소스 활용 (권장)&quot;">​</a></h3><p><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>RedGPU.Resource.IBL</code></a> 객체를 생성하면 내부적으로 <strong>환경 텍스처</strong>(Environment Texture) 가 함께 생성됩니다. 이 텍스처를 Skybox에 활용하는 방식입니다.</p><ul><li><strong>장점</strong>: 배경과 완벽하게 일치하는 물리 기반 조명 (Diffuse/Specular) 데이터를 함께 얻을 수 있습니다.</li><li><strong>활용</strong>: 가장 사실적인 렌더링 결과를 얻기 위해 주로 사용되는 현대적인 방식입니다.</li></ul><div class="info custom-block"><p class="custom-block-title">[HDR 파일 사용 가이드]</p><p>RedGPU에서 한 장의 HDR (.hdr) 파노라마 이미지를 스카이박스로 사용하려면 반드시 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a>을 거쳐야 합니다. 스카이박스는 큐브 형태의 데이터를 요구하며, <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a>이 2D 파노라마를 큐브맵으로 자동 변환해 줍니다.</p></div><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// IBL 생성 (조명 데이터 + 배경 텍스처 생성됨)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// IBL 내부의 environmentTexture를 Skybox로 사용</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span></code></pre></div><h3 id="_2-2-6장의-이미지-cubetexture" tabindex="-1">2.2 6장의 이미지 (CubeTexture) <a class="header-anchor" href="#_2-2-6장의-이미지-cubetexture" aria-label="Permalink to &quot;2.2 6장의 이미지 (CubeTexture)&quot;">​</a></h3><p>상, 하, 좌, 우, 앞, 뒤 6장의 일반 이미지 (JPG, PNG 등)를 결합하여 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/CubeTexture.html"><code>CubeTexture</code></a>를 생성하는 고전적인 방식입니다. 이미지 배열은 반드시 <strong>px, nx, py, ny, pz, nz</strong> 순서로 전달해야 합니다.</p><ul><li><strong>장점</strong>: 리소스를 구하기 쉽고 직관적입니다.</li><li><strong>단점</strong>: HDR 정보를 포함하지 않아 사실적인 광원 효과를 기대하기 어렵습니다.</li></ul><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> cubeTexture</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CubeTexture</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posx.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negx.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posy.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negy.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;./posz.jpg&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;./negz.jpg&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> skybox</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, cubeTexture);</span></span></code></pre></div><h2 id="_3-구현-방식-비교" tabindex="-1">3. 구현 방식 비교 <a class="header-anchor" href="#_3-구현-방식-비교" aria-label="Permalink to &quot;3. 구현 방식 비교&quot;">​</a></h2><table tabindex="0"><thead><tr><th style="text-align:left;">구분</th><th style="text-align:left;">IBL 활용 (권장)</th><th style="text-align:left;">CubeTexture</th></tr></thead><tbody><tr><td style="text-align:left;"><strong>소스</strong></td><td style="text-align:left;">1장의 HDR 이미지</td><td style="text-align:left;">6장의 이미지</td></tr><tr><td style="text-align:left;"><strong>타입</strong></td><td style="text-align:left;"><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/DirectCubeTexture.html"><code>DirectCubeTexture</code></a></td><td style="text-align:left;"><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/CubeTexture.html"><code>CubeTexture</code></a></td></tr><tr><td style="text-align:left;"><strong>조명 데이터</strong></td><td style="text-align:left;">O (자동 생성)</td><td style="text-align:left;">X</td></tr><tr><td style="text-align:left;"><strong>주요 용도</strong></td><td style="text-align:left;">배경 + 물리 기반 조명</td><td style="text-align:left;">단순 배경</td></tr></tbody></table><h2 id="_4-라이브-데모" tabindex="-1">4. 라이브 데모 <a class="header-anchor" href="#_4-라이브-데모" aria-label="Permalink to &quot;4. 라이브 데모&quot;">​</a></h2><h3 id="a-ibl-환경-텍스처-활용-hdr" tabindex="-1">A. IBL 환경 텍스처 활용 (HDR) <a class="header-anchor" href="#a-ibl-환경-텍스처-활용-hdr" aria-label="Permalink to &quot;A. IBL 환경 텍스처 활용 (HDR)&quot;">​</a></h3>`,13)),t(n,null,{default:i(()=>[t(o,{title:"RedGPU Basics - Skybox (IBL)",slugHash:"skybox-ibl"},{default:i(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// 1. IBL 생성 및 SkyBox 적용
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
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=e("h3",{id:"b-큐브맵-방식-6장-이미지",tabindex:"-1"},[a("B. 큐브맵 방식 (6장 이미지) "),e("a",{class:"header-anchor",href:"#b-큐브맵-방식-6장-이미지","aria-label":'Permalink to "B. 큐브맵 방식 (6장 이미지)"'},"​")],-1)),t(n,null,{default:i(()=>[t(o,{title:"RedGPU Basics - Skybox (CubeMap)",slugHash:"skybox-cubemap"},{default:i(()=>[...s[1]||(s[1]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// CubeTexture 생성 (순서: px, nx, py, ny, pz, nz)
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
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[5]||(s[5]=r('<hr><h2 id="관련-예제" tabindex="-1">관련 예제 <a class="header-anchor" href="#관련-예제" aria-label="Permalink to &quot;관련 예제&quot;">​</a></h2><ul><li><a href="/RedGPU/examples/3d/skybox/skybox/" target="_blank" rel="noopener noreferrer">SkyBox 기본</a></li><li><a href="/RedGPU/examples/3d/skybox/transition/skyboxTransition/" target="_blank" rel="noopener noreferrer">SkyBox 트랜지션</a></li><li><a href="/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/" target="_blank" rel="noopener noreferrer">노이즈 텍스처 기반 SkyBox 트랜지션</a></li></ul><hr><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><ul><li><strong><a href="./ibl.html">IBL</a></strong></li></ul>',6))])}}});export{g as __pageData,b as default};
