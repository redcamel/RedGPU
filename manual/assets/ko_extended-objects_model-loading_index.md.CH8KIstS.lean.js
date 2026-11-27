import{D as i,o,c as k,k as s,a,G as t,w as n,a2 as r}from"./chunks/framework.n5RLHRfo.js";const f=JSON.parse('{"title":"GLTF Loader","description":"Primitive 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴 (Blender, Maya 등)에서 제작하여 가져와야 합니다. RedGPU는 웹 3D 표준 포맷인 glTF(GL Transmission Format) 2.0 로딩...","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"ko/extended-objects/model-loading/index.md","filePath":"ko/extended-objects/model-loading/index.md","lastUpdated":1795745455000}'),g={name:"ko/extended-objects/model-loading/index.md"},m=Object.assign(g,{setup(c){const d=`
    GLTF[".gltf / .glb 파일"] -->|비동기 로드 및 파싱| Loader["GLTFLoader (로더)"]
    Loader -->|PBRMaterial 생성| Mat["Material (재질)"]
    Loader -->|Geometry 파싱| Geo["Geometry (지오메트리)"]
    Mat --> Mesh["resultMesh (최종 메시)"]
    Geo --> Mesh

    %% 회색조 스타일 적용
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(E,e)=>{const h=i("MermaidResponsive"),l=i("ClientOnly"),p=i("CodePen");return o(),k("div",null,[e[1]||(e[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[a("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),e[2]||(e[2]=s("p",null,[s("strong",null,"Primitive"),a(" 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴 (Blender, Maya 등)에서 제작하여 가져와야 합니다. RedGPU는 웹 3D 표준 포맷인 "),s("strong",null,"glTF"),a("(GL Transmission Format) 2.0 로딩을 지원하는 "),s("a",{href:"/RedGPU/manual/ko/api/RedGPU-API/namespaces/RedGPU/classes/GLTFLoader.html"},[s("code",null,"GLTFLoader")]),a(" 를 제공합니다.")],-1)),t(l,null,{default:n(()=>[t(h,{definition:d})]),_:1}),e[3]||(e[3]=r("",9)),t(l,null,{default:n(()=>[t(p,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:n(()=>[...e[0]||(e[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),a(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

let targetMesh;
new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loader) => {
        targetMesh = loader.resultMesh;
        scene.addChild(targetMesh);
    }
);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, () => {
    if (targetMesh) targetMesh.rotationY += 1;
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),e[4]||(e[4]=r("",18))])}}});export{f as __pageData,m as default};
