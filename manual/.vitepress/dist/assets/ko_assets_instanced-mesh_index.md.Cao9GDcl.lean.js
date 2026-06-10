import{$ as n,Q as p,j as e,g as i,n as a,o as h,ax as E,m as r}from"./chunks/framework.D5MFXpji.js";const c=JSON.parse('{"title":"Instancing Mesh","description":"","frontmatter":{"title":"Instancing Mesh","order":2},"headers":[],"relativePath":"ko/assets/instanced-mesh/index.md","filePath":"ko/assets/instanced-mesh/index.md","lastUpdated":1781133167000}'),d={name:"ko/assets/instanced-mesh/index.md"},o=Object.assign(d,{setup(g){const k=`
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
`;return(y,s)=>{const t=n("MermaidResponsive"),l=n("ClientOnly");return p(),e("div",null,[s[0]||(s[0]=i("h1",{id:"instancing-mesh",tabindex:"-1"},[a("Instancing Mesh "),i("a",{class:"header-anchor",href:"#instancing-mesh","aria-label":'Permalink to "Instancing Mesh"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"인스턴싱 메시"),a(" (Instancing Mesh) 는 동일한 지오메트리 와 재질 을 공유하는 수천, 수만 개의 객체를 단 한 번의 "),i("strong",null,"드로우 콜"),a(" (Draw Call) 로 렌더링하는 고성능 객체입니다. 숲( 나무), 잔디, 파티클, 군중 등을 표현할 때 필수적입니다.")],-1)),h(l,null,{default:E(()=>[h(t,{definition:k})]),_:1}),s[2]||(s[2]=r("",18))])}}});export{c as __pageData,o as default};
