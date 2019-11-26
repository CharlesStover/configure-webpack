# configureWebpack

`configureWebpack` is a Webpack configuration helper utility that automatically
generates common Webpack configurations for NPM modules, including image, SASS,
and TypeScript support.

## Use

```javascript
// webpack.config.js
const configureWebpack = require('configure-webpack');
module.exports = configureWebpack({ sass: true, typescript: true });
```

## Options

### css
If you are using vanilla CSS files (not [SASS](#sass)) in your package, set the
`css` property to `true`.

### sass

If you are using SASS files in your package, set the `sass` property to `true`.

### typescript

If you are using TypeScript in your package, set the `typescript` property to
`true`.

## TypeScript

To add images to your TypeScript project, create the following files:

```typescript
// src/types/images.d.ts
declare module '*.gif' {
  const _: string;
  export default _;
}

declare module '*.jpg' {
  const _: string;
  export default _;
}

declare module '*.png' {
  const _: string;
  export default _;
}
```
