# @i/webpack-svgr-plugin

Webpack plugin to run [SVGR](https://github.com/gregberge/svgr). Will watch the input directory during development.



### Getting Started

Initialize and pass the plugin to Webpack. The plugin will read the `.idsconfig.json` file in the project root.
<br>

```js
// webpack.config.js
const IntouchThemePlugin = require('@i/webpack-theme-plugin')

// ...
webpackPlugins.push(new IntouchThemePlugin())
```
<br>

```jsonc
// .idsconfig.json
{
    "values": "theme/values.json",
    "groups": "theme/groups.json",
    "components": "theme/components.json",
    "variants": "theme/variants.json",
    "output": "theme/theme.js"
}
```
<br>
