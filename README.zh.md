# babel-plugin-transform-style-units-to-vw

<p>
<a  href="https://www.npmjs.com/package/@x.render/babel-plugin-transform-jsx-style-units-to-vw"  target="__blank"><img  src="https://img.shields.io/npm/v/@x.render/babel-plugin-transform-jsx-style-units-to-vw"  alt="NPM version"  /></a>
  
<a  href="https://www.npmjs.com/package/@x.render/babel-plugin-transform-jsx-style-units-to-vw"  target="__blank"><img  src="https://img.shields.io/npm/dm/%40x.render%2Fbabel-plugin-transform-jsx-style-units-to-vw"  alt="NPM Downloads"  /></a>
  
</p>
  
[English document](./README.md)
  
用于将 React 组件中的 style 没有单位的属性值转换为视口单位（vw）。该插件支持多种配置选项，允许你自定义视口宽度、单位精度以及需要处理或排除的属性
  
## 安装
  
  
```bash
npm  install  --save-dev  @x.render/babel-plugin-transform-jsx-style-units-to-vw
```
  
或者
  
```bash
yarn  add  --dev  @x.render/babel-plugin-transform-jsx-style-units-to-vw
```
  
## 使用
  
在你的 Babel 配置文件中（例如 .babelrc 或 babel.config.js），添加此插件并配置相关选项。
  
### .babelrc
  
```json
{
  "presets": ["@babel/preset-react"],
  "plugins": [
    [
      "@x.render/babel-plugin-transform-jsx-style-units-to-vw",
      {
        "viewportWidth": 750,
        "unitPrecision": 5,
      }
    ]
  ]
}
```
  
### babel.config.js
  
```js
module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [
    [
      '@x.render/babel-plugin-transform-jsx-style-units-to-vw',
    ]
  ]
};
```
  
## 配置选项

- **`viewportWidth`**(默认值: 750)
  - 视口宽度(设计图尺寸)，用于计算`vw`单位。
- **`unitPrecision`**(默认值: 5)
  - 转换后的数值的小数位数。
- **`include`**(可选)
  - 一个字符串数组，包含需要转换为`vw`单位的 CSS 属性名称。
- **`exclude`**(可选)
  - 一个字符串数组，包含不需要转换为`vw`单位的 CSS 属性名称。这些属性将被排除在外，即使它们在`include`数组中。

## 示例

假设你有以下 React 组件：

```jsx
import React from 'react';
const MyComponent = () => (
  <div style={{ width: 100, height: 200, fontSize: 16 }}>Hello, World!</div>
);
export default MyComponent;
```

使用插件后，生成的代码将如下所示：

```jsx
import React from 'react';
const MyComponent = () => (
  <div
    style={{ width: '13.33333vw', height: '26.66667vw', fontSize: '2.13333vw' }}
  >
    Hello, World!
  </div>
);
```

支持动态参数解析：

```jsx
import React from 'react';
const MyComponent = ({ height }) => (
  <div style={{ width: 100, height, fontSize: 16 }}>Hello, World!</div>
);
export default MyComponent;
```

使用插件后，生成的代码将如下所示：

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

## 注意

- 插件只会转换插件内部和 include 的属性，如果你使用过程中发现有些属性不进行转换，请使用 exclude 进行配置。
- 插件只会转换没有携带单位的属性，比如：{height:100}或者{height:'100'}，会被处理，而{height:'100px'}、{height:'100%'}、{height:'100vm'}等带有其他单位的则不回被处理。
