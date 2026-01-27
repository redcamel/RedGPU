import{D as l,c as o,o as k,a2 as r,H as i,k as s,w as a,a as t}from"./chunks/framework.cYGcyyTy.js";const u=JSON.parse('{"title":"Skybox","description":"","frontmatter":{"order":1},"headers":[],"relativePath":"ko/environment/skybox.md","filePath":"ko/environment/skybox.md","lastUpdated":1769498891000}'),g={name:"ko/environment/skybox.md"},b=Object.assign(g,{setup(c){const d=`
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    HDRSource -->|new| HDRTex["RedGPU.Resource.HDRTexture"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    HDRTex --> Skybox
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% 커스텀 클래스 적용
    class View3D,Skybox mermaid-main;
    class IBL,HDRTex,CubeTex mermaid-component;
`;return(y,e)=>{const p=l("MermaidResponsive"),n=l("ClientOnly"),h=l("CodePen");return k(),o("div",null,[e[2]||(e[2]=r("",7)),i(n,null,{default:a(()=>[i(p,{definition:d})]),_:1}),e[3]||(e[3]=r("",16)),i(n,null,{default:a(()=>[i(h,{title:"RedGPU Basics - Skybox (IBL)",slugHash:"skybox-ibl"},{default:a(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),e[4]||(e[4]=s("h3",{id:"b-큐브맵-방식-6장-이미지",tabindex:"-1"},[t("B. 큐브맵 방식 (6장 이미지) "),s("a",{class:"header-anchor",href:"#b-큐브맵-방식-6장-이미지","aria-label":'Permalink to "B. 큐브맵 방식 (6장 이미지)"'},"​")],-1)),i(n,null,{default:a(()=>[i(h,{title:"RedGPU Basics - Skybox (CubeMap)",slugHash:"skybox-cubemap"},{default:a(()=>[...e[1]||(e[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),e[5]||(e[5]=r("",4))])}}});export{u as __pageData,b as default};
