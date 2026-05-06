import React from 'react';
import {THEME} from './Theme';

/**
 * [KO] 인스펙터 내의 그룹화된 섹션을 표시하는 컴포넌트입니다.
 */
const Section = ({title, children}: { title: string, children: React.ReactNode }) => (
    <div style={sectionStyle}>
        <div style={sectionTitleStyle}>{title}</div>
        {children}
    </div>
);

const sectionStyle: React.CSSProperties = {
    marginBottom: '16px'
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: THEME.fontSize.title,
    color: THEME.colors.primary,
    marginBottom: '8px',
    fontWeight: 'bold',
    borderBottom: `1px solid ${THEME.colors.primary}33`,
    paddingBottom: '4px',
    fontFamily: THEME.fontFamily
};
export default Section;