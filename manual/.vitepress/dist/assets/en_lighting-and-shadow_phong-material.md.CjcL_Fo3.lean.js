import{f as r,D as t,o as k,c as d,a2 as e,G as n,w as l,k as s,a}from"./chunks/framework.DpNgdNqH.js";const x=JSON.parse('{"title":"Phong Material","description":"","frontmatter":{"title":"Phong Material","order":1},"headers":[],"relativePath":"en/lighting-and-shadow/phong-material.md","filePath":"en/lighting-and-shadow/phong-material.md","lastUpdated":1769835435000}'),g={name:"en/lighting-and-shadow/phong-material.md"};function o(E,i,y,c,m,u){const h=t("CodePen"),p=t("ClientOnly");return k(),d("div",null,[i[1]||(i[1]=e("",13)),n(p,null,{default:l(()=>[n(h,{title:"RedGPU Basics - Phong Material Texture",slugHash:"phong-material-texture"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
material.specularPower = 32;

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
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=e("",6))])}const C=r(g,[["render",o]]);export{x as __pageData,C as default};
