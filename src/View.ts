import * as Pug from "pug";
import { Config } from "./Config";
import { HTTP_METHODS } from "./Utils";
import { assets, config, current, method, route, tokenField } from "./Helpers";
import { IRoute } from "./interfaces";

export class View {

	public static renderTemplate(template: string, data?: object): string {
		return Pug.compile(template)(new ViewData(data))
	}

	public static render(name: string, data?: object): string {
		let fullpath = `${Config.views()}/${name}`
		return Pug.compileFile(`${fullpath}.pug`)(new ViewData(data))
	}
}

class ViewData {

	constructor(public bindings: any = { }) { }

	public assets(path: string): string {
		return assets(path)
	}

	public config(key: string, defaults?: object): any {
		return config(key, defaults)
	}
	
	public current(): IRoute {
		return current()
	}

	public method(verb: HTTP_METHODS): string {
		return method(verb)
	}

	public route(name: string, params?: object): string | IRoute {
		return route(name, params)
	}

	public tokenField() {
		return tokenField()
	}
}