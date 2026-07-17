import{$ as n,Q as d,j as k,g as s,n as a,o as e,ax as t,m as o}from"./chunks/framework.D5MFXpji.js";const m=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"en/assets/model-loading/index.md","filePath":"en/assets/model-loading/index.md","lastUpdated":1784264306000}'),g={name:"en/assets/model-loading/index.md"},F=Object.assign(g,{setup(E){const h=`
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
`;return(c,i)=>{const p=n("MermaidResponsive"),l=n("ClientOnly"),r=n("CodePen");return d(),k("div",null,[i[1]||(i[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[a("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),i[2]||(i[2]=s("p",null,[a("While you can create basic shapes with "),s("strong",null,"Primitives"),a(", high-quality assets such as detailed characters or buildings need to be created in external 3D tools (Blender, Maya, etc.) and then imported. RedGPU provides the "),s("strong",null,"GLTFLoader"),a(", which supports loading the web 3D standard format "),s("strong",null,"glTF"),a(" (GL Transmission Format) 2.0.")],-1)),e(l,null,{default:t(()=>[e(p,{definition:h})]),_:1}),i[3]||(i[3]=o("",13)),e(l,null,{default:t(()=>[e(r,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3; // Adjust the camera distance

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// Set up IBL and a Skybox
const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);
        
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            loader.resultMesh.rotationY += 1;
        });
    }
);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=s("h2",{id:"next-steps",tabindex:"-1"},[a("Next Steps "),s("a",{class:"header-anchor",href:"#next-steps","aria-label":'Permalink to "Next Steps"'},"​")],-1)),i[5]||(i[5]=s("p",null,"Learn about image-based objects that will enrich the 3D space alongside text.",-1)),i[6]||(i[6]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./../sprite/"},"Sprite")])])],-1))])}}});export{m as __pageData,F as default};
