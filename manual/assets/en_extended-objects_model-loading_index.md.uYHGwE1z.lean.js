import{D as i,o as p,c as k,k as e,a,G as t,w as n,a2 as r}from"./chunks/framework.n5RLHRfo.js";const f=JSON.parse('{"title":"GLTF Loader","description":"While you can create basic shapes with Primitives, high-quality assets such as detailed characters or buildings need to be created in external 3D tools...","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"en/extended-objects/model-loading/index.md","filePath":"en/extended-objects/model-loading/index.md","lastUpdated":1794650641000}'),c={name:"en/extended-objects/model-loading/index.md"},y=Object.assign(c,{setup(g){const d=`
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
`;return(E,s)=>{const o=i("MermaidResponsive"),l=i("ClientOnly"),h=i("CodePen");return p(),k("div",null,[s[1]||(s[1]=e("h1",{id:"gltf-loader",tabindex:"-1"},[a("GLTF Loader "),e("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),s[2]||(s[2]=e("p",null,[a("While you can create basic shapes with "),e("strong",null,"Primitives"),a(", high-quality assets such as detailed characters or buildings need to be created in external 3D tools (Blender, Maya, etc.) and then imported. RedGPU provides the "),e("a",{href:"/RedGPU/manual/en/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"},[e("code",null,"GLTFLoader")]),a(", which supports loading the web 3D standard format "),e("strong",null,"glTF"),a(" (GL Transmission Format) 2.0.")],-1)),t(l,null,{default:n(()=>[t(o,{definition:d})]),_:1}),s[3]||(s[3]=r("",9)),t(l,null,{default:n(()=>[t(h,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:n(()=>[...s[0]||(s[0]=[e("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),e("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),e("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),e("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),a(`
`),e("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),a(`
`),e("pre",null,[e("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
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
`)]),a(`
`),e("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=r("",11))])}}});export{f as __pageData,y as default};
