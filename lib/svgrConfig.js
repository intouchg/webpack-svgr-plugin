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
            ],
        },
    }

    if (svgrOptionsFn) {
        config = svgrOptionsFn(config)
    }

    return config
}