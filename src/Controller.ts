import { View } from "./View"
import { ViewResponse, ErrorResponse, SerializeResponse } from "./ActionResponse";
import { HttpContext } from "./RouteResolver";

export abstract class ActionDispatcher {
	protected context: HttpContext
	protected name: string
	protected action: string

	constructor() {
		this.context = HttpContext.getInstance()
		this.name = <string> this.context.route.handler	//* IRoute[handler] will always be string here...
		this.name = this.name.toLocaleLowerCase()
		this.action = this.context.route.action
	}

	protected abstract error(data?: object): ErrorResponse
	protected abstract error(statusCode: number, data?: object): ErrorResponse

	protected abstract response(data: any): SerializeResponse

	protected abstract view(): ViewResponse
	protected abstract view(data: object): ViewResponse
	protected abstract view(name: string, data?: object): ViewResponse
}

export class Controller extends ActionDispatcher {

	protected context: HttpContext

	protected error(data?: object): ErrorResponse
	protected error(statusCode: number, data?: object): ErrorResponse
	protected error(statusCodeOrData?: number | object, maybeData?: object): ErrorResponse {
		// For error(data?)
		if (typeof statusCodeOrData !== "number")
			return new ErrorResponse(statusCodeOrData)
		
		// For error(statusCode, data?)
		return new ErrorResponse(maybeData, statusCodeOrData)
	}

	protected redirect() {
		throw new Error("Method not implemented.");
	}

	protected response(data: any): SerializeResponse {
		return new SerializeResponse(data)
	}

	protected view(data?: object): ViewResponse
	protected view(name: string, data?: object, externalDir?: boolean): ViewResponse
	protected view(nameOrData?: string | object, maybeData?: object/* , externalDir: boolean = false */): ViewResponse {
		if (!arguments.length)
			return new ViewResponse(`${this.name}/${this.action}`)
		else if (typeof nameOrData === "string")
			return new ViewResponse(`${this.name}/${nameOrData}`, maybeData)
		else
			return new ViewResponse(`${this.name}/${this.action}`, nameOrData)
	}

	protected viewTemplate(name: string, data?: object): string {
		return View.renderTemplate(`${this.name}/${name}`, data)
	}
}