[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / keepLog

# Variable: keepLog

> `const` **keepLog**: `any`

Defined in: [src/utils/keepLog.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/keepLog.ts#L12)

프로덕션 빌드에서도 제거되지 않도록 `console`에 바인딩된 `console.log` 함수입니다.

### Example
```typescript
RedGPU.Util.keepLog('Important debug message');
```
