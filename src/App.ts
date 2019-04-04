import { Router } from "./Router";
import { Server } from "./Server";
import { Config, CONFIG_DEFAULTS } from "./Config";
import { ConfigOptions, ServerConfig, ServerMiddlewareConfig } from "./interfaces";
import { AppContainer, ControllerContainer } from "./Container";

export class App {

	private server: Server
	private static instance: App

	private constructor (config?: string | ConfigOptions | ServerConfig | ServerMiddlewareConfig, middlewares?: ServerMiddlewareConfig) {
		
		Router.create()
		AppContainer.create(new ControllerContainer())
		
		// Setup application Config stack
		this.config(config)
		
		// Check if ServerMiddlewareConfig is NOT provided as only parameter
		if (!(typeof config === "object" && this.isServerMiddlewareConfig(config)))
		this.server = new Server(Config.server(), middlewares)
	}

	container(): AppContainer {
		return AppContainer.getInstance()
	}

	router(): Router {
		return Router.getInstance()
	}

	serve(callback?: Function): void {
		this.server.start(callback)
	}

	static create(): App
	static create(config: string | ConfigOptions | ServerConfig | ServerMiddlewareConfig): App
	static create(config: string | ConfigOptions | ServerConfig, middlewares: ServerMiddlewareConfig): App
	static create(config?: string | ConfigOptions | ServerConfig | ServerMiddlewareConfig, middlewares?: ServerMiddlewareConfig): App {
		if (this.instance === undefined)
			return this.instance = new App(config, middlewares)
		
		throw new Error("App can only be created once");
	}

	private config(config?: string | ConfigOptions | ServerConfig | ServerMiddlewareConfig): void {
		if (typeof config === "string")
			Config.create(config)
		else if (typeof config === "object") {
			// If [config] is [ConfigOptions] type
			if (this.isConfigOptions(config))
				Config.create(config)
			// ... Or is [ServerConfig] type
			else if (this.isServerConfig(config)) {
				let _conf = CONFIG_DEFAULTS
				_conf.server = config
				Config.create(_conf)
			}
			else if (this.isServerMiddlewareConfig(config))
				this.server = new Server(Config.server(), config)
		}
		else if (typeof config === "undefined") {
			Config.create()
		}
	}

	private isConfigOptions(obj: Object): obj is ConfigOptions {
		return obj.hasOwnProperty('app')	&& 
			   obj.hasOwnProperty('server') /* && 
			  (obj.hasOwnProperty('secret') || obj.hasOwnProperty('database')) */
	}

	private isServerConfig(obj: Object): obj is ServerConfig {
		return obj.hasOwnProperty('port') /* && 
			  (obj.hasOwnProperty('host') || obj.hasOwnProperty('static')) */
	}

	private isServerMiddlewareConfig(obj: Object): obj is ServerMiddlewareConfig {
		return obj.hasOwnProperty('cors')
	}
}