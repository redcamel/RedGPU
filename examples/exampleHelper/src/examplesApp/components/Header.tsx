import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import CategoryNav from './CategoryNav';
import ViewControls from './ViewControls';
import Logo from './header/Logo';
import SearchInput from './header/SearchInput';
import HeaderActions from './header/HeaderActions';

const Header: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const isCompact = useExamplesStore(state => state.isCompact);
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const sidebarOpen = useExamplesStore(state => state.sidebarOpen);

    if (isNarrow) {
        return (
            <header style={{
                ...headerStyle,
                margin: '16px 16px 0 16px',
                height: '46px',
                gap: '12px',
            }}>
                <Logo/>
                {!isCompact && !searchQuery && <CategoryNav/>}
                <div style={centerSectionStyle}>
                    <SearchInput/>
                </div>
            </header>
        );
    }

    return (
        <header style={{
            ...headerStyle,
            margin: '20px 20px 0 20px',
            height: '46px',
            gap: '12px',
        }}>
            <div style={leftGroupStyle}>
                <div style={{
                    ...brandColumnStyle,
                    width: (!searchQuery && sidebarOpen) ? '272px' : 'auto',
                }}>
                    <Logo/>
                </div>
                {!searchQuery && <CategoryNav/>}
            </div>

            <div style={rightGroupStyle}>
                <div style={desktopSearchWrapperStyle}>
                    <SearchInput/>
                </div>
                {!!searchQuery && <ViewControls/>}
                <HeaderActions/>
            </div>
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '46px',
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 100,
    flexShrink: 0,
};

const leftGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '0 0 auto',
};

const brandColumnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexShrink: 0,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const rightGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '8px',
    flex: '1 1 auto',
    minWidth: 0,
};

const desktopSearchWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '220px',
    minWidth: '100px',
    flex: '0 1 220px',
};

const toggleSidebarButton: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    backgroundColor: 'rgba(18, 18, 20, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    color: '#fdb48d',
    cursor: 'pointer',
    fontSize: '11px',
    transition: 'background-color 0.18s',
    boxSizing: 'border-box',
    flexShrink: 0,
};

const centerSectionStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 0,
};

export default Header;
