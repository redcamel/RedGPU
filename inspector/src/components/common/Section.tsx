import React, {memo} from 'react';
import {THEME} from './Theme';

/**
 * [KO] 인스펙터 내의 그룹화된 섹션을 표시하는 컴포넌트입니다.
 */
const Section = memo(({title, subTitle, children}: { title: React.ReactNode, subTitle?: React.ReactNode, children: React.ReactNode }) => (
    <div style={sectionStyle}>
        <div style={sectionTitleContainerStyle}>
            <div style={sectionTitleStyle}>{title}</div>
            {subTitle && <div style={sectionSubTitleStyle}>{subTitle}</div>}
        </div>
        {children}
    </div>
));

const sectionStyle: React.CSSProperties = {
    marginBottom: '16px'
};

const sectionTitleContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: `1px solid ${THEME.colors.primary}33`,
    marginBottom: '8px',
    paddingBottom: '4px'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: THEME.fontSize.title,
    color: THEME.colors.primary,
    fontWeight: 'bold',
    fontFamily: THEME.fontFamily
};

const sectionSubTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#888',
    fontStyle: 'italic',
    fontWeight: 'normal',
    marginLeft: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
};
export default Section;