import * as Path from "path";
import * as FileSystem from "fs";
import { ConfigOptions, ServerConfig } from "./interfaces";
import { extend } from "./Helpers";

export const CONFIG_VIEWS_PATH = "views"
export const CONFIG_DEFAULTS: ConfigOptions = {
	app: { base: './' },
	server: {
		host: 'localhost',
		port: 3000,
		static: ''
	},
}
/**
 * TODOS:
 * todo 1. Cache returned config values from [get] method
 * todo -> to decrease recursion for values already fetched
 */
export class Config {

	private config: ConfigOptions
	private readonly file: string
	private static instance: Config

	private constructor(options?: string | ConfigOptions) {
		if (typeof options === "undefined")
			this.config = CONFIG_DEFAULTS

		else if (typeof options === "string") {
			this.file = Path.resolve(__dirname, Path.relative(__dirname, options))
			this.config = this.parseConfigFile()
		}

		else this.config = extend(CONFIG_DEFAULTS, options)
	}

	public static create(options?: string | ConfigOptions): void {
		if (this.instance === undefined)
			this.instance = new Config(options)

		else throw new Error("An instance of [Config] has already been created");
	}

	private get(key: string, defaults?: any): any {
		return this.recursiveGet(key, this.config, defaults)
	}

	public static get(key: string, defaults?: any): any {
		return this.instance.get(key, defaults)
	}

	public static server(): ServerConfig
	public static server(key: string): any
	public static server(key?: string): any | ServerConfig {
		if (typeof key === "undefined")
			return this.instance.config.server
			
		return this.instance.get(`server.${key}`)
	}

	public static assets(relPath: string): string {
		const _static = Config.server('server')

		return typeof _static === "string"? 
			Path.join(_static, relPath) :
			Path.join(_static.root, relPath)
	}

	public static views(): string {
		let path = Path.resolve(__dirname, Path.relative(__dirname, this.instance.config.app.base))
		let views = Path.join(path, CONFIG_VIEWS_PATH)
		return views
	}

	private parseConfigFile(): ConfigOptions {
		return JSON.parse(FileSystem.readFileSync(this.file, "utf8"))
	}

	private recursiveGet(key: string, obj: any, defaults?: any): any {
		if (key) {
			let keys = key.split('.')
			if (keys.length === 1 && obj[key])
				return this.recursiveGet(null, obj[key], defaults)
	
			if (keys.length > 1 && obj[keys[0]])
				return this.recursiveGet(keys.slice(1, keys.length).join('.'), obj[keys[0]], defaults)

			if (obj[key] !== undefined)
				return obj[key]

			else if (defaults !== undefined)
				return defaults

			throw new Error(`[${key}] is not a valid config key`);
			
		}

		if (obj !== undefined)
			return obj
	
		throw new Error(`[${key}] is not a valid config key`);
	}
}