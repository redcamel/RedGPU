import {describe, expect, it} from 'vitest';
import {
    getAbsoluteURL,
    getFileExtension,
    getFileName,
    getFilePath
} from '../../../src/utils/file';

describe('Util.file', () => {
    // getFilePath 디렉터리 경로 추출 및 빈 문자열·NaN·null 차단 검증
    it('extracts directory path with getFilePath and rejects invalid inputs', () => {
        expect(getFilePath('https://example.com/assets/textures/diffuse.png')).toBe(
            'https://example.com/assets/textures/'
        );
        expect(() => getFilePath('')).toThrow();
        expect(() => getFilePath(NaN as unknown as string)).toThrow();
        expect(() => getFilePath(null as unknown as string)).toThrow();
    });

    // getFileName 파일명 추출 및 null 입력 차단 검증
    it('extracts file name with getFileName and rejects null', () => {
        expect(getFileName('path/to/image.png')).toBe('image.png');
        expect(() => getFileName(null as unknown as string)).toThrow();
    });

    // getFileExtension 소문자 확장자 추출, 확장자 미존재 및 undefined 처리 검증
    it('extracts lowercase extension with getFileExtension and handles no extension', () => {
        expect(getFileExtension('IMAGE.PNG')).toBe('png');
        expect(getFileExtension('filename')).toBe('');
        expect(() => getFileExtension(undefined as unknown as string)).toThrow();
    });

    // getAbsoluteURL 상대 경로·상위 디렉터리(../) 해석 및 비정상 입력 차단 검증
    it('resolves relative URLs with getAbsoluteURL and rejects invalid inputs', () => {
        expect(getAbsoluteURL('https://example.com/path/', 'image.png')).toBe(
            'https://example.com/path/image.png'
        );
        // URL 인스턴스를 기준 경로로 전달하는 케이스
        expect(getAbsoluteURL(new URL('https://example.com/path/'), 'image.png')).toBe(
            'https://example.com/path/image.png'
        );
        // 상위 디렉터리(../) 상대 경로 해석 검증
        expect(getAbsoluteURL('https://example.com/a/b/', '../image.png')).toBe(
            'https://example.com/a/image.png'
        );

        expect(() => getAbsoluteURL(null as unknown as string, 'file.txt')).toThrow();
        expect(() => getAbsoluteURL('https://a.com', '')).toThrow();
        expect(() => getAbsoluteURL('invalid-base', 'relative')).toThrow();
    });
});
