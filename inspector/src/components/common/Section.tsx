import React, {memo} from 'react';
import {THEME} from './Theme';
import ToggleButton from "./ToggleButton";

/**
 * [KO] 인스펙터 내의 그룹화된 섹션을 표시하는 컴포넌트입니다.
 * 접고 펼치기 기능을 지원합니다.
 */
const Section = memo(({title, subTitle, children, isExpanded, onToggle}: {
    title: React.ReactNode,
    subTitle?: React.ReactNode,
    children: React.ReactNode,
    isExpanded?: boolean,
    onToggle?: () => void
}) => (
    <div style={sectionStyle}>
        <div
            style={{...sectionTitleContainerStyle, cursor: onToggle ? 'pointer' : 'default'}}
            onClick={onToggle}
        >
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1}}>
                {onToggle && (
                    <ToggleButton isExpanded={!!isExpanded}/>
                )}
                <div style={sectionTitleStyle}>{title}</div>
            </div>
            {subTitle && <div style={sectionSubTitleStyle}>{subTitle}</div>}
        </div>
        {(!onToggle || isExpanded) && (
            <div style={contentAreaStyle}>
                {children}
            </div>
        )}
    </div>
));

const sectionStyle: React.CSSProperties = {
    marginBottom: '16px'
};

const sectionTitleContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${THEME.colors.primary}33`,
    marginBottom: '8px',
    paddingBottom: '4px',
    userSelect: 'none'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: THEME.fontSize.title,
    color: THEME.colors.primary,
    fontWeight: 'bold',
    fontFamily: THEME.fontFamily,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

const sectionSubTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#888',
    fontStyle: 'italic',
    fontWeight: 'normal',
    marginLeft: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flexShrink: 0
};

const contentAreaStyle: React.CSSProperties = {
    padding: '0 2px'
};

export default Section;