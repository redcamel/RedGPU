import{$ as e,Q as d,j as o,g as s,n as a,o as t,ax as n,m as h}from"./chunks/framework.D5MFXpji.js";const u=JSON.parse('{"title":"Texture","description":"","frontmatter":{"title":"Texture","order":3},"headers":[],"relativePath":"en/basic-objects/texture.md","filePath":"en/basic-objects/texture.md","lastUpdated":1781143738000}'),g={name:"en/basic-objects/texture.md"},m=Object.assign(g,{setup(E){const p=`
    Img["Image URL/File"] -->|Load| Texture["BitmapTexture (Resource)"]
    Texture -->|Reference| Material["BitmapMaterial (Material)"]
    Material -->|Apply| Mesh["Mesh (Display Object)"]

    %% Grayscale styles applied
    style Img fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Texture fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(c,i)=>{const r=e("MermaidResponsive"),l=e("ClientOnly"),k=e("CodePen");return d(),o("div",null,[i[1]||(i[1]=s("h1",{id:"texture",tabindex:"-1"},[a("Texture "),s("a",{class:"header-anchor",href:"#texture","aria-label":'Permalink to "Texture"'},"​")],-1)),i[2]||(i[2]=s("p",null,[a("By applying real photos or illustrations to an object's surface instead of simple colors, you can create much more realistic 3D objects. In RedGPU, image files are loaded as "),s("strong",null,"BitmapTexture"),a(" and applied to objects using "),s("strong",null,"BitmapMaterial"),a(".")],-1)),t(l,null,{default:n(()=>[t(r,{definition:p})]),_:1}),i[3]||(i[3]=h("",17)),t(l,null,{default:n(()=>[t(k,{title:"RedGPU Basics - Texture",slugHash:"mesh-texture"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
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
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",5))])}}});export{u as __pageData,m as default};
