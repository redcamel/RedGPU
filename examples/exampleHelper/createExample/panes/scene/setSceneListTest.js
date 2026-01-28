import {setSingleSceneTest} from "../index.js?t=1769586122100";

const setSceneListTest = (pane, sceneList, shouldExpand = false,) => {
    const title = sceneList.length === 1 ? sceneList[0].name : 'sceneList';
    const folder = pane.addFolder({
        title: title,
        expanded: shouldExpand
    });

    if (sceneList.length === 1) {
        setSingleSceneTest(folder, sceneList[0], true,)
    } else {
        console.log('sceneList', sceneList)
        const tab = folder.addTab({
            pages: sceneList.map(view => {
                return ({title: view.name.replace(/Instance/g, '')})
            })
        });

        assignSceneToTestTabs(sceneList, tab);
    }
}
export default setSceneListTest;

function assignSceneToTestTabs(sceneList, tab) {
    sceneList.forEach((view, index) => {
        setSingleSceneTest(tab.pages[index], view, true)
    });
}
