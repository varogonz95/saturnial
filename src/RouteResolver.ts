import express from "express";
import { Controller } from "./Controller";
import { ControllerContainer } from "./Container"
import { HTTP_METHODS, METADATA_KEYS } from "./Utils";
import { ActionResponse, InternalErrorResponse } from "./ActionResponse";
import { IRoute, ActionBindingOptions, Type } from "./interfaces";

export class RouteResolver {
    
    private readonly http_methods: string[] = [
        HTTP_METHODS.GET,
        HTTP_METHODS.HEAD,
        HTTP_METHODS.POST,
        HTTP_METHODS.PUT,
        HTTP_METHODS.PATCH,
        HTTP_METHODS.OPTIONS,
        HTTP_METHODS.DELETE,
    ]

    constructor(private application: express.Application, private container: ControllerContainer) { }

    public resolve(...routes: IRoute[]): void {
        routes.forEach(route => {
            if (this.http_methods.includes(route.method)) {
                this.application[route.method](
                    route.path,
                    async (req: express.Request, res: express.Response) => {
						try {
							//* Create current context *//
							HttpContext.create(route, req, route.method)
	
							if (typeof route.handler === "string") {
								let controllerClass = this.container.get(`${route.handler}Controller`)
								let controllerInstance = new controllerClass();
								let response = await this.resolveAction(controllerInstance, route.action, req)
								response.send()
							}
							
							else if (typeof route.handler === "function")
								res.status(200).send(route.handler(req.body))
						} 
						catch (error) {
							console.log(error)
							const response = new InternalErrorResponse(error, 500)
							response.send()
						}
					})
			}
			
            else throw new Error(`HTTP method [${route.method}] not supported`);
        })
    }

    // Provide action(id: request.param, request)
    private async resolveAction(target: any, propertyKey: string, request: express.Request): Promise<ActionResponse> {
		let injections: any[] = []

        const allowed_types: string[] = ["String", "Number", "Boolean"],
              actionBindings: ActionBindingOptions = Reflect.getMetadata(METADATA_KEYS.ACTION_PARAMS, target, propertyKey),
              definedParams: string[] = (<Function[]> (Reflect.getMetadata(METADATA_KEYS.PARAMETER_TYPES, target, propertyKey) || [])).map(fn => fn.name),
			  actionReturnType: any = Reflect.getMetadata(METADATA_KEYS.RETURN_TYPE, target, propertyKey)

		if (actionBindings !== undefined) {
			let params = (actionBindings.params || '').split(",")

            for (let i = 0; i < definedParams.length; i++) {
                if (allowed_types.includes(definedParams[i]))
                    injections.push(request.params[params[i]])
        
                else injections.push(request)
            }
		}
		else throw new Error(`Method [${propertyKey}] cannot be resolved as route action.`);
		
		// If Action is async...
		return this.isAsync(actionReturnType)?
			// Just return that action
			<Promise<ActionResponse>> target[propertyKey](...injections) :
			// ... or, create and return a Promise
			new Promise<ActionResponse>((resolve, reject) => {
				try { resolve(target[propertyKey](...injections)) } 
				catch (error) { reject(error) }
			})
	}

	private isAsync(target: any): target is Promise<any> {
		return typeof target === "function" && target.name === "Promise"
	}
}

//! DO NOT EXPORT THIS CLASS TO INDEX
export class HttpContext {

	private static instance: HttpContext = null

	private constructor(
		public route: IRoute,
		public request: express.Request,
		public method: HTTP_METHODS) { }

	static create(route: IRoute, request: express.Request, method: HTTP_METHODS): HttpContext {
			return this.instance = new HttpContext(route, request, method)
	}

	static getInstance(): HttpContext {
		return this.instance
	}
}
