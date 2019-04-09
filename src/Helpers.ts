import { Config } from "./Config";
import { HTTP_METHODS } from "./Utils";
import { IRoute } from "./interfaces";
import { Router } from "./Router";
import { HttpContext } from "./RouteResolver";

/* export function csrf(): string {
	return null
} */

export function token(): string {
	return HttpContext.getInstance().request.csrfToken()
}

export function tokenField(): string {
	return `input type="hidden" name="_csrf" value="${token()}"`
}

/* export function user(): Object {
	return null
} */

/* export function guest(): boolean {
	return null
} */

export function config(key: string, defaults?: object): any {
	return Config.get(key, defaults)
}

export function assets(path: string): string {
	return Config.assets(path)
}

export function current(): IRoute {
	return HttpContext.getInstance().route
}

export function method(method: HTTP_METHODS): string {
	return `input type="hidden" name="_method" value="${method.toUpperCase()}"`
}

export function route(name: string, params?: object): string {
	let resolvedPath = null,
		route: IRoute = (Router.all()
			.find(route => route.alias === name))

	if (route === undefined)
	throw new Error(`No routes match the name '${name}'`);

	resolvedPath = route.path

	if (params !== undefined)
		for (const key in params)
			resolvedPath = resolvedPath.replace(new RegExp(`\\:${key}\\??`, 'g'), params[key])

	return resolvedPath
}

// TODO: Add extension options parameter
export function extend<T>(target: any, ...sources: any[]): T {
	let output: T = target

	for (let source of sources) {
		for (const prop in source) {
			/* if (source[prop] instanceof Array)
				extend(source[prop], target[prop])
	
			else  */if (typeof source[prop] === "object")
				output[prop] = extend(source[prop], target[prop])
				
			else output[prop] = source[prop];
		}
	}

	return <T> output
}