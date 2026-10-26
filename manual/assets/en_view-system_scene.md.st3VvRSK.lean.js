import{D as n,o as k,c as o,a2 as t,G as e,w as l,k as a,a as i}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"Scene","description":"","frontmatter":{"title":"Scene","order":3},"headers":[],"relativePath":"en/view-system/scene.md","filePath":"en/view-system/scene.md","lastUpdated":1792993711000}'),c={name:"en/view-system/scene.md"},P=Object.assign(c,{setup(g){const p=`
    graph TD
        Scene["RedGPU.Display.Scene (Root Scene)"]
        LightMgr["LightManager"]
        ShadowMgr["ShadowManager"]
        PhysicsEngine["PhysicsEngine"]
        Children["Child Nodes (Mesh, Group3D)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Owns| ShadowMgr
        Scene -->|Owns| PhysicsEngine
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% Grayscale styles applied
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ShadowMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style PhysicsEngine fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Children fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(E,s)=>{const d=n("MermaidResponsive"),h=n("ClientOnly"),r=n("CodePen");return k(),o("div",null,[s[1]||(s[1]=t("",4)),e(h,null,{default:l(()=>[e(d,{definition:p})]),_:1}),s[2]||(s[2]=t("",6)),e(h,null,{default:l(()=>[e(r,{title:"RedGPU Basics - Scene Complete",slugHash:"scene-complete"},{default:l(()=>[...s[0]||(s[0]=[a("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),a("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),a("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),a("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),a("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),a("pre",null,[a("code",null,`// Lighting
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

// Add Object (TorusKnot)
const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
);
scene.addChild(mesh);

// View & Render
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true;
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationY += 1;
    mesh.rotationX += 0.5;
});
`)]),i(`
`),a("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",15))])}}});export{m as __pageData,P as default};
