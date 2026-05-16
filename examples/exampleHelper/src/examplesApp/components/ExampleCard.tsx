import React, {useState} from 'react';
import {ExampleItem} from '../../types/example';
import {useExamplesStore} from '../store/useExamplesStore';

interface ExampleCardProps {
    item: ExampleItem;
}

const ExampleCard: React.FC<ExampleCardProps> = ({item}) => {
    const language = useExamplesStore(state => state.language);
    const viewMode = useExamplesStore(state => state.viewMode);
    const [hovered, setHovered] = useState(false);

    const thumbUrl = item.path ? `/RedGPU/examples/${item.path}/thumb.png` : '';
    const description = item.description ? (item.description[language] || item.description['en']) : '';

    const handleClick = () => {
        if (item.path) {
            window.location.href = `/RedGPU/examples/${item.path}/index.html`;
        }
    };

    if (viewMode === 'list') {
        return (
            <div 
                style={listCardStyle(hovered)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleClick}
            >
                <img src={thumbUrl} style={listThumbStyle} alt="" />
                <div style={listContentStyle}>
                    <div style={titleStyle}>{item.name}</div>
                    <div style={listDescStyle} dangerouslySetInnerHTML={{__html: description}} />
                </div>
                {item.experimental && <span style={experimentalBadgeStyle}>EXP</span>}
            </div>
        );
    }

    return (
        <div 
            style={cardStyle(hovered)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleClick}
        >
            <div style={thumbWrapperStyle}>
                <img src={thumbUrl} style={thumbStyle(hovered)} alt={item.name} />
                <div style={overlayStyle(hovered)}>
                    <div style={viewButtonStyle}>VIEW EXAMPLE</div>
                </div>
            </div>
            <div style={contentStyle}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <div style={titleStyle}>{item.name}</div>
                    {item.experimental && <span style={experimentalBadgeStyle}>EXPERIMENTAL</span>}
                </div>
                <div style={descStyle} dangerouslySetInnerHTML={{__html: description}} />
            </div>
        </div>
    );
};

// Grid Card Styles
const cardStyle = (hovered: boolean): React.CSSProperties => ({
    backgroundColor: '#111112',
    border: `1px solid ${hovered ? '#444' : '#222'}`,
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: hovered ? 'translateY(-5px)' : 'none',
    boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
});

const thumbWrapperStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    backgroundColor: '#0a0a0b',
};

const thumbStyle = (hovered: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    transform: hovered ? 'scale(1.1)' : 'scale(1)',
});

const overlayStyle = (hovered: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: hovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
});

const viewButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#fdb48d',
    color: '#000',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '4px',
};

const contentStyle: React.CSSProperties = {
    padding: '16px',
};

const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#eee',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const descStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#888',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '36px',
};

const experimentalBadgeStyle: React.CSSProperties = {
    fontSize: '9px',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
};

// List Card Styles
const listCardStyle = (hovered: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: hovered ? '#1a1a1c' : 'transparent',
    borderBottom: '1px solid #222',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    gap: '15px',
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

const listDescStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '500px',
};

export default ExampleCard;
