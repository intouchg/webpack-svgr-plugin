const fs = require('fs')
const glob = require('glob')
const svgr = require('@svgr/core')
const config = require('./config')
const pkg = require('../package.json')

class IntouchSVGRPlugin {
	constructor (inputDirectory) {
		
		this.inputDirectory = inputDirectory

		if (!fs.existsSync(this.inputDirectory)) {
			throw new Error(`The input directory provided to ${pkg.name} does not exist: ${this.inputDirectory}`)
		}

		this.svgFileBuffers = {}
		this.writeIconJS = this.writeIconJS.bind(this)
	}

	async writeIconJS () {
		glob(this.inputDirectory + '/**/*.svg', {}, (error, files) => {
			if (error) {
				console.error('Error. Retrieving ".svg" files from directory failed: ' + error)
				process.exit(1)
			}

			await Promise.all(files.map(async (filepath) => {
				const fileDataBuffer = fs.readFileSync(filepath)

				if (!fileDataBuffer.equals(this.svgFileBuffers[filepath])) {
					this.svgFileBuffers[filepath] = fileDataBuffer
					
					svgr(fileDataBuffer, config, { filepath })
				}
			}))
		})
	}

	watchIconFiles () {
		let changeTimeoutId = null

		fs.watch(this.inputDirectory, 'utf-8', () => {
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

module.export = IntouchSVGRPlugin