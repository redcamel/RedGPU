/**
 * [KO] PerspectiveCamera를 위한 테스트 패널을 생성합니다.
 * [EN] Creates a test pane for PerspectiveCamera.
 *
 * @param {object} pane - Tweakpane 인스턴스 또는 폴더 [Tweakpane instance or folder]
 * @param {PerspectiveCamera} camera - 대상 카메라 인스턴스 [Target camera instance]
 * @param {boolean} openYn - 폴더 확장 여부 (기본값: true) [Whether to expand the folder (default: true)]
 */
const createPerspectiveCameraTest = (pane, camera, openYn = true) => {
    const folder = pane.addFolder({
        title: 'PerspectiveCamera',
        expanded: openYn
    });

    // 1. 투영 설정 (Projection)
    folder.addBinding(camera, 'fieldOfView', { label: 'FOV (deg)', min: 1, max: 179, step: 0.1 });

    // 2. 물리적 노출 설정 (Physical Exposure)
    const exposureFolder = folder.addFolder({ title: 'Exposure', expanded: true });
    exposureFolder.addBinding(camera, 'aperture', { label: 'Aperture (f-stop)', min: 1.0, max: 32.0, step: 0.1 });
    exposureFolder.addBinding(camera, 'shutterSpeed', { label: 'Shutter Speed (s)', min: 0.00025, max: 1.0, step: 0.0001 });
    exposureFolder.addBinding(camera, 'iso', { label: 'ISO', min: 50, max: 3200, step: 1 });
    
    // 결과 EV100 표시 (Read-only)
    exposureFolder.addBinding(camera, 'ev100', { label: 'EV100', readonly: true, view: 'text', format: (v) => v.toFixed(2) });
};

export default createPerspectiveCameraTest;
