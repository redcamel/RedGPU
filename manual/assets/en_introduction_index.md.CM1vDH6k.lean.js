import{D as l,o,c as E,a2 as h,G as e,w as t,k as i,a}from"./chunks/framework.DpNgdNqH.js";const u=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{"title":"Getting Started","order":1},"headers":[],"relativePath":"en/introduction/index.md","filePath":"en/introduction/index.md","lastUpdated":1770625747000}'),g={name:"en/introduction/index.md"},F=Object.assign(g,{setup(c){const r=`
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]

    %% Apply custom classes
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`,k=`
    Start(["Start"]) --> Init["RedGPU.init Initialization"] 
    Init -->|Success| Context["Obtain redGPUContext"]
    Context --> Create["Create Resources<br/>Scene, Camera, Mesh"]
    Create --> SetupView["Setup View3D"]
    SetupView --> StartLoop["Start Rendering Loop"]
    StartLoop -->|Loop| Update["Frame Update"]
    Update --> Render["Render Screen"]
    Render --> Update
`;return(y,s)=>{const d=l("CodePen"),n=l("ClientOnly"),p=l("MermaidResponsive");return o(),E("div",null,[s[1]||(s[1]=h("",19)),e(n,null,{default:t(()=>[e(d,{title:"RedGPU Quick Start - Rotating Cube",slugHash:"getting-started"},{default:t(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
camera.z = -5;`),a(`
`),i("pre",null,[i("code",null,`    const geometry = new RedGPU.Primitive.Box(redGPUContext); 
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    
    scene.addChild(mesh);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
},
(error) => {
    console.error("RedGPU initialization failed:", error);
}
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=i("br",null,null,-1)),s[3]||(s[3]=i("h2",{id:"system-architecture-execution-flow",tabindex:"-1"},[a("System Architecture & Execution Flow "),i("a",{class:"header-anchor",href:"#system-architecture-execution-flow","aria-label":'Permalink to "System Architecture & Execution Flow"'},"​")],-1)),s[4]||(s[4]=i("p",null,"This diagram illustrates the relationships between major classes and the application lifecycle in RedGPU.",-1)),s[5]||(s[5]=i("h3",{id:"execution-process",tabindex:"-1"},[a("Execution Process "),i("a",{class:"header-anchor",href:"#execution-process","aria-label":'Permalink to "Execution Process"'},"​")],-1)),e(n,null,{default:t(()=>[e(p,{definition:k})]),_:1}),s[6]||(s[6]=h("",2)),e(n,null,{default:t(()=>[e(p,{definition:r})]),_:1}),s[7]||(s[7]=h("",3))])}}});export{u as __pageData,F as default};
