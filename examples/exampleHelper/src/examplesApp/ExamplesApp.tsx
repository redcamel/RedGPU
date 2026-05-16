import React, {useEffect} from 'react';
import {useExamplesStore} from './store/useExamplesStore';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from '../common/components/Footer';
import './styles/common.css';

const ExamplesApp: React.FC = () => {
    const restoreState = useExamplesStore(state => state.restoreState);
    const setIsNarrow = useExamplesStore(state => state.setIsNarrow);
    const setSidebarOpen = useExamplesStore(state => state.setSidebarOpen);
    const searchQuery = useExamplesStore(state => state.searchQuery);

    useEffect(() => {
        restoreState();

        const handleResize = () => {
            const narrow = window.innerWidth <= 768;
            setIsNarrow(narrow);
            if (narrow) setSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, [restoreState, setIsNarrow, setSidebarOpen]);

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
