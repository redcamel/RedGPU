import{D as t,o as d,c as o,k as s,a as i,G as e,w as n,a2 as p}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"Texture","description":"","frontmatter":{"title":"Texture","order":3},"headers":[],"relativePath":"en/basic-objects/texture.md","filePath":"en/basic-objects/texture.md","lastUpdated":1792987289000}'),g={name:"en/basic-objects/texture.md"},u=Object.assign(g,{setup(c){const h=`
    Img["Image URL/File"] -->|Load| Texture["BitmapTexture (Resource)"]
    Texture -->|Reference| Material["BitmapMaterial (Material)"]
    Material -->|Apply| Mesh["Mesh (Display Object)"]

    %% Grayscale styles applied
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(E,a)=>{const r=t("MermaidResponsive"),l=t("ClientOnly"),k=t("CodePen");return d(),o("div",null,[a[1]||(a[1]=s("h1",{id:"texture",tabindex:"-1"},[i("Texture "),s("a",{class:"header-anchor",href:"#texture","aria-label":'Permalink to "Texture"'},"​")],-1)),a[2]||(a[2]=s("p",null,[i("By applying real photos or illustrations to an object's surface instead of simple colors, you can create much more realistic 3D objects. In RedGPU, image files are loaded as "),s("strong",null,"BitmapTexture"),i(" and applied to objects using "),s("strong",null,"BitmapMaterial"),i(".")],-1)),e(l,null,{default:n(()=>[e(r,{definition:h})]),_:1}),a[3]||(a[3]=p("",11)),e(l,null,{default:n(()=>[e(k,{title:"RedGPU Basics - Texture",slugHash:"mesh-texture"},{default:n(()=>[...a[0]||(a[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[i(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),i(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),i(`
`),s("pre",null,[s("code",null,`const texture = new RedGPU.Resource.BitmapTexture(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg'
);

const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture);

const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext), 
    material
);
scene.addChild(mesh);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationX += 1;
    mesh.rotationY += 1;
});
`)]),i(`
`),s("p",null,"});"),i(`
`)],-1)])]),_:1})]),_:1}),a[4]||(a[4]=p("",6))])}}});export{m as __pageData,u as default};
