import{D as l,o,c as E,a2 as h,G as e,w as t,k as i,a}from"./chunks/framework.Dn9yU8Jh.js";const m=JSON.parse('{"title":"Getting Started","description":"","frontmatter":{},"headers":[],"relativePath":"en/guide/introduction/index.md","filePath":"en/guide/introduction/index.md","lastUpdated":1769586579000}'),g={name:"en/guide/introduction/index.md"},u=Object.assign(g,{setup(c){const k=`
    Renderer[RedGPU.Renderer] -->|Draws| View[RedGPU.Display.View3D]
    View -->|Composes| Scene[RedGPU.Display.Scene]
    View -->|Uses| Camera[RedGPU.Camera]
    Scene -->|Contains| Mesh[RedGPU.Display.Mesh]
    Mesh -->|Combines| Geo[Geometry] & Mat[Material]

    %% Apply Custom Classes
    class Renderer mermaid-system;
    class View mermaid-main;
    class Geo,Mat mermaid-component;
`,r=`
    Start([Start]) --> Init[RedGPU.init Initialization]
    Init -->|Success| Context[Obtain RedContext]
    Context --> Create[Create Resources<br/>Scene, Camera, Mesh]
    Create --> SetupView[Configure View3D]
    SetupView --> StartLoop[Start Rendering Loop]
    StartLoop -->|Loop| Update[Update Frame]
    Update --> Render[Draw Frame]
    Render --> Update
`;return(y,s)=>{const d=l("CodePen"),n=l("ClientOnly"),p=l("MermaidResponsive");return o(),E("div",null,[s[1]||(s[1]=h("",19)),e(n,null,{default:t(()=>[e(d,{title:"RedGPU Quick Start - Rotating Cube",slugHash:"getting-started"},{default:t(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redContext) => {
const scene = new RedGPU.Display.Scene(redContext);
const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
camera.z = -5;`),a(`
`),i("pre",null,[i("code",null,`    const geometry = new RedGPU.Primitive.Box(redContext); 
    const material = new RedGPU.Material.ColorMaterial(redContext, "#00CC99");
    const mesh = new RedGPU.Display.Mesh(redContext, geometry, material);
    
    scene.addChild(mesh);

    const view = new RedGPU.Display.View3D(redContext, scene, camera);
    redContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redContext, (time) => {
        mesh.rotationX += 1;
        mesh.rotationY += 1;
    });
},
(error) => {
    console.error("RedGPU initialization failed:", error);
}
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[2]||(s[2]=i("br",null,null,-1)),s[3]||(s[3]=i("h2",{id:"system-architecture-flow",tabindex:"-1"},[a("System Architecture & Flow "),i("a",{class:"header-anchor",href:"#system-architecture-flow","aria-label":'Permalink to "System Architecture & Flow"'},"​")],-1)),s[4]||(s[4]=i("p",null,"The following diagrams illustrate the relationship between major classes and the application lifecycle in RedGPU.",-1)),s[5]||(s[5]=i("h3",{id:"execution-flow",tabindex:"-1"},[a("Execution Flow "),i("a",{class:"header-anchor",href:"#execution-flow","aria-label":'Permalink to "Execution Flow"'},"​")],-1)),e(n,null,{default:t(()=>[e(p,{definition:r})]),_:1}),s[6]||(s[6]=h("",2)),e(n,null,{default:t(()=>[e(p,{definition:k})]),_:1}),s[7]||(s[7]=h("",3))])}}});export{m as __pageData,u as default};
