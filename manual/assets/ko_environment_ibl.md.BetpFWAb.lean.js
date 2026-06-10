import{$ as t,Q as h,j as k,g as e,n as s,o as n,ax as i,m as l}from"./chunks/framework.D5MFXpji.js";const x=JSON.parse('{"title":"IBL","description":"","frontmatter":{"order":2},"headers":[],"relativePath":"ko/environment/ibl.md","filePath":"ko/environment/ibl.md","lastUpdated":1781131524000}'),c={name:"ko/environment/ibl.md"},b=Object.assign(c,{setup(u){const o=`
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

    %% 회색조 스타일 적용
    style HDR fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Cube fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Irradiance fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Specular fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Environment fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
    style Skybox fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`;return(f,a)=>{const d=t("MermaidResponsive"),r=t("ClientOnly"),p=t("CodePen");return h(),k("div",null,[a[1]||(a[1]=e("h1",{id:"ibl",tabindex:"-1"},[s("IBL "),e("a",{class:"header-anchor",href:"#ibl","aria-label":'Permalink to "IBL"'},"​")],-1)),a[2]||(a[2]=e("p",null,"IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.",-1)),a[3]||(a[3]=e("h2",{id:"_1-ibl의-핵심-구성",tabindex:"-1"},[s("1. IBL의 핵심 구성 "),e("a",{class:"header-anchor",href:"#_1-ibl의-핵심-구성","aria-label":'Permalink to "1. IBL의 핵심 구성"'},"​")],-1)),a[4]||(a[4]=e("p",null,[s("RedGPU의 "),e("strong",null,"이미지 기반 조명"),s("(IBL) 시스템은 HDR 환경 맵 또는 큐브맵 이미지를 분석하여 다음 세 가지 핵심 리소스를 자동으로 생성합니다.")],-1)),n(r,null,{default:i(()=>[n(d,{definition:o})]),_:1}),a[5]||(a[5]=l("",12)),n(r,null,{default:i(()=>[n(p,{title:"RedGPU Basics - Environmental Setup",slugHash:"env-setup"},{default:i(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[s(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),s(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),s(`
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
`)]),s(`
`),e("p",null,"});"),s(`
`)],-1)])]),_:1})]),_:1}),a[6]||(a[6]=l("",6))])}}});export{x as __pageData,b as default};
