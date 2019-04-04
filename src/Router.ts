import { posix as Path } from "path";
import { HTTP_METHODS } from "./Utils";
import { IRoute } from "./interfaces";
import { current } from "./Helpers";
// import { injectable } from "inversify";

// @injectable()
export class Router {
	
	private routes: IRoute[]
	private static instance: Router = null

	protected constructor() {
		this.routes = new Array<IRoute>()
	}

	static create(): void {
		if (this.instance === null)
			this.instance = new Router()
		else
			throw new Error("There is already an instance of [Router] created")
	}

	static getInstance() {
		return this.instance
	}

	//#region Router utils
	static all(): IRoute[] {
		return this.instance.routes
	}

	static current(): IRoute {
		return current()
	}
	
	static match(pattern: string | RegExp, flags?: string): IRoute[] {
		let reg: RegExp = null
		if (typeof pattern === "string")
			reg = new RegExp(pattern, flags)
		else if (typeof pattern === "object" && pattern instanceof RegExp)
			reg = new RegExp(pattern, flags)

		return this.instance.routes.filter(route => reg.test(route.path))
	}

	static findName(name: string): IRoute {
		return this.instance.all().find(route => route.alias === name)
	}
	//#endregion

	//#region Static methods
	static alias(name: string): Router {
		return this.instance.alias(name)
	}

	static crud(path: string, handler: string): Router {
		return this.instance.crud(path, handler)
	}
	
	static get(path: string, handler: Function): Router
	static get(path: string, handler: string, action: string): Router
	static get(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.get(path, handler, action) : 
			this.instance.get(path, handler)
	}

	static head(path: string, handler: Function): Router
	static head(path: string, handler: string, action: string): Router
	static head(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.head(path, handler, action) : 
			this.instance.head(path, handler)
	}

	static post(path: string, handler: Function): Router
	static post(path: string, handler: string, action: string): Router
	static post(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.post(path, handler, action) : 
			this.instance.post(path, handler)
	}

	static put(path: string, handler: Function): Router
	static put(path: string, handler: string, action: string): Router
	static put(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.put(path, handler, action) : 
			this.instance.put(path, handler)
	}

	static patch(path: string, handler: Function): Router
	static patch(path: string, handler: string, action: string): Router
	static patch(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.patch(path, handler, action) : 
			this.instance.patch(path, handler)
	}

	static options(path: string, handler: Function): Router
	static options(path: string, handler: string, action: string): Router
	static options(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.options(path, handler, action) : 
			this.instance.options(path, handler)
	}

	static delete(path: string, handler: Function): Router
	static delete(path: string, handler: string, action: string): Router
	static delete(path: string, handler: string | Function, action: string = "default"): Router {
		return typeof handler === "string"? 
			this.instance.delete(path, handler, action) : 
			this.instance.delete(path, handler)
	}
	//#endregion

	//#region Public methods
	/**
	 * @description Sets a name for the last added Route
	 * @param name Name for the Route
	 */
	public alias(name: string): Router {
		this.routes[this.routes.length - 1].alias = name
		return this
	}

	public all(): IRoute[] {
		return this.routes
	}

	public crud(path: string, handler: string): Router {
		const prefix = handler.toLocaleLowerCase()
		return this.get(Path.normalize(path), handler, "list").alias(`${handler.toLocaleLowerCase()}.list`)
				// .head(Path.normalize(path), handler, "index").alias(`${handler.toLocaleLowerCase()}.index`)
				.get(Path.normalize(`${path}/:${prefix}/details`), handler, "details").alias(`${prefix}.details`)
				.get(Path.normalize(`${path}/:${prefix}/edit`), handler, "edit").alias(`${prefix}.edit`)
				.get(Path.normalize(`${path}/new`), handler, "create").alias(`${prefix}.new`)
				.post(Path.normalize(`${path}`), handler, "store").alias(`${prefix}.store`)
				.put(Path.normalize(`${path}/:${prefix}`), handler, "update").alias(`${prefix}.update`)
				.patch(Path.normalize(`${path}/:${prefix}`), handler, "update").alias(`${prefix}.update`)
				.delete(Path.normalize(`${path}/:${prefix}`), handler, "destroy").alias(`${prefix}.destroy`)
	}

	public get(path: string, handler: Function): Router
	public get(path: string, handler: string, action: string): Router
	public get(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.GET,
		})

		return this
	}

	public head(path: string, handler: Function): Router
	public head(path: string, handler: string, action: string): Router
	public head(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.HEAD,
		})

		return this
	}

	public post(path: string, handler: Function): Router
	public post(path: string, handler: string, action: string): Router
	public post(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.POST,
		})

		return this
	}

	public put(path: string, handler: Function): Router
	public put(path: string, handler: string, action: string): Router
	public put(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.PUT,
		})

		return this
	}

	public patch(path: string, handler: Function): Router
	public patch(path: string, handler: string, action: string): Router
	public patch(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.PATCH,
		})

		return this
	}

	public options(path: string, handler: Function): Router
	public options(path: string, handler: string, action: string): Router
	public options(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.OPTIONS,
		})

		return this
	}

	public delete(path: string, handler: Function): Router
	public delete(path: string, handler: string, action: string): Router
	public delete(path: string, handler: string | Function, action: string = "default"): Router {
		this.routes.push({
			path,
			action,
			handler,
			method: HTTP_METHODS.DELETE,
		})

		return this
	}
	//#endregion
}