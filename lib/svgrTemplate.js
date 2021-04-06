module.exports = (
    { template, types },
    opts,
    { imports, interfaces, componentName, props, jsx, exports },
) => {
    const plugins = [ 'jsx' ]

    if (opts.typescript) {
        plugins.push('typescript')
    }

    const typeScriptTpl = template.smart({ plugins })

    // Change SVGR top-level element from `svg` to `Svg`
    jsx.openingElement.name.name = 'Svg'
    jsx.closingElement.name.name = 'Svg'
    
    // Append `{...props}` to `Svg`, because it got
    // removed when we changed from `svg` to `Svg`
    jsx.openingElement.attributes.push(types.jSXSpreadAttribute(types.identifier('props')))

    return typeScriptTpl.ast`${imports}
import { Svg } from '@i/components'

${interfaces}

const ${componentName} = (${props}) => (
    ${jsx}
)

${exports}
    `

}