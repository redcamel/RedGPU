import{D as i,o as h,c as k,k as e,a as n,G as s,w as t,a2 as l}from"./chunks/framework.Dn9yU8Jh.js";const m=JSON.parse('{"title":"IBL","description":"","frontmatter":{"order":2},"headers":[],"relativePath":"ko/environment/ibl.md","filePath":"ko/environment/ibl.md","lastUpdated":1769512249000}'),c={name:"ko/environment/ibl.md"},x=Object.assign(c,{setup(u){const o=`
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

    %% 커스텀 클래스 적용
    class IBL,Skybox mermaid-main;
    class Irradiance,Specular,Environment,PBR mermaid-component;
`;return(b,a)=>{const d=i("MermaidResponsive"),r=i("ClientOnly"),p=i("CodePen");return h(),k("div",null,[a[1]||(a[1]=e("h1",{id:"ibl",tabindex:"-1"},[n("IBL "),e("a",{class:"header-anchor",href:"#ibl","aria-label":'Permalink to "IBL"'},"​")],-1)),a[2]||(a[2]=e("p",null,"IBL은 주변 환경의 이미지를 광원으로 사용하여 물체를 비추는 방식입니다. 단순한 광원만으로는 표현하기 힘든 사실적인 반사와 전역 조명 효과를 제공하여 3D 씬의 사실감을 극대화합니다.",-1)),a[3]||(a[3]=e("h2",{id:"_1-ibl의-핵심-구성",tabindex:"-1"},[n("1. IBL의 핵심 구성 "),e("a",{class:"header-anchor",href:"#_1-ibl의-핵심-구성","aria-label":'Permalink to "1. IBL의 핵심 구성"'},"​")],-1)),a[4]||(a[4]=e("p",null,[n("RedGPU의 "),e("strong",null,"이미지 기반 조명"),n("(IBL) 시스템은 HDR 환경 맵 또는 큐브맵 이미지를 분석하여 다음 세 가지 핵심 리소스를 자동으로 생성합니다.")],-1)),s(r,null,{default:t(()=>[s(d,{definition:o})]),_:1}),a[5]||(a[5]=l("",11)),s(r,null,{default:t(()=>[s(p,{title:"RedGPU Basics - Environmental Setup",slugHash:"env-setup"},{default:t(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
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
`)]),n(`
`),e("p",null,"});"),n(`
`)],-1)])]),_:1})]),_:1}),a[6]||(a[6]=l("",6))])}}});export{m as __pageData,x as default};
