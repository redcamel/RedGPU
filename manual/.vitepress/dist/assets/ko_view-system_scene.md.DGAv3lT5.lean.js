import{$ as e,Q as d,j as o,m as t,o as n,ax as h,g as i,n as a}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Scene","description":"","frontmatter":{"title":"Scene","order":3},"headers":[],"relativePath":"ko/view-system/scene.md","filePath":"ko/view-system/scene.md","lastUpdated":1781136698000}'),g={name:"ko/view-system/scene.md"},C=Object.assign(g,{setup(E){const k=`
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager"]
        ShadowMgr["ShadowManager"]
        PhysicsEngine["PhysicsEngine"]
        Children["Child Nodes (Mesh, Group)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Owns| ShadowMgr
        Scene -->|Owns| PhysicsEngine
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% 회색조 스타일 일괄 적용
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ShadowMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style PhysicsEngine fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Children fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(c,s)=>{const p=e("MermaidResponsive"),l=e("ClientOnly"),r=e("CodePen");return d(),o("div",null,[s[1]||(s[1]=t("",4)),n(l,null,{default:h(()=>[n(p,{definition:k})]),_:1}),s[2]||(s[2]=t("",12)),n(l,null,{default:h(()=>[n(r,{title:"RedGPU Basics - Scene Complete",slugHash:"scene-complete"},{default:h(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),i("pre",null,[i("code",null,`// Lighting
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
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",18))])}}});export{F as __pageData,C as default};
