import{$ as e,Q as d,j as g,g as s,n as a,o as t,ax as n,m as h}from"./chunks/framework.D5MFXpji.js";const m=JSON.parse('{"title":"Phong Material","description":"","frontmatter":{"title":"Phong Material","order":2},"headers":[],"relativePath":"en/lighting-and-shadow/phong-material.md","filePath":"en/lighting-and-shadow/phong-material.md","lastUpdated":1781143738000}'),o={name:"en/lighting-and-shadow/phong-material.md"},u=Object.assign(o,{setup(E){const p=`
    Ambient["Ambient Light"] --> Phong["Phong Reflection"]
    Diffuse["Diffuse Reflection"] --> Phong
    Specular["Specular Reflection"] --> Phong

    %% Grayscale styles applied
    style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Diffuse fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Specular fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Phong fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(y,i)=>{const r=e("MermaidResponsive"),l=e("ClientOnly"),k=e("CodePen");return d(),g("div",null,[i[1]||(i[1]=s("h1",{id:"phong-material",tabindex:"-1"},[a("Phong Material "),s("a",{class:"header-anchor",href:"#phong-material","aria-label":'Permalink to "Phong Material"'},"​")],-1)),i[2]||(i[2]=s("p",null,[s("strong",null,"Phong Material"),a(" is a material that implements the "),s("strong",null,"Phong Reflection Model"),a(", one of the most widely used lighting models in 3D graphics. Beyond simply painting colors, you can realistically adjust the texture of an object using various "),s("strong",null,"Texture Maps"),a(".")],-1)),t(l,null,{default:n(()=>[t(r,{definition:p})]),_:1}),i[3]||(i[3]=h("",11)),t(l,null,{default:n(()=>[t(k,{title:"RedGPU Basics - Phong Material Texture",slugHash:"phong-material-texture"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

const material = new RedGPU.Material.PhongMaterial(redGPUContext);
const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');

material.displacementScale = 0.5;
material.shininess = 32;

const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
    material
);
scene.addChild(mesh);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    mesh.rotationY += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=h("",6))])}}});export{m as __pageData,u as default};
