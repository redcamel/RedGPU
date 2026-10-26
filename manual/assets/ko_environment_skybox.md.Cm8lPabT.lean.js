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
`;return(x,s)=>{const p=l("MermaidResponsive"),n=l("ClientOnly"),o=l("CodePen");return h(),k("div",null,[s[2]||(s[2]=r("",7)),t(n,null,{default:i(()=>[t(p,{definition:d})]),_:1}),s[3]||(s[3]=r("",13)),t(n,null,{default:i(()=>[t(o,{title:"RedGPU Basics - Skybox (IBL)",slugHash:"skybox-ibl"},{default:i(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),s[5]||(s[5]=r("",6))])}}});export{g as __pageData,b as default};
