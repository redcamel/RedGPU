import{D as l,o,c as E,a2 as h,G as t,w as e,k as i,a}from"./chunks/framework.Dn9yU8Jh.js";const u=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{"title":"Getting Started","order":1},"headers":[],"relativePath":"en/introduction/index.md","filePath":"en/introduction/index.md","lastUpdated":1769512807000}'),g={name:"en/introduction/index.md"},F=Object.assign(g,{setup(c){const k=`
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    Scene -->|Contains| Mesh["RedGPU.Display.Mesh"]
    Mesh -->|Combines| Geo["Geometry"] & Mat["Material"]
`,r=`
    Start(["Start"]) --> Init["RedGPU.init Initialization"] 
    Init -->|Success| Context["Obtain redGPUContext"]
    Context --> Create["Create Resources<br/>Scene, Camera, Mesh"]
    Create --> SetupView["Setup View3D"]
    SetupView --> StartLoop["Start Rendering Loop"]
    StartLoop -->|Loop| Update["Update Frame"]
    Update --> Render["Render Screen"]
    Render --> Update
`;return(y,s)=>{const d=l("CodePen"),n=l("ClientOnly"),p=l("MermaidResponsive");return o(),E("div",null,[s[1]||(s[1]=h("",19)),t(n,null,{default:e(()=>[t(d,{title:"RedGPU Quick Start - Rotating Cube",slugHash:"getting-started"},{default:e(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=i("br",null,null,-1)),s[3]||(s[3]=i("h2",{id:"system-structure-execution-flow",tabindex:"-1"},[a("System Structure & Execution Flow "),i("a",{class:"header-anchor",href:"#system-structure-execution-flow","aria-label":'Permalink to "System Structure & Execution Flow"'},"​")],-1)),s[4]||(s[4]=i("p",null,"Diagram showing major class relationships and application lifecycle in RedGPU.",-1)),s[5]||(s[5]=i("h3",{id:"execution-process",tabindex:"-1"},[a("Execution Process "),i("a",{class:"header-anchor",href:"#execution-process","aria-label":'Permalink to "Execution Process"'},"​")],-1)),t(n,null,{default:e(()=>[t(p,{definition:r})]),_:1}),s[6]||(s[6]=h("",2)),t(n,null,{default:e(()=>[t(p,{definition:k})]),_:1}),s[7]||(s[7]=h("",3))])}}});export{u as __pageData,F as default};
