const template = require('./svgrTemplate')

module.exports = (svgrOptionsFn) => {
    let config = {
        template,
        plugins: [
            '@svgr/plugin-svgo',
            '@svgr/plugin-jsx',
        ],
        svgoConfig: {
            plugins: [
                { removeDimensions: true },
                { removeXMLNS: true },
                { cleanupIDs: { minify: false } },
                { prefixIds: false },
                { removeTitle: false },
                { removeUnknownsAndDefaults: {
                    keepAriaAttrs: true,
                    keepDataAttrs: true,
                    keepRoleAttr: true,
                } },
            ],
        },
    }

    if (svgrOptionsFn) {
        config = svgrOptionsFn(config)
    }

    return config
}