import{D as e,c as d,o as g,a2 as t,H as n,w as h,k as i,a}from"./chunks/framework.cYGcyyTy.js";const F=JSON.parse('{"title":"Scene","description":"","frontmatter":{"title":"Scene","order":3},"headers":[],"relativePath":"ko/view-system/scene.md","filePath":"ko/view-system/scene.md","lastUpdated":1769496586000}'),E={name:"ko/view-system/scene.md"},C=Object.assign(E,{setup(o){const p=`
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager (Uniform Buffer)"]
        Children["Child Nodes (Mesh, Group)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% 커스텀 클래스 적용
        class Scene mermaid-main;
        class LightMgr mermaid-system;
`;return(c,s)=>{const k=e("MermaidResponsive"),l=e("ClientOnly"),r=e("CodePen");return g(),d("div",null,[s[1]||(s[1]=t("",4)),n(l,null,{default:h(()=>[n(k,{definition:p})]),_:1}),s[2]||(s[2]=t("",12)),n(l,null,{default:h(()=>[n(r,{title:"RedGPU Basics - Scene Complete",slugHash:"scene-complete"},{default:h(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=t("",9))])}}});export{F as __pageData,C as default};
