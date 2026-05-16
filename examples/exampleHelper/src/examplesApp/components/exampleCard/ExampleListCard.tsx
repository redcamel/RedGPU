import React from 'react';
import {ExampleItem} from '../../../types/example';

interface CardProps {
    item: ExampleItem;
    language: 'ko' | 'en';
    hovered: boolean;
    isNarrow: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export const ExampleListCard: React.FC<CardProps> = ({
    item, language, hovered, isNarrow, onClick, onMouseEnter, onMouseLeave
}) => {
    const thumbUrl = item.path ? `/RedGPU/examples/${item.path}/thumb.webp` : '';
    const description = item.description ? (item.description[language] || item.description['en']) : '';
    
    // [KO] SEO: HTML 태그를 제거한 순수 텍스트 추출 및 언어별 alt 텍스트 적용
    // [EN] SEO: Extract plain text without HTML tags and apply localized alt text
    const plainDescription = description.replace(/<[^>]*>?/gm, '').trim();
    const altSuffix = language === 'ko' ? 'RedGPU WebGPU 예제' : 'RedGPU WebGPU Example';
    const imageAlt = `${item.name} - ${altSuffix}`;
    const imageTitle = plainDescription || item.name;
    
    const href = item.path ? `/RedGPU/examples/${item.path}/index.html` : '#';

    return (
        <a 
            href={href}
            style={{...listCardStyle(hovered, isNarrow), textDecoration: 'none', display: 'flex'}}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={(e) => {
                // [KO] 기본 이동은 허용하되, 필요한 경우 추가 로직 수행
            }}
        >
            <img src={thumbUrl} style={listThumbStyle} alt={imageAlt} title={imageTitle} loading="lazy" />
            <div style={listContentStyle}>
                <div style={{...titleStyle, fontSize: isNarrow ? '12px' : '14px'}}>{item.name}</div>
                {!isNarrow && <div style={listDescStyle} dangerouslySetInnerHTML={{__html: description}} />}
            </div>
            {item.experimental && <span style={experimentalBadgeStyle}>EXP</span>}
        </a>
    );
};

const listCardStyle = (hovered: boolean, isNarrow: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: isNarrow ? '8px 10px' : '10px 15px',
    backgroundColor: hovered ? '#1a1a1c' : 'transparent',
    borderBottom: '1px solid #222',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    gap: isNarrow ? '10px' : '15px',
});

const listThumbStyle: React.CSSProperties = {
    width: '60px',
    height: '34px',
    borderRadius: '4px',
    objectFit: 'cover',
};

const listContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
};

const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#eee',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const listDescStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '500px',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '9px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
};export default ExampleListCard;