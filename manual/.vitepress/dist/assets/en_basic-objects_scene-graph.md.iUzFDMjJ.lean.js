import{$ as e,Q as d,j as o,m as t,o as n,ax as h,g as i,n as a}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"Scene Graph","description":"","frontmatter":{"title":"Scene Graph","order":2},"headers":[],"relativePath":"en/basic-objects/scene-graph.md","filePath":"en/basic-objects/scene-graph.md","lastUpdated":1781142511000}'),E={name:"en/basic-objects/scene-graph.md"},C=Object.assign(E,{setup(g){const p=`
    Scene["Scene (Root)"] --> ParentMesh["Parent Mesh (Parent)"]
    ParentMesh --> ChildMesh1["Child Mesh A (Child)"]
    ParentMesh --> ChildMesh2["Child Mesh B (Child)"]
    ChildMesh2 --> GrandChild["Grandchild Mesh (Grandchild)"]

    %% Grayscale styles applied
    style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style ParentMesh fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style ChildMesh1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style ChildMesh2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GrandChild fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(c,s)=>{const k=e("MermaidResponsive"),l=e("ClientOnly"),r=e("CodePen");return d(),o("div",null,[s[1]||(s[1]=t("",5)),n(l,null,{default:h(()=>[n(k,{definition:p})]),_:1}),s[2]||(s[2]=t("",10)),n(l,null,{default:h(()=>[n(r,{title:"RedGPU Basics - Mesh Hierarchy",slugHash:"mesh-hierarchy"},{default:h(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera();
camera.z = -15; camera.y = 5;
camera.lookAt(0, 0, 0);`),a(`
`),i("pre",null,[i("code",null,`const sun = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
);
scene.addChild(sun);

const earth = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
);
earth.x = 7;
sun.addChild(earth);

const moon = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
    new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
);
moon.x = 2;
earth.addChild(moon);

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    sun.rotationY += 1;
    earth.rotationY += 2;
});
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",5))])}}});export{F as __pageData,C as default};
