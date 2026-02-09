import{D as i,o as h,c,k as e,a as n,G as t,w as s,a2 as l}from"./chunks/framework.DpNgdNqH.js";const y=JSON.parse('{"title":"IBL","description":"","frontmatter":{"order":2},"headers":[],"relativePath":"en/environment/ibl.md","filePath":"en/environment/ibl.md","lastUpdated":1770637469000}'),u={name:"en/environment/ibl.md"},b=Object.assign(u,{setup(m){const o=`
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

    %% Apply custom classes
    class IBL,Skybox mermaid-main;
    class Irradiance,Specular,Environment,PBR mermaid-component;
`;return(g,a)=>{const d=i("MermaidResponsive"),r=i("ClientOnly"),p=i("CodePen");return h(),c("div",null,[a[1]||(a[1]=e("h1",{id:"ibl",tabindex:"-1"},[n("IBL "),e("a",{class:"header-anchor",href:"#ibl","aria-label":'Permalink to "IBL"'},"​")],-1)),a[2]||(a[2]=e("p",null,"IBL (Image-Based Lighting) is a method of lighting objects using images of the surrounding environment as light sources. It provides realistic reflections and global illumination effects that are difficult to express with simple light sources alone, maximizing the realism of 3D scenes.",-1)),a[3]||(a[3]=e("h2",{id:"_1-core-components-of-ibl",tabindex:"-1"},[n("1. Core Components of IBL "),e("a",{class:"header-anchor",href:"#_1-core-components-of-ibl","aria-label":'Permalink to "1. Core Components of IBL"'},"​")],-1)),a[4]||(a[4]=e("p",null,[n("RedGPU's "),e("strong",null,"Image-Based Lighting"),n(" (IBL) system analyzes HDR environment maps or cubemap images to automatically create the following three core resources.")],-1)),t(r,null,{default:s(()=>[t(d,{definition:o})]),_:1}),a[5]||(a[5]=l("",12)),t(r,null,{default:s(()=>[t(p,{title:"RedGPU Basics - Environmental Setup",slugHash:"env-setup"},{default:s(()=>[...a[0]||(a[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[n(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById("redgpu-canvas");'),n(`
`),e("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),n(`
`),e("pre",null,[e("code",null,`// Set up IBL and a SkyBox
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
`)],-1)])]),_:1})]),_:1}),a[6]||(a[6]=l("",6))])}}});export{y as __pageData,b as default};
