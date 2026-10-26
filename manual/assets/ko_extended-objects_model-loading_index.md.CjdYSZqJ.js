import{D as n,o as k,c as o,k as s,a as i,G as e,w as l,a2 as h}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"ko/extended-objects/model-loading/index.md","filePath":"ko/extended-objects/model-loading/index.md","lastUpdated":1792987289000}'),E={name:"ko/extended-objects/model-loading/index.md"},F=Object.assign(E,{setup(c){const p=`
    GLTF[".gltf / .glb 파일"] -->|비동기 로드 및 파싱| Loader["GLTFLoader (로더)"]
    Loader -->|PBRMaterial 생성| Mat["Material (재질)"]
    Loader -->|Geometry 파싱| Geo["Geometry (지오메트리)"]
    Mat --> Mesh["resultMesh (최종 메시)"]
    Geo --> Mesh

    %% 회색조 스타일 적용
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(g,a)=>{const r=n("MermaidResponsive"),t=n("ClientOnly"),d=n("CodePen");return k(),o("div",null,[a[1]||(a[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[i("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),a[2]||(a[2]=s("p",null,[s("strong",null,"Primitive"),i(" 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴 (Blender, Maya 등)에서 제작하여 가져와야 합니다. RedGPU는 웹 3D 표준 포맷인 "),s("strong",null,"glTF"),i("(GL Transmission Format) 2.0 로딩을 지원하는 "),s("a",{href:"/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"},[s("code",null,"GLTFLoader")]),i(" 를 제공합니다.")],-1)),e(t,null,{default:l(()=>[e(r,{definition:p})]),_:1}),a[3]||(a[3]=h(`<h2 id="_1-모델-불러오기" tabindex="-1">1. 모델 불러오기 <a class="header-anchor" href="#_1-모델-불러오기" aria-label="Permalink to &quot;1. 모델 불러오기&quot;">​</a></h2><p><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"><code>GLTFLoader</code></a> 를 생성하면 비동기로 파일을 로드 및 파싱하며, 완료 시 콜백 함수로 전달된 <code>loader.resultMesh</code> 를 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Scene.html"><code>Scene</code></a> 에 추가하여 렌더링합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">GLTFLoader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://.../DamagedHelmet.glb&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 모델 경로</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">loader</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 로드 완료 후 최종 모델(resultMesh)을 씬에 추가</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        scene.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(loader.resultMesh);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div><ul><li><strong><code>resultMesh</code></strong>: 로드된 모델 계층 구조를 담고 있는 루트 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Display/classes/Mesh.html"><code>Mesh</code></a> 객체입니다.</li><li><strong><code>parsingResult</code></strong>: 재질 (<code>materials</code>), 텍스처 (<code>textures</code>), 애니메이션 (<code>animations</code>) 등 파싱된 상세 데이터입니다.</li></ul><div class="tip custom-block github-alert"><p class="custom-block-title">TIP</p><p>glTF 모델은 대부분 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Material/classes/PBRMaterial.html"><code>PBRMaterial</code></a> 을 사용하므로, 사실적인 금속 반사와 색감을 표현하려면 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>view.ibl</code></a> 에 <a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a> 환경광을 함께 설정하는 것을 권장합니다.</p></div><h2 id="_2-실습-예제-환경광과-모델-로딩" tabindex="-1">2. 실습 예제: 환경광과 모델 로딩 <a class="header-anchor" href="#_2-실습-예제-환경광과-모델-로딩" aria-label="Permalink to &quot;2. 실습 예제: 환경광과 모델 로딩&quot;">​</a></h2><p><a href="/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/namespaces/Resource/classes/IBL.html"><code>IBL</code></a> 로 환경을 구성하고 금속 헬멧 모델을 로드하는 예제입니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;https://redcamel.github.io/RedGPU/dist/index.js&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RedGPU.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">init</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(canvas, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">redGPUContext</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> scene</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Scene</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">();</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> controller</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Camera.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">OrbitController</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    controller.distance </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">View3D</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, scene, controller);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addView</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(view);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 1. IBL 및 SkyBox 설정</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        redGPUContext,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">        &#39;https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    );</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    view.ibl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ibl;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    // 2. GLTF 모델 로딩</span></span>
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
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre></div><h3 id="라이브-데모" tabindex="-1">라이브 데모 <a class="header-anchor" href="#라이브-데모" aria-label="Permalink to &quot;라이브 데모&quot;">​</a></h3>`,9)),e(t,null,{default:l(()=>[e(d,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:l(()=>[...a[0]||(a[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),i(`
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
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),a[4]||(a[4]=h('<hr><h2 id="관련-예제" tabindex="-1">관련 예제 <a class="header-anchor" href="#관련-예제" aria-label="Permalink to &quot;관련 예제&quot;">​</a></h2><ul><li><a href="/RedGPU/examples/gltf/models/helmets/" target="_blank" rel="noopener noreferrer">DamagedHelmet 모델 로딩</a></li><li><a href="/RedGPU/examples/gltf/animation/basicAnimations/" target="_blank" rel="noopener noreferrer">glTF 기본 애니메이션</a></li><li><a href="/RedGPU/examples/gltf/animation/motionBlending/" target="_blank" rel="noopener noreferrer">애니메이션 모션 블렌딩</a></li><li><a href="/RedGPU/examples/gltf/models/sponza/" target="_blank" rel="noopener noreferrer">Sponza 씬 모델</a></li></ul><hr><h2 id="다음-단계" tabindex="-1">다음 단계 <a class="header-anchor" href="#다음-단계" aria-label="Permalink to &quot;다음 단계&quot;">​</a></h2><p>수천~수만 개의 동일한 객체를 단일 드로우 콜로 고성능 렌더링하는 방법을 알아봅니다.</p><ul><li><strong><a href="./../instanced-mesh/">Instancing Mesh</a></strong></li></ul>',7))])}}});export{m as __pageData,F as default};
