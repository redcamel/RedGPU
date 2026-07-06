import{$ as a,Q as k,j as p,g as i,n as t,o as n,ax as r,m as d}from"./chunks/framework.D5MFXpji.js";const c=JSON.parse('{"title":"SkyAtmosphere","description":"","frontmatter":{"title":"SkyAtmosphere","order":3},"headers":[],"relativePath":"ko/environment/skyatmosphere.md","filePath":"ko/environment/skyatmosphere.md","lastUpdated":1783326997000}'),o={name:"ko/environment/skyatmosphere.md"},F=Object.assign(o,{setup(g){const e=`
    Sun["Sun (DirectionalLight)"] -->|빛의 방향 제공| Atmosphere["SkyAtmosphere (대기 산란 계산)"]
    Atmosphere -->|배경 렌더링| View["View3D (배경 및 포스트 이펙트 적용)"]

    %% 회색조 스타일 적용
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(E,s)=>{const l=a("MermaidResponsive"),h=a("ClientOnly");return k(),p("div",null,[s[0]||(s[0]=i("h1",{id:"skyatmosphere",tabindex:"-1"},[t("SkyAtmosphere "),i("a",{class:"header-anchor",href:"#skyatmosphere","aria-label":'Permalink to "SkyAtmosphere"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"SkyAtmosphere"),t("는 물리 기반 대기 산란(Atmospheric Scattering) 시뮬레이션 시스템입니다. 레일리 산란(Rayleigh Scattering), 미 산란(Mie Scattering), 오존 흡수(Ozone Absorption) 등을 실시간으로 계산하여 사실적인 하늘, 저녁 노을, 그리고 고도와 거리에 따른 공중 원근법(Aerial Perspective) 효과를 제공합니다.")],-1)),n(h,null,{default:r(()=>[n(l,{definition:e})]),_:1}),s[2]||(s[2]=d("",23))])}}});export{c as __pageData,F as default};
