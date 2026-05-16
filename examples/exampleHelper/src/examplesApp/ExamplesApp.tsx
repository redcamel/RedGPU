import React from 'react';
import {useExamplesStore} from './store/useExamplesStore';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from '../common/components/Footer';
import {useAppInitialization} from './hooks/useAppInitialization';
import './styles/common.css';

const ExamplesApp: React.FC = () => {
    const searchQuery = useExamplesStore(state => state.searchQuery);

    // [KO] 앱 초기화 및 전역 이벤트 관리 훅
    // [EN] Hook for app initialization and global event management
    useAppInitialization();

    return (
        <div className="examples-app">
            <Header />
            {!searchQuery && <CategoryNav />}
            <div className="layout-wrapper">
                <Sidebar />
                <MainContent />
            </div>
            <Footer useSourceModal={false} />
        </div>
    );
};

export default ExamplesApp;
