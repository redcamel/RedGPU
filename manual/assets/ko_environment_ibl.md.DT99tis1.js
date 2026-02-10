import{D as i,o as h,c,k as e,a,G as s,w as t,a2 as l}from"./chunks/framework.DZW1bhNM.js";const b=JSON.parse('{"title":"IBL","description":"","frontmatter":{"order":2},"headers":[],"relativePath":"ko/environment/ibl.md","filePath":"ko/environment/ibl.md","lastUpdated":1770713971000}'),k={name:"ko/environment/ibl.md"},x=Object.assign(k,{setup(u){const o=`
    HDR["HDR Source"] -->|new| IBL["RedGPU.Resource.IBL"]
    Cube["6 Images (CubeMap)"] -->|new| IBL
    
    subgraph Outputs ["Generated Resources"]
        IBL --> Irradiance["irradianceTexture (Diffuse)"]
        IBL --> Specular["prefilterTexture (Specular)"]
        IBL --> Environment["environmentTexture (Background)"]
    end

    Irradiance -->|Lighting| PBR["PBR Material"]
    Specular -->|Reflection| PBR
    Environment -->|Background| Skybox["RedGPU.Display.SkyBox"]

    %% 커스텀 클래스 적용
    class IBL,Skybox mermaid-main;
    class Irradiance,Specular,Environment,PBR mermaid-component;
`;return(g,n)=>{const d=i("MermaidResponsive"),r=i("ClientOnly"),p=i("CodePen");return h(),c("div",null,[n[1]||(n[1]=e("h1",{id:"ibl",tabindex:"-1"},[a("IBL "),e("a",{class:"header-anchor",href:"#ibl","aria-label":'Permalink to "IBL"'},"​")],-1)),n[2]||(n[2]=e("p",null,"IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.",-1)),n[3]||(n[3]=e("h2",{id:"_1-ibl의-핵심-구성",tabindex:"-1"},[a("1. IBL의 핵심 구성 "),e("a",{class:"header-anchor",href:"#_1-ibl의-핵심-구성","aria-label":'Permalink to "1. IBL의 핵심 구성"'},"​")],-1)),n[4]||(n[4]=e("p",null,[a("RedGPU의 "),e("strong",null,"이미지 기반 조명"),a("(IBL) 시스템은 HDR 환경 맵 또는 큐브맵 이미지를 분석하여 다음 세 가지 핵심 리소스를 자동으로 생성합니다.")],-1)),s(r,null,{default:t(()=>[s(d,{definition:o})]),_:1}),n[5]||(n[5]=l(`<h3 id="_1-1-방사-조도-텍스처-irradiance-texture" tabindex="-1">1.1 방사 조도 텍스처 (Irradiance Texture) <a class="header-anchor" href="#_1-1-방사-조도-텍스처-irradiance-texture" aria-label="Permalink to &quot;1.1 방사 조도 텍스처 (Irradiance Texture)&quot;">​</a></h3><p>물체의 기본 명암과 주변광(Ambient) 역할을 담당하는 <strong>Diffuse Irradiance Map</strong>입니다. 직접적인 광원이 없는 곳에서도 자연스러운 색감을 부여합니다. (<code>irradianceTexture</code> 속성을 통해 접근)</p><h3 id="_1-2-스펙큘러-프리필터-텍스처-specular-prefilter-texture" tabindex="-1">1.2 스펙큘러 프리필터 텍스처 (Specular Prefilter Texture) <a class="header-anchor" href="#_1-2-스펙큘러-프리필터-텍스처-specular-prefilter-texture" aria-label="Permalink to &quot;1.2 스펙큘러 프리필터 텍스처 (Specular Prefilter Texture)&quot;">​</a></h3><p>물체 표면에 주변 환경이 비치는 효과를 담당하는 <strong>Specular Prefilter Map</strong>입니다. 물리 기반 렌더링(PBR) 재질에서 금속이나 유리 같은 표면의 반사를 현실감 있게 표현합니다. (<code>prefilterTexture</code> 속성을 통해 접근)</p><div class="tip custom-block"><p class="custom-block-title">[조명 리소스 자동 적용]</p><p><code>view.ibl</code> 속성에 <code>IBL</code> 인스턴스를 할당하면, 내부에 생성된 <strong>방사 조도 텍스처</strong>와 <strong>스펙큘러 프리필터 텍스처</strong>가 해당 뷰에서 렌더링되는 모든 PBR 객체에 자동으로 적용됩니다.</p></div><h3 id="_1-3-환경-텍스처-environment-texture" tabindex="-1">1.3 환경 텍스처 (Environment Texture) <a class="header-anchor" href="#_1-3-환경-텍스처-environment-texture" aria-label="Permalink to &quot;1.3 환경 텍스처 (Environment Texture)&quot;">​</a></h3><p>원본 이미지를 고해상도 큐브맵으로 유지한 데이터로, 주로 <strong>SkyBox</strong> 의 시각적 배경 텍스처로 사용됩니다. (<code>environmentTexture</code> 속성을 통해 접근)</p><h2 id="_2-구현하기-생성-및-적용" tabindex="-1">2. 구현하기: 생성 및 적용 <a class="header-anchor" href="#_2-구현하기-생성-및-적용" aria-label="Permalink to &quot;2. 구현하기: 생성 및 적용&quot;">​</a></h2><p>IBL을 적용하려면 리소스를 생성한 후, <strong>View3D</strong>에 등록해야 합니다.</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. IBL 리소스 생성 (HDR 파일 권장)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ibl</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Resource.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">IBL</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    redGPUContext, </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &#39;https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. View에 IBL 적용 (조명 효과)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.ibl </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ibl;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 3. View에 SkyBox 적용 (시각적 배경)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">view.skybox </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> RedGPU.Display.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SkyBox</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(redGPUContext, ibl.environmentTexture);</span></span></code></pre></div><h2 id="_3-라이브-샘플-환경-구성" tabindex="-1">3. 라이브 샘플: 환경 구성 <a class="header-anchor" href="#_3-라이브-샘플-환경-구성" aria-label="Permalink to &quot;3. 라이브 샘플: 환경 구성&quot;">​</a></h2><p>아래 예제는 HDR 소스로부터 IBL과 Skybox를 동시에 생성한 결과입니다. 지금은 단순히 360도 배경이 보일 뿐이지만, 이 공간은 이미 물리적으로 정확한 빛의 데이터를 머금고 있는 상태입니다.</p>`,12)),s(r,null,{default:t(()=>[s(p,{title:"RedGPU Basics - Environmental Setup",slugHash:"env-setup"},{default:t(()=>[...n[0]||(n[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// IBL 및 Skybox 설정
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
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),n[6]||(n[6]=l('<h2 id="_4-진정한-가치-gltf와의-시너지" tabindex="-1">4. 진정한 가치: GLTF와의 시너지 <a class="header-anchor" href="#_4-진정한-가치-gltf와의-시너지" aria-label="Permalink to &quot;4. 진정한 가치: GLTF와의 시너지&quot;">​</a></h2><p>단순히 배경(Skybox)만 보았을 때는 큰 차이가 없게 느껴질 수 있습니다. 하지만 이 환경 설정의 진정한 가치는 다음 장에서 다룰 <strong>GLTF 모델</strong> 을 로드할 때 드러납니다.</p><p>외부에서 제작된 정교한 모델들은 대부분 PBR(물리 기반 렌더링) 재질을 사용합니다. IBL은 이러한 모델들에게 현실적인 반사 데이터와 부드러운 환경광을 제공하여, 모델이 마치 실제 그 공간에 존재하는 것 같은 실사 수준의 질감을 구현하게 해줍니다.</p><h2 id="다음-학습-추천" tabindex="-1">다음 학습 추천 <a class="header-anchor" href="#다음-학습-추천" aria-label="Permalink to &quot;다음 학습 추천&quot;">​</a></h2><p>지금까지 배운 객체와 환경 설정을 바탕으로, 실제 프로젝트에서 어떻게 모델을 불러오고 제어하는지 더 깊이 알아봅시다.</p><ul><li><strong><a href="./../assets/model-loading/">모델 로딩</a></strong></li></ul>',6))])}}});export{b as __pageData,x as default};
