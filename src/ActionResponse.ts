import * as Pug from "pug";
import * as Path from "path";
import { View } from "./View";
import { HttpContext } from "./RouteResolver";

export abstract class ActionResponse {

	protected context: HttpContext
	
	constructor() {
		this.context = HttpContext.getInstance()
	}

    abstract send(): any
}

export class ViewResponse extends ActionResponse {

    constructor(private name: string, public bindings: object = {}) {
        super()
    }

    send() {
        let view: string = View.render(this.name, this.bindings)
        return this.context.request.res.status(200).send(view)
    }

}

export class ErrorResponse extends ActionResponse {

    constructor(private errorOrMessage: any, private statusCode: number = 500) {
        super()
    }

    send() {
		const view: string = View.render(`error/${this.statusCode}`, {
			statusCode: this.statusCode, 
			error: this.errorOrMessage
		})
		this.context.request.res.status(this.statusCode).send(view)
    }

}

//! DO NOT EXPORT THIS CLASS TO INDEX
export class InternalErrorResponse extends ErrorResponse {
	private readonly viewPath = 'resources/views/error'

	constructor(private error: any, private code: number = 500) {
		super(error, code)
	}

	/**
	 * @override
	 */
	send() {
		try {
			const path = Path.join(__dirname, this.viewPath, this.code + '.pug')
			const view: string = Pug.compileFile(path)({
				statusCode: this.code,
				error: this.error
			})
			this.context.request.res.status(this.code).send(view)
		} 
		catch (error) {
			this.fallback(error)
		}
	}

	private fallback(error: any) {
		this.context.request.next(error)
	}
}