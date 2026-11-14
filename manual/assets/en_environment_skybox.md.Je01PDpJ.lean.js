import{D as l,o as h,c,a2 as r,G as t,w as n,k as e,a}from"./chunks/framework.n5RLHRfo.js";const y=JSON.parse('{"title":"Skybox","description":"Skybox is a technique for representing an infinite background in 3D space. It is rendered by creating a SkyBox object and assigning it to the skybox pro...","frontmatter":{"order":1},"headers":[],"relativePath":"en/environment/skybox.md","filePath":"en/environment/skybox.md","lastUpdated":1794650641000}'),k={name:"en/environment/skybox.md"},x=Object.assign(k,{setup(g){const d=`
    HDRSource["HDR Source (.hdr)"] -->|new| IBL["RedGPU.Resource.IBL"]
    Images["6 Images"] -->|new| CubeTex["RedGPU.Resource.CubeTexture"]

    IBL -->|.environmentTexture| Skybox["RedGPU.Display.SkyBox"]
    CubeTex --> Skybox

    Skybox -->|view.skybox| View3D["RedGPU.Display.View3D"]

    %% Grayscale styles applied
    style HDRSource fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Images fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style IBL fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style CubeTex fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Skybox fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View3D fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(u,s)=>{const p=l("MermaidResponsive"),i=l("ClientOnly"),o=l("CodePen");return h(),c("div",null,[s[2]||(s[2]=r("",7)),t(i,null,{default:n(()=>[t(p,{definition:d})]),_:1}),s[3]||(s[3]=r("",13)),t(i,null,{default:n(()=>[t(o,{title:"RedGPU Basics - Skybox (IBL)",slugHash:"skybox-ibl"},{default:n(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// 1. Create IBL and Apply SkyBox
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
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=e("h3",{id:"b-cubemap-method-6-images",tabindex:"-1"},[a("B. CubeMap Method (6 Images) "),e("a",{class:"header-anchor",href:"#b-cubemap-method-6-images","aria-label":'Permalink to "B. CubeMap Method (6 Images)"'},"​")],-1)),t(i,null,{default:n(()=>[t(o,{title:"RedGPU Basics - Skybox (CubeMap)",slugHash:"skybox-cubemap"},{default:n(()=>[...s[1]||(s[1]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),e("pre",null,[e("code",null,`// Create CubeTexture (Order: px, nx, py, ny, pz, nz)
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
`)],-1)])]),_:1})]),_:1}),s[5]||(s[5]=r("",6))])}}});export{y as __pageData,x as default};
