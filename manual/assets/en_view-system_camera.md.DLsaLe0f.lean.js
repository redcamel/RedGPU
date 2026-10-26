import{D as n,o as d,c as o,a2 as t,G as e,w as l,k as a,a as i}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"Camera","description":"","frontmatter":{"title":"Camera","order":4},"headers":[],"relativePath":"en/view-system/camera.md","filePath":"en/view-system/camera.md","lastUpdated":1792987289000}'),c={name:"en/view-system/camera.md"},C=Object.assign(c,{setup(E){const r=`
    graph LR
        World["3D World Coordinates (Scene)"]
        ViewMat["View Matrix (position, lookAt)"]
        ProjMat["Projection Matrix (FOV / Ortho Bounds, Clipping)"]
        Screen["2D Screen Coordinates (View3D)"]

        World -->|View Transform| ViewMat
        ViewMat -->|Projection Transform| ProjMat
        ProjMat -->|Final Output| Screen

        %% Grayscale styles applied
        style World fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style ViewMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ProjMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Screen fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(g,s)=>{const p=n("MermaidResponsive"),h=n("ClientOnly"),k=n("CodePen");return d(),o("div",null,[s[1]||(s[1]=t("",4)),e(h,null,{default:l(()=>[e(p,{definition:r})]),_:1}),s[2]||(s[2]=t("",12)),e(h,null,{default:l(()=>[e(k,{title:"RedGPU Basics - Camera lookAt",slugHash:"camera-lookat"},{default:l(()=>[...s[0]||(s[0]=[a("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),a("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),a("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),a("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),a("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),a("pre",null,[a("code",null,`const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
);
scene.addChild(mesh);

const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

const camera = new RedGPU.Camera.PerspectiveCamera();
camera.y = 8;
camera.fieldOfView = 45;

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    const angle = time / 1000;
    camera.x = Math.sin(angle) * 15;
    camera.z = Math.cos(angle) * 15;
    camera.lookAt(0, 0, 0);
});
`)]),i(`
`),a("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",7))])}}});export{m as __pageData,C as default};
