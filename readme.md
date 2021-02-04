# @i/webpack-svgr-plugin

Webpack plugin to run [SVGR](https://github.com/gregberge/svgr) and watch the directory for changes to rerun as necessary.



### Getting Started

Initialize and pass the plugin to Webpack. The plugin will read the `.idsconfig.json` file in the project root. The plugin will use the "icons" property filepath.
<br>

```js
// webpack.config.js
const IntouchSVGRPlugin = require('@i/webpack-svgr-plugin')

// ...
webpackPlugins.push(new IntouchSVGRPlugin())
```
<br>

```jsonc
// .idsconfig.json
{
    "icons": "icons"
}
```
<br>



### Advanced

The plugin constructor accepts a filepath to the `.idsconfig.json` file, and a merge function to update any SVGR option:

```js
new IntouchSVGRPlugin(
    '../path/to/idsconfig',
    (defaultSvgrOptions) => {
        console.log(defaultSvgrOptions)
        const newSvgrOptions = defaultSvgrOptions

        // do stuff to manipulate newSvgrOptions here...

        return newSvgrOptions
    }
)
```
