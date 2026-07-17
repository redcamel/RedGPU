import{$ as e,Q as r,j as d,g as s,n as a,o as n,ax as l,m as o}from"./chunks/framework.D5MFXpji.js";const F=JSON.parse('{"title":"GLTF Loader","description":"","frontmatter":{"title":"GLTF Loader","order":1},"headers":[],"relativePath":"ko/assets/model-loading/index.md","filePath":"ko/assets/model-loading/index.md","lastUpdated":1784265003000}'),E={name:"ko/assets/model-loading/index.md"},u=Object.assign(E,{setup(g){const h=`
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
`;return(y,i)=>{const p=e("MermaidResponsive"),t=e("ClientOnly"),k=e("CodePen");return r(),d("div",null,[i[1]||(i[1]=s("h1",{id:"gltf-loader",tabindex:"-1"},[a("GLTF Loader "),s("a",{class:"header-anchor",href:"#gltf-loader","aria-label":'Permalink to "GLTF Loader"'},"​")],-1)),i[2]||(i[2]=s("p",null,[s("strong",null,"Primitive"),a(" 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴(Blender, Maya 등)에서 제작하여 가져와야 합니다. RedGPU는 웹 3D 표준 포맷인 "),s("strong",null,"glTF"),a("(GL Transmission Format) 2.0 로딩을 지원하는 "),s("strong",null,"GLTFLoader"),a(" 를 제공합니다.")],-1)),n(t,null,{default:l(()=>[n(p,{definition:h})]),_:1}),i[3]||(i[3]=o("",13)),n(t,null,{default:l(()=>[n(k,{title:"RedGPU Basics - GLTF Loader with IBL",slugHash:"gltf-loader"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 3; // 카메라 거리 조절

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
redGPUContext.addView(view);

// IBL 및 Skybox 설정
const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    (loader) => {
        scene.addChild(loader.resultMesh);
        
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext, () => {
            loader.resultMesh.rotationY += 1;
        });
    }
);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=s("h2",{id:"다음-단계",tabindex:"-1"},[a("다음 단계 "),s("a",{class:"header-anchor",href:"#다음-단계","aria-label":'Permalink to "다음 단계"'},"​")],-1)),i[5]||(i[5]=s("p",null,"텍스트와 함께 3D 공간을 풍성하게 채워줄 이미지 기반의 객체들에 대해 알아봅니다.",-1)),i[6]||(i[6]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./../sprite/"},"스프라이트")])])],-1))])}}});export{F as __pageData,u as default};
