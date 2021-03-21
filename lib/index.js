const chokidar = require('chokidar')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const svgr = require('@svgr/core').default
const { configFilename } = require('@i/theme')
const svgrConfig = require('./svgrConfig')
const camelcase = require('camelcase')

const VALID_CHARACTERS_REGEX = /[^a-zA-Z0-9_-]/g
const DYNAMIC_PROPERTIES = [ 'fill', 'stroke' ]

class IntouchSVGRPlugin {
	constructor (configFilepath, svgrOptionsFn) {
		const configPath = configFilepath || path.resolve('.', configFilename)

		if (!fs.existsSync(configPath)) {
			throw new Error(`No ${configFilename} config file was found at filepath: ${configPath}`)
		}

		const config = JSON.parse(fs.readFileSync(configPath))

		if (!config.icons) {
			throw new Error(`Property "icons" is not configured in "${configFilename}" config file at filepath: ${configPath}`)
		}

		this.directory = path.resolve('.', config.icons)

		if (!fs.existsSync(this.directory)) {
			fs.mkdirSync(this.directory)
		}

		this.svgrConfig = svgrConfig(svgrOptionsFn)
		this.svgFileBuffers = {}
		this.writeIconJS = this.writeIconJS.bind(this)
	}

	writeIndexFile (filepaths) {
		const exportEntries = filepaths.map((filepath) => {
			const componentName = camelcase(
				path.parse(filepath).name.replace(VALID_CHARACTERS_REGEX, ''),
				{ pascalCase: true }
			)
			return `export { default as ${componentName} } from './${componentName}'`
		})

		const exportData = exportEntries.join('\n')
		fs.writeFileSync(`${this.directory}/index.js`, exportData)
	}

	replaceDynamicProps (code) {
		const dynamicPropNames = []

		DYNAMIC_PROPERTIES.forEach((propName) => {
			const matches = code.match(new RegExp(`${propName}=".*?"`, 'g'))
			const uniqueMatches = []

			if (matches) {
				matches.forEach((s) => {
					if (!uniqueMatches.includes(s)) {
						uniqueMatches.push(s)
					}
				})
			}

			if (uniqueMatches.length === 1) {
				code = code.replace(uniqueMatches[0], `${propName}="inherit"`)
			}

			if (uniqueMatches.length === 2 || uniqueMatches.length === 3) {
				uniqueMatches.forEach((s, i) => {
					const dynamicPropName = propName + (i + 1)
					code = code.replace(s, `${propName}={${dynamicPropName} || 'inherit'}`)
					dynamicPropNames.push(dynamicPropName)
				})
			}
		})

		if (dynamicPropNames.length) {
			code = code.replace('= props =>', `= ({ ${dynamicPropNames.join(', ')}, ...props }) =>`)
		}
		else {
			code = code.replace('= props =>', '= (props) =>')
		}
		
		return code
	}

	async writeIconJS () {
		glob(this.directory + '/**/*.svg', {}, async (error, files) => {
			if (error) {
				console.error('Error. Retrieving ".svg" files from directory failed: ' + error)
				process.exit(1)
			}

			let didChange = false

			await Promise.all(files.map(async (filepath) => {
				const fileDataBuffer = fs.readFileSync(filepath)

				if (!this.svgFileBuffers[filepath] || !fileDataBuffer.equals(this.svgFileBuffers[filepath])) {
					didChange = true

					this.svgFileBuffers[filepath] = fileDataBuffer

					const filepathName = path.parse(filepath).name
					
					if (filepathName.toLowerCase() === 'icon') {
						console.error('Error. Cannot name an SVG icon "icon.svg" or any other variation ("Icon.svg", "ICON.SVG", etc.)\n')
						return
					}

					const componentName = camelcase(
						filepathName.replace(VALID_CHARACTERS_REGEX, ''),
						{ pascalCase: true }
					)

					svgr(fileDataBuffer, this.svgrConfig, { componentName }).then((code) => {
						code = this.replaceDynamicProps(code)
						fs.writeFileSync(`${this.directory}/${componentName}.jsx`, code)
					})
				}
			}))

			if (didChange) {
				this.writeIndexFile(files)
			}
		})
	}

	watchIconFiles () {
		const watcher = chokidar.watch(this.directory, { persistent: true })
		watcher.on('change', this.writeIconJS)
	}

	// This function is called by Webpack one time when the plugin is initialized
	apply (compiler) {
		this.writeIconJS()
		this.watchIconFiles()
	}
}

module.exports = IntouchSVGRPlugin