const fs = require('fs')
const path = require('path')
const glob = require('glob')
const svgr = require('@svgr/core').default
const svgrConfig = require('./svgrConfig')
const { configFilename } = require('@i/theme')
const camelcase = require('camelcase')

const VALID_CHARACTERS = /[^a-zA-Z0-9_-]/g

class IntouchSVGRPlugin {
	constructor (configFilepath, svgrOptionsFn) {
		const configPath = configFilepath || path.resolve('.', configFilename)

		if (!fs.existsSync(configPath)) {
			throw new Error(`No ${configFilename} config file was found at filepath: ${configPath}`)
		}

		const configData = fs.readFileSync(configPath).toString('utf-8')
		const config = JSON.stringify(configData)

		if (!config.icons) {
			throw new Error(`Property "icons" is not configured in "${configFilename}" config file at filepath: ${configPath}`)
		}

		this.directory = path.resolve('.', config.icons)

		if (!fs.existsSync(this.directory)) {
			throw new Error(`Could not locate directory referenced by property "icons" in ${configFilename} config file.\n Referenced "icons" filepath: ${this.directory}\n Config file filepath: ${configPath}`)
		}

		this.svgrConfig = svgrConfig(svgrOptionsFn)
		this.svgFileBuffers = {}
		this.writeIconJS = this.writeIconJS.bind(this)
	}

	async writeIconJS () {
		glob(this.directory + '/**/*.svg', {}, async (error, files) => {
			if (error) {
				console.error('Error. Retrieving ".svg" files from directory failed: ' + error)
				process.exit(1)
			}

			await Promise.all(files.map(async (filepath) => {
				const fileDataBuffer = fs.readFileSync(filepath)

				if (!this.svgFileBuffers[filepath] || !fileDataBuffer.equals(this.svgFileBuffers[filepath])) {
					this.svgFileBuffers[filepath] = fileDataBuffer

					svgr(fileDataBuffer, this.svgrConfig, { filePath: filepath }).then((code) => {
						const pascalCaseFilename = camelcase(
							path.parse(filepath).name.replace(VALID_CHARACTERS, ''),
							{ pascalCase: true }
						)
						fs.writeFile(`${this.directory}/Svg${pascalCaseFilename}.jsx`, code)
					})
				}
			}))
		})
	}

	watchIconFiles () {
		let changeTimeoutId = null

		fs.watch(this.directory, 'utf-8', () => {
			if (changeTimeoutId) {
				clearTimeout(changeTimeoutId)
			}
			changeTimeoutId = setTimeout(this.writeIconJS, 1)
		})
	}

	// This function is called by Webpack one time when the plugin is initialized
	apply (_) {
		this.writeIconJS()
		this.watchIconFiles()
	}
}

module.exports = IntouchSVGRPlugin