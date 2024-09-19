import { toFixed, getFilterProperties } from './util';
import { PluginObj } from '@babel/core';
import * as T from '@babel/types';

interface PluginOptions {
  viewportWidth?: number;
  unitPrecision?: number;
  include?: string[]; // 需要处理的属性
  exclude?: string[]; // 不需要处理的属性
}

export default function (
  { types: t }: { types: typeof T },
  options: PluginOptions = {}
): PluginObj {
  const viewportWidth = options.viewportWidth || 750; // 默认值750
  const unitPrecision = options.unitPrecision || 5; // 默认值5
  const excludedProperties = options.exclude || [];
  const includedProperties = options.include || [];

  const filterProperties = getFilterProperties(
    includedProperties,
    excludedProperties
  );

  return {
    name: '@x.render/babel-plugin-transform-jsx-style-units-to-vw',
    visitor: {
      JSXElement(path) {
        const attributes = path.node.openingElement.attributes;
        for (const attr of attributes) {
          if (
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name, { name: 'style' })
          ) {
            const value = attr.value;
            if (value && t.isJSXExpressionContainer(value)) {
              const styleObject = (value.expression as any).properties;
              styleObject.forEach((property: any) => {
                const propName = property.key.name; // 属性名称
                const propValue = property.value; // 属性值

                // 检查属性名是否在excludedProperties中
                const isExcluded = filterProperties.includes(propName);

                // 如果在excludedProperties中，则进行转换
                if (isExcluded) {
                  // 处理变量情况
                  // 检查属性值是否是数字或字符串数字
                  const isNumeric = (val: any) => {
                    return (
                      t.isNumericLiteral(val) ||
                      (t.isStringLiteral(val) && /^\d+$/.test(val.value)) ||
                      t.isIdentifier(val) // 允许变量
                    );
                  };

                  // 如果是数字或字符串数字，则进行处理
                  if (isNumeric(propValue)) {
                    // 将字符串数字转换为数字
                    const numericValue = t.isStringLiteral(propValue)
                      ? t.numericLiteral(parseFloat(propValue.value))
                      : propValue;

                    // 新增逻辑：如果是数字或字符串数字，直接调用外部定义的toFixed函数
                    if (
                      t.isNumericLiteral(numericValue) ||
                      t.isStringLiteral(propValue)
                    ) {
                      property.value = t.binaryExpression(
                        '+',
                        t.numericLiteral(
                          toFixed(
                            (numericValue.value / viewportWidth) * 100,
                            unitPrecision
                          )
                        ),
                        t.stringLiteral('vw')
                      );
                      return; // 直接返回，避免后续逻辑
                    }

                    // 创建新的表达式 (numericValue / viewportWidth) * 100
                    const dividedValue = t.binaryExpression(
                      '/',
                      numericValue,
                      t.numericLiteral(viewportWidth)
                    );

                    const multipliedValue = t.binaryExpression(
                      '*',
                      dividedValue,
                      t.numericLiteral(100)
                    );

                    // 使用toFixed逻辑保留小数位
                    const multiplier = t.numericLiteral(
                      Math.pow(10, unitPrecision + 1)
                    );
                    const wholeNumber = t.callExpression(
                      t.memberExpression(
                        t.identifier('Math'),
                        t.identifier('floor')
                      ),
                      [t.binaryExpression('*', multipliedValue, multiplier)]
                    );

                    const roundedValue = t.binaryExpression(
                      '/',
                      t.binaryExpression(
                        '*',
                        t.callExpression(
                          t.memberExpression(
                            t.identifier('Math'),
                            t.identifier('round')
                          ),
                          [
                            t.binaryExpression(
                              '/',
                              wholeNumber,
                              t.numericLiteral(10)
                            ),
                          ]
                        ),
                        t.numericLiteral(10)
                      ),
                      multiplier
                    );

                    property.value = t.binaryExpression(
                      '+',
                      roundedValue,
                      t.stringLiteral('vw') // 添加vw单位
                    );
                  }
                }
              });
            }
          }
        }
      },
    },
  };
}
