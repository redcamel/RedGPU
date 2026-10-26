[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / keepLog

# Variable: keepLog

> `const` **keepLog**: `any`

Defined in: [src/utils/keepLog.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/keepLog.ts#L12)

A `console.log` function bound to `console` so that it is not stripped in production builds.

### Example
```typescript
RedGPU.Util.keepLog('Important debug message');
```
