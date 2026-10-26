import{D as n,o as k,c as o,k as s,a as e,G as i,w as l,a2 as h}from"./chunks/framework.n5RLHRfo.js";const y=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"en/extended-objects/model-loading/index.md","filePath":"en/extended-objects/model-loading/index.md","lastUpdated":1792987289000}'),c={name:"en/extended-objects/model-loading/index.md"},F=Object.assign(c,{setup(E){const d=`
    GLTF[".gltf / .glb File"] -->|Async Load & Parse| Loader["GLTFLoader (Loader)"]
    Loader -->|Create PBRMaterial| Mat["Material (Surface)"]
    Loader -->|Parse Geometry| Geo["Geometry (Skeleton)"]
    Mat --> Mesh["resultMesh (Final Mesh)"]
    Geo --> Mesh

    %% Grayscale styles applied
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(g,a)=>{const p=n("MermaidResponsive"),t=n("ClientOnly"),r=n("CodePen");return k(),o("div",null,[a[1]||(a[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[e("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),a[2]||(a[2]=s("p",null,[e("While you can create basic shapes with "),s("strong",null,"Primitives"),e(", high-quality assets such as detailed characters or buildings need to be created in external 3D tools (Blender, Maya, etc.) and then imported. RedGPU provides the "),s("a",{href:"/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"},[s("code",null,"GLTFLoader")]),e(", which supports loading the web 3D standard format "),s("strong",null,"glTF"),e(" (GL Transmission Format) 2.0.")],-1)),i(t,null,{default:l(()=>[i(p,{definition:d})]),_:1}),a[3]||(a[3]=h("",9)),i(t,null,{default:l(()=>[i(r,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:l(()=>[...a[0]||(a[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),e(`
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
`)]),e(`
`),s("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),a[4]||(a[4]=h("",7))])}}});export{y as __pageData,F as default};
