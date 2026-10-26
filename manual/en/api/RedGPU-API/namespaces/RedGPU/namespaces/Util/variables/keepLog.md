[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / keepLog

# Variable: keepLog

> `const` **keepLog**: `any`

Defined in: [src/utils/keepLog.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/keepLog.ts#L12)

A `console.log` function bound to `console` so that it is not stripped in production builds.

### Example
```typescript
RedGPU.Util.keepLog('Important debug message');
```
