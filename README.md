# babel-plugin-transform-style-units-to-vw

<p>
<a href="https://www.npmjs.com/package/@x.render/babel-plugin-transform-jsx-style-units-to-vw" target="__blank"><img src="https://img.shields.io/npm/v/@x.render/babel-plugin-transform-jsx-style-units-to-vw" alt="NPM version" /></a>

<a href="https://www.npmjs.com/package/@x.render/babel-plugin-transform-jsx-style-units-to-vw" target="__blank"><img src="https://img.shields.io/npm/dm/%40x.render%2Fbabel-plugin-transform-jsx-style-units-to-vw" alt="NPM Downloads" /></a>

</p>

[中文文档](./README.zh.md)

This is a Babel plugin for converting unitless style attribute values in React components to viewport units (vw). The plugin supports multiple configuration options, allowing you to customize the viewport width, unit precision, and the properties to include or exclude.

## Install

```bash
npm  install  --save-dev  @x.render/babel-plugin-transform-jsx-style-units-to-vw
```

or

```bash
yarn  add  --dev  @x.render/babel-plugin-transform-jsx-style-units-to-vw
```

## Usage

In your Babel configuration file (e.g., .babelrc or babel.config.js), add this plugin and configure the relevant options.

### .babelrc

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    [
      "@x.render/babel-plugin-transform-jsx-style-units-to-vw",
      {
        "viewportWidth": 750,
        "unitPrecision": 5
      }
    ]
  ]
}
```

### babel.config.js

```js
module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [['@x.render/babel-plugin-transform-jsx-style-units-to-vw']],
};
```

## Options

- **`viewportWidth`**(Default: 750)
  - The viewport width (design size) used to calculate the`vw`unit.
- **`unitPrecision`**(Default: 5)
  - The number of decimal places for the converted values.
- **`include`**(Optional)
  - An array of strings that specifies the CSS property names to be converted to`vw`units.
- **`exclude`**(Optional)
  - An array of strings that specifies the CSS property names that should not be converted to`vw`units. These properties will be excluded even if they are in the`include`array.

## Example

Assume you have the following React component:

```jsx
import React from 'react';
const MyComponent = () => (
  <div style={{ width: 100, height: 200, fontSize: 16 }}>Hello, World!</div>
);
export default MyComponent;
```

After using the plugin, the generated code will look like this:

```jsx
import React from 'react';
const MyComponent = () => (
 <div style={{ width: "13.33333vw", height: "26.66667vw," fontSize: "2.13333vw" }}>
 Hello, World!
 </div>
);
```

Supports dynamic parameter resolution:

```jsx
import React from 'react';
const MyComponent = ({ height }) => (
  <div style={{ width: 100, height, fontSize: 16 }}>Hello, World!</div>
);
export default MyComponent;
```

After using the plugin, the generated code will look like this:

```jsx
import React from 'react';
const MyComponent = ({ height }) => (
  <div
    style={{
      width: '13.33333vw',
      height:
        (10 * Math.round(Math.floor((j / 750) * 100 * 1e6) / 10)) / 1e6 + 'vw',
      fontSize: '2.13333vw',
    }}
  >
    Hello, World!
  </div>
);
export default MyComponent;
```

## Notes

- The plugin will only convert properties that are included in the include array. If you find that some properties are not being converted, use the exclude option to configure them.
- The plugin will only convert properties that do not have units. For example, {height: 100} or {height: '100'} will be processed, while properties with other units such as {height: '100px'}, {height: '100%'}, and {height: '100vm'} will not be processed.
