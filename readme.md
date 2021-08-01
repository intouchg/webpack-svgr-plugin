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


### React Children

Generated React icon components will render the `children` prop as the first child inside the component, without replacing the other child elements. This is useful for passing elements such as `title` for accessibility:

```jsx
<IntouchLogoIcon
    role="img"
    width="200px"
    fill="#b2d236"
>
    <title>
        Intouch Logo Icon
    </title>
</IntouchLogoIcon>
```
<br>


### Disabling Dynamic Properties

* **DISABLING**: Turn off "dynamic property" replacement by adding a `// svgr-disable-dynamic-props` comment block to the source SVG file:
```html
<!-- // svgr-disable-dynamic-props -->
```
<br>


### Dynamic Properties

"Dynamic properties" are enabled by default. When enabled, the `fill` and `stroke` properties from the source SVG file are replaced by React component props as follows:

* If the SVG file has exactly 1 unique value each for the `fill` and `stroke` properties, those values will be replaced with `inherit` in the generated component output

* If the SVG file has exactly 2 or 3 unique values each for the `fill` and `stroke` properties, those values will be replaced with `fill1 || 'inherit'`, `fill2 || 'inherit'`, etc. and `stroke1 || 'inherit'` etc.

Note: Uniqueness of `fill` and `stroke` values are considered separately - so dynamic props will still be generated if your `fill` values are red, green, and blue while your `stroke` values are orange, purple, and pink (6 unique values in total).



### Advanced

The plugin constructor accepts a filepath to the `.idsconfig.json` file, an options object that's specific to this module, and a merge function to update any SVGR option:

```js
new IntouchSVGRPlugin(
    '../path/to/idsconfig',
    { scss: true }, // module options
    (defaultSvgrOptions) => {
        console.log(defaultSvgrOptions)
        const newSvgrOptions = defaultSvgrOptions

        // do stuff to manipulate newSvgrOptions here...

        return newSvgrOptions
    }
)
```
