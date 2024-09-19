const { transformSync } = require('@babel/core');
const plugin = require('../lib/index');

describe('Babel Plugin: transform-jsx-style-units-to-vw', () => {
  const transformCode = (code, options = {}) => {
    return transformSync(code, {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-runtime', [plugin, options]],
    }).code;
  };

  test('transforms numeric style values to vw with default options', () => {
    const input = `<div style={{ width: 100, height: 200 }} />`;
    const output = `<div style={{ width: 13.33333 + "vw", height: 26.66667 + "vw" }} />`;
    expect(transformCode(input)).toEqual(transformCode(output));
  });

  test('transforms numeric style values to vw with custom viewportWidth', () => {
    const input = `<div style={{ width: 100 }} />`;
    const output = `<div style={{ width: 20 + "vw" }} />`; // 100 / 500 * 100
    expect(transformCode(input, { viewportWidth: 500 })).toEqual(
      transformCode(output)
    );
  });

  test('transforms numeric style values to vw with custom unitPrecision', () => {
    const input = `<div style={{ width: 100 }} />`;
    const output = `<div style={{ width: 13.333 + "vw" }} />`; // 100 / 750 * 100
    expect(transformCode(input, { unitPrecision: 3 })).toEqual(
      transformCode(output)
    );
  });

  test('ignores excluded properties', () => {
    const input = `<div style={{ width: 100, height: 200, margin: 10 }} />`;
    const output = `<div style={{ width: 13.33 + "vw", height: 26.67 + "vw", margin: 10 }} />`;
    expect(
      transformCode(input, { exclude: ['margin'], unitPrecision: 2 })
    ).toEqual(transformCode(output, { exclude: ['margin'], unitPrecision: 2 }));
  });

  test('handles string numeric values', () => {
    const input = `<div style={{ width: '100', height: '200' }} />`;
    const output = `<div style={{ width: 13.33 + "vw", height: 26.67 + "vw" }} />`;
    expect(transformCode(input, { unitPrecision: 2 })).toEqual(
      transformCode(output)
    );
  });

  test('handles variables in style', () => {
    const input = `<div style={{ width: variableWidth }} />`;
    const output = `width: Math.round(Math.floor(variableWidth / 750 * 100 * 1000000) / 10) * 10 / 1000000 + "vw"`;
    expect(transformCode(input)).toContain(output);
  });
});
