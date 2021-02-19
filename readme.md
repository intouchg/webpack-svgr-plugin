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



### Dynamic Properties

* If the SVG file has exactly 1 unique value each for the `fill` and `stroke` properties, those values will be replaced with `inherit` in the generated component output

* If the SVG file has exactly 2 or 3 unique values each for the `fill` and `stroke` properties, those values will be replaced with `fill1 || 'inherit'`, `fill2 || 'inherit'`, etc. and `stroke1 || 'inherit'` etc.

Note: Uniqueness of `fill` and `stroke` values are considered separately - so dynamic props will still be generated if your `fill` values are red, green, and blue while your `stroke` values are orange, purple, and pink (6 unique values in total).



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
