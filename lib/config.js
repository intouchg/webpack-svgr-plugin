const template = require('./template')

module.export = {
    template,
    plugins: [
        '@svgr/plugin-svgo',
        '@svgr/plugin-jsx',
    ],
    svgoConfig: {
        plugins: [
            { removeDimensions: true },
            { removeXMLNS: true },
        ],
    },
}