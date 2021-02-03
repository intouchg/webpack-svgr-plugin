module.export = (
    { template, types },
    opts,
    { imports, interfaces, componentName, props, jsx, exports },
) => {
    const plugins = [ 'jsx' ]

    if (opts.typescript) {
        plugins.push('typescript')
    }

    const typeScriptTpl = template.smart({ plugins })

    // Change SVGR top-level element from `svg` to `Icon`
    jsx.openingElement.name.name = 'Icon'
    jsx.closingElement.name.name = 'Icon'
    
    // Append `{...props}` to `Icon`, because it got
    // removed when we changed from `svg` to `Icon`
    jsx.openingElement.attributes.push(types.jSXSpreadAttribute(types.identifier('props')))

    return typeScriptTpl.ast`${imports}
import { Icon } from '@i/components'

${interfaces}

const ${componentName} = (${props}) => {
  return ${jsx};
}

${exports}
    `

}