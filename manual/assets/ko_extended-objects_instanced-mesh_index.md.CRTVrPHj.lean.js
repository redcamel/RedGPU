import{D as a,o as d,c as r,k as i,a as n,G as e,w as E,a2 as t}from"./chunks/framework.n5RLHRfo.js";const F=JSON.parse('{"title":"Instancing Mesh","description":"","frontmatter":{"title":"Instancing Mesh","order":2},"headers":[],"relativePath":"ko/extended-objects/instanced-mesh/index.md","filePath":"ko/extended-objects/instanced-mesh/index.md","lastUpdated":1792987289000}'),c={name:"ko/extended-objects/instanced-mesh/index.md"},C=Object.assign(c,{setup(o){const h=`
    CPU["CPU (1 Draw Call)"] -->|전송| GPU["GPU (버퍼 연산)"]
    GPU --> Inst1["Instance 1"]
    GPU --> Inst2["Instance 2"]
    GPU --> InstN["Instance N..."]

    %% 회색조 스타일 적용
    style CPU fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GPU fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Inst1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Inst2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style InstN fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(g,s)=>{const l=a("MermaidResponsive"),p=a("ClientOnly"),k=a("ExampleFrame");return d(),r("div",null,[s[0]||(s[0]=i("h1",{id:"instancing-mesh",tabindex:"-1"},[n("Instancing Mesh "),i("a",{class:"header-anchor",href:"#instancing-mesh","aria-label":'Permalink to "Instancing Mesh"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"인스턴싱 메시"),n("(Instancing Mesh)는 동일한 지오메트리와 재질을 공유하는 수천, 수만 개의 객체를 단 한 번의 "),i("strong",null,"드로우 콜"),n("(Draw Call)로 렌더링하는 고성능 객체입니다. 숲 (나무), 잔디, 군중 등을 표현할 때 필수적입니다.")],-1)),e(p,null,{default:E(()=>[e(l,{definition:h})]),_:1}),s[2]||(s[2]=t("",11)),e(k,{src:"/RedGPU/examples/3d/instancedMesh/simple/",style:{width:"100%",height:"500px"}}),s[3]||(s[3]=t("",7))])}}});export{F as __pageData,C as default};
